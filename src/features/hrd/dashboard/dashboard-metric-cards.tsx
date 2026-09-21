import { MetricCard } from "@/components/custom";
import { cn } from "@/lib/utils";
import { useDashboardMetricCards } from "./dashboard.metric-cards";

export interface DashboardMetricCardsProps {
  className?: string;
}

export function DashboardMetricCards({ className }: DashboardMetricCardsProps) {
  const { cards } = useDashboardMetricCards();

  return (
    <MetricCard.Grid
      className={cn(
        "w-full max-w-full min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4",
        className,
      )}
    >
      {cards.map((card) => (
        <MetricCard
          key={card.key}
          category={card.category}
          title={card.title}
          value={card.value}
          color={card.color}
          customColor={card.customColor}
          isActive={card.isActive}
          categoryClassName={card.categoryClassName}
          titleClassName={card.titleClassName}
          valueClassName={card.valueClassName}
          iconClassName={card.iconClassName}
          className="rounded-xl"
        />
      ))}
    </MetricCard.Grid>
  );
}

