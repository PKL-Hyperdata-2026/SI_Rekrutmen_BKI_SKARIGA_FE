import { useId, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { AsyncSearchableSelect, CharCounter } from "@/components/custom";
import { selectOptionsApi } from "@/api/select-options";
import type { SelectQuery, AsyncSelectItem } from "@/api/select-options";
import type { SiswaFormSchemaType } from "./siswa.schema";

const fetchClasses = (query: SelectQuery) =>
  selectOptionsApi.getStandardTypes("class", query);

const fetchMajors = (query: SelectQuery) => selectOptionsApi.getMajors(query);

const fetchEmploymentStatuses = (query: SelectQuery) =>
  selectOptionsApi.getStandardTypes("employment_status", query);

const fetchCompanies = (query: SelectQuery) =>
  selectOptionsApi.getCompanies(query);

function extraString(item: AsyncSelectItem, key: string): string {
  const value = item.extra?.[key];
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

interface SiswaFormProps {
  form: UseFormReturn<SiswaFormSchemaType>;
  classFallbackLabel?: string;
  majorFallbackLabel?: string;
  statusFallbackLabel?: string;
  companyFallbackLabel?: string;
  isEditing?: boolean;
}

export function SiswaForm({
  form,
  classFallbackLabel,
  majorFallbackLabel,
  statusFallbackLabel,
  companyFallbackLabel,
  isEditing = false,
}: SiswaFormProps) {
  const majorSelectId = useId();
  const classSelectId = useId();
  const statusSelectId = useId();
  const companySelectId = useId();

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentMajorId = watch("major_id");
  const currentClassId = watch("class_id");
  const currentStatusId = watch("employment_status_id");
  const currentCompanyId = watch("current_company_id");
  const watchedNis = watch("nis") ?? "";
  const watchedFullName = watch("full_name") ?? "";
  const watchedPosition = watch("current_position") ?? "";
  const watchedSocialMedia = watch("social_media") ?? "";

  const [autoMajorLabel, setAutoMajorLabel] = useState<string | undefined>(
    undefined
  );

  const handleClassSelect = (item: AsyncSelectItem) => {
    const resolvedMajorId = extraString(item, "resolvedMajorId");
    const resolvedMajorName = extraString(item, "resolvedMajorName");
    if (resolvedMajorId) {
      setValue("major_id", resolvedMajorId, { shouldValidate: true });
      setAutoMajorLabel(resolvedMajorName || undefined);
    }
  };

  return (
    <div className="space-y-4 py-1 max-h-[72vh] overflow-y-auto pr-1">
      {/* Baris 1: NIS & Nama Lengkap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">
              Nomor Induk Siswa (NIS) <span className="text-rose-500">*</span>
            </label>
            <CharCounter length={watchedNis.length} max={20} />
          </div>
          <Input
            {...register("nis")}
            placeholder="cth. 212200881"
            maxLength={20}
            className="h-10 rounded-xl"
          />
          {errors.nis && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.nis.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">
              Nama Lengkap Siswa <span className="text-rose-500">*</span>
            </label>
            <CharCounter length={watchedFullName.length} max={255} />
          </div>
          <Input
            {...register("full_name")}
            placeholder="cth. Muhammad Rizky Pratama"
            maxLength={255}
            className="h-10 rounded-xl"
          />
          {errors.full_name && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.full_name.message}</p>
          )}
        </div>
      </div>

      {/* Baris 2: Email & No. Handphone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Email Akun Siswa <span className="text-rose-500">*</span>
          </label>
          <Input
            type="email"
            {...register("email")}
            placeholder="siswa@skariga.sch.id"
            className="h-10 rounded-xl"
          />
          {errors.email && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Nomor WhatsApp / Telepon
          </label>
          <Input
            {...register("phone")}
            placeholder="081234567890"
            className="h-10 rounded-xl"
          />
          {errors.phone && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Baris 3: Kelas & Jurusan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor={classSelectId} className="text-xs font-bold text-slate-700">
            Kelas Siswa <span className="text-rose-500">*</span>
          </label>
          <AsyncSearchableSelect
            id={classSelectId}
            variant="admin"
            value={currentClassId}
            onValueChange={(val) => setValue("class_id", val, { shouldValidate: true })}
            onOptionSelect={handleClassSelect}
            placeholder="Pilih Kelas"
            searchPlaceholder="Cari kelas..."
            fetchPage={fetchClasses}
            fallbackLabel={classFallbackLabel}
          />
          {errors.class_id && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.class_id.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor={majorSelectId} className="text-xs font-bold text-slate-700">
            Kompetensi Keahlian (Jurusan) <span className="text-rose-500">*</span>
          </label>
          <AsyncSearchableSelect
            id={majorSelectId}
            variant="admin"
            value={currentMajorId}
            onValueChange={(val) => setValue("major_id", val, { shouldValidate: true })}
            placeholder="Pilih Jurusan"
            searchPlaceholder="Cari jurusan..."
            fetchPage={fetchMajors}
            fallbackLabel={autoMajorLabel ?? majorFallbackLabel}
          />
          {errors.major_id && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.major_id.message}</p>
          )}
        </div>
      </div>

      {/* Baris 4: Kata Sandi */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">
          {isEditing
            ? "Kata Sandi Baru (Kosongkan jika tidak ingin diubah)"
            : "Kata Sandi Akun Siswa"}
        </label>
        <Input
          type="password"
          {...register("password")}
          placeholder={isEditing ? "••••••••" : "Minimal 6 karakter kombinasi"}
          className="h-10 rounded-xl"
        />
        {errors.password && (
          <p className="text-[11px] text-rose-500 font-medium">{errors.password.message}</p>
        )}
      </div>

      {/* Baris 5: Status Keterserapan & Perusahaan Tempat Kerja */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor={statusSelectId} className="text-xs font-bold text-slate-700">
            Status Keterserapan Kerja
          </label>
          <AsyncSearchableSelect
            id={statusSelectId}
            variant="admin"
            value={currentStatusId || ""}
            onValueChange={(val) => setValue("employment_status_id", val)}
            placeholder="Pilih Status Keterserapan"
            searchPlaceholder="Cari status..."
            fetchPage={fetchEmploymentStatuses}
            fallbackLabel={statusFallbackLabel}
            emptyOptionLabel="Belum Ditentukan / Belum Bekerja"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor={companySelectId} className="text-xs font-bold text-slate-700">
            Perusahaan Mitra / Tempat Kerja (Opsional)
          </label>
          <AsyncSearchableSelect
            id={companySelectId}
            variant="admin"
            value={currentCompanyId || ""}
            onValueChange={(val) => setValue("current_company_id", val)}
            placeholder="Pilih Perusahaan"
            searchPlaceholder="Cari perusahaan..."
            fetchPage={fetchCompanies}
            fallbackLabel={companyFallbackLabel}
            emptyOptionLabel="Tidak Ada / Belum Bekerja"
          />
        </div>
      </div>

      {/* Baris 6: Posisi Jabatan & Tautan Sosial Media */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">
              Posisi / Jabatan Pekerjaan (Opsional)
            </label>
            <CharCounter length={watchedPosition.length} max={255} />
          </div>
          <Input
            {...register("current_position")}
            placeholder="cth. Frontend Developer Junior"
            maxLength={255}
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">
              Tautan Profil / Media Sosial (Opsional)
            </label>
            <CharCounter length={watchedSocialMedia.length} max={255} />
          </div>
          <Input
            {...register("social_media")}
            placeholder="https://linkedin.com/in/... atau @username"
            maxLength={255}
            className="h-10 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
