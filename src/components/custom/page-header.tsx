import * as React from "react";
import { cn } from "@/lib/utils";

export type PageHeaderVariant = "admin" | "student" | "alumni" | "hrd" | "auto";

const roleThemeClasses: Record<PageHeaderVariant, string> = {
  admin: "theme-admin",
  student: "theme-siswa",
  alumni: "theme-siswa",
  hrd: "theme-hrd",
  auto: "",
};

const glassSurface =
  "bg-gradient-to-b from-white/20 via-white/10 to-white/10 border border-white/25 backdrop-blur-[4px] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_1px_0_0_rgba(255,255,255,0.35),inset_-1px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(255,255,255,0.2),0_2px_6px_rgba(0,0,0,0.18),0_10px_24px_rgba(0,0,0,0.28)]";

const glassPill =
  "bg-white/10 border border-white/25 backdrop-blur-[4px] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.15),0_2px_6px_rgba(0,0,0,0.15)]";

export interface PageHeaderProps extends Omit<React.ComponentProps<"div">, "title"> {
  variant?: PageHeaderVariant;
  badge?: React.ReactNode;
  badgeIcon?: React.ReactNode;
  title: React.ReactNode;
  titleAs?: "h1" | "h2" | "h3" | "div";
  description?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({
  variant = "auto",
  badge,
  badgeIcon,
  title,
  titleAs = "h1",
  description,
  children,
  className,
  ...props
}: PageHeaderProps) {
  const HeadingTag = titleAs;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl p-6 sm:p-7 text-white shadow-md",
        "bg-gradient-to-r from-sidebar-gradient-to via-sidebar-strip to-sidebar-gradient-from",
        roleThemeClasses[variant],
        className
      )}
      {...props}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Sisi Kiri: Badge, Judul, dan Subjudul */}
        <div className="flex-1 min-w-0">
          {badge && (
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white/90 mb-3 select-none w-fit",
                glassPill
              )}
            >
              {badgeIcon && <span className="shrink-0">{badgeIcon}</span>}
              <span>{badge}</span>
            </div>
          )}
          <HeadingTag className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            {title}
          </HeadingTag>
          {description && (
            <p className="text-xs sm:text-sm text-white/85 mt-1.5 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Sisi Kanan: Slot Children Fleksibel */}
        {children && (
          <div className="shrink-0 flex items-center gap-3 flex-wrap">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// Sub-Helpers (Tombol Aksi, Kartu Stat, dsb.)
// ==========================================

export interface PageHeaderButtonProps extends React.ComponentProps<"button"> {
  variant?: "primary" | "glass" | "dark";
  icon?: React.ReactNode;
}

export function PageHeaderButton({
  variant = "glass",
  icon,
  children,
  className,
  ...props
}: PageHeaderButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-white transition-all cursor-pointer active:scale-[0.98]",
        variant === "primary" &&
          "bg-black/30 hover:bg-black/45 border border-white/20 text-white font-semibold shadow-sm",
        variant === "glass" &&
          cn(glassSurface, "hover:from-white/30 hover:via-white/15 hover:to-white/15"),
        variant === "dark" &&
          "bg-black/25 hover:bg-black/40 border border-white/15 shadow-sm",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

export interface StatItem {
  label: string;
  value: React.ReactNode;
  valueColor?: string;
}

export interface PageHeaderStatCardProps extends React.ComponentProps<"div"> {
  items: StatItem[];
}

export function PageHeaderStatCard({
  items,
  className,
  ...props
}: PageHeaderStatCardProps) {
  return (
    <div
      className={cn(
        glassSurface,
        "rounded-xl px-5 py-3.5 flex items-center gap-5 divide-x divide-white/20",
        className
      )}
      {...props}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={cn("flex flex-col items-center", index > 0 && "pl-5")}
        >
          <span className="text-[11px] font-medium text-white/80">
            {item.label}
          </span>
          <span
            className={cn(
              "text-lg sm:text-xl font-bold leading-tight mt-0.5",
              item.valueColor || "text-white"
            )}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export interface PageHeaderNotificationCardProps extends React.ComponentProps<"div"> {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export function PageHeaderNotificationCard({
  icon,
  title,
  description,
  className,
  ...props
}: PageHeaderNotificationCardProps) {
  return (
    <div
      className={cn(
        glassSurface,
        "rounded-xl px-5 py-3.5 flex items-center gap-3.5 text-left select-none",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="shrink-0 flex items-center justify-center text-white">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
          {title}
        </h4>
        <p className="text-[11px] sm:text-xs text-white/80 leading-snug mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
}

// Sub-component exports
PageHeader.Button = PageHeaderButton;
PageHeader.StatCard = PageHeaderStatCard;
PageHeader.NotificationCard = PageHeaderNotificationCard;
