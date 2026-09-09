import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/api/axios";
import { toast } from "@/components/custom/sonner";
import {
  type JobPlacement,
  type PenempatanFormOptionsData,
  type PenempatanStatus,
  penempatanUpdateStatusFormSchema,
} from "../types/penempatan-schema";

export interface UsePenempatanUpdateStatusFormOptions {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  placement?: JobPlacement | null;
}

export type PlacementStatusOption = PenempatanStatus;

export interface WorkStatusOption {
  value: string;
  label: string;
}

export interface JobPlacementStatusPayload {
  period: string;
  work_status: string;
  notes: string;
  placement_status_id?: string | number;
}

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

export function usePenempatanUpdateStatusForm({
  open,
  onOpenChange,
  onSuccess,
  placement,
}: UsePenempatanUpdateStatusFormOptions) {
  const [period, setPeriodState] = useState("");
  const [workStatus, setWorkStatusState] = useState("");
  const [notes, setNotesState] = useState("");
  const [placementStatuses, setPlacementStatuses] = useState<
    PlacementStatusOption[]
  >([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const workStatusOptions: WorkStatusOption[] = useMemo(
    () => [
      { value: "active", label: "Masih Bekerja / Aktif" },
      { value: "resigned", label: "Resign / Kontrak Habis" },
      { value: "moved", label: "Pindah Perusahaan Lain" },
    ],
    [],
  );

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const setWorkStatus = useCallback(
    (val: string) => {
      setWorkStatusState(val);
      clearFieldError("workStatus");
    },
    [clearFieldError],
  );

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement> | string) => {
      const val = typeof e === "string" ? e : e.target.value;
      setNotesState(val);
      clearFieldError("notes");
    },
    [clearFieldError],
  );

  const resetForm = useCallback(() => {
    setPeriodState("");
    setWorkStatusState("");
    setNotesState("");
    setErrors({});
  }, []);

  const fetchOptions = useCallback(async () => {
    setIsLoadingOptions(true);
    try {
      const response = await api.get<{
        success: boolean;
        data: PenempatanFormOptionsData;
      }>("/admin/job-placements/options");

      const data = response.data?.data;
      if (data && Array.isArray(data.placement_statuses)) {
        setPlacementStatuses(data.placement_statuses);
      }
    } catch {
    } finally {
      setIsLoadingOptions(false);
    }
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      onOpenChange(nextOpen);
      if (!nextOpen) {
        resetForm();
      }
    },
    [onOpenChange, resetForm],
  );

  const handleCancel = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  const populatePeriodData = useCallback(
    (targetPeriod: string) => {
      const existing = placement?.evaluations?.[targetPeriod];
      if (existing) {
        setNotesState(existing.notes || "");
        if (existing.status) {
          const s = existing.status.toLowerCase();
          if (s.includes("masih") || s.includes("aktif"))
            setWorkStatusState("active");
          else if (s.includes("resign") || s.includes("keluar"))
            setWorkStatusState("resigned");
          else if (s.includes("pindah") || s.includes("kontrak"))
            setWorkStatusState("moved");
          else setWorkStatusState("");
        } else {
          setWorkStatusState("");
        }
      } else {
        setNotesState("");
        setWorkStatusState("");
      }
    },
    [placement?.evaluations],
  );

  const setPeriod = useCallback(
    (val: string) => {
      setPeriodState(val);
      clearFieldError("period");
      populatePeriodData(val);
    },
    [clearFieldError, populatePeriodData],
  );

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

  useEffect(() => {
    if (open) {
      resetForm();
      fetchOptions();
    } else {
      resetForm();
    }
  }, [open, fetchOptions, resetForm]);

  useEffect(() => {
    if (
      period &&
      availablePeriods.some((p) => p.value === period && p.disabled)
    ) {
      setPeriodState("");
    }
  }, [availablePeriods, period]);

  const validate = useCallback(() => {
    const result = penempatanUpdateStatusFormSchema.safeParse({
      period,
      workStatus,
      notes: notes.trim() || undefined,
    });

    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0];
        if (fieldName && typeof fieldName === "string" && !errs[fieldName]) {
          errs[fieldName] = issue.message;
        }
      }
      setErrors(errs);
      return false;
    }

    const selectedPeriodOption = availablePeriods.find(
      (p) => p.value === period,
    );
    if (selectedPeriodOption?.disabled) {
      if (period === "6") {
        setErrors({
          period: "Evaluasi monitoring 3 bulan harus diisi terlebih dahulu.",
        });
      } else if (period === "12") {
        setErrors({
          period:
            "Evaluasi monitoring 3 dan 6 bulan harus diisi terlebih dahulu.",
        });
      } else {
        setErrors({ period: "Periode monitoring ini tidak dapat dipilih." });
      }
      return false;
    }

    setErrors({});
    return true;
  }, [period, workStatus, notes, availablePeriods]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!placement?.id) return;

      if (!validate()) {
        return;
      }

      setIsSubmitting(true);

      try {
        const workStatusLabelMap: Record<string, string> = {
          active: "Masih Bekerja / Aktif",
          resigned: "Resign / Kontrak Habis",
          moved: "Pindah Perusahaan Lain",
        };
        const resolvedStatusLabel =
          workStatusLabelMap[workStatus] || workStatus;

        const matchingStatus = placementStatuses.find((ps) => {
          const code = ps.code?.toLowerCase();
          const name = ps.name?.toLowerCase() || "";
          if (workStatus === "active") {
            return (
              code === "active" ||
              name.includes("aktif") ||
              name.includes("bertahan")
            );
          }
          if (workStatus === "resigned") {
            return (
              code === "resigned" ||
              name.includes("resign") ||
              name.includes("keluar")
            );
          }
          if (workStatus === "moved") {
            return (
              code === "contract_end" ||
              name.includes("kontrak") ||
              name.includes("pindah")
            );
          }
          return false;
        });

        const payload: JobPlacementStatusPayload = {
          period: String(period),
          work_status: resolvedStatusLabel,
          notes: notes.trim(),
        };

        if (matchingStatus?.id) {
          payload.placement_status_id = matchingStatus.id;
        }

        const placementId = encodeURIComponent(String(placement.id));
        await api.put(`/admin/job-placements/${placementId}`, payload);
        toast.success("Status evaluasi retensi berhasil diperbarui.");
        onSuccess?.();
        handleOpenChange(false);
      } catch (err: unknown) {
        let msg = "Terjadi kesalahan sistem saat memperbarui data.";
        if (isApiError(err)) {
          const res = err.response?.data;
          msg = res?.message || "Gagal memperbarui status evaluasi.";
          const apiErrors = res?.errors;
          if (apiErrors && typeof apiErrors === "object") {
            const mappedErrors: Record<string, string> = {};
            for (const [key, msgs] of Object.entries(apiErrors)) {
              if (Array.isArray(msgs) && msgs.length > 0) {
                mappedErrors[key] = msgs[0];
              }
            }
            setErrors((prev) => ({ ...prev, ...mappedErrors }));
          }
        }
        toast.error(msg, { title: "Gagal Memperbarui Status" });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      placement?.id,
      validate,
      placementStatuses,
      workStatus,
      period,
      notes,
      onSuccess,
      handleOpenChange,
    ],
  );

  const submitButtonText = useMemo(() => {
    return isSubmitting ? "Menyimpan..." : "Simpan Data";
  }, [isSubmitting]);

  const hasError = useCallback(
    (field: string) => Boolean(errors[field]),
    [errors],
  );

  return {
    period,
    setPeriod,
    availablePeriods,
    workStatus,
    setWorkStatus,
    workStatusOptions,
    notes,
    setNotes: handleNotesChange,
    isLoadingOptions,
    isSubmitting,
    submitButtonText,
    errors,
    hasError,
    title,
    description,
    handleOpenChange,
    handleCancel,
    handleSubmit,
    resetForm,
  };
}
