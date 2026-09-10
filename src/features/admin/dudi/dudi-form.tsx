import { useId } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AsyncSearchableSelect } from "@/components/custom/async-searchable-select";
import { selectOptionsApi } from "@/api/select-options";
import type { SelectQuery } from "@/api/select-options";
import type { DudiFormSchemaType } from "./dudi.schema";

const fetchIndustries = (query: SelectQuery) =>
  selectOptionsApi.getStandardTypes("company_industry", query);

interface DudiFormProps {
  form: UseFormReturn<DudiFormSchemaType>;
  industryFallbackLabel?: string;
}

export function DudiForm({ form, industryFallbackLabel }: DudiFormProps) {
  const industrySelectId = useId();

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentIndustryId = watch("industry_id");
  const isActive = watch("is_active");

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Nama Perusahaan / Instansi *</label>
        <Input
          {...register("name")}
          placeholder="cth. PT United Tractors Tbk"
          className="h-10 rounded-xl"
        />
        {errors.name && (
          <p className="text-[11px] text-rose-500 font-medium">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor={industrySelectId} className="text-xs font-bold text-slate-700">
            Bidang Industri
          </label>
          <AsyncSearchableSelect
            id={industrySelectId}
            value={currentIndustryId}
            onValueChange={(val) => setValue("industry_id", val)}
            placeholder="Pilih Bidang Industri"
            searchPlaceholder="Cari bidang industri..."
            fetchPage={fetchIndustries}
            fallbackLabel={industryFallbackLabel}
          />
          {errors.industry_id && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.industry_id.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Email Perusahaan</label>
          <Input
            type="email"
            {...register("email")}
            placeholder="hrd@perusahaan.co.id"
            className="h-10 rounded-xl"
          />
          {errors.email && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Nomor Telepon Kantor</label>
          <Input
            {...register("phone")}
            placeholder="021-12345678 / 08123456789"
            className="h-10 rounded-xl"
          />
          {errors.phone && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Website Resmi</label>
          <Input
            {...register("website")}
            placeholder="https://perusahaan.co.id"
            className="h-10 rounded-xl"
          />
          {errors.website && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.website.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Alamat Lengkap</label>
        <Input
          {...register("address")}
          placeholder="Jl. Raya Industri No. 45, Kawasan Industri SIER"
          className="h-10 rounded-xl"
        />
        {errors.address && (
          <p className="text-[11px] text-rose-500 font-medium">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Nama PIC / HRD</label>
          <Input
            {...register("pic_name")}
            placeholder="cth. Ibu Ratna (HR Manager)"
            className="h-10 rounded-xl"
          />
          {errors.pic_name && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.pic_name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Kontak WhatsApp PIC</label>
          <Input
            {...register("pic_contact")}
            placeholder="081234567890"
            className="h-10 rounded-xl"
          />
          {errors.pic_contact && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.pic_contact.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-slate-800">Status Kerjasama Aktif</div>
          <div className="text-[11px] text-slate-400">
            Perusahaan aktif dapat membuka lowongan kerja dan menerima lamaran.
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
