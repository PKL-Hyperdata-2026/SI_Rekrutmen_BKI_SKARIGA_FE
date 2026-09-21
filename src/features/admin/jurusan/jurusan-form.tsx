import { useId } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AsyncSearchableSelect, CharCounter } from "@/components/custom";
import { selectOptionsApi } from "@/api/select-options";
import type { MajorFormSchemaType } from "./jurusan.schema";

interface MajorFormProps {
  form: UseFormReturn<MajorFormSchemaType>;
  departmentFallbackLabel?: string;
}

export function MajorForm({ form, departmentFallbackLabel }: MajorFormProps) {
  const deptSelectId = useId();

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentDepartmentId = watch("department_id");
  const isActive = watch("is_active");
  const watchedCode = watch("code") ?? "";
  const watchedName = watch("name") ?? "";
  const watchedDescription = watch("description") ?? "";

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-1.5">
        <label htmlFor={deptSelectId} className="text-xs font-bold text-slate-700">
          Departemen Induk <span className="text-rose-500">*</span>
        </label>
        <AsyncSearchableSelect
          id={deptSelectId}
          value={currentDepartmentId}
          onValueChange={(val) => setValue("department_id", val, { shouldValidate: true })}
          placeholder="Pilih Departemen Induk"
          searchPlaceholder="Cari departemen..."
          fetchPage={selectOptionsApi.getDepartments}
          fallbackLabel={departmentFallbackLabel}
        />
        {errors.department_id && (
          <p className="text-xs text-rose-500 font-medium">{errors.department_id.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">
              Kode Jurusan <span className="text-rose-500">*</span>
            </label>
            <CharCounter length={watchedCode.length} max={20} />
          </div>
          <Input
            {...register("code")}
            placeholder="cth. RPL, TKJ, DKV"
            maxLength={20}
            className="h-10 rounded-xl uppercase"
          />
          {errors.code && (
            <p className="text-xs text-rose-500 font-medium">{errors.code.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">
              Nama Program Keahlian <span className="text-rose-500">*</span>
            </label>
            <CharCounter length={watchedName.length} max={255} />
          </div>
          <Input
            {...register("name")}
            placeholder="cth. Rekayasa Perangkat Lunak"
            maxLength={255}
            className="h-10 rounded-xl"
          />
          {errors.name && (
            <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700">Deskripsi</label>
          <CharCounter length={watchedDescription.length} max={1000} />
        </div>
        <textarea
          {...register("description")}
          placeholder="Keterangan kurikulum keahlian..."
          maxLength={1000}
          className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-24"
        />
        {errors.description && (
          <p className="text-xs text-rose-500 font-medium">{errors.description.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-slate-800">Status Aktif</div>
          <div className="text-xs text-slate-400">
            Jurusan aktif dapat dipilih saat registrasi siswa, alumni, dan lowongan kerja.
          </div>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={(checked) => setValue("is_active", checked)}
        />
      </div>
    </div>
  );
}
