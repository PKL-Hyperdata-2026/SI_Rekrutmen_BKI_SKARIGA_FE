import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FilterSelect } from "@/components/custom/filter-select";
import { Building2, GraduationCap, Users, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type LowonganKerjaFilterProps,
  useLowonganKerjaFilterValues,
} from "./lowongan-kerja.filter";

export function LowonganKerjaFilter(props: LowonganKerjaFilterProps) {
  const {
    departmentOptions = [],
    majorOptions = [],
    targetOptions = [],
    locationOptions = [],
    defaultDepartment = "all",
    defaultMajor = "all",
    defaultTarget = "all",
    defaultLocation = "all",
    onDepartmentChange,
    onMajorChange,
    onTargetChange,
    onLocationChange,
    className,
    isLoading = false,
  } = props;

  const { departmentValue, majorValue, targetValue, locationValue } =
    useLowonganKerjaFilterValues(props);

  return (
    <Card
      className={cn(
        "theme-siswa rounded-lg border border-slate-200/80 bg-white p-3 sm:p-3.5 shadow-xs ring-0 w-full",
        className,
      )}
    >
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-2.5 sm:gap-3 p-0 w-full">
        <Badge
          variant="outline"
          className="relative flex items-center h-10 w-full rounded-lg border-primary/30 bg-primary/5 hover:border-primary/50 transition-colors shadow-2xs cursor-pointer p-0 font-normal text-foreground [&>div]:w-full [&>div]:h-full"
        >
          <Building2 className="size-4 text-primary shrink-0 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <FilterSelect
            role="siswa"
            value={departmentValue}
            defaultValue={defaultDepartment}
            onValueChange={onDepartmentChange}
            options={departmentOptions}
            isLoading={isLoading}
            className="w-full! h-full! pl-9.5! pr-3.5! rounded-lg! bg-transparent! text-foreground! border-none! shadow-none! text-xs! sm:text-[13px]! font-normal! hover:bg-transparent! [&_svg]:text-primary! [&_svg]:size-4! cursor-pointer gap-2! justify-between!"
          />
        </Badge>

        <Badge
          variant="outline"
          className="relative flex items-center h-10 w-full rounded-lg border-primary/30 bg-primary/5 hover:border-primary/50 transition-colors shadow-2xs cursor-pointer p-0 font-normal text-foreground [&>div]:w-full [&>div]:h-full"
        >
          <GraduationCap className="size-4 text-primary shrink-0 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <FilterSelect
            role="siswa"
            value={majorValue}
            defaultValue={defaultMajor}
            onValueChange={onMajorChange}
            options={majorOptions}
            isLoading={isLoading}
            className="w-full! h-full! pl-9.5! pr-3.5! rounded-lg! bg-transparent! text-foreground! border-none! shadow-none! text-xs! sm:text-[13px]! font-normal! hover:bg-transparent! [&_svg]:text-primary! [&_svg]:size-4! cursor-pointer gap-2! justify-between!"
          />
        </Badge>

        <Badge
          variant="outline"
          className="relative flex items-center h-10 w-full rounded-lg border-primary/30 bg-primary/5 hover:border-primary/50 transition-colors shadow-2xs cursor-pointer p-0 font-normal text-foreground [&>div]:w-full [&>div]:h-full"
        >
          <Users className="size-4 text-primary shrink-0 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <FilterSelect
            role="siswa"
            value={targetValue}
            defaultValue={defaultTarget}
            onValueChange={onTargetChange}
            options={targetOptions}
            isLoading={isLoading}
            className="w-full! h-full! pl-9.5! pr-3.5! rounded-lg! bg-transparent! text-foreground! border-none! shadow-none! text-xs! sm:text-[13px]! font-normal! hover:bg-transparent! [&_svg]:text-primary! [&_svg]:size-4! cursor-pointer gap-2! justify-between!"
          />
        </Badge>

        <Badge
          variant="outline"
          className="relative flex items-center h-10 w-full rounded-lg border-primary/30 bg-primary/5 hover:border-primary/50 transition-colors shadow-2xs cursor-pointer p-0 font-normal text-foreground [&>div]:w-full [&>div]:h-full"
        >
          <MapPin className="size-4 text-primary shrink-0 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <FilterSelect
            role="siswa"
            value={locationValue}
            defaultValue={defaultLocation}
            onValueChange={onLocationChange}
            options={locationOptions}
            isLoading={isLoading}
            className="w-full! h-full! pl-9.5! pr-3.5! rounded-lg! bg-transparent! text-foreground! border-none! shadow-none! text-xs! sm:text-[13px]! font-normal! hover:bg-transparent! [&_svg]:text-primary! [&_svg]:size-4! cursor-pointer gap-2! justify-between!"
          />
        </Badge>
      </CardContent>
    </Card>
  );
}
