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

const roleHoverStyles: Record<"admin" | "siswa" | "hrd", string> = {
  admin: "hover:border-purple-300 hover:bg-purple-50/30",
  siswa: "hover:border-sky-300 hover:bg-sky-50/30",
  hrd: "hover:border-pink-300 hover:bg-pink-50/30",
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
        "flex items-center justify-between py-1.5 px-3 rounded-2xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 ease-out cursor-pointer",
        roleHoverStyles[role],
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {avatar && (
          <img
            src={avatar}
            alt={title}
            className="h-8.5 w-8.5 rounded-xl object-cover shrink-0 shadow-2xs"
          />
        )}
        <div className="min-w-0">
          <p className="font-bold text-xs sm:text-[13px] text-[#1e1b4b] leading-tight truncate">
            {title}
          </p>
          {subtitle && (
            <p className="text-[10.5px] text-slate-400 font-medium truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {(status || time) && (
        <div className="text-right shrink-0">
          {typeof status === "string" ? (
            <p className="text-xs font-bold text-[#10b981] leading-tight">{status}</p>
          ) : (
            status
          )}
          {time && <p className="text-[10px] text-slate-400 font-medium mt-0.5">{time}</p>}
        </div>
      )}

      {children}
    </div>
  );
}