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
  "bg-gradient-to-b from-white/20 via-white/10 to-white/10 border border-white/25 backdrop-blur-xs shadow-md";

const glassPill =
  "bg-white/10 border border-white/25 backdrop-blur-xs shadow-xs";

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
        "relative overflow-hidden text-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-md w-full max-w-full min-w-0",
        "bg-gradient-to-r from-sidebar-gradient-to via-sidebar-strip to-sidebar-gradient-from",
        roleThemeClasses[variant],
        className
      )}
      {...props}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between relative z-10 gap-4 sm:gap-6 w-full max-w-full min-w-0">
        <div className="flex-1 min-w-0">
          {badge && (
            <div
              className={cn(
                "inline-flex items-center rounded-full font-semibold text-white/90 select-none w-fit gap-1.5 px-3 py-1 text-xs mb-3",
                glassPill
              )}
            >
              {badgeIcon && <span className="shrink-0">{badgeIcon}</span>}
              <span>{badge}</span>
            </div>
          )}
          <HeadingTag className="font-bold tracking-tight text-white text-lg sm:text-xl leading-snug break-words">
            {title}
          </HeadingTag>
          {description && (
            <p className="text-xs sm:text-sm text-white/85 max-w-2xl mt-1.5 leading-relaxed break-words">
              {description}
            </p>
          )}
        </div>

        {children && (
          <div className="w-full lg:w-auto min-w-0 lg:shrink-0 flex items-center gap-3 flex-wrap">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

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
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-white transition-all cursor-pointer active:scale-95 shadow-sm",
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
        "rounded-xl py-2.5 px-1 sm:px-2 flex items-center justify-center divide-x divide-white/20 text-center",
        className
      )}
      {...props}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center text-center px-3 sm:px-4 min-w-[72px] sm:min-w-[84px]"
        >
          <span className="text-xs font-medium text-white/80">
            {item.label}
          </span>
          <span
            className={cn(
              "text-lg sm:text-xl font-bold leading-tight mt-0.5 text-center",
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
        "rounded-xl px-4 py-2 sm:px-4.5 sm:py-2.5 flex items-center gap-3 sm:gap-3.5 text-left select-none",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="shrink-0 flex items-center justify-center text-white [&_svg]:size-5">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
          {title}
        </h4>
        <p className="text-xs text-white/85 leading-tight mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
}

PageHeader.Button = PageHeaderButton;
PageHeader.StatCard = PageHeaderStatCard;
PageHeader.NotificationCard = PageHeaderNotificationCard;
