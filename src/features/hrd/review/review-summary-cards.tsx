import { FileCheck } from "lucide-react";
import { MetricCard } from "@/components/custom/metric-card";
import { cn } from "@/lib/utils";
import type { ReviewStatusFilter, ReviewSummary } from "./review.schema";

export interface ReviewSummaryCardsProps {
  summary: ReviewSummary;
  activeFilter: ReviewStatusFilter;
  loading?: boolean;
  onSelect: (value: string) => void;
  className?: string;
}

const CARDS: Array<{
  key: ReviewStatusFilter;
  category: string;
  title: string;
  valueSuffix: string;
  color: "custom" | "amber" | "emerald" | "rose";
}> = [
  {
    key: "semua",
    category: "TOTAL",
    title: "Semua Pelamar",
    valueSuffix: "Pelamar",
    color: "custom",
  },
  {
    key: "perlu_review",
    category: "TAHAP 1",
    title: "Perlu Review",
    valueSuffix: "Pelamar",
    color: "amber",
  },
  {
    key: "lolos_berkas",
    category: "TAHAP 2",
    title: "Lolos Berkas",
    valueSuffix: "Lolos",
    color: "emerald",
  },
  {
    key: "ditolak",
    category: "HASIL",
    title: "Ditolak",
    valueSuffix: "Ditolak",
    color: "rose",
  },
];

function getValue(summary: ReviewSummary, key: ReviewStatusFilter): number {
  if (key === "lolos_berkas") return summary.lolos_berkas;
  if (key === "ditolak") return summary.ditolak;
  if (key === "semua") return summary.total;
  return summary.perlu_review;
}

export function ReviewSummaryCards({
  summary,
  activeFilter,
  loading = false,
  onSelect,
  className,
}: ReviewSummaryCardsProps) {
  if (loading) {
    return (
      <MetricCard.Grid
        className={cn("grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4", className)}
      >
        <MetricCard.Skeleton />
        <MetricCard.Skeleton />
        <MetricCard.Skeleton />
        <MetricCard.Skeleton />
      </MetricCard.Grid>
    );
  }

  return (
    <MetricCard.Grid
      className={cn("grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-1", className)}
    >
      {CARDS.map((card) => {
        const count = getValue(summary, card.key);
        const isActive = activeFilter === card.key;
        const className = "hover:border-[#8D1D96]/50 hover:shadow-sm";
        const customColor =
          card.key === "semua"
            ? {
                category: "text-[#8D1D96]",
                icon: "text-[#8D1D96]",
                value: "text-[#8D1D96]",
                container: isActive
                  ? cn("bg-[#FDF2F8] border border-[#8D1D96] shadow-xs", className)
                  : cn("bg-white border-slate-200/80", className),
              }
            : undefined;

        return (
          <MetricCard
            key={card.key}
            category={card.category}
            title={card.title}
            value={`${count} ${card.valueSuffix}`}
            icon={FileCheck}
            color={card.color}
            customColor={customColor}
            isActive={isActive}
            ariaPressed={isActive}
            onClick={() => onSelect(card.key)}
          />
        );
      })}
    </MetricCard.Grid>
  );
}
