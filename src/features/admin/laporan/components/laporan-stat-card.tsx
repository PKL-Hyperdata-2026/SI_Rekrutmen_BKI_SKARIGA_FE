import * as React from "react";
import { cn } from "@/lib/utils";

export interface LaporanStatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tag?: string;
  tagColor?: string;
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: React.ReactNode;
  accentColor?: string;
}

export function LaporanStatCard({
  tag,
  tagColor = "text-slate-500",
  label,
  value,
  sublabel,
  icon,
  accentColor = "text-slate-900",
  className,
  ...props
}: LaporanStatCardProps) {
  return (
    <div
      className={cn(
        "relative bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col gap-2 overflow-hidden transition-all hover:shadow-md",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          {tag && (
            <span
              className={cn(
                "text-[11px] font-bold tracking-widest uppercase",
                tagColor
              )}
            >
              {tag}
            </span>
          )}
          <span className="text-sm font-bold text-slate-900 leading-tight">
            {label}
          </span>
        </div>
        {icon && <div className="shrink-0">{icon}</div>}
      </div>

      <div className="mt-0.5 flex flex-col">
        <span className={cn("text-xl font-bold tracking-tight", accentColor)}>
          {value}
        </span>
        {sublabel && (
          <span className="mt-0.5 text-[11px] font-normal text-slate-400">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
