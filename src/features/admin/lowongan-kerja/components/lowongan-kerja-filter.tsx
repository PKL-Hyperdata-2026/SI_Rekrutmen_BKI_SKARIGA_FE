import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FilterSelect,
  type FilterSelectOption,
} from "@/components/custom/filter-select";
import { Building2, GraduationCap, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LowonganKerjaFilterProps {
  statusOptions?: FilterSelectOption[];
  majorOptions?: FilterSelectOption[];
  targetOptions?: FilterSelectOption[];
  defaultStatus?: string;
  defaultMajor?: string;
  defaultTarget?: string;
  onStatusChange?: (val: string) => void;
  onMajorChange?: (val: string) => void;
  onTargetChange?: (val: string) => void;
  totalCount?: number | string;
  totalLabel?: string;
  className?: string;
  isLoading?: boolean;
}

export function LowonganKerjaFilter({
  statusOptions = [],
  majorOptions = [],
  targetOptions = [],
  defaultStatus = "all",
  defaultMajor = "all",
  defaultTarget = "all",
  onStatusChange,
  onMajorChange,
  onTargetChange,
  totalCount = 0,
  totalLabel = "Perusahaan Mitra",
  className,
  isLoading = false,
}: LowonganKerjaFilterProps) {
  return (
    <Card
      className={cn(
        "theme-admin rounded-lg border border-slate-100! bg-white p-3 sm:p-3.5 shadow-xs ring-0!",
        className,
      )}
    >
      <CardContent className="flex flex-wrap items-center gap-3 p-0">
        <Badge
          variant="outline"
          className="relative flex items-center h-10 rounded-lg border-primary/30 bg-primary/5 hover:border-primary/50 transition-colors shadow-2xs cursor-pointer p-0 font-normal text-foreground [&>div]:w-full [&>div]:h-full shrink-0"
        >
          <Building2 className="size-4 text-primary shrink-0 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <FilterSelect
            key={`status-${statusOptions.map((o) => o.value).join("-")}`}
            role="admin"
            defaultValue={defaultStatus}
            onValueChange={onStatusChange}
            options={statusOptions}
            isLoading={isLoading}
            className="w-full! h-full! pl-9.5! pr-3.5! rounded-lg! bg-transparent! text-foreground! border-none! shadow-none! text-xs! sm:text-[13px]! font-normal! hover:bg-transparent! [&_svg]:text-primary! [&_svg]:size-4! cursor-pointer gap-2! justify-between!"
          />
        </Badge>

        <Badge
          variant="outline"
          className="relative flex items-center h-10 rounded-lg border-primary/30 bg-primary/5 hover:border-primary/50 transition-colors shadow-2xs cursor-pointer p-0 font-normal text-foreground [&>div]:w-full [&>div]:h-full shrink-0"
        >
          <GraduationCap className="size-4 text-primary shrink-0 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <FilterSelect
            key={`major-${majorOptions.map((o) => o.value).join("-")}`}
            role="admin"
            defaultValue={defaultMajor}
            onValueChange={onMajorChange}
            options={majorOptions}
            isLoading={isLoading}
            className="w-full! h-full! pl-9.5! pr-3.5! rounded-lg! bg-transparent! text-foreground! border-none! shadow-none! text-xs! sm:text-[13px]! font-normal! hover:bg-transparent! [&_svg]:text-primary! [&_svg]:size-4! cursor-pointer gap-2! justify-between!"
          />
        </Badge>

        <Badge
          variant="outline"
          className="relative flex items-center h-10 rounded-lg border-primary/30 bg-primary/5 hover:border-primary/50 transition-colors shadow-2xs cursor-pointer p-0 font-normal text-foreground [&>div]:w-full [&>div]:h-full shrink-0"
        >
          <Users className="size-4 text-primary shrink-0 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <FilterSelect
            key={`target-${targetOptions.map((o) => o.value).join("-")}`}
            role="admin"
            defaultValue={defaultTarget}
            onValueChange={onTargetChange}
            options={targetOptions}
            isLoading={isLoading}
            className="w-full! h-full! pl-9.5! pr-3.5! rounded-lg! bg-transparent! text-foreground! border-none! shadow-none! text-xs! sm:text-[13px]! font-normal! hover:bg-transparent! [&_svg]:text-primary! [&_svg]:size-4! cursor-pointer gap-2! justify-between!"
          />
        </Badge>

        <Badge
          variant="outline"
          className="h-10 px-4 rounded-lg border-primary/30 bg-primary/5 text-xs sm:text-[13px] shadow-2xs font-normal text-foreground select-none shrink-0 gap-1"
        >
          Total :
          <Badge
            variant="outline"
            className="border-none bg-transparent p-0 font-bold text-accent text-xs sm:text-[13px] shadow-none inline"
          >
            {totalCount} {totalLabel}
          </Badge>
        </Badge>
      </CardContent>
    </Card>
  );
}
