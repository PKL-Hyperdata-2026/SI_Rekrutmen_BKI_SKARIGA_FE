import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Box, Span, Paragraph } from "@/components/custom";
import { cn } from "@/lib/utils";
import type { DepartmentFormSchemaType } from "./departemen.schema";
import { useDepartmentFormFields } from "./departemen.form";

interface DepartmentFormProps {
  form: UseFormReturn<DepartmentFormSchemaType>;
}

export function DepartmentForm({ form }: DepartmentFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  const { isActive, handleToggleActive } = useDepartmentFormFields(form);

  return (
    <Box className="space-y-3 sm:space-y-4 py-1 sm:py-2">
      <Box className="space-y-1">
        <Label className="text-xs font-semibold text-slate-700">
          Kode Departemen <Span className="text-rose-500">*</Span>
        </Label>
        <Input
          {...register("code")}
          placeholder="cth. TIK"
          className={cn(
            "h-10 w-full rounded-lg border bg-slate-50/70 px-3.5 text-sm uppercase text-slate-800 placeholder:text-slate-400 placeholder:normal-case focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all shadow-2xs",
            errors.code
              ? "border-rose-500 bg-rose-50/20 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
              : "border-slate-200",
          )}
        />
        {errors.code && (
          <Paragraph className="text-[11px] font-medium text-rose-500">
            {errors.code.message}
          </Paragraph>
        )}
      </Box>

      <Box className="space-y-1">
        <Label className="text-xs font-semibold text-slate-700">
          Nama Departemen <Span className="text-rose-500">*</Span>
        </Label>
        <Input
          {...register("name")}
          placeholder="cth. Teknologi Informasi dan Komunikasi"
          className={cn(
            "h-10 w-full rounded-lg border bg-slate-50/70 px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all shadow-2xs",
            errors.name
              ? "border-rose-500 bg-rose-50/20 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
              : "border-slate-200",
          )}
        />
        {errors.name && (
          <Paragraph className="text-[11px] font-medium text-rose-500">
            {errors.name.message}
          </Paragraph>
        )}
      </Box>

      <Box className="space-y-1">
        <Label className="text-xs font-semibold text-slate-700">
          Deskripsi
        </Label>
        <Textarea
          {...register("description")}
          placeholder="Keterangan lingkup bidang keahlian..."
          rows={3}
          className={cn(
            "min-h-18 sm:min-h-24 w-full rounded-lg border bg-slate-50/70 px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all shadow-2xs resize-none",
            errors.description
              ? "border-rose-500 bg-rose-50/20 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
              : "border-slate-200",
          )}
        />
        {errors.description && (
          <Paragraph className="text-[11px] font-medium text-rose-500">
            {errors.description.message}
          </Paragraph>
        )}
      </Box>

      <Box className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/90 transition-colors gap-3 mb-2 sm:mb-0">
        <Box className="space-y-0.5 min-w-0 flex-1">
          <Box className="text-xs font-semibold text-slate-800">
            Status Aktif
          </Box>
          <Box className="text-[11px] sm:text-xs text-slate-400 leading-tight">
            Departemen aktif dapat dipilih saat registrasi dan pemetaan jurusan.
          </Box>
        </Box>
        <Switch checked={isActive} onCheckedChange={handleToggleActive} className="shrink-0" />
      </Box>
    </Box>
  );
}
