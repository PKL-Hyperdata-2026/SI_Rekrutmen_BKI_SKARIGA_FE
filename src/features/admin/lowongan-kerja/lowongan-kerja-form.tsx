import { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/custom/modal";
import { Form } from "@/components/ui/form";
import { Field, FieldGroup, FieldError } from "@/components/ui/field";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/custom/date-picker";
import { AsyncSearchableSelect } from "@/components/custom/async-searchable-select";
import { selectOptionsApi } from "@/api/select-options";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/custom/sonner";
import {
  type MajorItem,
  type StandardTypeItem,
  type JobVacancy,
} from "./lowongan-kerja.schema";
import { lowonganKerjaApi } from "./lowongan-kerja.api";
import {
  useLowonganKerjaForm,
  toJobVacancyDefaultValues,
  toSubmitJobVacancyPayload,
} from "./lowongan-kerja.form";

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

function isApiError(err: unknown): err is ApiErrorResponse {
  return typeof err === "object" && err !== null && "response" in err;
}

export interface LowonganKerjaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  vacancy?: JobVacancy | null;
  majors?: MajorItem[];
  targetApplicants?: StandardTypeItem[];
}

export function LowonganKerjaForm({
  open,
  onOpenChange,
  onSuccess,
  vacancy,
  majors: initialMajors,
  targetApplicants: initialTargetApplicants,
}: LowonganKerjaFormProps) {
  const [majors, setMajors] = useState<MajorItem[]>(initialMajors || []);
  const [targetApplicants, setTargetApplicants] = useState<StandardTypeItem[]>(
    initialTargetApplicants || [],
  );
  const [companyFallbackLabel, setCompanyFallbackLabel] = useState<
    string | undefined
  >(undefined);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isEditMode = Boolean(vacancy?.id);

  const form = useLowonganKerjaForm(vacancy, majors, targetApplicants);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = form;

  const companyId = watch("companyId");
  const deadline = watch("deadline");
  const majorId = watch("majorId");
  const targetId = watch("targetId");
  const sendNotification = watch("sendNotification");

  const fetchOptions = useCallback(async () => {
    setIsLoadingOptions(true);
    try {
      const data = await lowonganKerjaApi.getOptions();
      if (data) {
        if (Array.isArray(data.majors)) setMajors(data.majors);
        if (Array.isArray(data.targetApplicants))
          setTargetApplicants(data.targetApplicants);
      }
      return data ?? null;
    } catch {
      return null;
    } finally {
      setIsLoadingOptions(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (!open) {
        setIsLoadingData(false);
        return;
      }

      setErrorMsg("");

      let currentMajors =
        initialMajors && initialMajors.length > 0 ? initialMajors : majors;
      let currentTargets =
        initialTargetApplicants && initialTargetApplicants.length > 0
          ? initialTargetApplicants
          : targetApplicants;

      if (currentMajors.length === 0 || currentTargets.length === 0) {
        const fetched = await fetchOptions();
        if (fetched) {
          if (Array.isArray(fetched.majors) && fetched.majors.length > 0) {
            currentMajors = fetched.majors;
          }
          if (
            Array.isArray(fetched.targetApplicants) &&
            fetched.targetApplicants.length > 0
          ) {
            currentTargets = fetched.targetApplicants;
          }
        }
      }

      if (!isMounted) return;

      if (vacancy) {
        setIsLoadingData(true);
        setCompanyFallbackLabel(vacancy.company?.name);
        reset(
          toJobVacancyDefaultValues(vacancy, currentMajors, currentTargets),
        );
        setTimeout(() => {
          if (isMounted) setIsLoadingData(false);
        }, 150);
      } else {
        setIsLoadingData(false);
        setCompanyFallbackLabel(undefined);
        reset(toJobVacancyDefaultValues(null));
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [
    open,
    vacancy,
    initialMajors,
    initialTargetApplicants,
    fetchOptions,
    reset,
  ]);

  const onFormSubmit = handleSubmit(async (values) => {
    setErrorMsg("");
    clearErrors();

    const payload = toSubmitJobVacancyPayload(values);

    try {
      if (isEditMode && vacancy?.id) {
        await lowonganKerjaApi.updateVacancy(vacancy.id, payload);
        toast.success("Lowongan kerja berhasil diperbarui.");
      } else {
        await lowonganKerjaApi.createVacancy(payload);
        toast.success("Lowongan kerja berhasil dipublikasikan.");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      if (isApiError(err) && err.response?.data?.errors) {
        const errMap = err.response.data.errors;
        if (errMap.company_id?.[0]) {
          setError("companyId", { message: errMap.company_id[0] });
        }
        if (errMap.position?.[0]) {
          setError("position", { message: errMap.position[0] });
        }
        if (errMap.quota?.[0]) {
          setError("quota", { message: errMap.quota[0] });
        }
        if (errMap.deadline?.[0]) {
          setError("deadline", { message: errMap.deadline[0] });
        }
        if (errMap.major_ids?.[0]) {
          setError("majorId", { message: errMap.major_ids[0] });
        }
        if (errMap.target_applicant_id?.[0]) {
          setError("targetId", { message: errMap.target_applicant_id[0] });
        }
        if (errMap.work_location?.[0]) {
          setError("workLocation", { message: errMap.work_location[0] });
        }
        if (errMap.qualification?.[0]) {
          setError("qualification", { message: errMap.qualification[0] });
        }
      }

      const serverMessage = isApiError(err)
        ? err.response?.data?.message
        : undefined;

      setErrorMsg(
        serverMessage ||
          (isEditMode
            ? "Terjadi kesalahan saat memperbarui lowongan kerja."
            : "Terjadi kesalahan saat mempublikasikan lowongan kerja."),
      );
    }
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      variant="admin"
      headerStyle="gradient"
      size="md"
      title={
        isEditMode ? "Edit Lowongan Kerja" : "Form Publikasi Lowongan Kerja"
      }
      description={
        isEditMode
          ? "Perbarui informasi dan kualifikasi lowongan kerja."
          : "Lengkapi informasi lowongan untuk pendataan."
      }
      footer={null}
      className="w-[95vw] sm:max-w-160 max-h-[92vh] rounded-lg overflow-hidden"
    >
      {isLoadingData ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="size-8 animate-spin text-purple-600" />
          <p className="text-xs font-medium text-slate-500 font-sans">
            Memuat data lowongan kerja...
          </p>
        </div>
      ) : (
        <Form onSubmit={onFormSubmit} className="space-y-2.5 pt-0.5">
          {errorMsg && (
            <CardContent className="rounded-lg bg-red-500/10 p-2.5 text-xs font-medium text-red-600 border border-red-500/20">
              {errorMsg}
            </CardContent>
          )}

          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field className="flex flex-col gap-1">
              <Label className="text-xs text-[#1e1b4b] flex items-center gap-1">
                Nama Perusahaan Mitra
                <Badge
                  variant="outline"
                  className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
                >
                  *
                </Badge>
              </Label>
              <AsyncSearchableSelect
                value={companyId}
                onValueChange={(val) =>
                  setValue("companyId", val, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                onOptionSelect={(item) => setCompanyFallbackLabel(item.label)}
                placeholder="Pilih Perusahaan"
                searchPlaceholder="Cari nama perusahaan..."
                emptyMessage="Perusahaan tidak ditemukan"
                fetchPage={selectOptionsApi.getCompanies}
                fallbackLabel={companyFallbackLabel}
                hasError={Boolean(errors.companyId)}
              />
              {errors.companyId && (
                <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.companyId.message}
                </FieldError>
              )}
            </Field>

            <Field className="flex flex-col gap-1">
              <Label className="text-xs text-[#1e1b4b] flex items-center gap-1">
                Posisi Pekerjaan
                <Badge
                  variant="outline"
                  className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
                >
                  *
                </Badge>
              </Label>
              <Input
                {...register("position")}
                placeholder="cth. Customer Service"
                className={cn(
                  "h-10 w-full rounded-lg border bg-[#F8F9FD] px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all",
                  errors.position
                    ? "border-red-500 bg-red-50/20"
                    : "border-slate-200",
                )}
              />
              {errors.position && (
                <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.position.message}
                </FieldError>
              )}
            </Field>
          </FieldGroup>

          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field className="flex flex-col gap-1">
              <Label className="text-xs text-[#1e1b4b] flex items-center gap-1">
                Kuota
                <Badge
                  variant="outline"
                  className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
                >
                  *
                </Badge>
              </Label>
              <Input
                {...register("quota")}
                placeholder="cth. 30 Orang"
                className={cn(
                  "h-10 w-full rounded-lg border bg-[#F8F9FD] px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all",
                  errors.quota
                    ? "border-red-500 bg-red-50/20"
                    : "border-slate-200",
                )}
              />
              {errors.quota && (
                <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.quota.message}
                </FieldError>
              )}
            </Field>

            <Field className="flex flex-col gap-1">
              <Label className="text-xs text-[#1e1b4b] flex items-center gap-1">
                Batas Pendaftaran
                <Badge
                  variant="outline"
                  className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
                >
                  *
                </Badge>
              </Label>
              <DatePicker
                value={deadline}
                onChange={(val) =>
                  setValue("deadline", val, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                hasError={Boolean(errors.deadline)}
              />
              {errors.deadline && (
                <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.deadline.message}
                </FieldError>
              )}
            </Field>
          </FieldGroup>

          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field className="flex flex-col gap-1">
              <Label className="text-xs text-[#1e1b4b] flex items-center gap-1">
                Jurusan
                <Badge
                  variant="outline"
                  className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
                >
                  *
                </Badge>
              </Label>
              <Select
                value={majorId}
                onValueChange={(val) =>
                  setValue("majorId", val, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger
                  isLoading={isLoadingOptions}
                  className={cn(
                    "h-10 w-full rounded-lg border bg-[#F8F9FD] px-3.5 text-sm text-slate-800 data-placeholder:text-slate-700 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                    errors.majorId
                      ? "border-red-500 bg-red-50/20"
                      : "border-slate-200",
                  )}
                >
                  <SelectValue placeholder="Semua Jurusan" />
                </SelectTrigger>
                <SelectContent
                  className="rounded-lg max-h-60"
                  isLoading={isLoadingOptions}
                >
                  <SelectItem value="all" className="text-sm cursor-pointer">
                    Semua Jurusan
                  </SelectItem>
                  {majors.map((m) => (
                    <SelectItem
                      key={m.id}
                      value={String(m.id)}
                      className="text-sm cursor-pointer"
                    >
                      {m.name} ({m.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.majorId && (
                <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.majorId.message}
                </FieldError>
              )}
            </Field>

            <Field className="flex flex-col gap-1">
              <Label className="text-xs text-[#1e1b4b] flex items-center gap-1">
                Target
                <Badge
                  variant="outline"
                  className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
                >
                  *
                </Badge>
              </Label>
              <Select
                value={targetId}
                onValueChange={(val) =>
                  setValue("targetId", val, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger
                  isLoading={isLoadingOptions}
                  className={cn(
                    "h-10 w-full rounded-lg border bg-[#F8F9FD] px-3.5 text-sm text-slate-800 data-placeholder:text-slate-700 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                    errors.targetId
                      ? "border-red-500 bg-red-50/20"
                      : "border-slate-200",
                  )}
                >
                  <SelectValue placeholder="Semua Target" />
                </SelectTrigger>
                <SelectContent
                  className="rounded-lg max-h-60"
                  isLoading={isLoadingOptions}
                >
                  <SelectItem value="all" className="text-sm cursor-pointer">
                    Semua Target
                  </SelectItem>
                  {targetApplicants.map((t) => (
                    <SelectItem
                      key={t.id}
                      value={String(t.id)}
                      className="text-sm cursor-pointer"
                    >
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.targetId && (
                <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.targetId.message}
                </FieldError>
              )}
            </Field>
          </FieldGroup>

          <Field className="flex flex-col gap-1">
            <Label className="text-xs text-[#1e1b4b] flex items-center gap-1">
              Lokasi Kerja
              <Badge
                variant="outline"
                className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
              >
                *
              </Badge>
            </Label>
            <Input
              {...register("workLocation")}
              placeholder="cth. Surabaya"
              className={cn(
                "h-10 w-full rounded-lg border bg-[#F8F9FD] px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all",
                errors.workLocation
                  ? "border-red-500 bg-red-50/20"
                  : "border-slate-200",
              )}
            />
            {errors.workLocation && (
              <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                {errors.workLocation.message}
              </FieldError>
            )}
          </Field>

          <Field className="flex flex-col gap-1">
            <Label className="text-xs text-[#1e1b4b] flex items-center gap-1">
              Kualifikasi / Persyaratan
              <Badge
                variant="outline"
                className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
              >
                *
              </Badge>
            </Label>
            <Textarea
              {...register("qualification")}
              placeholder="cth. Surat Lamaran Kerja, CV, .."
              className={cn(
                "min-h-20 max-h-28 w-full rounded-lg border bg-[#F8F9FD] p-3 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all resize-y custom-scrollbar",
                errors.qualification
                  ? "border-red-500 bg-red-50/20"
                  : "border-slate-200",
              )}
            />
            {errors.qualification && (
              <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                {errors.qualification.message}
              </FieldError>
            )}
          </Field>

          <CardContent className="flex items-center gap-2.5 pt-0.5 select-none cursor-pointer p-0">
            <Checkbox
              id="send-notification"
              checked={sendNotification}
              onCheckedChange={(checked) =>
                setValue("sendNotification", Boolean(checked), {
                  shouldDirty: true,
                })
              }
            />
            <Label
              htmlFor="send-notification"
              className="text-xs font-normal text-slate-600 cursor-pointer font-sans"
            >
              {isEditMode
                ? "Kirim notifikasi pembaruan ke target siswa/alumni"
                : "Kirim notifikasi otomatis ke target siswa/alumni"}
            </Label>
          </CardContent>

          <CardContent className="sticky -bottom-4 bg-white/95 backdrop-blur-xs pt-2.5 pb-3 sm:pb-2 -mx-6 px-6 border-t border-slate-100 flex items-center justify-end gap-3 z-10 mt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="hidden sm:inline-flex h-9.5 w-auto px-6 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-xs cursor-pointer justify-center"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9.5 w-full sm:w-auto px-7 rounded-lg bg-linear-to-r from-[#2e1065] via-[#4c1d95] to-[#7c3aed] hover:opacity-95 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {isEditMode ? "Menyimpan Perubahan..." : "Menyimpan..."}
                </>
              ) : (
                <>
                  {isEditMode ? "Perbarui Data" : "Simpan Data"}
                  <Send className="size-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Form>
      )}
    </Modal>
  );
}
