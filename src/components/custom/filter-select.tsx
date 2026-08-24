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

const roleSelectStyles: Record<"admin" | "siswa" | "hrd", string> = {
  admin: "!bg-[#3b1578] hover:!bg-[#2e0e63]",
  siswa: "!bg-[#123C70] hover:!bg-[#062A4D]",
  hrd: "!bg-[#5A0C62] hover:!bg-[#3D0040]",
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
    <Select defaultValue={defaultValue} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "!w-fit !text-white !border-none !rounded-lg !px-2.5 !h-7 !text-xs font-semibold shadow-2xs transition-all duration-200 cursor-pointer !gap-1.5 [&_svg]:!text-white [&_svg]:!opacity-100 [&_svg]:!size-3.5",
          roleSelectStyles[role],
          className
        )}
      >
        <SelectValue placeholder={placeholder || (options[0] ? options[0].label : "Pilih")} />
      </SelectTrigger>
      <SelectContent align="end">
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-xs">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}