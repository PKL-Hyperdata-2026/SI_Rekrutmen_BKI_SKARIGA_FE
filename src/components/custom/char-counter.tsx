import { cn } from "@/lib/utils";

export interface CharCounterProps {
  length: number;
  max: number;
  className?: string;
}

export function CharCounter({ length, max, className }: CharCounterProps) {
  return (
    <span
      className={cn(
        "text-[10px] text-slate-400 font-medium tabular-nums select-none",
        length > max && "text-rose-500 font-semibold",
        className
      )}
    >
      {length}/{max}
    </span>
  );
}
