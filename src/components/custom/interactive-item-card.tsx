import * as React from "react";
import { cn } from "@/lib/utils";

export interface InteractiveItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  avatar?: string;
  title: string;
  subtitle?: string;
  status?: React.ReactNode;
  time?: string;
  role?: "admin" | "siswa" | "hrd";
}

const roleThemeClasses: Record<"admin" | "siswa" | "hrd", string> = {
  admin: "theme-admin",
  siswa: "theme-siswa",
  hrd: "theme-hrd",
};

export function InteractiveItemCard({
  avatar,
  title,
  subtitle,
  status,
  time,
  role = "admin",
  className,
  children,
  ...props
}: InteractiveItemCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-2 px-3 rounded-2xl border border-slate-200 bg-white shadow-xs @media(hover:hover):hover:shadow-sm @media(hover:hover):hover:-translate-y-0.5 transition-[transform,box-shadow,border-color,background-color] duration-200 ease-[var(--ease-out)] motion-reduce:transform-none cursor-pointer",
        "hover:border-primary/40 hover:bg-primary/5",
        roleThemeClasses[role],
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 min-w-0">
        {avatar && (
          <img
            src={avatar}
            alt={title}
            className="h-9 w-9 rounded-xl object-cover shrink-0 shadow-xs"
          />
        )}
        <div className="min-w-0">
          <p className="font-bold text-xs sm:text-sm text-slate-900 leading-tight truncate">
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {(status || time) && (
        <div className="text-right shrink-0">
          {typeof status === "string" ? (
            <p className="text-xs font-bold text-emerald-600 leading-tight">{status}</p>
          ) : (
            status
          )}
          {time && <p className="text-xs text-slate-400 font-medium mt-0.5">{time}</p>}
        </div>
      )}

      {children}
    </div>
  );
}