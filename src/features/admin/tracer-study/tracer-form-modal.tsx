import { useState, useEffect } from "react";
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
} from "./tracer.schema";

interface TracerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: SubmitAdminTracerPayload) => Promise<void>;
  editingItem: AdminTracerItem | null;
  availableAlumni: AvailableAlumniItem[];
  isSubmitting?: boolean;
}

const formatCurrencyString = (val?: string | number | null): string => {
  if (!val && val !== 0) return "";
  const digits = String(val).replace(/\D/g, "");
  if (!digits) return "";
  return new Intl.NumberFormat("id-ID").format(Number(digits));
};

const parseCurrencyNumber = (val?: string | null): number | null => {
  if (!val) return null;
  const digits = val.replace(/\D/g, "");
  if (!digits) return null;
  const num = parseInt(digits, 10);
  return isNaN(num) ? null : num;
};

export function TracerFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
  availableAlumni,
  isSubmitting = false,
}: TracerFormModalProps) {
  const isEditing = Boolean(editingItem);

  const [studentAlumniId, setStudentAlumniId] = useState<string>("");
  const [careerStatus, setCareerStatus] = useState<CareerStatus>("bekerja");

  // Bekerja
  const [companyName, setCompanyName] = useState("");
  const [companySector, setCompanySector] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [minimumSalary, setMinimumSalary] = useState("");
  const [maximumSalary, setMaximumSalary] = useState("");
  const [waitingPeriod, setWaitingPeriod] = useState("");
  const [acceptedDate, setAcceptedDate] = useState("");
  const [startDate, setStartDate] = useState("");

  // Wirausaha
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [averageIncome, setAverageIncome] = useState("");
  const [businessField, setBusinessField] = useState("");
  const [businessStartDate, setBusinessStartDate] = useState("");

  // Lanjut Studi
  const [universityName, setUniversityName] = useState("");
  const [studyProgram, setStudyProgram] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      if (editingItem) {
        setStudentAlumniId(editingItem.studentAlumniId || "");
        setCareerStatus(editingItem.careerStatus || "bekerja");
        setCompanyName(editingItem.companyName || "");
        setCompanySector(editingItem.companySector || "");
        setJobTitle(editingItem.jobTitle || "");
        setJobLocation(editingItem.jobLocation || "");
        setMinimumSalary(formatCurrencyString(editingItem.minimumSalary));
        setMaximumSalary(formatCurrencyString(editingItem.maximumSalary));
        setWaitingPeriod(editingItem.waitingPeriod || "");
        setAcceptedDate(editingItem.acceptedDate || "");
        setStartDate(editingItem.startDate || "");
        setBusinessName(editingItem.businessName || "");
        setBusinessAddress(editingItem.businessAddress || "");
        setInstagramHandle(editingItem.instagramAccount || "");
        setAverageIncome(editingItem.averageRevenue || "");
        setBusinessField(editingItem.businessField || "");
        setBusinessStartDate(editingItem.businessStartDate || "");
        setUniversityName(editingItem.universityName || "");
        setStudyProgram(editingItem.studyProgram || "");
        setErrors({});
      } else {
        setStudentAlumniId("");
        setCareerStatus("bekerja");
        setCompanyName("");
        setCompanySector("");
        setJobTitle("");
        setJobLocation("");
        setMinimumSalary("");
        setMaximumSalary("");
        setWaitingPeriod("1 Bulan");
        setAcceptedDate("");
        setStartDate("");
        setBusinessName("");
        setBusinessAddress("");
        setInstagramHandle("");
        setAverageIncome("");
        setBusinessField("Kuliner");
        setBusinessStartDate("");
        setUniversityName("");
        setStudyProgram("");
        setErrors({});
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [editingItem, isOpen]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!isEditing && !studentAlumniId) {
      errs.student_alumni_id = "Pilih alumni terlebih dahulu.";
    }

    if (careerStatus === "bekerja") {
      if (!companyName.trim()) errs.company_name = "Nama perusahaan wajib diisi.";
      if (!jobTitle.trim()) errs.job_title = "Posisi/jabatan wajib diisi.";
      if (!startDate) errs.start_date = "Tanggal mulai masuk wajib diisi.";
      if (!waitingPeriod) errs.waiting_period = "Masa tunggu wajib dipilih.";
    } else if (careerStatus === "lanjut_studi") {
      if (!universityName.trim()) errs.university_name = "Nama universitas/kampus wajib diisi.";
      if (!studyProgram.trim()) errs.study_program = "Program studi wajib diisi.";
    } else if (careerStatus === "wirausaha") {
      if (!businessName.trim()) errs.business_name = "Nama usaha wajib diisi.";
      if (!businessAddress.trim()) errs.business_address = "Alamat usaha wajib diisi.";
      if (!businessField) errs.business_field = "Bidang usaha wajib dipilih.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: SubmitAdminTracerPayload = {
      career_status: careerStatus,
    };

    if (!isEditing) {
      payload.student_alumni_id = studentAlumniId;
    }

    if (careerStatus === "bekerja") {
      payload.company_name = companyName.trim();
      payload.company_sector = companySector.trim() || null;
      payload.job_title = jobTitle.trim();
      payload.job_location = jobLocation.trim() || null;
      payload.minimum_salary = parseCurrencyNumber(minimumSalary);
      payload.maximum_salary = parseCurrencyNumber(maximumSalary);
      payload.waiting_period = waitingPeriod;
      payload.accepted_date = acceptedDate || null;
      payload.start_date = startDate;
    } else if (careerStatus === "lanjut_studi") {
      payload.university_name = universityName.trim();
      payload.study_program = studyProgram.trim();
      payload.company_sector = companySector.trim() || "Perguruan Tinggi";
      payload.job_location = jobLocation.trim() || null;
      payload.waiting_period = waitingPeriod || "0 Bulan";
    } else if (careerStatus === "wirausaha") {
      payload.business_name = businessName.trim();
      payload.business_field = businessField;
      payload.business_address = businessAddress.trim();
      payload.job_location = jobLocation.trim() || null;
      payload.instagram_handle = instagramHandle.trim() || null;
      payload.average_income = averageIncome || null;
      payload.business_start_date = businessStartDate || null;
    }

    await onSubmit(payload);
  };

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

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Identitas Alumni (Readonly di Mode Edit, Select di Mode Add) */}
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
                  onValueChange={setStudentAlumniId}
                  options={availableAlumni.map((al) => ({ value: al.id, label: al.label }))}
                  placeholder="Pilih alumni"
                  searchPlaceholder="Cari nama / NIS alumni..."
                  emptyMessage="Tidak ada alumni baru yang belum mengisi tracer study."
                  searchable
                  hasError={Boolean(errors.student_alumni_id)}
                />
                {errors.student_alumni_id && (
                  <p className="text-xs text-rose-500 font-medium">{errors.student_alumni_id}</p>
                )}
              </div>
            )}
          </div>

          {/* Pilihan Status Karir */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700">Status Karir Alumni *</Label>
            <Select
              value={careerStatus}
              onValueChange={(val: CareerStatus) => setCareerStatus(val)}
            >
              <SelectTrigger className="w-full h-11 rounded-xl bg-white border-slate-200 text-xs sm:text-sm font-semibold">
                <SelectValue placeholder="Pilih status karir" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200">
                <SelectItem value="bekerja" className="text-xs sm:text-sm">
                  💼 Bekerja (Perusahaan Mitra / Industri)
                </SelectItem>
                <SelectItem value="lanjut_studi" className="text-xs sm:text-sm">
                  🎓 Kuliah / Lanjut Studi
                </SelectItem>
                <SelectItem value="wirausaha" className="text-xs sm:text-sm">
                  🏪 Wirausaha (Usaha Mandiri)
                </SelectItem>
                <SelectItem value="mencari_pekerjaan" className="text-xs sm:text-sm">
                  🔍 Sedang Mencari Pekerjaan
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Form Fields: Status BEKERJA */}
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
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                  {errors.company_name && (
                    <p className="text-[11px] text-rose-500 font-medium">{errors.company_name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Sektor Industri
                  </Label>
                  <Input
                    placeholder="Contoh: Sektor : Teknologi Digital"
                    value={companySector}
                    onChange={(e) => setCompanySector(e.target.value)}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Posisi / Jabatan *
                  </Label>
                  <Input
                    placeholder="Contoh: Junior Web Developer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                  {errors.job_title && (
                    <p className="text-[11px] text-rose-500 font-medium">{errors.job_title}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Lokasi / Wilayah Kerja
                  </Label>
                  <Input
                    placeholder="Contoh: Malang, Jawa Timur"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Tanggal Diterima
                  </Label>
                  <DatePicker
                    value={acceptedDate}
                    onChange={setAcceptedDate}
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
                    onChange={setStartDate}
                    hasError={Boolean(errors.start_date)}
                    placeholder="Pilih tanggal mulai masuk"
                    className="h-10 rounded-xl bg-white border-slate-200 text-xs sm:text-sm"
                  />
                  {errors.start_date && (
                    <p className="text-[11px] text-rose-500 font-medium">{errors.start_date}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Masa Tunggu Kerja *
                  </Label>
                  <Select value={waitingPeriod} onValueChange={setWaitingPeriod}>
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
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Gaji Awal / Nominal (Rp)
                  </Label>
                  <Input
                    placeholder="Contoh: 4.800.000"
                    value={minimumSalary}
                    onChange={(e) => setMinimumSalary(formatCurrencyString(e.target.value))}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Fields: Status LANJUT STUDI */}
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
                    value={universityName}
                    onChange={(e) => setUniversityName(e.target.value)}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                  {errors.university_name && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {errors.university_name}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Program Studi *
                  </Label>
                  <Input
                    placeholder="Contoh: D4 Teknik Elektro"
                    value={studyProgram}
                    onChange={(e) => setStudyProgram(e.target.value)}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                  {errors.study_program && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {errors.study_program}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Kategori Perguruan Tinggi
                  </Label>
                  <Input
                    placeholder="Perguruan Tinggi Negeri / Swasta"
                    value={companySector}
                    onChange={(e) => setCompanySector(e.target.value)}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Lokasi Kampus / Kota
                  </Label>
                  <Input
                    placeholder="Contoh: Malang, Jatim"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Fields: Status WIRAUSAHA */}
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
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                  {errors.business_name && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {errors.business_name}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Bidang Usaha *
                  </Label>
                  <Select value={businessField} onValueChange={setBusinessField}>
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
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold text-slate-700">
                    Alamat Lengkap Usaha *
                  </Label>
                  <Input
                    placeholder="Contoh: Jl. Danau Ranau No. 12, Sawojajar, Malang"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                  {errors.business_address && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {errors.business_address}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Akun Instagram / Media Sosial
                  </Label>
                  <Input
                    placeholder="Contoh: @kedaikopis kariga"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    className="h-10 rounded-xl bg-white text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Estimasi Omzet / Bulan
                  </Label>
                  <Select value={averageIncome} onValueChange={setAverageIncome}>
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
                    onChange={setBusinessStartDate}
                    placeholder="Pilih tanggal mulai usaha"
                    className="h-10 rounded-xl bg-white border-slate-200 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Fields: Status MENCARI KERJA */}
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
