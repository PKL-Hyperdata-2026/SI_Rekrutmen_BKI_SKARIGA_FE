import { describe, it, expect } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { StatCard } from "../stat-card";
import { Users } from "lucide-react";

describe("StatCard Component", () => {
  it("renders metric value, label, and accessible icon presentation", () => {
    const { container } = render(
      <StatCard label="Total Pendaftar" value={150} icon={Users} color="purple" />,
    );

    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("Total Pendaftar")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("accepts string and numeric values seamlessly", () => {
    render(<StatCard label="Tingkat Kelulusan" value="98.5%" icon={Users} color="teal" />);

    expect(screen.getByText("98.5%")).toBeInTheDocument();
    expect(screen.getByText("Tingkat Kelulusan")).toBeInTheDocument();
  });

  it("renders skeleton fallback when isLoading is true", () => {
    render(<StatCard label="Total Pendaftar" value={150} icon={Users} isLoading={true} />);

    expect(screen.queryByText("150")).not.toBeInTheDocument();
    expect(screen.queryByText("Total Pendaftar")).not.toBeInTheDocument();
    expect(screen.getByRole("status", { name: /memuat data/i })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("renders skeleton fallback when value is null or undefined", () => {
    const { unmount } = render(<StatCard label="Total Pendaftar" value={null} icon={Users} />);

    expect(screen.queryByText("Total Pendaftar")).not.toBeInTheDocument();
    expect(screen.getByRole("status", { name: /memuat data/i })).toHaveAttribute(
      "aria-busy",
      "true",
    );

    unmount();

    render(<StatCard label="Total Pendaftar" value={undefined} icon={Users} />);

    expect(screen.queryByText("Total Pendaftar")).not.toBeInTheDocument();
    expect(screen.getByRole("status", { name: /memuat data/i })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });
});
