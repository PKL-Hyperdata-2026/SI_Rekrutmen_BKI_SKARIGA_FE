import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Save, RotateCcw, Loader2 } from "lucide-react";
import {
  studentProfileSchema,
  type StudentProfileSchemaType,
  type PortfolioFormOptions,
  type StudentProfileData,
} from "../schemas/portfolio.schema";

interface PersonalAcademicFormProps {
  initialData: StudentProfileData | null;
  options: PortfolioFormOptions | null;
  onSubmit: (data: StudentProfileSchemaType) => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
}

export function PersonalAcademicForm({
  initialData,
  options,
  onSubmit,
  isLoading,
  isSaving,
}: PersonalAcademicFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentProfileSchemaType>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      fullName: "",
      nis: "",
      email: "",
      phone: "",
      majorId: 0,
      classId: 0,
      graduationYear: 2026,
      socialMedia: {
        linkedin: "",
        github: "",
        instagram: "",
        tiktok: "",
      },
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName || "",
        nis: initialData.nis || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        majorId: initialData.majorId || 0,
        classId: initialData.classId || 0,
        graduationYear: initialData.graduationYear || new Date().getFullYear(),
        socialMedia: {
          linkedin: initialData.socialMedia?.linkedin || "",
          github: initialData.socialMedia?.github || "",
          instagram: initialData.socialMedia?.instagram || "",
          tiktok: initialData.socialMedia?.tiktok || "",
        },
      });
    }
  }, [initialData, reset]);

  const handleReset = () => {
    if (initialData) {
      reset({
        fullName: initialData.fullName || "",
        nis: initialData.nis || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        majorId: initialData.majorId || 0,
        classId: initialData.classId || 0,
        graduationYear: initialData.graduationYear || new Date().getFullYear(),
        socialMedia: {
          linkedin: initialData.socialMedia?.linkedin || "",
          github: initialData.socialMedia?.github || "",
          instagram: initialData.socialMedia?.instagram || "",
          tiktok: initialData.socialMedia?.tiktok || "",
        },
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100/90">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-2.5">
          <User className="h-5 w-5 text-blue-500" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Data Diri & Akademik Pelamar
          </h2>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#0a2342] to-[#1e6091] text-white text-[11px] font-semibold tracking-wide shadow-sm select-none">
          Terhubung Sistem BKK
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-xs font-medium">Memuat data profil...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Row 1: Status & Nama Lengkap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                STATUS <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  disabled
                  defaultValue="SISWA"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 cursor-not-allowed appearance-none"
                >
                  <option value="SISWA">SISWA</option>
                  <option value="ALUMNI">ALUMNI</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 tracking-wider mb-1.5">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled
                {...register("fullName")}
                placeholder="e.g nama lengkap"
                className="w-full h-11 px-3.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 transition-all outline-none cursor-not-allowed"
              />
              {errors.fullName && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: NIS/NISN & Jurusan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 tracking-wider mb-1.5">
                NIS/NISN <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled
                {...register("nis")}
                placeholder="e.g 21098/210987654"
                className="w-full h-11 px-3.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 transition-all outline-none cursor-not-allowed"
              />
              {errors.nis && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">
                  {errors.nis.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 tracking-wider mb-1.5">
                Jurusan <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  disabled
                  {...register("majorId", { valueAsNumber: true })}
                  className="w-full h-11 px-3.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 transition-all outline-none appearance-none cursor-not-allowed"
                >
                  <option value={0}>Pilih Jurusan</option>
                  {options?.majors?.map((major) => (
                    <option key={major.id} value={major.id}>
                      {major.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
              {errors.majorId && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">
                  {errors.majorId.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Kelas & Tahun Lulus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 tracking-wider mb-1.5">
                Kelas <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  disabled
                  {...register("classId", { valueAsNumber: true })}
                  className="w-full h-11 px-3.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 transition-all outline-none appearance-none cursor-not-allowed"
                >
                  <option value={0}>Pilih Kelas</option>
                  {options?.classes?.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
              {errors.classId && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">
                  {errors.classId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 tracking-wider mb-1.5">
                Tahun Lulus <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  disabled
                  {...register("graduationYear", {
                    setValueAs: (v) => (v === "" || v === null ? null : Number(v)),
                  })}
                  className="w-full h-11 px-3.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 transition-all outline-none appearance-none cursor-not-allowed"
                >
                  <option value="">Pilih Tahun Lulus</option>
                  {options?.graduation_years?.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
              {errors.graduationYear && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">
                  {errors.graduationYear.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 4: No WA & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 tracking-wider mb-1.5">
                No . WhatsApp Aktif <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                {...register("phone")}
                placeholder="e.g +62 123-4567-890"
                className="w-full h-11 px-3.5 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs sm:text-sm text-slate-800 transition-all outline-none"
              />
              {errors.phone && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 tracking-wider mb-1.5">
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                disabled
                {...register("email")}
                placeholder="e.g email@email.com"
                className="w-full h-11 px-3.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 transition-all outline-none cursor-not-allowed"
              />
              {errors.email && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Sub-section: Sosial Media (Opsional) */}
          <div className="pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 mb-3">
              Sosial Media (Opsional)
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    {...register("socialMedia.linkedin")}
                    placeholder="e.g https://"
                    className="w-full h-10 px-3.5 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs sm:text-sm text-slate-800 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Github
                  </label>
                  <input
                    type="text"
                    {...register("socialMedia.github")}
                    placeholder="e.g https://"
                    className="w-full h-10 px-3.5 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs sm:text-sm text-slate-800 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Instagram
                  </label>
                  <input
                    type="text"
                    {...register("socialMedia.instagram")}
                    placeholder="e.g https://"
                    className="w-full h-10 px-3.5 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs sm:text-sm text-slate-800 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tiktok
                  </label>
                  <input
                    type="text"
                    {...register("socialMedia.tiktok")}
                    placeholder="e.g https://"
                    className="w-full h-10 px-3.5 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs sm:text-sm text-slate-800 transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="h-10 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-600 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="h-10 px-6 rounded-xl bg-gradient-to-r from-[#0a2342] to-[#1e6091] hover:opacity-95 text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-sm cursor-pointer active:scale-95 disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
