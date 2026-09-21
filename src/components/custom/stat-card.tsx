import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatCardColor = "purple" | "sky" | "teal" | "dark-purple" | "cyan" | "blue" | "rose" | "amber";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: StatCardColor;
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

export function StatCard({
  label,
  value,
  icon: Icon,
  color = "purple",
  className,
  ...props
}: StatCardProps) {
  const currentTheme = colorMap[color] || colorMap.purple;

  return (
    <Card
      className={cn(
        "rounded-xl border border-slate-100 bg-white p-3 shadow-xs hover:shadow-md transition-all",
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
          <Icon className="h-4 w-4" />
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
