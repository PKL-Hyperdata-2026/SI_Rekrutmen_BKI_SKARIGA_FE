import { useState, useEffect, useCallback, useMemo } from "react";
import { Modal } from "@/components/custom/modal";
import { Form } from "@/components/ui/form";
import { Field, FieldError } from "@/components/ui/field";
import { CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/custom/sonner";
import {
  type JobPlacement,
  type PenempatanStatus,
} from "./penempatan.schema";
import { penempatanApi } from "./penempatan.api";
import { usePenempatanUpdateStatusForm } from "./penempatan.form";

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

export interface PenempatanUpdateStatusFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  placement?: JobPlacement | null;
}

export interface WorkStatusOption {
  value: string;
  label: string;
}

export function PenempatanUpdateStatusForm({
  open,
  onOpenChange,
  onSuccess,
  placement,
}: PenempatanUpdateStatusFormProps) {
  const [placementStatuses, setPlacementStatuses] = useState<PenempatanStatus[]>(
    [],
  );
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const form = usePenempatanUpdateStatusForm();
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

  const period = watch("period");
  const workStatus = watch("workStatus");

  const workStatusOptions: WorkStatusOption[] = useMemo(
    () => [
      { value: "active", label: "Masih Bekerja / Aktif" },
      { value: "resigned", label: "Resign / Kontrak Habis" },
      { value: "moved", label: "Pindah Perusahaan Lain" },
    ],
    [],
  );

  const isTerminal = useCallback((status?: string | null): boolean => {
    if (!status) return false;
    const s = status.toLowerCase();
    return (
      s.includes("resign") ||
      s.includes("kontrak") ||
      s.includes("habis") ||
      s.includes("pindah") ||
      s.includes("non-aktif") ||
      s.includes("keluar") ||
      s === "resigned" ||
      s === "moved" ||
      s === "contract_end"
    );
  }, []);

  const hasEvaluated3 = useMemo(() => {
    const s = placement?.evaluations?.["3"]?.status || placement?.status3Months;
    return Boolean(s && s !== "-" && s !== "Belum Waktunya" && s.trim() !== "");
  }, [placement?.evaluations, placement?.status3Months]);

  const hasEvaluated6 = useMemo(() => {
    const s = placement?.evaluations?.["6"]?.status || placement?.status6Months;
    return Boolean(s && s !== "-" && s !== "Belum Waktunya" && s.trim() !== "");
  }, [placement?.evaluations, placement?.status6Months]);

  const availablePeriods = useMemo(() => {
    const s3 =
      placement?.evaluations?.["3"]?.status || placement?.status3Months;
    const s6 =
      placement?.evaluations?.["6"]?.status || placement?.status6Months;
    const is3Terminal = isTerminal(s3);
    const is6Terminal = isTerminal(s6);

    return [
      {
        value: "3",
        label: "Monitoring 3 Bulan",
        disabled: false,
      },
      {
        value: "6",
        label: "Monitoring 6 Bulan",
        disabled: !hasEvaluated3 || is3Terminal,
      },
      {
        value: "12",
        label: "Monitoring 12 Bulan",
        disabled:
          !hasEvaluated3 || !hasEvaluated6 || is3Terminal || is6Terminal,
      },
    ];
  }, [
    hasEvaluated3,
    hasEvaluated6,
    placement?.evaluations,
    placement?.status3Months,
    placement?.status6Months,
    isTerminal,
  ]);

  const fetchOptions = useCallback(async () => {
    setIsLoadingOptions(true);
    try {
      const data = await penempatanApi.getOptions();
      if (data && Array.isArray(data.placement_statuses)) {
        setPlacementStatuses(data.placement_statuses);
      }
    } catch {
    } finally {
      setIsLoadingOptions(false);
    }
  }, []);

  const populatePeriodData = useCallback(
    (targetPeriod: string) => {
      const existing = placement?.evaluations?.[targetPeriod];
      if (existing) {
        setValue("notes", existing.notes || "");
        if (existing.status) {
          const s = existing.status.toLowerCase();
          if (s.includes("masih") || s.includes("aktif")) {
            setValue("workStatus", "active", { shouldValidate: true });
          } else if (s.includes("resign") || s.includes("keluar")) {
            setValue("workStatus", "resigned", { shouldValidate: true });
          } else if (s.includes("pindah") || s.includes("kontrak")) {
            setValue("workStatus", "moved", { shouldValidate: true });
          } else {
            setValue("workStatus", "");
          }
        } else {
          setValue("workStatus", "");
        }
      } else {
        setValue("notes", "");
        setValue("workStatus", "");
      }
    },
    [placement?.evaluations, setValue],
  );

  const handlePeriodChange = useCallback(
    (val: string) => {
      setValue("period", val, { shouldValidate: true, shouldDirty: true });
      clearErrors("period");
      populatePeriodData(val);
    },
    [clearErrors, populatePeriodData, setValue],
  );

  useEffect(() => {
    if (open) {
      reset({
        period: "",
        workStatus: "",
        notes: "",
      });
      fetchOptions();
    }
  }, [open, fetchOptions, reset]);

  const onFormSubmit = handleSubmit(async (values) => {
    if (!placement?.id) return;

    const selectedPeriodOption = availablePeriods.find(
      (p) => p.value === values.period,
    );
    if (selectedPeriodOption?.disabled) {
      if (values.period === "6") {
        setError("period", {
          message: "Evaluasi monitoring 3 bulan harus diisi terlebih dahulu.",
        });
      } else if (values.period === "12") {
        setError("period", {
          message:
            "Evaluasi monitoring 3 dan 6 bulan harus diisi terlebih dahulu.",
        });
      } else {
        setError("period", {
          message: "Periode monitoring ini tidak dapat dipilih.",
        });
      }
      return;
    }

    try {
      const workStatusLabelMap: Record<string, string> = {
        active: "Masih Bekerja / Aktif",
        resigned: "Resign / Kontrak Habis",
        moved: "Pindah Perusahaan Lain",
      };
      const resolvedStatusLabel =
        workStatusLabelMap[values.workStatus] || values.workStatus;

      const matchingStatus = placementStatuses.find((ps) => {
        const code = ps.code?.toLowerCase();
        const name = ps.name?.toLowerCase() || "";
        if (values.workStatus === "active") {
          return (
            code === "active" ||
            name.includes("aktif") ||
            name.includes("bertahan")
          );
        }
        if (values.workStatus === "resigned") {
          return (
            code === "resigned" ||
            name.includes("resign") ||
            name.includes("keluar")
          );
        }
        if (values.workStatus === "moved") {
          return (
            code === "contract_end" ||
            name.includes("kontrak") ||
            name.includes("pindah")
          );
        }
        return false;
      });

      const payload: Record<string, unknown> = {
        period: String(values.period),
        work_status: resolvedStatusLabel,
        notes: values.notes ? values.notes.trim() : "",
      };

      if (matchingStatus?.id) {
        payload.placement_status_id = matchingStatus.id;
      }

      await penempatanApi.updatePlacement(placement.id, payload);
      toast.success("Status evaluasi retensi berhasil diperbarui.");
      onSuccess?.();
      onOpenChange(false);
    } catch (err: unknown) {
      let msg = "Terjadi kesalahan sistem saat memperbarui data.";
      if (isApiError(err)) {
        const res = err.response?.data;
        msg = res?.message || "Gagal memperbarui status evaluasi.";
        const apiErrors = res?.errors;
        if (apiErrors && typeof apiErrors === "object") {
          for (const [key, msgs] of Object.entries(apiErrors)) {
            if (Array.isArray(msgs) && msgs.length > 0) {
              if (key === "period") setError("period", { message: msgs[0] });
              if (key === "work_status")
                setError("workStatus", { message: msgs[0] });
              if (key === "notes") setError("notes", { message: msgs[0] });
            }
          }
        }
      }
      toast.error(msg, { title: "Gagal Memperbarui Status" });
    }
  });

  const alumniName = useMemo(() => {
    return (
      placement?.studentAlumni?.user?.fullName ||
      placement?.alumniName ||
      "Alumni"
    );
  }, [placement]);

  const companyName = useMemo(() => {
    return placement?.company?.name || placement?.companyName || "Perusahaan";
  }, [placement]);

  const title = "Update Status Evaluasi Retensi";
  const description = `${alumniName} - ${companyName}`;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      variant="hrd"
      headerStyle="gradient"
      size="md"
      title={title}
      description={description}
      footer={null}
      className="w-[95vw] sm:max-w-135 rounded-lg overflow-hidden"
    >
      <Form onSubmit={onFormSubmit} className="space-y-4 py-1">
        <Field className="flex flex-col gap-1.5">
          <Label className="text-sm font-semibold text-[#1e1b4b] flex items-center gap-1">
            Periode Evaluasi Monitoring
            <Badge
              variant="outline"
              className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm font-bold"
            >
              *
            </Badge>
          </Label>
          <Select
            value={period || undefined}
            onValueChange={handlePeriodChange}
          >
            <SelectTrigger
              className={cn(
                "h-10 w-full justify-between rounded-lg border border-slate-200 bg-[#F8F9FD] px-3.5 text-sm text-slate-800 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                Boolean(errors.period) &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              )}
            >
              <SelectValue placeholder="Pilih Periode Monitoring" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 p-1.5 shadow-xl bg-white theme-hrd">
              {availablePeriods.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                  className="rounded-lg py-2 px-3 text-sm font-medium text-slate-700 cursor-pointer focus:bg-[#8D1D96] focus:text-white data-[state=checked]:bg-[#8D1D96] data-[state=checked]:text-white data-disabled:opacity-40 data-disabled:cursor-not-allowed"
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.period && (
            <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
              {errors.period.message}
            </FieldError>
          )}
        </Field>

        <Field className="flex flex-col gap-1.5">
          <Label className="text-sm font-semibold text-[#1e1b4b] flex items-center gap-1">
            Status Bekerja
            <Badge
              variant="outline"
              className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm font-bold"
            >
              *
            </Badge>
          </Label>
          <Select
            value={workStatus || undefined}
            onValueChange={(val) =>
              setValue("workStatus", val, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            disabled={isLoadingOptions}
          >
            <SelectTrigger
              isLoading={isLoadingOptions}
              className={cn(
                "h-10 w-full justify-between rounded-lg border border-slate-200 bg-[#F8F9FD] px-3.5 text-sm text-slate-800 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                Boolean(errors.workStatus) &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              )}
            >
              <SelectValue placeholder="Pilih Status Bekerja" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 p-1.5 shadow-xl bg-white theme-hrd">
              {workStatusOptions.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="rounded-lg py-2 px-3 text-sm font-medium text-slate-700 cursor-pointer focus:bg-[#8D1D96] focus:text-white data-[state=checked]:bg-[#8D1D96] data-[state=checked]:text-white"
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.workStatus && (
            <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
              {errors.workStatus.message}
            </FieldError>
          )}
        </Field>

        <Field className="flex flex-col gap-1.5">
          <Label className="text-sm font-semibold text-[#1e1b4b] flex items-center gap-1">
            Catatan Monitoring (Opsional)
          </Label>
          <Textarea
            {...register("notes")}
            placeholder="Masukkan catatan evaluasi..."
            rows={3}
            className={cn(
              "min-h-24 w-full rounded-lg border border-slate-200 bg-[#F8F9FD] px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none",
              Boolean(errors.notes) &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            )}
          />
          {errors.notes && (
            <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
              {errors.notes.message}
            </FieldError>
          )}
        </Field>

        <CardContent className="flex items-center gap-3 rounded-lg border border-[#D069D7]/30 bg-[#FDF2F8]/80 p-3.5 text-slate-800">
          <Info className="size-5 text-[#8D1D96] shrink-0" />
          <CardDescription className="text-xs font-medium text-slate-800 leading-snug font-sans">
            Perbaruan status ini akan secara otomatis memperbarui data
            keterserapan di modul Tracer Study
          </CardDescription>
        </CardContent>

        <CardContent className="flex items-center justify-end gap-3 pt-5 p-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="h-9.5 px-6 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-xs cursor-pointer justify-center"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-9.5 px-7 rounded-lg bg-linear-to-r from-[#3D0040] via-[#5A0C62] to-[#D46AD8] hover:opacity-95 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                Simpan Data
                <Send className="size-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Form>
    </Modal>
  );
}
