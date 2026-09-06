import { useId } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { resolveMajorByClass } from "./siswa.form";
import type { SiswaFormSchemaType, SiswaOptionItem } from "./siswa.schema";

interface SiswaFormProps {
  form: UseFormReturn<SiswaFormSchemaType>;
  majors: SiswaOptionItem[];
  classes: SiswaOptionItem[];
  employmentStatuses?: SiswaOptionItem[];
  companies?: SiswaOptionItem[];
  isEditing?: boolean;
}

export function SiswaForm({
  form,
  majors,
  classes,
  employmentStatuses = [],
  companies = [],
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

  const handleClassChange = (selectedClassId: string) => {
    setValue("class_id", selectedClassId, { shouldValidate: true });
    const autoMajorId = resolveMajorByClass(selectedClassId, classes, majors);
    if (autoMajorId) {
      setValue("major_id", autoMajorId, { shouldValidate: true });
    }
  };

  const statusOptions = [
    { value: "", label: "Belum Ditentukan / Belum Bekerja" },
    ...employmentStatuses.map((s) => ({
      value: String(s.id),
      label: s.name,
    })),
  ];

  const companyOptions = [
    { value: "", label: "Tidak Ada / Belum Bekerja" },
    ...companies.map((c) => ({
      value: String(c.id),
      label: c.name,
    })),
  ];

  return (
    <div className="space-y-4 py-1 max-h-[72vh] overflow-y-auto pr-1">
      {/* Baris 1: NIS & Nama Lengkap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Nomor Induk Siswa (NIS) <span className="text-rose-500">*</span>
          </label>
          <Input
            {...register("nis")}
            placeholder="cth. 212200881"
            className="h-10 rounded-xl"
          />
          {errors.nis && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.nis.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Nama Lengkap Siswa <span className="text-rose-500">*</span>
          </label>
          <Input
            {...register("full_name")}
            placeholder="cth. Muhammad Rizky Pratama"
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
          <SearchableSelect
            id={classSelectId}
            searchable={true}
            variant="admin"
            value={currentClassId}
            onValueChange={handleClassChange}
            placeholder="Pilih Kelas"
            searchPlaceholder="Cari kelas..."
            hasError={Boolean(errors.class_id)}
            options={classes.map((c) => ({
              value: String(c.id),
              label: c.name,
            }))}
          />
          {errors.class_id && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.class_id.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor={majorSelectId} className="text-xs font-bold text-slate-700">
            Kompetensi Keahlian (Jurusan) <span className="text-rose-500">*</span>
          </label>
          <SearchableSelect
            id={majorSelectId}
            searchable={true}
            variant="admin"
            value={currentMajorId}
            onValueChange={(val) => setValue("major_id", val, { shouldValidate: true })}
            placeholder="Pilih Jurusan"
            searchPlaceholder="Cari jurusan..."
            hasError={Boolean(errors.major_id)}
            options={majors.map((m) => ({
              value: String(m.id),
              label: m.name,
            }))}
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
          <SearchableSelect
            id={statusSelectId}
            variant="admin"
            value={currentStatusId || ""}
            onValueChange={(val) => setValue("employment_status_id", val)}
            placeholder="Pilih Status Keterserapan"
            searchPlaceholder="Cari status..."
            options={statusOptions}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor={companySelectId} className="text-xs font-bold text-slate-700">
            Perusahaan Mitra / Tempat Kerja (Opsional)
          </label>
          <SearchableSelect
            id={companySelectId}
            searchable={true}
            variant="admin"
            value={currentCompanyId || ""}
            onValueChange={(val) => setValue("current_company_id", val)}
            placeholder="Pilih Perusahaan"
            searchPlaceholder="Cari perusahaan..."
            options={companyOptions}
          />
        </div>
      </div>

      {/* Baris 6: Posisi Jabatan & Tautan Sosial Media */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Posisi / Jabatan Pekerjaan (Opsional)
          </label>
          <Input
            {...register("current_position")}
            placeholder="cth. Frontend Developer Junior"
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Tautan Profil / Media Sosial (Opsional)
          </label>
          <Input
            {...register("social_media")}
            placeholder="https://linkedin.com/in/... atau @username"
            className="h-10 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
