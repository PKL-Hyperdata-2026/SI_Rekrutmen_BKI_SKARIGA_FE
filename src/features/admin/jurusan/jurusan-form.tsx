import { useId } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SearchableSelect,
  CharCounter,
  Box,
  Span,
  Paragraph,
} from "@/components/custom";
import { cn } from "@/lib/utils";
import type { DepartmentOption, MajorFormSchemaType } from "./jurusan.schema";
import { useMajorFormFields } from "./jurusan.form";

export function MajorFormSkeleton() {
  return (
    <Box className="space-y-4 py-2">
      <Box className="space-y-1.5">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </Box>

      <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Box className="space-y-1.5">
          <Box className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-3 w-8 rounded" />
          </Box>
          <Skeleton className="h-10 w-full rounded-lg" />
        </Box>

        <Box className="space-y-1.5">
          <Box className="flex items-center justify-between">
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-3 w-8 rounded" />
          </Box>
          <Skeleton className="h-10 w-full rounded-lg" />
        </Box>
      </Box>

      <Box className="space-y-1.5">
        <Box className="flex items-center justify-between">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-3 w-8 rounded" />
        </Box>
        <Skeleton className="h-24 w-full rounded-lg" />
      </Box>

      <Box className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/90 gap-3 mb-2 sm:mb-0">
        <Box className="space-y-1">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-3 w-64 rounded" />
        </Box>
        <Skeleton className="h-6 w-11 rounded-full shrink-0" />
      </Box>
    </Box>
  );
}

interface MajorFormProps {
  form: UseFormReturn<MajorFormSchemaType>;
  departmentOptions?: DepartmentOption[];
  departmentFallbackLabel?: string;
  isLoading?: boolean;
}

export function MajorForm({
  form,
  departmentOptions = [],
  departmentFallbackLabel,
  isLoading = false,
}: MajorFormProps) {
  const deptSelectId = useId();

  const {
    register,
    formState: { errors },
  } = form;

  const {
    currentDepartmentId,
    isActive,
    watchedCode,
    watchedName,
    watchedDescription,
    options,
    handleDepartmentChange,
    handleToggleActive,
  } = useMajorFormFields(form, departmentOptions);

  if (isLoading) {
    return <MajorFormSkeleton />;
  }

  return (
    <Box className="space-y-4 py-2">
      <Box className="space-y-1.5">
        <Label
          htmlFor={deptSelectId}
          className="text-xs font-bold text-slate-700"
        >
          Departemen Induk <Span className="text-rose-500">*</Span>
        </Label>
        <SearchableSelect
          id={deptSelectId}
          value={currentDepartmentId}
          onValueChange={handleDepartmentChange}
          options={options}
          placeholder="Pilih Departemen Induk"
          searchPlaceholder="Cari departemen..."
          searchable
          selectedFallbackLabel={departmentFallbackLabel}
        />
        {errors.department_id && (
          <Paragraph className="text-xs text-rose-500 font-medium">
            {errors.department_id.message}
          </Paragraph>
        )}
      </Box>

      <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Box className="space-y-1.5">
          <Box className="flex items-center justify-between">
            <Label className="text-xs font-bold text-slate-700">
              Kode Jurusan <Span className="text-rose-500">*</Span>
            </Label>
            <CharCounter length={watchedCode.length} max={20} />
          </Box>
          <Input
            {...register("code")}
            placeholder="cth. RPL"
            maxLength={20}
            className={cn(
              "h-10 w-full rounded-lg border bg-slate-50 px-3.5 text-sm uppercase placeholder:normal-case text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all",
              errors.code
                ? "border-rose-500 bg-rose-50/20 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
                : "border-slate-200",
            )}
          />
          {errors.code && (
            <Paragraph className="text-xs text-rose-500 font-medium">
              {errors.code.message}
            </Paragraph>
          )}
        </Box>

        <Box className="space-y-1.5">
          <Box className="flex items-center justify-between">
            <Label className="text-xs font-bold text-slate-700">
              Nama Program Keahlian <Span className="text-rose-500">*</Span>
            </Label>
            <CharCounter length={watchedName.length} max={255} />
          </Box>
          <Input
            {...register("name")}
            placeholder="cth. Rekayasa Perangkat Lunak"
            maxLength={255}
            className={cn(
              "h-10 w-full rounded-lg border bg-slate-50 px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all",
              errors.name
                ? "border-rose-500 bg-rose-50/20 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
                : "border-slate-200",
            )}
          />
          {errors.name && (
            <Paragraph className="text-xs text-rose-500 font-medium">
              {errors.name.message}
            </Paragraph>
          )}
        </Box>
      </Box>

      <Box className="space-y-1.5">
        <Box className="flex items-center justify-between">
          <Label className="text-xs font-bold text-slate-700">Deskripsi</Label>
          <CharCounter length={watchedDescription.length} max={1000} />
        </Box>
        <Textarea
          {...register("description")}
          placeholder="Keterangan kurikulum keahlian..."
          maxLength={1000}
          className={cn(
            "w-full rounded-lg border bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all min-h-24",
            errors.description
              ? "border-rose-500 bg-rose-50/20 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
              : "border-slate-200",
          )}
        />
        {errors.description && (
          <Paragraph className="text-xs text-rose-500 font-medium">
            {errors.description.message}
          </Paragraph>
        )}
      </Box>

      <Box className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/90 transition-colors gap-3 mb-2 sm:mb-0">
        <Box className="space-y-0.5">
          <Box className="text-xs font-bold text-slate-800">Status Aktif</Box>
          <Box className="text-xs text-slate-400">
            Jurusan aktif dapat dipilih saat registrasi siswa, alumni, dan
            lowongan kerja.
          </Box>
        </Box>
        <Switch checked={isActive} onCheckedChange={handleToggleActive} />
      </Box>
    </Box>
  );
}
