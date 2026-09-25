import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface SlidingSegmentOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface SlidingSegmentedControlProps<T extends string = string> {
  options: Array<SlidingSegmentOption<T>>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
  itemClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  pillClassName?: string;
  "aria-label"?: string;
}

export function SlidingSegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className,
  itemClassName,
  activeClassName = "text-primary",
  inactiveClassName = "text-slate-600 hover:text-slate-900",
  pillClassName,
  "aria-label": ariaLabel,
}: SlidingSegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<T, HTMLButtonElement>>(new Map());
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    height: number;
    top: number;
    ready: boolean;
  }>({
    left: 0,
    width: 0,
    height: 0,
    top: 4,
    ready: false,
  });

  const updateIndicator = useCallback(() => {
    const activeEl = itemsRef.current.get(value);
    const container = containerRef.current;
    if (activeEl && container) {
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();

      setIndicatorStyle({
        left: activeRect.left - containerRect.left,
        width: activeRect.width,
        height: activeRect.height,
        top: activeRect.top - containerRect.top,
        ready: true,
      });
    }
  }, [value]);

  useEffect(() => {
    updateIndicator();
    const handleResize = () => updateIndicator();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateIndicator]);

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "relative inline-flex items-center p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-xl gap-1 shrink-0 select-none",
        className
      )}
    >
      {indicatorStyle.ready && (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute rounded-lg bg-white dark:bg-slate-900 shadow-xs",
            "transform-gpu transition-[transform,width,height] duration-240 ease-[var(--ease-out)]",
            "motion-reduce:transition-none",
            pillClassName
          )}
          style={{
            transform: `translate3d(${indicatorStyle.left}px, ${indicatorStyle.top}px, 0)`,
            width: `${indicatorStyle.width}px`,
            height: `${indicatorStyle.height}px`,
            left: 0,
            top: 0,
          }}
        />
      )}

      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            ref={(el) => {
              if (el) {
                itemsRef.current.set(option.value, el);
              } else {
                itemsRef.current.delete(option.value);
              }
            }}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative z-10 inline-flex items-center justify-center gap-1.5 h-8 px-3.5 rounded-lg text-xs font-semibold cursor-pointer",
              "transition-colors duration-150 transform-gpu active:scale-[0.98] motion-reduce:active:scale-100",
              isActive ? activeClassName : inactiveClassName,
              itemClassName
            )}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
