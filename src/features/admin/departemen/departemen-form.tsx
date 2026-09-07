import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { DepartmentFormSchemaType } from "./departemen.schema";

interface DepartmentFormProps {
  form: UseFormReturn<DepartmentFormSchemaType>;
}

export function DepartmentForm({ form }: DepartmentFormProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const isActive = watch("is_active");

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">
          Kode Departemen <span className="text-rose-500">*</span>
        </label>
        <Input
          {...register("code")}
          placeholder="cth. TIK, MESIN, ELEKTRO"
          className="h-10 rounded-xl uppercase"
        />
        {errors.code && (
          <p className="text-[11px] text-rose-500 font-medium">{errors.code.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">
          Nama Departemen <span className="text-rose-500">*</span>
        </label>
        <Input
          {...register("name")}
          placeholder="cth. Teknologi Informasi dan Komunikasi"
          className="h-10 rounded-xl"
        />
        {errors.name && (
          <p className="text-[11px] text-rose-500 font-medium">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Deskripsi</label>
        <textarea
          {...register("description")}
          placeholder="Keterangan lingkup bidang keahlian..."
          className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[90px]"
        />
        {errors.description && (
          <p className="text-[11px] text-rose-500 font-medium">{errors.description.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-slate-800">Status Aktif</div>
          <div className="text-[11px] text-slate-400">
            Departemen aktif dapat dipilih saat registrasi dan pemetaan jurusan.
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
