import { cn } from "@/lib/utils";

export interface CharCounterProps {
  length: number;
  max: number;
  className?: string;
}

export function CharCounter({ length = 0, max, className }: CharCounterProps) {
  const safeLength = length ?? 0;
  const remaining = max - safeLength;
  const warningThreshold = max <= 25 ? 3 : 10;

  const isFull = safeLength >= max;
  const isWarning = !isFull && remaining <= warningThreshold && safeLength > 0;

  return (
    <span
      className={cn(
        "text-[10px] tabular-nums select-none transition-colors duration-150",
        isFull
          ? "text-rose-500 font-semibold"
          : isWarning
          ? "text-amber-500 font-semibold"
          : "text-slate-400 font-medium",
        className
      )}
    >
      {safeLength}/{max}
    </span>
  );
}
