import { MetricCard, MetricCardSkeleton } from "@/components/custom";
import { cn } from "@/lib/utils";
import {
  usePenempatanMetricCards,
  type UsePenempatanMetricCardsOptions,
} from "../hooks/usePenempatanMetricCards";

export interface PenempatanMetricCardsProps extends UsePenempatanMetricCardsOptions {
  className?: string;
}

export function PenempatanMetricCards({
  companyId,
  year,
  refreshKey,
  className,
}: PenempatanMetricCardsProps) {
  const { cards, isLoading } = usePenempatanMetricCards({
    companyId,
    year,
    refreshKey,
  });

  return (
    <MetricCard.Grid
      className={cn(
        "w-full max-w-full min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4",
        className,
      )}
    >
      {isLoading ? (
        <>
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </>
      ) : (
        cards.map((card) => (
          <MetricCard
            key={card.key}
            category={card.category}
            title={card.title}
            value={card.value}
            color={card.color}
            customColor={card.customColor}
          />
        ))
      )}
    </MetricCard.Grid>
  );
}
