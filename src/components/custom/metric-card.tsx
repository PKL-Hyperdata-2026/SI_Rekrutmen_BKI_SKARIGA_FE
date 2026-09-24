import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { FileCheck, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export type MetricCardColor =
  | "purple"
  | "amber"
  | "emerald"
  | "blue"
  | "rose"
  | "cyan"
  | "teal"
  | "indigo"
  | "slate"
  | "custom";

const metricCardVariants = cva(
  "relative flex flex-col justify-between rounded-xl p-4 sm:p-5 transition-[background-color,border-color,box-shadow,transform] duration-200 ease-[var(--ease-out)] motion-reduce:transition-none text-left w-full select-none",
  {
    variants: {
      color: {
        purple: "hover:border-purple-400 hover:bg-purple-50/50 hover:shadow-sm",
        amber: "hover:border-amber-400 hover:bg-amber-50/50 hover:shadow-sm",
        emerald: "hover:border-emerald-400 hover:bg-emerald-50/50 hover:shadow-sm",
        blue: "hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-sm",
        rose: "hover:border-rose-400 hover:bg-rose-50/50 hover:shadow-sm",
        cyan: "hover:border-cyan-400 hover:bg-cyan-50/50 hover:shadow-sm",
        teal: "hover:border-teal-400 hover:bg-teal-50/50 hover:shadow-sm",
        indigo: "hover:border-indigo-400 hover:bg-indigo-50/50 hover:shadow-sm",
        slate: "hover:border-slate-400 hover:bg-slate-50/50 hover:shadow-sm",
        custom: "",
      },
      isActive: {
        true: "",
        false: "bg-white border border-slate-200/80 shadow-xs",
      },
      isClickable: {
        true: "cursor-pointer active:scale-[0.99] motion-reduce:active:scale-100",
        false: "",
      },
    },
    compoundVariants: [
      {
        color: "purple",
        isActive: true,
        class: "bg-purple-50/70 border border-purple-500 shadow-xs",
      },
      {
        color: "amber",
        isActive: true,
        class: "bg-amber-50/70 border border-amber-500 shadow-xs",
      },
      {
        color: "emerald",
        isActive: true,
        class: "bg-emerald-50/70 border border-emerald-500 shadow-xs",
      },
      {
        color: "blue",
        isActive: true,
        class: "bg-blue-50/70 border border-blue-500 shadow-xs",
      },
      {
        color: "rose",
        isActive: true,
        class: "bg-rose-50/70 border border-rose-500 shadow-xs",
      },
      {
        color: "cyan",
        isActive: true,
        class: "bg-cyan-50/70 border border-cyan-500 shadow-xs",
      },
      {
        color: "teal",
        isActive: true,
        class: "bg-teal-50/70 border border-teal-500 shadow-xs",
      },
      {
        color: "indigo",
        isActive: true,
        class: "bg-indigo-50/70 border border-indigo-500 shadow-xs",
      },
      {
        color: "slate",
        isActive: true,
        class: "bg-slate-100 border border-slate-400 shadow-xs",
      },
    ],
    defaultVariants: {
      color: "purple",
      isActive: false,
      isClickable: false,
    },
  },
);

const colorTokens: Record<
  Exclude<MetricCardColor, "custom">,
  {
    category: string;
    icon: string;
    value: string;
  }
> = {
  purple: {
    category: "text-purple-500",
    icon: "text-purple-500",
    value: "text-purple-500",
  },
  amber: {
    category: "text-amber-500",
    icon: "text-amber-500",
    value: "text-amber-500",
  },
  emerald: {
    category: "text-emerald-500",
    icon: "text-emerald-500",
    value: "text-emerald-500",
  },
  blue: {
    category: "text-blue-600",
    icon: "text-blue-600",
    value: "text-blue-600",
  },
  rose: {
    category: "text-rose-600",
    icon: "text-rose-600",
    value: "text-rose-600",
  },
  cyan: {
    category: "text-cyan-600",
    icon: "text-cyan-600",
    value: "text-cyan-600",
  },
  teal: {
    category: "text-teal-600",
    icon: "text-teal-600",
    value: "text-teal-600",
  },
  indigo: {
    category: "text-indigo-600",
    icon: "text-indigo-600",
    value: "text-indigo-600",
  },
  slate: {
    category: "text-slate-600",
    icon: "text-slate-600",
    value: "text-slate-700",
  },
};

export interface MetricCardCustomColor {
  category?: string;
  icon?: string;
  value?: string;
  container?: string;
}

export interface MetricCardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricCardVariants> {
  category: string;
  title: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  color?: MetricCardColor;
  customColor?: MetricCardCustomColor;
  categoryClassName?: string;
  titleClassName?: string;
  valueClassName?: string;
  iconClassName?: string;
  isActive?: boolean;
  ariaPressed?: boolean;
  onClick?: () => void;
}

export function MetricCard({
  category,
  title,
  value,
  icon: Icon = FileCheck,
  color = "purple",
  customColor,
  categoryClassName,
  titleClassName,
  valueClassName,
  iconClassName,
  isActive = false,
  ariaPressed,
  onClick,
  className,
  ...props
}: MetricCardProps) {
  const isClickable = Boolean(onClick);
  const theme =
    color && color !== "custom" && color in colorTokens
      ? colorTokens[color as keyof typeof colorTokens]
      : colorTokens.purple;

  const categoryColorClass =
    customColor?.category || categoryClassName || theme.category;
  const iconColorClass = customColor?.icon || iconClassName || theme.icon;
  const valueColorClass = customColor?.value || valueClassName || theme.value;

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-pressed={isClickable ? (ariaPressed ?? isActive) : undefined}
      onClick={onClick}
      onKeyDown={
        isClickable
          ? (e) => {
              props.onKeyDown?.(e);
              if (!e.defaultPrevented && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onClick?.();
              }
            }
          : props.onKeyDown
      }
      className={cn(
        metricCardVariants({ color, isActive, isClickable }),
        customColor?.container,
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between w-full mb-1">
        <span
          className={cn(
            "text-[10px] sm:text-[11px] font-bold tracking-wider uppercase",
            categoryColorClass,
          )}
        >
          {category}
        </span>
        <Icon
          className={cn("size-4 sm:size-4.5 shrink-0", iconColorClass)}
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col gap-0.5 mt-0.5">
        <h4
          className={cn(
            "text-xs sm:text-sm font-bold text-slate-900 leading-tight",
            titleClassName,
          )}
        >
          {title}
        </h4>
        <p
          className={cn(
            "text-lg sm:text-xl font-extrabold tracking-tight leading-tight",
            valueColorClass,
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export type MetricCardSkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function MetricCardSkeleton({
  className,
  ...props
}: MetricCardSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Memuat metrik"
      className={cn(
        "rounded-xl p-4 sm:p-5 bg-white border border-slate-100 shadow-xs flex flex-col justify-between gap-3 w-full",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="size-4 rounded" />
      </div>
      <div className="space-y-1.5 mt-1">
        <Skeleton className="h-3.5 w-16 rounded" />
        <Skeleton className="h-5 w-24 rounded" />
      </div>
    </div>
  );
}

export type MetricCardGridProps = React.ComponentProps<"div">;

export function MetricCardGrid({ className, ...props }: MetricCardGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
        className,
      )}
      {...props}
    />
  );
}

MetricCard.Grid = MetricCardGrid;
MetricCard.Skeleton = MetricCardSkeleton;
