import { useState, useEffect } from "react";
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
import { SectionCard, CharCounter } from "@/components/custom";
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
  type TracerStudyData,
  type SubmitTracerPayload,
  WAITING_PERIOD_OPTIONS,
  AVERAGE_INCOME_OPTIONS,
  BUSINESS_FIELD_OPTIONS,
} from "./tracer-study.schema";
import {
  useStudentTracerStudyForm,
  toSubmitTracerPayload,
  toTracerStudyDefaultValues,
  formatCurrencyString,
} from "./tracer-study.form";

interface TracerStudyFormProps {
  initialData?: TracerStudyData | null;
  isLoading?: boolean;
  isSaving?: boolean;
  onSubmit: (payload: SubmitTracerPayload) => Promise<void>;
}

export function TracerStudyForm({
  initialData,
  isLoading = false,
  isSaving = false,
  onSubmit,
}: TracerStudyFormProps) {
  const [isChangingStatus, setIsChangingStatus] = useState<boolean>(false);
  const hasExistingStatus = Boolean(initialData?.careerStatus);

  const form = useStudentTracerStudyForm(initialData);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = form;

  const currentCareerStatus = watch("career_status");
  const waitingPeriodVal = watch("waiting_period");
  const averageIncomeVal = watch("average_income");
  const businessFieldVal = watch("business_field");
  const minSalaryVal = watch("minimum_salary");
  const maxSalaryVal = watch("maximum_salary");

  const companyName = watch("company_name") || "";
  const jobTitle = watch("job_title") || "";
  const businessName = watch("business_name") || "";
  const businessAddress = watch("business_address") || "";
  const instagramHandle = watch("instagram_handle") || "";
  const universityName = watch("university_name") || "";
  const studyProgram = watch("study_program") || "";

  useEffect(() => {
    reset(toTracerStudyDefaultValues(initialData));
    setIsChangingStatus(false);
  }, [initialData, reset]);

  const handleSalaryChange = (
    field: "minimum_salary" | "maximum_salary",
    rawValue: string
  ) => {
    const formatted = formatCurrencyString(rawValue);
    setValue(field, formatted, { shouldDirty: true, shouldValidate: true });
  };

  const handleReset = () => {
    reset(toTracerStudyDefaultValues(initialData));
    setIsChangingStatus(false);
  };

  const handleChangeDecision = () => {
    setIsChangingStatus(true);
    reset(toTracerStudyDefaultValues(null));
  };

  const onFormSubmit = handleSubmit(async (values) => {
    const payload = toSubmitTracerPayload(values);
    await onSubmit(payload);
    setIsChangingStatus(false);
  });

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
        <form onSubmit={onFormSubmit} className="space-y-4 sm:space-y-5 flex-1 flex flex-col justify-between">
          <div className="space-y-4 sm:space-y-5">
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
                    .filter((item) => item.id === currentCareerStatus)
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
                    const isSelected = currentCareerStatus === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setValue("career_status", item.id, { shouldDirty: true, shouldValidate: true })}
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

            {currentCareerStatus === "bekerja" && (
              <div className="space-y-3.5 sm:space-y-4 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider">
                      Tempat Kerja / Perusahaan Saat Ini{" "}
                      <span className="text-rose-500">*</span>
                    </Label>
                    <CharCounter length={companyName.length} max={255} />
                  </div>
                  <Input
                    type="text"
                    {...register("company_name")}
                    placeholder="e.g PT.HyperData"
                    maxLength={255}
                    className="h-9 text-xs bg-white text-slate-800 focus-visible:border-primary"
                  />
                  {errors.company_name && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">
                      {errors.company_name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label className="block text-xs font-bold text-slate-800 tracking-wider">
                        Jabatan / Posisi <span className="text-rose-500">*</span>
                      </Label>
                      <CharCounter length={jobTitle.length} max={255} />
                    </div>
                    <Input
                      type="text"
                      {...register("job_title")}
                      placeholder="e.g Staff IT"
                      maxLength={255}
                      className="h-9 text-xs bg-white text-slate-800 focus-visible:border-primary"
                    />
                    {errors.job_title && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">
                        {errors.job_title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                      Gaji Minimum
                    </Label>
                    <Input
                      type="text"
                      value={minSalaryVal ? `Rp ${minSalaryVal}` : ""}
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
                      value={maxSalaryVal ? `Rp ${maxSalaryVal}` : ""}
                      onChange={(e) =>
                        handleSalaryChange("maximum_salary", e.target.value)
                      }
                      placeholder="e.g Rp. 100.000.000"
                      className="h-9 text-xs bg-white text-slate-800 focus-visible:border-primary"
                    />
                    {errors.maximum_salary && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">
                        {errors.maximum_salary.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                      Masa Tunggu Kerja <span className="text-rose-500">*</span>
                    </Label>
                    <Select
                      value={waitingPeriodVal}
                      onValueChange={(val) =>
                        setValue("waiting_period", val, { shouldDirty: true, shouldValidate: true })
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
                    {errors.waiting_period && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">
                        {errors.waiting_period.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                      Tanggal Masuk Kerja{" "}
                      <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      type="date"
                      {...register("start_date")}
                      className="h-9 text-xs bg-white text-slate-800"
                    />
                    {errors.start_date && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">
                        {errors.start_date.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentCareerStatus === "wirausaha" && (
              <div className="space-y-3.5 sm:space-y-4 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider">
                      Nama Wirausaha <span className="text-rose-500">*</span>
                    </Label>
                    <CharCounter length={businessName.length} max={255} />
                  </div>
                  <Input
                    type="text"
                    {...register("business_name")}
                    placeholder="Warung Makan Haji Sanusi"
                    maxLength={255}
                    className="h-9 text-xs bg-white text-slate-800 focus-visible:border-primary"
                  />
                  {errors.business_name && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">
                      {errors.business_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider">
                      Alamat Wirausaha <span className="text-rose-500">*</span>
                    </Label>
                    <CharCounter length={businessAddress.length} max={255} />
                  </div>
                  <Input
                    type="text"
                    {...register("business_address")}
                    placeholder="Jl. Doank, Gg. Jadian, RT 11/ RW 02"
                    maxLength={255}
                    className="h-9 text-xs bg-white text-slate-800 focus-visible:border-primary"
                  />
                  {errors.business_address && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">
                      {errors.business_address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label className="block text-xs font-bold text-slate-800 tracking-wider">
                        Username Instagram
                      </Label>
                      <CharCounter length={instagramHandle.length} max={255} />
                    </div>
                    <Input
                      type="text"
                      {...register("instagram_handle")}
                      placeholder="@warungmakan_hjsanusi"
                      maxLength={255}
                      className="h-9 text-xs bg-white text-slate-800 focus-visible:border-primary"
                    />
                  </div>

                  <div>
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                      Rata-rata Pendapatan
                    </Label>
                    <Select
                      value={averageIncomeVal}
                      onValueChange={(val) =>
                        setValue("average_income", val, { shouldDirty: true })
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                      Bidang Usaha <span className="text-rose-500">*</span>
                    </Label>
                    <Select
                      value={businessFieldVal}
                      onValueChange={(val) =>
                        setValue("business_field", val, { shouldDirty: true, shouldValidate: true })
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
                    {errors.business_field && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">
                        {errors.business_field.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                      Tanggal Berdiri Usaha
                    </Label>
                    <Input
                      type="date"
                      {...register("business_start_date")}
                      className="h-9 text-xs bg-white text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentCareerStatus === "lanjut_studi" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider">
                      Nama Perguruan Tinggi/Kampus{" "}
                      <span className="text-rose-500">*</span>
                    </Label>
                    <CharCounter length={universityName.length} max={255} />
                  </div>
                  <Input
                    type="text"
                    {...register("university_name")}
                    placeholder="e.g Universitas -"
                    maxLength={255}
                    className="h-9 text-xs bg-white text-slate-800 focus-visible:border-primary"
                  />
                  {errors.university_name && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">
                      {errors.university_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider">
                      Program Studi <span className="text-rose-500">*</span>
                    </Label>
                    <CharCounter length={studyProgram.length} max={255} />
                  </div>
                  <Input
                    type="text"
                    {...register("study_program")}
                    placeholder="e.g Teknik Informatika"
                    maxLength={255}
                    className="h-9 text-xs bg-white text-slate-800 focus-visible:border-primary"
                  />
                  {errors.study_program && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">
                      {errors.study_program.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 mt-2 sm:mt-3 flex items-center justify-end gap-2.5 border-t border-slate-100/60">
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              disabled={!isDirty || isSaving}
              className="h-9 px-3.5 text-xs font-semibold border-none bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>

            <Button
              type="submit"
              disabled={isSaving}
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
