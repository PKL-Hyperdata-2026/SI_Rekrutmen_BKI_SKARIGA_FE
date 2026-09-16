import { useEffect } from "react";
import { Loader2, User, Building2, GraduationCap, Store } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DatePicker, SearchableSelect } from "@/components/custom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type CareerStatus,
  type AdminTracerItem,
  type AvailableAlumniItem,
  type SubmitAdminTracerPayload,
  WAITING_PERIOD_OPTIONS,
  AVERAGE_INCOME_OPTIONS,
  BUSINESS_FIELD_OPTIONS,
} from "./tracer-study.schema";
import {
  useAdminTracerStudyForm,
  toAdminTracerDefaultValues,
  toSubmitAdminTracerPayload,
  formatCurrencyString,
} from "./tracer-study.form";

interface TracerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: SubmitAdminTracerPayload) => Promise<void>;
  editingItem: AdminTracerItem | null;
  availableAlumni: AvailableAlumniItem[];
  isSubmitting?: boolean;
}

export function TracerFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
  availableAlumni,
  isSubmitting = false,
}: TracerFormModalProps) {
  const isEditing = Boolean(editingItem);

  const form = useAdminTracerStudyForm(editingItem);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  const studentAlumniId = watch("student_alumni_id");
  const careerStatus = watch("career_status");
  const waitingPeriod = watch("waiting_period");
  const acceptedDate = watch("accepted_date");
  const startDate = watch("start_date");
  const businessField = watch("business_field");
  const averageIncome = watch("average_income");
  const businessStartDate = watch("business_start_date");
  const minimumSalary = watch("minimum_salary");

  useEffect(() => {
    reset(toAdminTracerDefaultValues(editingItem));
  }, [editingItem, isOpen, reset]);

  const onFormSubmit = handleSubmit(async (values) => {
    const payload = toSubmitAdminTracerPayload(values);
    if (isEditing) {
      delete payload.student_alumni_id;
    }
    await onSubmit(payload);
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-7">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900">
            {isEditing ? "Edit Data Tracer Study" : "Tambah Data Tracer Study Alumni"}
          </DialogTitle>
          <p className="text-xs sm:text-sm text-slate-500">
            {isEditing
              ? "Perbarui detail karir, penempatan, atau studi alumni (identitas alumni terkunci/readonly)."
              : "Pilih alumni terdaftar untuk memasukkan data survei keterserapan karir."}
          </p>
        </DialogHeader>

        <form onSubmit={onFormSubmit} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700">
              Pilih Alumni {isEditing ? "(Readonly)" : "*"}
            </Label>

            {isEditing ? (
              <div className="p-3.5 rounded-2xl bg-slate-100/90 border border-slate-200/90 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {editingItem?.studentAlumni?.fullName || "Nama Alumni"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      NIS: {editingItem?.studentAlumni?.nis} •{" "}
                      {editingItem?.studentAlumni?.major?.name || "Jurusan"} (
                      {editingItem?.studentAlumni?.graduationYear || "-"})
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shrink-0">
                  Terkunci
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <SearchableSelect
                  value={studentAlumniId}
                  onValueChange={(val) =>
                    setValue("student_alumni_id", val, { shouldDirty: true, shouldValidate: true })
                  }
                  options={availableAlumni.map((al) => ({ value: al.id, label: al.label }))}
                  placeholder="Pilih alumni"
                  searchPlaceholder="Cari nama / NIS alumni..."
                  emptyMessage="Tidak ada alumni baru yang belum mengisi tracer study."
                  searchable
                  hasError={Boolean(errors.student_alumni_id)}
                />
                {errors.student_alumni_id && (
                  <p className="text-xs text-rose-500 font-medium">{errors.student_alumni_id.message}</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700">Status Karir Alumni *</Label>
            <Select
              value={careerStatus}
              onValueChange={(val: CareerStatus) =>
                setValue("career_status", val, { shouldDirty: true, shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full h-11 rounded-xl bg-white border-slate-200 text-xs sm:text-sm font-semibold">
                <SelectValue placeholder="Pilih status karir" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200">
                <SelectItem value="bekerja" className="text-xs sm:text-sm">
                  💼 Bekerja
                </SelectItem>
                <SelectItem value="lanjut_studi" className="text-xs sm:text-sm">
                  🎓 Lanjut Studi
                </SelectItem>
                <SelectItem value="wirausaha" className="text-xs sm:text-sm">
                  🏪 Wirausaha
                </SelectItem>
                <SelectItem value="mencari_pekerjaan" className="text-xs sm:text-sm">
                  🔍 Mencari Pekerjaan
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {careerStatus === "bekerja" && (
            <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200/80 pb-2.5">
                <Building2 className="h-4 w-4 text-purple-600" />
                <span>Informasi Tempat Kerja & Posisi</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Nama Perusahaan / Tempat Kerja *
                  </Label>
                  <Input
                    placeholder="Contoh: PT Astra Honda Motor"
                    {...register("company_name")}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                  {errors.company_name && (
                    <p className="text-[11px] text-rose-500 font-medium">{errors.company_name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Sektor Industri
                  </Label>
                  <Input
                    placeholder="Contoh: Sektor : Teknologi Digital"
                    {...register("company_sector")}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Posisi / Jabatan *
                  </Label>
                  <Input
                    placeholder="Contoh: Junior Web Developer"
                    {...register("job_title")}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                  {errors.job_title && (
                    <p className="text-[11px] text-rose-500 font-medium">{errors.job_title.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Lokasi / Wilayah Kerja
                  </Label>
                  <Input
                    placeholder="Contoh: Malang, Jawa Timur"
                    {...register("job_location")}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Tanggal Diterima
                  </Label>
                  <DatePicker
                    value={acceptedDate}
                    onChange={(val) => setValue("accepted_date", val, { shouldDirty: true })}
                    placeholder="Pilih tanggal diterima"
                    className="h-10 rounded-xl bg-white border-slate-200 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Tanggal Mulai Masuk *
                  </Label>
                  <DatePicker
                    value={startDate}
                    onChange={(val) =>
                      setValue("start_date", val, { shouldDirty: true, shouldValidate: true })
                    }
                    hasError={Boolean(errors.start_date)}
                    placeholder="Pilih tanggal mulai masuk"
                    className="h-10 rounded-xl bg-white border-slate-200 text-xs sm:text-sm"
                  />
                  {errors.start_date && (
                    <p className="text-[11px] text-rose-500 font-medium">{errors.start_date.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Masa Tunggu Kerja *
                  </Label>
                  <Select
                    value={waitingPeriod}
                    onValueChange={(val) =>
                      setValue("waiting_period", val, { shouldDirty: true, shouldValidate: true })
                    }
                  >
                    <SelectTrigger className="h-10 rounded-xl bg-white text-xs sm:text-sm">
                      <SelectValue placeholder="Pilih masa tunggu" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200">
                      {WAITING_PERIOD_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt} className="text-xs sm:text-sm">
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.waiting_period && (
                    <p className="text-[11px] text-rose-500 font-medium">{errors.waiting_period.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Gaji Awal / Nominal (Rp)
                  </Label>
                  <Input
                    placeholder="Contoh: 4.800.000"
                    value={minimumSalary}
                    onChange={(e) =>
                      setValue("minimum_salary", formatCurrencyString(e.target.value), { shouldDirty: true })
                    }
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {careerStatus === "lanjut_studi" && (
            <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200/80 pb-2.5">
                <GraduationCap className="h-4 w-4 text-purple-600" />
                <span>Informasi Kampus & Program Studi</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Nama Universitas / Perguruan Tinggi *
                  </Label>
                  <Input
                    placeholder="Contoh: Universitas Brawijaya"
                    {...register("university_name")}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                  {errors.university_name && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {errors.university_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Program Studi *
                  </Label>
                  <Input
                    placeholder="Contoh: D4 Teknik Elektro"
                    {...register("study_program")}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                  {errors.study_program && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {errors.study_program.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Kategori Perguruan Tinggi
                  </Label>
                  <Input
                    placeholder="Perguruan Tinggi Negeri / Swasta"
                    {...register("company_sector")}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Lokasi Kampus / Kota
                  </Label>
                  <Input
                    placeholder="Contoh: Malang, Jatim"
                    {...register("job_location")}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {careerStatus === "wirausaha" && (
            <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200/80 pb-2.5">
                <Store className="h-4 w-4 text-emerald-600" />
                <span>Informasi Usaha & Omzet</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Nama Usaha *
                  </Label>
                  <Input
                    placeholder="Contoh: Kedai Kopi Skariga"
                    {...register("business_name")}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                  {errors.business_name && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {errors.business_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Bidang Usaha *
                  </Label>
                  <Select
                    value={businessField}
                    onValueChange={(val) =>
                      setValue("business_field", val, { shouldDirty: true, shouldValidate: true })
                    }
                  >
                    <SelectTrigger className="h-10 rounded-xl bg-white text-xs sm:text-sm">
                      <SelectValue placeholder="Pilih bidang usaha" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200">
                      {BUSINESS_FIELD_OPTIONS.map((bf) => (
                        <SelectItem key={bf} value={bf} className="text-xs sm:text-sm">
                          {bf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.business_field && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {errors.business_field.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold text-slate-700">
                    Alamat Lengkap Usaha *
                  </Label>
                  <Input
                    placeholder="Contoh: Jl. Danau Ranau No. 12, Sawojajar, Malang"
                    {...register("business_address")}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                  {errors.business_address && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {errors.business_address.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Akun Instagram / Media Sosial
                  </Label>
                  <Input
                    placeholder="Contoh: @kedaikopis kariga"
                    {...register("instagram_handle")}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Estimasi Omzet / Bulan
                  </Label>
                  <Select
                    value={averageIncome}
                    onValueChange={(val) =>
                      setValue("average_income", val, { shouldDirty: true })
                    }
                  >
                    <SelectTrigger className="h-10 rounded-xl bg-white text-xs sm:text-sm">
                      <SelectValue placeholder="Pilih range omzet" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200">
                      {AVERAGE_INCOME_OPTIONS.map((inc) => (
                        <SelectItem key={inc} value={inc} className="text-xs sm:text-sm">
                          Rp. {inc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Tanggal Mulai Usaha
                  </Label>
                  <DatePicker
                    value={businessStartDate}
                    onChange={(val) => setValue("business_start_date", val, { shouldDirty: true })}
                    placeholder="Pilih tanggal mulai usaha"
                    className="h-10 rounded-xl bg-white border-slate-200 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {careerStatus === "mencari_pekerjaan" && (
            <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50 text-center space-y-1">
              <p className="text-xs font-bold text-rose-700">Status Pencarian Kerja Aktif</p>
              <p className="text-xs text-rose-600/90 leading-relaxed">
                Alumni belum memiliki penempatan kerja atau studi lanjutan dan sedang dalam proses
                mencari peluang karir baru.
              </p>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs font-semibold h-10 px-5"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold h-10 px-6 cursor-pointer shadow-xs"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menyimpan...</span>
                </div>
              ) : isEditing ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Data"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
