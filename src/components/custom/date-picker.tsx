import * as React from "react";
import { format, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppSelector } from "@/hooks/use-app";

export type DatePickerVariant = "admin" | "student" | "alumni" | "hrd" | "auto";

export interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  popoverClassName?: string;
  hasError?: boolean;
  disabled?: boolean;
  id?: string;
  variant?: DatePickerVariant;
}

const roleThemeClasses: Record<string, string> = {
  admin: "theme-admin",
  superadmin: "theme-admin",
  siswa: "theme-siswa",
  student: "theme-siswa",
  alumni: "theme-siswa",
  hrd: "theme-hrd",
};

export function DatePicker({
  value,
  onChange,
  placeholder = "Pilih Tanggal",
  className,
  popoverClassName,
  hasError = false,
  disabled = false,
  id,
  variant = "auto",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const resolvedRole = variant !== "auto" ? variant : user?.role || "admin";

  const themeClass = roleThemeClasses[resolvedRole] || "theme-admin";

  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    try {
      const d = parseISO(value);
      return isNaN(d.getTime()) ? undefined : d;
    } catch {
      return undefined;
    }
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      onChange?.(`${year}-${month}-${day}`);
    } else {
      onChange?.("");
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-10 w-full justify-between px-3.5 text-left font-normal rounded-lg border bg-[#F8F9FD] hover:bg-white transition-all shadow-xs cursor-pointer group",
            !selectedDate && "text-slate-700",
            selectedDate && "text-slate-800 font-normal",
            open && "border-primary ring-2 ring-primary/20 bg-white",
            hasError
              ? "border-red-500 bg-red-50/20 focus-visible:ring-red-500/20"
              : "border-slate-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
            className,
          )}
        >
          <span className="truncate">
            {selectedDate ? format(selectedDate, "dd/MM/yyyy") : placeholder}
          </span>
          <CalendarIcon
            className={cn(
              "size-4 shrink-0 transition-colors",
              selectedDate
                ? "text-primary"
                : "text-slate-500 group-hover:text-primary",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-auto p-0 rounded-lg shadow-xl border border-slate-200 bg-white",
          themeClass,
          popoverClassName,
        )}
        align="start"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          locale={idLocale}
          className="p-3"
          classNames={{
            nav: "absolute inset-x-0 top-0 flex h-9 w-full items-center justify-between px-1 z-10",
            button_previous:
              "h-7 w-7 flex items-center justify-center cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
            button_next:
              "h-7 w-7 flex items-center justify-center cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
            month_caption: "flex h-9 w-full items-center justify-center px-8",
            caption_label: "text-sm font-semibold text-slate-800 select-none",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
