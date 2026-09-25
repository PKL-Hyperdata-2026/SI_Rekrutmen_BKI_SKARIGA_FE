import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SectionCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  headerClassName?: string;
  bodyClassName?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function SectionCard({
  title,
  subtitle,
  action,
  headerClassName,
  bodyClassName,
  headingLevel = 3,
  className,
  children,
  ...props
}: SectionCardProps) {
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <Card
      className={cn(
        "rounded-3xl border border-slate-100 bg-white shadow-xs hover:shadow-sm transition-shadow p-5 sm:p-6 flex flex-col",
        className
      )}
      {...props}
    >
      {(title || subtitle || action) && (
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3.5 shrink-0",
            headerClassName
          )}
        >
          <div>
            {typeof title === "string" ? (
              <HeadingTag className="text-base sm:text-lg font-bold text-slate-900">{title}</HeadingTag>
            ) : (
              title
            )}
            {typeof subtitle === "string" ? (
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            ) : (
              subtitle
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn("flex-1 flex flex-col justify-between", bodyClassName)}>{children}</div>
    </Card>
  );
}