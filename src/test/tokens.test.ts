/// <reference types="node" />
import { describe, it, expect } from "vite-plus/test";
import fs from "node:fs";
import path from "node:path";

describe("Semantic Tokens in index.css", () => {
  const cssPath = path.resolve(import.meta.dirname, "../index.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  it("contains semantic token declarations for status colors in @theme inline", () => {
    const states = ["success", "warning", "info", "danger"] as const;
    const variants = ["", "-foreground", "-subtle", "-border"] as const;

    for (const state of states) {
      for (const variant of variants) {
        expect(cssContent).toContain(`--color-${state}${variant}:`);
      }
    }
  });

  it("contains root definitions and dark mode overrides for status tokens", () => {
    const states = ["success", "warning", "info", "danger"] as const;

    const rootBlock = cssContent.slice(
      cssContent.indexOf(":root {"),
      cssContent.indexOf("/* Color Palette Siswa / Alumni */"),
    );
    const darkBlock = cssContent.slice(
      cssContent.indexOf(".dark {"),
      cssContent.indexOf("@layer base {"),
    );

    for (const state of states) {
      expect(rootBlock).toContain(`--${state}:`);
      expect(rootBlock).toContain(`--${state}-foreground:`);
      expect(rootBlock).toContain(`--${state}-subtle:`);
      expect(rootBlock).toContain(`--${state}-border:`);

      expect(darkBlock).toContain(`--${state}:`);
      expect(darkBlock).toContain(`--${state}-foreground:`);
      expect(darkBlock).toContain(`--${state}-subtle:`);
      expect(darkBlock).toContain(`--${state}-border:`);
    }
  });
});
