import * as React from "react";
import { cn } from "@/lib/utils";

export interface ColumnDefinition {
  label: string;
  align?: "left" | "center" | "right";
  span?: number;
  className?: string;
}

export interface PillTableHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: ColumnDefinition[];
  role?: "admin" | "siswa" | "hrd";
}

const roleThemeClasses: Record<"admin" | "siswa" | "hrd", string> = {
  admin: "theme-admin",
  siswa: "theme-siswa",
  hrd: "theme-hrd",
};

export function PillTableHeader({
  columns,
  role = "admin",
  className,
  ...props
}: PillTableHeaderProps) {
  const hasSpan = columns.some((col) => col.span !== undefined);
  const totalSpan = columns.reduce((acc, col) => acc + (col.span || 1), 0);

  return (
    <div
      className={cn(
        "grid items-center w-full rounded-full border border-primary/20 bg-primary/5 text-slate-900 py-2.5 px-5 text-xs sm:text-sm font-semibold",
        roleThemeClasses[role],
        className
      )}
      style={{
        gridTemplateColumns: hasSpan
          ? `repeat(${totalSpan}, minmax(0, 1fr))`
          : `repeat(${columns.length}, minmax(0, 1fr))`,
      }}
      {...props}
    >
      {columns.map((col, idx) => (
        <span
          key={idx}
          className={cn(
            col.align === "center" && "text-center",
            col.align === "right" && "text-right",
            col.align === "left" && "text-left",
            col.className
          )}
          style={col.span ? { gridColumn: `span ${col.span} / span ${col.span}` } : undefined}
        >
          {col.label}
        </span>
      ))}
    </div>
  );
}