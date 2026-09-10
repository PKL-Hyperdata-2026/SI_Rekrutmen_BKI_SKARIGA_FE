import { useId } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/custom/searchable-select";
import { AsyncSearchableSelect } from "@/components/custom/async-searchable-select";
import { selectOptionsApi } from "@/api/select-options";
import type {
  UsersFormSchemaType,
  ResetPasswordSchemaType,
  UserItem,
} from "./users.schema";

interface UserFormProps {
  form: UseFormReturn<UsersFormSchemaType>;
  companyFallbackLabel?: string;
  isEditing?: boolean;
}

export function UserForm({ form, companyFallbackLabel, isEditing = false }: UserFormProps) {
  const roleSelectId = useId();
  const companySelectId = useId();

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentRole = watch("role");
  const currentCompanyId = watch("company_id");

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
          <Input
            {...register("full_name")}
            placeholder="cth. Budi Santoso, S.Pd"
            className="h-10 rounded-xl"
          />
          {errors.full_name && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.full_name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Email Akun</label>
          <Input
            type="email"
            {...register("email")}
            placeholder="nama@skariga.sch.id"
            className="h-10 rounded-xl"
          />
          {errors.email && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Nomor WhatsApp / Telepon</label>
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
          <label htmlFor={roleSelectId} className="text-xs font-bold text-slate-700">
            Role
          </label>
          <SearchableSelect
            id={roleSelectId}
            searchable={false}
            value={currentRole}
            onValueChange={(val) => setValue("role", val as UsersFormSchemaType["role"])}
            placeholder="Pilih Role"
            options={[
              { value: "admin", label: "Admin" },
              { value: "hrd", label: "HRD" },
              { value: "siswa", label: "Siswa" },
              { value: "alumni", label: "Alumni" },
            ]}
          />
          {errors.role && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.role.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">
          {isEditing ? "Kata Sandi Baru (Kosongkan jika tidak ingin diubah)" : "Kata Sandi Akun"}
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

      {currentRole === "hrd" && (
        <div className="space-y-1.5 pt-1">
          <label htmlFor={companySelectId} className="text-xs font-bold text-slate-700">
            Pilih Perusahaan DUDI Mitra
          </label>
          <AsyncSearchableSelect
            id={companySelectId}
            value={currentCompanyId}
            onValueChange={(val) => setValue("company_id", val)}
            placeholder="Pilih Perusahaan Terdaftar"
            searchPlaceholder="Cari perusahaan..."
            fetchPage={selectOptionsApi.getCompanies}
            fallbackLabel={companyFallbackLabel}
          />
          <p className="text-[11px] text-slate-400">
            Akun HRD ini akan memiliki wewenang untuk mengelola lowongan &amp; seleksi dari perusahaan yang dipilih.
          </p>
        </div>
      )}
    </div>
  );
}

interface UserResetPasswordFormProps {
  form: UseFormReturn<ResetPasswordSchemaType>;
  user: UserItem | null;
}

export function UserResetPasswordForm({ form }: UserResetPasswordFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-3 py-2">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Kata Sandi Baru</label>
        <Input
          type="password"
          {...register("password")}
          placeholder="Masukkan minimal 6 karakter"
          className="h-10 rounded-xl"
        />
        {errors.password && (
          <p className="text-[11px] text-rose-500 font-medium">{errors.password.message}</p>
        )}
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed">
        Pastikan pengguna segera mengganti kata sandi setelah berhasil masuk ke sistem.
      </p>
    </div>
  );
}
