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

const roleStyles: Record<"admin" | "siswa" | "hrd", { border: string; bg: string; text: string }> = {
  admin: { border: "border-purple-200/80", bg: "bg-[#f8f5ff]", text: "text-[#1e1b4b]" },
  siswa: { border: "border-sky-200/80", bg: "bg-[#f0f9ff]", text: "text-[#0c4a6e]" },
  hrd: { border: "border-pink-200/80", bg: "bg-[#fdf2f8]", text: "text-[#701a75]" },
};

export function PillTableHeader({
  columns,
  role = "admin",
  className,
  ...props
}: PillTableHeaderProps) {
  const current = roleStyles[role] || roleStyles.admin;

  return (
    <div
      className={cn(
        "grid items-center w-full rounded-full border py-2.5 px-5 text-xs sm:text-[13px] font-bold",
        current.border,
        current.bg,
        current.text,
        className
      )}
      style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
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
        >
          {col.label}
        </span>
      ))}
    </div>
  );
}