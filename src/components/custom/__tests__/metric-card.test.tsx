import { describe, it, expect, vi } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MetricCard, MetricCardSkeleton } from "../metric-card";
import { Briefcase } from "lucide-react";

describe("MetricCard Component", () => {
  it("renders category, title, value, and accessible icon", () => {
    const { container } = render(
      <MetricCard
        category="Rekrutmen"
        title="Total Lowongan Aktif"
        value={24}
        icon={Briefcase}
        color="purple"
      />,
    );

    expect(screen.getByText("Rekrutmen")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 4, name: "Total Lowongan Aktif" }),
    ).toBeInTheDocument();
    expect(screen.getByText("24")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("handles user clicks and keyboard interaction when onClick provided", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <MetricCard
        category="Statistik"
        title="Lamaran Masuk"
        value="120"
        onClick={handleClick}
        isActive={true}
      />,
    );

    const button = screen.getByRole("button", { name: /lamaran masuk/i });
    expect(button).toHaveAttribute("aria-pressed", "true");

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);

    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledTimes(2);

    await user.keyboard(" ");
    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it("renders MetricCardSkeleton with accessible role and attributes", () => {
    render(<MetricCardSkeleton />);
    expect(screen.getByRole("status", { name: /memuat metrik/i })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("renders in static presentation mode when onClick is omitted", () => {
    render(<MetricCard category="Statistik" title="Ringkasan Data" value="50" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders MetricCard.Grid with responsive layout classes and children", () => {
    render(
      <MetricCard.Grid data-testid="metric-grid">
        <MetricCard category="A" title="Card 1" value="1" />
        <MetricCard category="B" title="Card 2" value="2" />
      </MetricCard.Grid>,
    );

    const grid = screen.getByTestId("metric-grid");
    expect(grid).toHaveClass("grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-4");
    expect(screen.getByText("Card 1")).toBeInTheDocument();
    expect(screen.getByText("Card 2")).toBeInTheDocument();
  });
});
