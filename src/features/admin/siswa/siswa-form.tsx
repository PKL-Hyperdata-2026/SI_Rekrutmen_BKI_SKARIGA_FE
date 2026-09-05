import { useId } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import type { SiswaFormSchemaType, SiswaOptionItem } from "./siswa.schema";

interface SiswaFormProps {
  form: UseFormReturn<SiswaFormSchemaType>;
  majors: SiswaOptionItem[];
  classes: SiswaOptionItem[];
  isEditing?: boolean;
}

export function SiswaForm({ form, majors, classes, isEditing = false }: SiswaFormProps) {
  const majorSelectId = useId();
  const classSelectId = useId();

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentMajorId = watch("major_id");
  const currentClassId = watch("class_id");

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Nomor Induk Siswa (NIS) *</label>
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
          <label className="text-xs font-bold text-slate-700">Nama Lengkap Siswa *</label>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Email Akun Siswa *</label>
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
          <label className="text-xs font-bold text-slate-700">Nomor WhatsApp / Telepon *</label>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor={majorSelectId} className="text-xs font-bold text-slate-700">
            Kompetensi Keahlian (Jurusan) *
          </label>
          <SearchableSelect
            id={majorSelectId}
            searchable={true}
            value={currentMajorId}
            onValueChange={(val) => setValue("major_id", val)}
            placeholder="Pilih Jurusan"
            searchPlaceholder="Cari jurusan..."
            options={majors.map((m) => ({
              value: String(m.id),
              label: m.name,
            }))}
          />
          {errors.major_id && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.major_id.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor={classSelectId} className="text-xs font-bold text-slate-700">
            Kelas Siswa *
          </label>
          <SearchableSelect
            id={classSelectId}
            searchable={true}
            value={currentClassId}
            onValueChange={(val) => setValue("class_id", val)}
            placeholder="Pilih Kelas"
            searchPlaceholder="Cari kelas..."
            options={classes.map((c) => ({
              value: String(c.id),
              label: c.name,
            }))}
          />
          {errors.class_id && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.class_id.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">
          {isEditing ? "Kata Sandi Baru (Kosongkan jika tidak ingin diubah)" : "Kata Sandi Akun Siswa"}
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
    </div>
  );
}
