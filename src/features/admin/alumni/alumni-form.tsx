import { useId } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import type { AlumniFormSchemaType, AlumniOptionsData } from "./alumni.schema";

interface AlumniFormProps {
  form: UseFormReturn<AlumniFormSchemaType>;
  options: AlumniOptionsData;
  isEditing?: boolean;
}

export function AlumniForm({ form, options, isEditing = false }: AlumniFormProps) {
  const majorSelectId = useId();
  const companySelectId = useId();
  const yearSelectId = useId();
  const statusSelectId = useId();

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentMajorId = watch("major_id");
  const currentCompanyId = watch("current_company_id");
  const currentGraduationYear = watch("graduation_year");
  const currentStatusId = watch("employment_status_id");

  const yearOptions = (options.graduation_years || []).map((yr) => ({
    value: String(yr),
    label: `Lulusan ${yr}`,
  }));

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Nama Lengkap Alumni *</label>
          <Input
            {...register("full_name")}
            placeholder="cth. Bagas Setiawan"
            className="h-10 rounded-xl"
          />
          {errors.full_name && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.full_name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Nomor Induk Siswa (NIS)</label>
          <Input
            {...register("nis")}
            placeholder="cth. 202100123"
            className="h-10 rounded-xl"
          />
          {errors.nis && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.nis.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Nomor WhatsApp</label>
          <Input
            {...register("phone")}
            placeholder="081234567890"
            className="h-10 rounded-xl"
          />
          {errors.phone && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor={yearSelectId} className="text-xs font-bold text-slate-700">
            Tahun Kelulusan *
          </label>
          <SearchableSelect
            id={yearSelectId}
            searchable={false}
            value={currentGraduationYear}
            onValueChange={(val) => setValue("graduation_year", val)}
            placeholder="Pilih Tahun Kelulusan"
            options={yearOptions}
          />
          {errors.graduation_year && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.graduation_year.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor={majorSelectId} className="text-xs font-bold text-slate-700">
            Jurusan Saat SMK *
          </label>
          <SearchableSelect
            id={majorSelectId}
            searchable={true}
            value={currentMajorId}
            onValueChange={(val) => setValue("major_id", val)}
            placeholder="Pilih Jurusan"
            searchPlaceholder="Cari jurusan..."
            options={(options.majors || []).map((m) => ({
              value: String(m.id),
              label: m.name,
            }))}
          />
          {errors.major_id && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.major_id.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor={statusSelectId} className="text-xs font-bold text-slate-700">
            Status Keterserapan Kerja
          </label>
          <SearchableSelect
            id={statusSelectId}
            searchable={false}
            value={currentStatusId}
            onValueChange={(val) => setValue("employment_status_id", val)}
            placeholder="Pilih Status Karir"
            options={(options.employment_statuses || []).map((s) => ({
              value: String(s.id),
              label: s.name,
            }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="space-y-1.5">
          <label htmlFor={companySelectId} className="text-xs font-bold text-slate-700">
            Tempat Bekerja Saat Ini
          </label>
          <SearchableSelect
            id={companySelectId}
            searchable={true}
            value={currentCompanyId}
            onValueChange={(val) => setValue("current_company_id", val)}
            placeholder="Pilih Perusahaan Mitra / Instansi"
            searchPlaceholder="Cari tempat bekerja..."
            options={(options.companies || []).map((c) => ({
              value: String(c.id),
              label: c.name,
            }))}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Posisi / Jabatan Pekerjaan</label>
          <Input
            {...register("current_position")}
            placeholder="cth. Staff IT Support"
            className="h-10 rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Gaji Pertama / Saat Ini (Rp)</label>
          <Input
            type="number"
            {...register("starting_salary")}
            placeholder="cth. 4500000"
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Masa Tunggu Kerja (Bulan)</label>
          <Input
            type="number"
            {...register("waiting_time_months")}
            placeholder="cth. 2"
            className="h-10 rounded-xl"
          />
        </div>
      </div>

      {!isEditing && (
        <p className="text-[11px] text-slate-400">
          Catatan: Alumni ini akan terdata dalam pelacakan jejak alumni (Tracer Study).
        </p>
      )}
    </div>
  );
}
