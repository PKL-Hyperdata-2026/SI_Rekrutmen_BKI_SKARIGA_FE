import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FilterSelectOption {
  value: string;
  label: string;
}

export interface FilterSelectProps {
  options: FilterSelectOption[];
  defaultValue?: string;
  placeholder?: string;
  role?: "admin" | "siswa" | "hrd";
  onValueChange?: (val: string) => void;
  className?: string;
}

const roleThemeClasses: Record<"admin" | "siswa" | "hrd", string> = {
  admin: "theme-admin",
  siswa: "theme-siswa",
  hrd: "theme-hrd",
};

export function FilterSelect({
  options,
  defaultValue,
  placeholder,
  role = "admin",
  onValueChange,
  className,
}: FilterSelectProps) {
  return (
    <div className={cn("inline-block", roleThemeClasses[role])}>
      <Select defaultValue={defaultValue} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            "!w-fit !text-white !border-none !rounded-lg !px-2.5 !h-7 !text-xs font-semibold shadow-xs transition-all duration-200 cursor-pointer !gap-1.5 [&_svg]:!text-white [&_svg]:!opacity-100 [&_svg]:!size-3.5",
            "!bg-[var(--sidebar-strip)] hover:!bg-[var(--sidebar-gradient-to)]",
            className
          )}
        >
          <SelectValue placeholder={placeholder || (options[0]?.label ?? "Pilih")} />
        </SelectTrigger>
        <SelectContent align="end">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}