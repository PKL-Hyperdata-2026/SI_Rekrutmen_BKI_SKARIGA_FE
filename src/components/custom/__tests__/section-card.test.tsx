import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionCard } from "../section-card";

describe("SectionCard Component", () => {
  it("renders title, subtitle, and body children", () => {
    render(
      <SectionCard title="Ringkasan Berkas" subtitle="Daftar berkas pelamar">
        <div>Konten Berkas</div>
      </SectionCard>
    );

    expect(screen.getByRole("heading", { level: 3, name: "Ringkasan Berkas" })).toBeInTheDocument();
    expect(screen.getByText("Daftar berkas pelamar")).toBeInTheDocument();
    expect(screen.getByText("Konten Berkas")).toBeInTheDocument();
  });

  it("renders action button in header when action prop provided", () => {
    render(
      <SectionCard
        title="Pengaturan"
        action={<button type="button">Edit</button>}
      >
        <p>Pengaturan akun</p>
      </SectionCard>
    );

    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  it("renders custom ReactNode title and subtitle cleanly", () => {
    render(
      <SectionCard
        title={<span>Judul Khusus</span>}
        subtitle={<span>Sub Judul Khusus</span>}
      >
        <div>Konten</div>
      </SectionCard>
    );

    expect(screen.getByText("Judul Khusus")).toBeInTheDocument();
    expect(screen.getByText("Sub Judul Khusus")).toBeInTheDocument();
  });

  it("supports custom headingLevel", () => {
    render(
      <SectionCard title="Informasi Penting" headingLevel={2}>
        <p>Detail informasi</p>
      </SectionCard>
    );

    expect(screen.getByRole("heading", { level: 2, name: "Informasi Penting" })).toBeInTheDocument();
  });

  it("renders headless card without header when neither title, subtitle, nor action is provided", () => {
    render(
      <SectionCard>
        <p>Bare Content</p>
      </SectionCard>
    );

    expect(screen.getByText("Bare Content")).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });
});
