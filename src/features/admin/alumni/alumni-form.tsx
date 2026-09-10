import { useId, useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import { GraduationCap, UserPlus, X, Send, Loader2, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/custom/searchable-select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { resolveMajorByClass } from "./alumni.form";
import type { AlumniFormSchemaType, AlumniOptionsData } from "./alumni.schema";

export interface AlumniFormProps {
  form: UseFormReturn<AlumniFormSchemaType>;
  options: AlumniOptionsData;
  isEditing?: boolean;
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onSubmit?: () => void | Promise<void>;
  isSubmitting?: boolean;
}

export function AlumniForm({
  form,
  options,
  isEditing = false,
  isOpen,
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}: AlumniFormProps) {
  const classMajorSelectId = useId();
  const yearSelectId = useId();
  const statusSelectId = useId();

  const isModal = isOpen !== undefined || open !== undefined;
  const modalOpen = open ?? isOpen ?? false;

  const {
    register,
    watch,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting: formIsSubmitting },
  } = form;

  const currentMode = watch("mode") || "graduate";
  const currentUserId = watch("user_id");
  const currentMajorId = watch("major_id");
  const currentClassId = watch("class_id");
  const currentGraduationYear = watch("graduation_year");
  const currentStatusId = watch("employment_status_id");

  const isPending = isSubmitting || formIsSubmitting;
  const isStudentLocked = !isEditing && currentMode === "graduate" && Boolean(currentUserId);

  const eligibleStudents = options.eligible_students || [];
  const studentOptions = useMemo(() => {
    return eligibleStudents.map((s) => ({
      value: String(s.userId),
      label: `${s.nis} - ${s.fullName}${s.className ? ` (${s.className})` : s.majorName ? ` (${s.majorName})` : ""}`,
    }));
  }, [eligibleStudents]);

  const classMajorOptions = useMemo(() => {
    const result: { value: string; label: string }[] = [];

    if (options.classes && options.classes.length > 0) {
      options.classes.forEach((c) => {
        const resolvedMajorId = resolveMajorByClass(String(c.id), options.classes, options.majors);
        const majorName = options.majors?.find((m) => String(m.id) === resolvedMajorId)?.name;
        result.push({
          value: `class_${c.id}`,
          label: majorName ? `${c.name} - ${majorName}` : c.name,
        });
      });
    }

    (options.majors || []).forEach((m) => {
      result.push({
        value: `major_${m.id}`,
        label: `Jurusan: ${m.name}`,
      });
    });

    return result;
  }, [options.classes, options.majors]);

  const currentClassMajorValue = useMemo(() => {
    if (currentClassId) {
      const matchedClass = options.classes?.find(
        (c) => String(c.id) === String(currentClassId) || (c.code && c.code === currentClassId)
      );
      if (matchedClass) return `class_${matchedClass.id}`;
    }
    if (currentMajorId) {
      const matchedMajor = options.majors?.find(
        (m) => String(m.id) === String(currentMajorId) || (m.code && m.code === currentMajorId)
      );
      if (matchedMajor) return `major_${matchedMajor.id}`;
    }
    return "";
  }, [currentClassId, currentMajorId, options.classes, options.majors]);

  const statusOptions = useMemo(() => {
    if (options.employment_statuses && options.employment_statuses.length > 0) {
      return options.employment_statuses.map((s) => ({
        value: String(s.id),
        label: s.name,
      }));
    }
    return [
      { value: "belum_bekerja", label: "Belum Bekerja" },
      { value: "bekerja", label: "Bekerja (Kolektif/Mandiri)" },
      { value: "wirausaha", label: "Wirausaha" },
      { value: "melanjutkan_studi", label: "Melanjutkan Studi" },
    ];
  }, [options.employment_statuses]);

  const yearOptions = useMemo(() => {
    if (options.graduation_years && options.graduation_years.length > 0) {
      return options.graduation_years.map((yr) => ({
        value: String(yr),
        label: `Lulusan ${yr}`,
      }));
    }
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => currentYear - i).map((yr) => ({
      value: String(yr),
      label: `Lulusan ${yr}`,
    }));
  }, [options.graduation_years]);

  const handleTabChange = (newMode: "graduate" | "manual") => {
    setValue("mode", newMode);
    if (newMode === "manual") {
      setValue("user_id", "");
    }
  };

  const handleStudentSelect = (userIdVal: string) => {
    const student = (options.eligible_students || []).find(
      (s) => String(s.userId) === userIdVal
    );
    if (!student) return;

    setValue("user_id", String(student.userId));
    setValue("nis", student.nis, { shouldValidate: true });
    setValue("full_name", student.fullName, { shouldValidate: true });
    setValue("phone", student.phone || "");
    if (student.email) {
      setValue("email", student.email);
    }
    setValue("major_id", String(student.majorId), { shouldValidate: true });
    setValue("class_id", student.classId ? String(student.classId) : "");
    clearErrors(["nis", "full_name", "major_id"]);
  };

  const handleClassMajorChange = (val: string) => {
    if (val.startsWith("class_")) {
      const cId = val.replace("class_", "");
      setValue("class_id", cId);
      const resolvedMajorId = resolveMajorByClass(cId, options.classes, options.majors);
      if (resolvedMajorId) {
        setValue("major_id", resolvedMajorId, { shouldValidate: true });
      } else if (options.majors && options.majors.length > 0) {
        setValue("major_id", String(options.majors[0].id), { shouldValidate: true });
      }
    } else if (val.startsWith("major_")) {
      const mId = val.replace("major_", "");
      setValue("major_id", mId, { shouldValidate: true });
      setValue("class_id", "");
    }
    clearErrors("major_id");
  };

  const { onChange: onCompanyManualRHFChange, ...companyManualRest } = register("company_name_manual");

  const handleCompanyManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCompanyManualRHFChange(e);
    const val = e.target.value;
    const matched = options.companies?.find(
      (c) => c.name.toLowerCase() === val.trim().toLowerCase()
    );
    if (matched) {
      setValue("current_company_id", String(matched.id));
    } else {
      setValue("current_company_id", "");
    }
  };

  const formBody = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2A1063] via-[#351477] to-[#8B5CF6] text-white p-5 sm:p-6 relative rounded-t-2xl select-none">
        <div className="flex items-start justify-between gap-4">
          <div>
            {isModal ? (
              <>
                <DialogTitle className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {isEditing ? "Edit Data Alumni" : "Form Data Alumni"}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-purple-100/90 mt-1">
                  {isEditing
                    ? "Perbarui informasi alumni untuk pendataan."
                    : "Lengkapi informasi alumni untuk pendataan."}
                </DialogDescription>
              </>
            ) : (
              <>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {isEditing ? "Edit Data Alumni" : "Form Data Alumni"}
                </h2>
                <p className="text-xs sm:text-sm text-purple-100/90 mt-1">
                  {isEditing
                    ? "Perbarui informasi alumni untuk pendataan."
                    : "Lengkapi informasi alumni untuk pendataan."}
                </p>
              </>
            )}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-white/80 hover:text-white hover:bg-white/15 transition-all outline-none cursor-pointer border-none bg-transparent shrink-0"
              aria-label="Tutup"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Top Segmented Tab Control (rendered when !isEditing) */}
      {!isEditing && (
        <div className="bg-slate-50 px-5 sm:px-6 pt-4 pb-2 border-b border-slate-200/80 select-none">
          <div className="grid grid-cols-2 p-1 bg-slate-200/70 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => handleTabChange("graduate")}
              className={cn(
                "flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer",
                currentMode === "graduate"
                  ? "bg-white text-purple-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <GraduationCap className="h-4 w-4 text-purple-600" />
              <span>Luluskan Siswa Aktif</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("manual")}
              className={cn(
                "flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer",
                currentMode === "manual"
                  ? "bg-white text-purple-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <UserPlus className="h-4 w-4 text-purple-600" />
              <span>Input Alumni Baru</span>
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Form Body */}
      <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        {/* Tab 1: Eligible student selector */}
        {!isEditing && currentMode === "graduate" && (
          <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="eligible-student-select" className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-purple-600" />
                Pilih Siswa Aktif (Tingkat Akhir) *
              </label>
              {currentUserId && (
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Terpilih
                </span>
              )}
            </div>
            <SearchableSelect
              id="eligible-student-select"
              searchable={true}
              value={currentUserId ? String(currentUserId) : ""}
              onValueChange={handleStudentSelect}
              placeholder="Pilih nama siswa atau ketik NIS..."
              searchPlaceholder="Cari berdasarkan NIS atau nama siswa..."
              options={studentOptions}
              emptyMessage="Tidak ada siswa aktif yang ditemukan"
            />
            <p className="text-[11px] text-purple-700/80">
              Memilih siswa aktif akan otomatis mengunci dan mengisi NIS, Nama Lengkap, Jurusan, dan Nomor Handphone.
            </p>
          </div>
        )}

        {/* 2-Column Form Fields */}
        <div className="space-y-3.5">
          {/* Row 1: NIS * & Nama Lengkap * */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Nomor Induk Siswa (NIS) *</span>
                {isStudentLocked && (
                  <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                    <Lock className="h-2.5 w-2.5" /> Terkunci
                  </span>
                )}
              </label>
              <Input
                {...register("nis")}
                readOnly={isStudentLocked}
                placeholder="cth. 212200881"
                className={cn(
                  "h-10 rounded-xl",
                  isStudentLocked && "bg-slate-100 cursor-not-allowed text-slate-600 border-slate-200"
                )}
              />
              {errors.nis && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.nis.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Nama Lengkap *</span>
                {isStudentLocked && (
                  <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                    <Lock className="h-2.5 w-2.5" /> Terkunci
                  </span>
                )}
              </label>
              <Input
                {...register("full_name")}
                readOnly={isStudentLocked}
                placeholder="cth. Bagas Setiawan"
                className={cn(
                  "h-10 rounded-xl",
                  isStudentLocked && "bg-slate-100 cursor-not-allowed text-slate-600 border-slate-200"
                )}
              />
              {errors.full_name && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.full_name.message}</p>
              )}
            </div>
          </div>

          {/* Row 2: Kelas & Jurusan * & Status Keterserapan * */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor={classMajorSelectId} className="text-xs font-bold text-slate-700">
                Kelas & Jurusan *
              </label>
              <SearchableSelect
                id={classMajorSelectId}
                searchable={true}
                value={currentClassMajorValue}
                onValueChange={handleClassMajorChange}
                placeholder="Pilih Kelas atau Jurusan"
                searchPlaceholder="Cari kelas atau jurusan..."
                options={classMajorOptions}
                hasError={Boolean(errors.major_id)}
              />
              {errors.major_id && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.major_id.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor={statusSelectId} className="text-xs font-bold text-slate-700">
                Status Keterserapan *
              </label>
              <SearchableSelect
                id={statusSelectId}
                searchable={false}
                value={currentStatusId}
                onValueChange={(val) => setValue("employment_status_id", val, { shouldValidate: true })}
                placeholder="Pilih Status Keterserapan"
                options={statusOptions}
              />
              {errors.employment_status_id && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.employment_status_id.message}</p>
              )}
            </div>
          </div>

          {/* Row 3: Nomor Handphone * & Tahun kelulusan * */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Nomor Handphone *</span>
                {isStudentLocked && (
                  <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                    <Lock className="h-2.5 w-2.5" /> Terkunci
                  </span>
                )}
              </label>
              <Input
                {...register("phone")}
                readOnly={isStudentLocked}
                placeholder="081234567890"
                className={cn(
                  "h-10 rounded-xl",
                  isStudentLocked && "bg-slate-100 cursor-not-allowed text-slate-600 border-slate-200"
                )}
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
                onValueChange={(val) => setValue("graduation_year", val, { shouldValidate: true })}
                placeholder="Pilih Tahun Kelulusan"
                options={yearOptions}
                hasError={Boolean(errors.graduation_year)}
              />
              {errors.graduation_year && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.graduation_year.message}</p>
              )}
            </div>
          </div>

          {/* Row 4: Tautan Profil * & Nama Kampus/PT/Usaha * */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Tautan Profil *
              </label>
              <Input
                {...register("profile_url")}
                placeholder="https://linkedin.com/in/... atau website"
                className="h-10 rounded-xl"
              />
              {errors.profile_url && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.profile_url.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Nama Kampus/PT/Usaha *
              </label>
              <Input
                {...companyManualRest}
                onChange={handleCompanyManualChange}
                placeholder="Nama Tempat Kerja / Perusahaan / Kampus"
                className="h-10 rounded-xl"
                list="alumni-company-suggestions"
              />
              {options.companies && options.companies.length > 0 && (
                <datalist id="alumni-company-suggestions">
                  {options.companies.map((c) => (
                    <option key={c.id} value={c.name} />
                  ))}
                </datalist>
              )}
              {errors.company_name_manual && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.company_name_manual.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Tracer Study Details */}
        <details className="group pt-1">
          <summary className="text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer select-none list-none flex items-center gap-1.5">
            <span className="transition-transform group-open:rotate-90">▸</span>
            <span>Informasi Tambahan Tracer Study (Opsional)</span>
          </summary>
          <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">Posisi / Jabatan</label>
              <Input
                {...register("current_position")}
                placeholder="cth. Software Engineer"
                className="h-9 text-xs rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">Gaji Pertama (Rp)</label>
              <Input
                type="number"
                {...register("starting_salary")}
                placeholder="cth. 4500000"
                className="h-9 text-xs rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">Masa Tunggu (Bulan)</label>
              <Input
                type="number"
                {...register("waiting_time_months")}
                placeholder="cth. 2"
                className="h-9 text-xs rounded-lg"
              />
            </div>
          </div>
        </details>
      </div>

      {/* Footer Actions */}
      <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-3 rounded-b-2xl">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="h-10 px-5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type={onSubmit ? "button" : "submit"}
          onClick={onSubmit ? () => onSubmit() : undefined}
          disabled={isPending}
          className="h-10 px-5 rounded-xl bg-[#2A1063] hover:bg-[#351477] text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <span>{isEditing ? "Perbarui Data Alumni" : "Simpan Data Alumni"}</span>
              <Send className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <Dialog open={modalOpen} onOpenChange={(val) => { if (!val) onClose?.(); }}>
        <DialogContent className="max-w-[660px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl [&>button]:hidden">
          {onSubmit ? (
            <form onSubmit={onSubmit} className="flex flex-col h-full">
              {formBody}
            </form>
          ) : (
            formBody
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return formBody;
}

export const AlumniFormModal = AlumniForm;

