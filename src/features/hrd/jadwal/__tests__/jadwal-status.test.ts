import { describe, it, expect } from "vitest";
import {
  formatScheduleDateTime,
  getStatusSesiBadgeClass,
  getTahapSeleksiBadgeClass,
  getStatusKehadiranBadgeClass,
  getTahapLabel,
} from "../jadwal.status";

describe("jadwal.status helper functions", () => {
  describe("formatScheduleDateTime", () => {
    it("formats ISO date and time into Indonesian localized display", () => {
      const result = formatScheduleDateTime("2026-02-25", "08:00");
      expect(result).toBe("25 Feb 2026 • 08:00 WIB");
    });

    it("handles missing time string gracefully", () => {
      const result = formatScheduleDateTime("2026-02-25", null);
      expect(result).toBe("25 Feb 2026");
    });

    it("returns dash fallback when date string is missing", () => {
      expect(formatScheduleDateTime(null, "08:00")).toBe("-");
      expect(formatScheduleDateTime(undefined, undefined)).toBe("-");
    });
  });

  describe("getStatusSesiBadgeClass", () => {
    it("returns emerald styling for status siap", () => {
      expect(getStatusSesiBadgeClass("siap")).toContain("border-emerald-500");
    });

    it("returns amber styling for status selesai", () => {
      expect(getStatusSesiBadgeClass("selesai")).toContain("border-amber-500");
    });

    it("returns blue styling for status berjalan", () => {
      expect(getStatusSesiBadgeClass("berjalan")).toContain("border-blue-500");
    });

    it("returns rose styling for status dibatalkan", () => {
      expect(getStatusSesiBadgeClass("dibatalkan")).toContain("border-rose-500");
    });

    it("returns slate styling for status draft or unknown", () => {
      expect(getStatusSesiBadgeClass("draft")).toContain("border-slate-300");
    });
  });

  describe("getTahapSeleksiBadgeClass", () => {
    it("returns correct theme classes per stage", () => {
      expect(getTahapSeleksiBadgeClass("psikotes")).toContain("border-purple-300");
      expect(getTahapSeleksiBadgeClass("interview")).toContain("border-indigo-300");
      expect(getTahapSeleksiBadgeClass("mcu")).toContain("border-teal-300");
      expect(getTahapSeleksiBadgeClass("final")).toContain("border-emerald-300");
      expect(getTahapSeleksiBadgeClass("administrasi")).toContain("border-slate-300");
    });
  });

  describe("getStatusKehadiranBadgeClass", () => {
    it("returns green for hadir and amber for belum_presensi", () => {
      expect(getStatusKehadiranBadgeClass("hadir")).toContain("border-emerald-500");
      expect(getStatusKehadiranBadgeClass("belum_presensi")).toContain("border-amber-500");
    });
  });

  describe("getTahapLabel", () => {
    it("returns readable labels for each stage key", () => {
      expect(getTahapLabel("psikotes")).toBe("Psikotes");
      expect(getTahapLabel("interview")).toBe("Interview");
      expect(getTahapLabel("mcu")).toBe("Medical Check Up");
      expect(getTahapLabel("final")).toBe("Tahap Akhir");
      expect(getTahapLabel("administrasi")).toBe("Administrasi");
    });
  });
});
