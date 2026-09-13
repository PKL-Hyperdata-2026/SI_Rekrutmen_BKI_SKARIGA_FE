import * as React from "react";
import { format, startOfDay } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DateRange } from "react-day-picker";
import { useAppSelector } from "@/hooks/useApp";

export type DateRangeValue = DateRange;
export type DateRangePickerVariant = "admin" | "student" | "alumni" | "hrd" | "auto";
export type DateRangeTriggerVariant = "default" | "glass-pill";

export interface DateRangePickerProps {
  value?: DateRangeValue;
  onChange?: (range: DateRangeValue | undefined) => void;
  placeholder?: string;
  title?: string;
  confirmText?: string;
  className?: string;
  popoverClassName?: string;
  hasError?: boolean;
  disabled?: boolean;
  id?: string;
  variant?: DateRangePickerVariant;
  triggerVariant?: DateRangeTriggerVariant;
}

const roleThemeClasses: Record<string, string> = {
  admin: "theme-admin",
  superadmin: "theme-admin",
  siswa: "theme-siswa",
  student: "theme-siswa",
  alumni: "theme-siswa",
  hrd: "theme-hrd",
};

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Pilih Rentang Tanggal",
  title,
  confirmText = "Pilih",
  className,
  popoverClassName,
  hasError = false,
  disabled = false,
  id,
  variant = "auto",
  triggerVariant = "default",
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const resolvedRole = variant !== "auto" ? variant : user?.role || "student";
  const themeClass = roleThemeClasses[resolvedRole] || "theme-siswa";
  const [draftRange, setDraftRange] = React.useState<DateRangeValue | null>(null);
  const [hoveredDate, setHoveredDate] = React.useState<Date | null>(null);

  const activeRange = draftRange ?? value;

  const displayRange = React.useMemo<DateRangeValue | undefined>(() => {
    if (draftRange?.from && !draftRange?.to && hoveredDate) {
      if (hoveredDate < draftRange.from) {
        return { from: hoveredDate, to: draftRange.from };
      }
      return { from: draftRange.from, to: hoveredDate };
    }
    return activeRange;
  }, [draftRange, hoveredDate, activeRange]);

  const displayLabel = React.useMemo(() => {
    if (value?.from && value?.to) {
      const fromStr = format(value.from, "d MMM", { locale: idLocale });
      const toStr = format(value.to, "d MMM yyyy", { locale: idLocale });
      return `${fromStr} - ${toStr}`;
    }
    if (value?.from) {
      return `${format(value.from, "d MMM yyyy", { locale: idLocale })} - ...`;
    }
    return placeholder;
  }, [value, placeholder]);

  const handleDayClick = (day: Date) => {
    const clicked = startOfDay(day);
    if (!draftRange?.from || (draftRange.from && draftRange.to)) {
      setDraftRange({ from: clicked, to: undefined });
      setHoveredDate(null);
      return;
    }
    const curFrom = startOfDay(draftRange.from);
    setHoveredDate(null);
    const nextRange: DateRangeValue =
      clicked < curFrom
        ? { from: clicked, to: curFrom }
        : { from: curFrom, to: clicked };
    setDraftRange(null);
    onChange?.(nextRange);
  };

  const handleFinalizeRange = () => {
    if (draftRange?.from && !draftRange?.to) {
      const complete = { from: draftRange.from, to: draftRange.from };
      setDraftRange(null);
      onChange?.(complete);
    } else {
      setDraftRange(null);
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleFinalizeRange();
        setOpen(nextOpen);
      }}
    >
      <PopoverTrigger asChild>
        {triggerVariant === "glass-pill" ? (
          <button
            id={id}
            type="button"
            disabled={disabled}
            className={cn(
              "w-auto max-w-fit !text-white !bg-white/15 hover:!bg-white/25 !border !border-white/35 !backdrop-blur-[6px] !rounded-full !px-3.5 !py-1 !h-7.5 !text-xs font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all cursor-pointer flex items-center gap-2 select-none justify-between disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
          >
            <CalendarIcon className="size-3.5 text-white opacity-95 shrink-0" />
            <span className="truncate">{displayLabel}</span>
            <ChevronDown className="size-3.5 text-white opacity-95 shrink-0" />
          </button>
        ) : (
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-10 w-full justify-between px-3.5 text-left font-normal rounded-lg border bg-[#F8F9FD] hover:bg-white transition-all shadow-xs cursor-pointer group text-xs",
              !value?.from ? "text-slate-700" : "text-slate-900 font-semibold",
              open && "border-primary ring-2 ring-primary/20 bg-white",
              hasError
                ? "border-red-500 bg-red-50/20 focus-visible:ring-red-500/20"
                : "border-slate-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
              className
            )}
          >
            <span className="truncate">{displayLabel}</span>
            <CalendarIcon className="size-4 shrink-0 text-slate-500 group-hover:text-primary transition-colors" />
          </Button>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className={cn(
          "w-64 max-w-[calc(100vw-2rem)] p-0 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.18)] border border-slate-200 bg-white z-50 overflow-hidden",
          themeClass,
          popoverClassName
        )}
      >
        {title && (
          <div className="flex items-center px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/80">
            <span className="text-xs font-bold text-slate-700">{title}</span>
          </div>
        )}

        <div
          className="px-2.5 py-1.5 w-full flex justify-center"
          onMouseLeave={() => {
            if (draftRange?.from && !draftRange?.to) {
              setHoveredDate(null);
            }
          }}
        >
          <Calendar
            mode="range"
            selected={displayRange}
            onSelect={(_range, triggerDate) => {
              if (triggerDate) {
                handleDayClick(triggerDate);
              }
            }}
            onDayMouseEnter={(day) => {
              if (draftRange?.from && !draftRange?.to) {
                setHoveredDate(startOfDay(day));
              }
            }}
            locale={idLocale}
            numberOfMonths={1}
            className="rounded-xl p-0 w-full flex justify-center"
            classNames={{
              root: "w-full flex justify-center",
              months: "relative w-full flex justify-center",
              month: "relative w-full flex flex-col items-center gap-1.5",
              month_grid: "w-full border-collapse",
              weekdays: "flex w-full justify-between",
              weekday: "flex-1 text-center text-[0.75rem] font-medium text-slate-400 py-0.5",
              week: "flex w-full justify-between mt-0.5",
              day: "flex-1 aspect-square p-0 text-center flex items-center justify-center",
              month_caption: "flex h-7 w-full items-center justify-center px-8 text-xs font-semibold select-none",
              nav: "absolute inset-x-0 top-0 flex h-7 w-full items-center justify-between px-1 z-10 pointer-events-none",
              button_previous: "h-6 w-6 p-0 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer pointer-events-auto",
              button_next: "h-6 w-6 p-0 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer pointer-events-auto",
            }}
            defaultMonth={draftRange?.from || value?.from || new Date()}
          />
        </div>

        <div className="px-3.5 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs gap-2">
          <span className="text-[11px] text-slate-500 truncate min-w-0 flex-1">
            {displayRange?.from && displayRange?.to
              ? `${format(displayRange.from, "dd/MM/yyyy")} - ${format(displayRange.to, "dd/MM/yyyy")}`
              : draftRange?.from
              ? `${format(draftRange.from, "dd/MM/yyyy")} - ...`
              : placeholder}
          </span>
          <button
            type="button"
            onClick={() => {
              handleFinalizeRange();
              setOpen(false);
            }}
            className="px-3 py-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-[11px] rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
          >
            {confirmText}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
