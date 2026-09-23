import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatCardColor =
  | "purple"
  | "sky"
  | "teal"
  | "dark-purple"
  | "cyan"
  | "blue"
  | "rose"
  | "amber";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value?: string | number | null;
  icon: LucideIcon;
  color?: StatCardColor;
  isLoading?: boolean;
}

const colorMap: Record<StatCardColor, { box: string; text: string }> = {
  purple: { box: "bg-purple-700", text: "text-purple-700" },
  sky: { box: "bg-sky-500", text: "text-sky-600" },
  teal: { box: "bg-teal-600", text: "text-teal-600" },
  "dark-purple": { box: "bg-purple-900", text: "text-purple-900" },
  cyan: { box: "bg-cyan-700", text: "text-cyan-700" },
  blue: { box: "bg-blue-600", text: "text-blue-600" },
  rose: { box: "bg-rose-600", text: "text-rose-600" },
  amber: { box: "bg-amber-600", text: "text-amber-600" },
};

export function StatCardSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card
      role="status"
      aria-busy="true"
      aria-label="Memuat data"
      className={cn(
        "rounded-xl border border-slate-100 bg-white p-3 shadow-xs cursor-default",
        className
      )}
      {...props}
    >
      <CardContent className="p-0 flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3.5 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color = "purple",
  isLoading = false,
  className,
  ...props
}: StatCardProps) {
  if (isLoading || value === undefined || value === null) {
    return <StatCardSkeleton className={className} {...props} />;
  }

  const currentTheme = colorMap[color] || colorMap.purple;

  return (
    <Card
      className={cn(
        "rounded-xl border border-slate-100 bg-white p-3 shadow-xs hover:shadow-md transition-all cursor-default",
        className
      )}
      {...props}
    >
      <CardContent className="p-0 flex items-center gap-3">
        <div
          className={cn(
            "h-9 w-9 rounded-xl text-white flex items-center justify-center shrink-0 shadow-xs",
            currentTheme.box
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-tight">{value}</p>
          <p className={cn("text-xs font-semibold truncate mt-0.5", currentTheme.text)}>
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
