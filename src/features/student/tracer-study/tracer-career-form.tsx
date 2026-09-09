import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Briefcase,
  Store,
  GraduationCap,
  Search,
  RotateCcw,
  Save,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { SectionCard } from "@/components/custom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/custom/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type CareerStatus,
  type TracerStudyData,
  type TracerStudyFormData,
  type SubmitTracerPayload,
  WAITING_PERIOD_OPTIONS,
  AVERAGE_INCOME_OPTIONS,
  BUSINESS_FIELD_OPTIONS,
} from "./tracer.schema";

interface TracerCareerFormProps {
  initialData?: TracerStudyData | null;
  isLoading?: boolean;
  isSaving?: boolean;
  onSubmit: (payload: SubmitTracerPayload) => Promise<void>;
}

const DEFAULT_FORM_DATA: TracerStudyFormData = {
  career_status: "bekerja",
  company_name: "",
  job_title: "",
  minimum_salary: "",
  maximum_salary: "",
  waiting_period: "",
  start_date: "",
  business_name: "",
  business_address: "",
  instagram_handle: "",
  average_income: "",
  business_field: "",
  business_start_date: "",
  university_name: "",
  study_program: "",
};

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

export function TracerCareerForm({
  initialData,
  isLoading = false,
  isSaving = false,
  onSubmit,
}: TracerCareerFormProps) {
  const [formData, setFormData] = useState<TracerStudyFormData>(DEFAULT_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isChangingStatus, setIsChangingStatus] = useState<boolean>(false);

  const hasExistingStatus = Boolean(initialData?.careerStatus);

  // Sync initialData to form
  useEffect(() => {
    if (initialData) {
      setFormData({
        career_status: initialData.careerStatus || "bekerja",
        company_name: initialData.companyName || "",
        job_title: initialData.jobTitle || "",
        minimum_salary: formatCurrencyString(initialData.minimumSalary),
        maximum_salary: formatCurrencyString(initialData.maximumSalary),
        waiting_period: initialData.waitingPeriod || "",
        start_date: initialData.startDate || "",
        business_name: initialData.businessName || "",
        business_address: initialData.businessAddress || "",
        instagram_handle: initialData.instagramAccount || "",
        average_income: initialData.averageRevenue || "",
        business_field: initialData.businessField || "",
        business_start_date: initialData.businessStartDate || "",
        university_name: initialData.universityName || "",
        study_program: initialData.studyProgram || "",
      });
      setFormErrors({});
      setIsChangingStatus(false);
    } else {
      setFormData(DEFAULT_FORM_DATA);
      setFormErrors({});
      setIsChangingStatus(false);
    }
  }, [initialData]);

  // Track if form changed
  const isFormChanged = useMemo(() => {
    if (isChangingStatus) {
      return true;
    }

    if (!initialData) {
      return (
        formData.career_status !== "bekerja" ||
        formData.company_name !== "" ||
        formData.job_title !== "" ||
        formData.minimum_salary !== "" ||
        formData.maximum_salary !== "" ||
        formData.waiting_period !== "" ||
        formData.start_date !== "" ||
        formData.business_name !== "" ||
        formData.business_address !== "" ||
        formData.instagram_handle !== "" ||
        formData.average_income !== "" ||
        formData.business_field !== "" ||
        formData.business_start_date !== "" ||
        formData.university_name !== "" ||
        formData.study_program !== ""
      );
    }

    const initMinSalary = formatCurrencyString(initialData.minimumSalary);
    const initMaxSalary = formatCurrencyString(initialData.maximumSalary);

    return (
      formData.career_status !== (initialData.careerStatus || "bekerja") ||
      formData.company_name !== (initialData.companyName || "") ||
      formData.job_title !== (initialData.jobTitle || "") ||
      formData.minimum_salary !== initMinSalary ||
      formData.maximum_salary !== initMaxSalary ||
      formData.waiting_period !== (initialData.waitingPeriod || "") ||
      formData.start_date !== (initialData.startDate || "") ||
      formData.business_name !== (initialData.businessName || "") ||
      formData.business_address !== (initialData.businessAddress || "") ||
      formData.instagram_handle !== (initialData.instagramAccount || "") ||
      formData.average_income !== (initialData.averageRevenue || "") ||
      formData.business_field !== (initialData.businessField || "") ||
      formData.business_start_date !== (initialData.businessStartDate || "") ||
      formData.university_name !== (initialData.universityName || "") ||
      formData.study_program !== (initialData.studyProgram || "")
    );
  }, [formData, initialData]);

  const handleFieldChange = (field: keyof TracerStudyFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSalaryChange = (
    field: "minimum_salary" | "maximum_salary",
    rawValue: string
  ) => {
    const formatted = formatCurrencyString(rawValue);
    handleFieldChange(field, formatted);
  };

  const handleReset = () => {
    if (initialData) {
      setFormData({
        career_status: initialData.careerStatus || "bekerja",
        company_name: initialData.companyName || "",
        job_title: initialData.jobTitle || "",
        minimum_salary: formatCurrencyString(initialData.minimumSalary),
        maximum_salary: formatCurrencyString(initialData.maximumSalary),
        waiting_period: initialData.waitingPeriod || "",
        start_date: initialData.startDate || "",
        business_name: initialData.businessName || "",
        business_address: initialData.businessAddress || "",
        instagram_handle: initialData.instagramAccount || "",
        average_income: initialData.averageRevenue || "",
        business_field: initialData.businessField || "",
        business_start_date: initialData.businessStartDate || "",
        university_name: initialData.universityName || "",
        study_program: initialData.studyProgram || "",
      });
      setIsChangingStatus(false);
    } else {
      setFormData(DEFAULT_FORM_DATA);
    }
    setFormErrors({});
  };

  const handleChangeDecision = () => {
    setIsChangingStatus(true);
    setFormData(DEFAULT_FORM_DATA);
    setFormErrors({});
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (formData.career_status === "bekerja") {
      if (!formData.company_name.trim()) {
        errors.company_name = "Nama perusahaan/tempat kerja wajib diisi.";
      }
      if (!formData.job_title.trim()) {
        errors.job_title = "Jabatan/posisi wajib diisi.";
      }
      if (!formData.waiting_period.trim()) {
        errors.waiting_period = "Masa tunggu kerja wajib dipilih.";
      }
      if (!formData.start_date.trim()) {
        errors.start_date = "Tanggal masuk kerja wajib diisi.";
      }
      const minSal = parseCurrencyNumber(formData.minimum_salary);
      const maxSal = parseCurrencyNumber(formData.maximum_salary);
      if (minSal !== null && maxSal !== null && maxSal < minSal) {
        errors.maximum_salary =
          "Gaji maksimum harus lebih besar atau sama dengan gaji minimum.";
      }
    } else if (formData.career_status === "wirausaha") {
      if (!formData.business_name.trim()) {
        errors.business_name = "Nama wirausaha wajib diisi.";
      }
      if (!formData.business_address.trim()) {
        errors.business_address = "Alamat wirausaha wajib diisi.";
      }
      if (!formData.business_field.trim()) {
        errors.business_field = "Bidang usaha wajib dipilih.";
      }
    } else if (formData.career_status === "lanjut_studi") {
      if (!formData.university_name.trim()) {
        errors.university_name = "Nama perguruan tinggi/kampus wajib diisi.";
      }
      if (!formData.study_program.trim()) {
        errors.study_program = "Program studi wajib diisi.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const payload: SubmitTracerPayload = {
      career_status: formData.career_status,
    };

    if (formData.career_status === "bekerja") {
      payload.company_name = formData.company_name.trim();
      payload.job_title = formData.job_title.trim();
      payload.minimum_salary = parseCurrencyNumber(formData.minimum_salary);
      payload.maximum_salary = parseCurrencyNumber(formData.maximum_salary);
      payload.waiting_period = formData.waiting_period;
      payload.start_date = formData.start_date;
    } else if (formData.career_status === "wirausaha") {
      payload.business_name = formData.business_name.trim();
      payload.business_address = formData.business_address.trim();
      payload.instagram_handle = formData.instagram_handle.trim() || null;
      payload.average_income = formData.average_income || null;
      payload.business_field = formData.business_field;
      payload.business_start_date = formData.business_start_date || null;
    } else if (formData.career_status === "lanjut_studi") {
      payload.university_name = formData.university_name.trim();
      payload.study_program = formData.study_program.trim();
    }

    await onSubmit(payload);
    setIsChangingStatus(false);
  };

  const careerStatuses = [
    {
      id: "bekerja" as CareerStatus,
      label: "Bekerja",
      icon: <Briefcase className="h-5 w-5 stroke-2" />,
    },
    {
      id: "wirausaha" as CareerStatus,
      label: "Wirausaha",
      icon: <Store className="h-5 w-5 stroke-2" />,
    },
    {
      id: "lanjut_studi" as CareerStatus,
      label: "Lanjut Studi",
      icon: <GraduationCap className="h-5 w-5 stroke-2" />,
    },
    {
      id: "mencari_pekerjaan" as CareerStatus,
      label: "Mencari Pekerjaan",
      icon: <Search className="h-5 w-5 stroke-2" />,
    },
  ];

  return (
    <SectionCard
      className="rounded-xl p-4 sm:p-5 shadow-xs border border-slate-100/90 flex flex-col"
      headerClassName="pb-3 sm:pb-3.5 border-b border-slate-100 mb-4 sm:mb-5"
      title={
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary stroke-2" />
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
            Form Keterserapan Karir Alumni
          </h2>
        </div>
      }
      action={
        <div className="bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-2xs">
          Kuesioner Wajib Alumni
        </div>
      }
    >
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-1.5 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-xs font-medium">Memuat data tracer study...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 flex-1 flex flex-col justify-between">
          <div className="space-y-4 sm:space-y-5">
            {/* Status Karir Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="block text-xs font-bold text-slate-800 tracking-wider">
                  Status Karir Saat Ini
                </Label>
                {hasExistingStatus && !isChangingStatus && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleChangeDecision}
                    className="h-8 px-2.5 text-xs font-semibold border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs rounded-lg"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                    <span>Ganti Status Karir</span>
                  </Button>
                )}
              </div>

              {hasExistingStatus && !isChangingStatus ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  {careerStatuses
                    .filter((item) => item.id === formData.career_status)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center gap-2 border-2 border-slate-900 bg-slate-50/50 text-slate-900 font-semibold shadow-xs"
                      >
                        <div className="text-slate-900">{item.icon}</div>
                        <span className="text-xs font-semibold tracking-tight text-center">
                          {item.label}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  {careerStatuses.map((item) => {
                    const isSelected = formData.career_status === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleFieldChange("career_status", item.id)}
                        className={`rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-2 border-slate-900 bg-slate-50/50 text-slate-900 font-semibold shadow-xs"
                            : "border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40 text-slate-600 font-medium"
                        }`}
                      >
                        <div className={isSelected ? "text-slate-900" : "text-slate-500"}>
                          {item.icon}
                        </div>
                        <span className="text-xs font-semibold tracking-tight text-center">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Dynamic Fields - Bekerja */}
            {formData.career_status === "bekerja" && (
              <div className="space-y-3.5 sm:space-y-4 pt-1">
                {/* Tempat Kerja */}
                <div>
                  <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                    Tempat Kerja / Perusahaan Saat Ini{" "}
                    <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) =>
                      handleFieldChange("company_name", e.target.value)
                    }
                    placeholder="e.g PT.HyperData"
                    className="h-9 text-xs bg-white text-slate-800 focus-visible:border-primary"
                  />
                  {formErrors.company_name && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">
                      {formErrors.company_name}
                    </p>
                  )}
                </div>

                {/* Jabatan, Gaji Min, Gaji Max */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                      Jabatan / Posisi <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      value={formData.job_title}
                      onChange={(e) =>
                        handleFieldChange("job_title", e.target.value)
                      }
                      placeholder="e.g Staff IT"
                      className="h-9 text-xs bg-white text-slate-800 focus-visible:border-primary"
                    />
                    {formErrors.job_title && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">
                        {formErrors.job_title}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                      Gaji Minimum
                    </Label>
                    <Input
                      type="text"
                      value={
                        formData.minimum_salary
                          ? `Rp ${formData.minimum_salary}`
                          : ""
                      }
                      onChange={(e) =>
                        handleSalaryChange("minimum_salary", e.target.value)
                      }
                      placeholder="e.g Rp. 1.500.000"
                      className="h-9 text-xs bg-white text-slate-800 focus-visible:border-primary"
                    />
                  </div>

                  <div>
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                      Gaji Maksimum
                    </Label>
                    <Input
                      type="text"
                      value={
                        formData.maximum_salary
                          ? `Rp ${formData.maximum_salary}`
                          : ""
                      }
                      onChange={(e) =>
                        handleSalaryChange("maximum_salary", e.target.value)
                      }
                      placeholder="e.g Rp. 100.000.000"
                      className="h-9 text-xs bg-white text-slate-800 focus-visible:border-primary"
                    />
                    {formErrors.maximum_salary && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">
                        {formErrors.maximum_salary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Masa Tunggu Kerja & Tanggal Masuk */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                      Masa Tunggu Kerja <span className="text-rose-500">*</span>
                    </Label>
                    <Select
                      value={formData.waiting_period}
                      onValueChange={(val) =>
                        handleFieldChange("waiting_period", val)
                      }
                    >
                      <SelectTrigger className="h-9 text-xs bg-white text-slate-800 w-full">
                        <SelectValue placeholder="Pilih Rentang Waktu" />
                      </SelectTrigger>
                      <SelectContent>
                        {WAITING_PERIOD_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt} className="text-xs">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.waiting_period && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">
                        {formErrors.waiting_period}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                      Tanggal Masuk Kerja{" "}
                      <span className="text-rose-500">*</span>
                    </Label>
                    <DatePicker
                      value={formData.start_date}
                      onChange={(val) => handleFieldChange("start_date", val)}
                      placeholder="dd/mm/yyyy"
                      className="h-9 text-xs bg-white text-slate-800"
                    />
                    {formErrors.start_date && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">
                        {formErrors.start_date}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Fields - Wirausaha */}
            {formData.career_status === "wirausaha" && (
              <div className="space-y-3.5 sm:space-y-4 pt-1">
                {/* Nama Wirausaha */}
                <div>
                  <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                    Nama Wirausaha <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) =>
                      handleFieldChange("business_name", e.target.value)
                    }
                    placeholder="Warung Makan Haji Sanusi"
                    className="h-9 text-xs bg-white text-slate-800 focus-visible:border-primary"
                  />
                  {formErrors.business_name && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">
                      {formErrors.business_name}
                    </p>
                  )}
                </div>

                {/* Alamat Wirausaha */}
                <div>
                  <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                    Alamat Wirausaha <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={formData.business_address}
                    onChange={(e) =>
                      handleFieldChange("business_address", e.target.value)
                    }
                    placeholder="Jl. Doank, Gg. Jadian, RT 11/ RW 02, Prov. Maluku Utara, BTW Kapan Nikahnya, 17845"
                    className="h-9 text-xs bg-white text-slate-800 focus-visible:border-primary"
                  />
                  {formErrors.business_address && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">
                      {formErrors.business_address}
                    </p>
                  )}
                </div>

                {/* Username Instagram & Rata-rata Pendapatan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                      Username Instagram
                    </Label>
                    <Input
                      type="text"
                      value={formData.instagram_handle}
                      onChange={(e) =>
                        handleFieldChange("instagram_handle", e.target.value)
                      }
                      placeholder="@warungmakan_hjsanusi"
                      className="h-9 text-xs bg-white text-slate-800 focus-visible:border-primary"
                    />
                  </div>

                  <div>
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                      Rata-rata Pendapatan
                    </Label>
                    <Select
                      value={formData.average_income}
                      onValueChange={(val) =>
                        handleFieldChange("average_income", val)
                      }
                    >
                      <SelectTrigger className="h-9 text-xs bg-white text-slate-800 w-full">
                        <SelectValue placeholder="Pilih Pendapatan" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVERAGE_INCOME_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt} className="text-xs">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Bidang Usaha & Tanggal Berdiri Usaha */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                      Bidang Usaha <span className="text-rose-500">*</span>
                    </Label>
                    <Select
                      value={formData.business_field}
                      onValueChange={(val) =>
                        handleFieldChange("business_field", val)
                      }
                    >
                      <SelectTrigger className="h-9 text-xs bg-white text-slate-800 w-full">
                        <SelectValue placeholder="Pilih Bidang" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_FIELD_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt} className="text-xs">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.business_field && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">
                        {formErrors.business_field}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                      Tanggal Berdiri Usaha
                    </Label>
                    <DatePicker
                      value={formData.business_start_date}
                      onChange={(val) =>
                        handleFieldChange("business_start_date", val)
                      }
                      placeholder="dd/mm/yyyy"
                      className="h-9 text-xs bg-white text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Fields - Lanjut Studi */}
            {formData.career_status === "lanjut_studi" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
                <div>
                  <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                    Nama Perguruan Tinggi/Kampus{" "}
                    <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={formData.university_name}
                    onChange={(e) =>
                      handleFieldChange("university_name", e.target.value)
                    }
                    placeholder="e.g Universitas -"
                    className="h-9 text-xs bg-white text-slate-800 focus-visible:border-primary"
                  />
                  {formErrors.university_name && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">
                      {formErrors.university_name}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                    Program Studi <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={formData.study_program}
                    onChange={(e) =>
                      handleFieldChange("study_program", e.target.value)
                    }
                    placeholder="e.g Teknik Informatika"
                    className="h-9 text-xs bg-white text-slate-800 focus-visible:border-primary"
                  />
                  {formErrors.study_program && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">
                      {formErrors.study_program}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Mencari Pekerjaan: no extra fields */}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 mt-2 sm:mt-3 flex items-center justify-end gap-2.5 border-t border-slate-100/60">
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              disabled={!isFormChanged || isSaving}
              className="h-9 px-3.5 text-xs font-semibold border-none bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>

            <Button
              type="submit"
              disabled={!isFormChanged || isSaving}
              className="h-9 px-4 sm:px-5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <span>Simpan Data</span>
                  <Save className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </SectionCard>
  );
}
