import { useEffect, useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/custom/sonner";
import {
  lowonganFormSchema,
  type LowonganFormValues,
  type HrdJobVacancyItem,
  type HrdJobVacancyOptions,
  type LowonganPayload,
} from "./lowongan.schema";
import { hrdLowonganApi } from "./lowongan.api";

export const defaultLowonganFormValues: LowonganFormValues = {
  title: "",
  position: "",
  major_ids: [],
  target_applicant_id: "",
  job_type_id: "",
  quota: "",
  deadline: "",
  work_location: "",
  qualification: "",
  description: "",
  send_notification: false,
};

export function toLowonganDefaultValues(
  vacancy?: HrdJobVacancyItem | null,
  options?: HrdJobVacancyOptions
): LowonganFormValues {
  if (!vacancy) {
    return defaultLowonganFormValues;
  }

  // Resolve major_ids
  let resolvedMajorIds: string[] = [];
  if (vacancy.majors && vacancy.majors.length > 0 && options?.majors) {
    resolvedMajorIds = vacancy.majors
      .map((vm) => {
        const match = options.majors.find(
          (m) =>
            Boolean(vm.code && m.code && m.code.toLowerCase() === vm.code.toLowerCase()) ||
            Boolean(vm.name && m.name && m.name.toLowerCase() === vm.name.toLowerCase()) ||
            Boolean(vm.id && m.id && String(m.id) === String(vm.id))
        );
        return match ? String(match.id) : String(vm.id);
      })
      .filter(Boolean);
  } else if (vacancy.majorIds && vacancy.majorIds.length > 0) {
    resolvedMajorIds = vacancy.majorIds.map(String);
  }

  // Resolve target_applicant_id
  let resolvedTargetId = "";
  const target = vacancy.targetApplicant;
  const targetId = vacancy.targetApplicantId || target?.id;
  if ((target || targetId) && options?.targetApplicants) {
    const match = options.targetApplicants.find(
      (t) =>
        Boolean(target?.code && t?.code && t.code.toLowerCase() === target.code.toLowerCase()) ||
        Boolean(target?.name && t?.name && t.name.toLowerCase() === target.name.toLowerCase()) ||
        Boolean(targetId && t?.id && String(t.id) === String(targetId))
    );
    resolvedTargetId = match ? String(match.id) : String(targetId || "");
  }

  // Resolve job_type_id
  let resolvedJobTypeId = "";
  const jobType = vacancy.jobType;
  const jobTypeId = vacancy.jobTypeId || jobType?.id;
  if ((jobType || jobTypeId) && options?.jobTypes) {
    const match = options.jobTypes.find(
      (jt) =>
        Boolean(jobType?.code && jt?.code && jt.code.toLowerCase() === jobType.code.toLowerCase()) ||
        Boolean(jobType?.name && jt?.name && jt.name.toLowerCase() === jobType.name.toLowerCase()) ||
        Boolean(jobTypeId && jt?.id && String(jt.id) === String(jobTypeId))
    );
    resolvedJobTypeId = match ? String(match.id) : String(jobTypeId || "");
  }

  return {
    title: vacancy.title || "",
    position: vacancy.position || "",
    major_ids: resolvedMajorIds,
    target_applicant_id: resolvedTargetId,
    job_type_id: resolvedJobTypeId,
    quota:
      vacancy.quota !== undefined && vacancy.quota !== null
        ? String(vacancy.quota)
        : "",
    deadline: vacancy.deadline ? vacancy.deadline.split("T")[0] : "",
    work_location: vacancy.workLocation || "",
    qualification: vacancy.qualification || "",
    description: vacancy.description || "",
    send_notification: false,
  };
}

export function toSubmitLowonganPayload(
  values: LowonganFormValues
): LowonganPayload {
  const position = values.position.trim();

  return {
    title: values.title.trim(),
    position,
    quota: Number(values.quota),
    deadline: values.deadline,
    major_ids: values.major_ids,
    target_applicant_id: values.target_applicant_id,
    job_type_id: values.job_type_id ? values.job_type_id : null,
    work_location: values.work_location.trim(),
    qualification: values.qualification.trim(),
    description: values.description?.trim() || null,
    send_notification: values.send_notification,
  };
}

export interface UseLowonganFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedVacancy: HrdJobVacancyItem | null;
  options: HrdJobVacancyOptions;
  onSuccess: () => void;
  onClearSelection?: () => void;
}

const LOWONGAN_DRAFT_KEY = "hrd-lowongan-draft-v1";

function toDraftValues(raw: unknown): LowonganFormValues | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  const asString = (value: unknown): string =>
    typeof value === "string" ? value : "";
  const asStringArray = (value: unknown): string[] =>
    Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  const quota =
    typeof record.quota === "string" || typeof record.quota === "number"
      ? record.quota
      : "";
  const description =
    record.description === null || record.description === undefined
      ? ""
      : asString(record.description);
  const jobTypeId =
    typeof record.job_type_id === "string" ? record.job_type_id : "";
  return {
    title: asString(record.title),
    position: asString(record.position),
    major_ids: asStringArray(record.major_ids),
    target_applicant_id: asString(record.target_applicant_id),
    job_type_id: jobTypeId,
    quota,
    deadline: asString(record.deadline),
    work_location: asString(record.work_location),
    qualification: asString(record.qualification),
    description,
    send_notification: false,
  };
}

export function loadLowonganDraft(): LowonganFormValues | null {
  try {
    const raw = localStorage.getItem(LOWONGAN_DRAFT_KEY);
    if (!raw) return null;
    const draft = toDraftValues(JSON.parse(raw) as unknown);
    if (
      !draft ||
      (!draft.title &&
        !draft.position &&
        draft.major_ids.length === 0 &&
        !draft.quota &&
        !draft.deadline &&
        !draft.work_location &&
        !draft.qualification)
    ) {
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

function clearLowonganDraft(): void {
  try {
    localStorage.removeItem(LOWONGAN_DRAFT_KEY);
  } catch {
    // Draft is best-effort only; ignore storage failures.
  }
}

export function useLowonganForm({
  open,
  onOpenChange,
  selectedVacancy,
  options,
  onSuccess,
  onClearSelection,
}: UseLowonganFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);

  const form = useForm<LowonganFormValues>({
    resolver: zodResolver(lowonganFormSchema),
    defaultValues: defaultLowonganFormValues,
  });

  const { reset } = form;

  const prevOpenRef = useRef(false);
  const prevSelectedVacancyIdRef = useRef<string | number | undefined>(undefined);
  const prevOptionsLoadedRef = useRef(false);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    const wasOpen = prevOpenRef.current;
    const prevId = prevSelectedVacancyIdRef.current;
    const currentId = selectedVacancy?.id;
    const optionsLoaded = optionsRef.current.majors.length > 0;
    const wasOptionsLoaded = prevOptionsLoadedRef.current;

    if (!wasOpen && open) {
      if (!selectedVacancy) {
        const draft = loadLowonganDraft();
        reset(draft ?? defaultLowonganFormValues);
      } else {
        reset(toLowonganDefaultValues(selectedVacancy, optionsRef.current));
      }
    } else if (open && currentId !== prevId) {
      reset(toLowonganDefaultValues(selectedVacancy, optionsRef.current));
    } else if (open && selectedVacancy && !wasOptionsLoaded && optionsLoaded) {
      // Options arrived after the edit modal opened; re-resolve ids to labels.
      reset(toLowonganDefaultValues(selectedVacancy, optionsRef.current));
    } else if (wasOpen && !open) {
      // Every close flows through doCloseForm or the submit handler below,
      // both of which already reset the flags. Keep this branch effect-free.
      reset(defaultLowonganFormValues);
    }

    prevOpenRef.current = open;
    prevSelectedVacancyIdRef.current = currentId;
    prevOptionsLoadedRef.current = optionsLoaded;
  }, [open, selectedVacancy, options, reset]);

  // Draft snapshot is written on close, never in edit mode.
  // Keeping values in the form on submit error already covers
  // network failures, so no live subscription is needed.
  const saveDraftSnapshot = useCallback(() => {
    try {
      const values = form.getValues();
      localStorage.setItem(LOWONGAN_DRAFT_KEY, JSON.stringify(values));
    } catch {
      // Draft is best-effort only; ignore storage failures.
    }
  }, [form]);

  const doCloseForm = useCallback(() => {
    if (!selectedVacancy) {
      saveDraftSnapshot();
    }
    onClearSelection?.();
    onOpenChange(false);
    reset(defaultLowonganFormValues);
    setIsCloseConfirmOpen(false);
  }, [selectedVacancy, saveDraftSnapshot, onClearSelection, onOpenChange, reset]);

  const handleSafeClose = useCallback(() => {
    if (form.formState.isDirty) {
      setIsCloseConfirmOpen(true);
      return;
    }
    doCloseForm();
  }, [form.formState.isDirty, doCloseForm]);

  const confirmClose = useCallback(() => {
    doCloseForm();
  }, [doCloseForm]);

  const cancelClose = useCallback(() => {
    setIsCloseConfirmOpen(false);
  }, []);

  const onSubmit = form.handleSubmit(async (values) => {
    // Mirror backend deadline rules: create mode rejects past dates.
    // Edit mode only rejects a changed deadline that lies in the past.
    const todayStr = new Date().toLocaleDateString("en-CA");
    const originalDeadline = selectedVacancy?.deadline
      ? selectedVacancy.deadline.split("T")[0]
      : "";
    if (values.deadline < todayStr && values.deadline !== originalDeadline) {
      form.setError("deadline", {
        type: "validate",
        message: "Batas pendaftaran tidak boleh di masa lalu.",
      });
      toast.error("Batas pendaftaran tidak boleh di masa lalu.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = toSubmitLowonganPayload(values);

      if (selectedVacancy) {
        await hrdLowonganApi.updateVacancy(selectedVacancy.id, payload);
        toast.success("Lowongan kerja berhasil diperbarui!");
      } else {
        await hrdLowonganApi.createVacancy(payload);
        toast.success("Lowongan kerja berhasil dipublikasikan!");
      }

      clearLowonganDraft();
      reset(defaultLowonganFormValues);
      setIsCloseConfirmOpen(false);
      onClearSelection?.();
      onOpenChange(false);
      onSuccess();
    } catch (err: unknown) {
      const apiErr = err as {
        response?: {
          data?: {
            message?: string;
            errors?: Record<string, string[]>;
          };
        };
      };
      const validationErrors = apiErr.response?.data?.errors;
      if (validationErrors) {
        Object.entries(validationErrors).forEach(([field, msgs]) => {
          if (msgs && msgs.length > 0) {
            const formField =
              field.startsWith("major_ids.") || field === "major_ids"
                ? "major_ids"
                : (field as keyof LowonganFormValues);
            form.setError(formField, {
              type: "server",
              message: msgs[0],
            });
          }
        });
      }
      toast.error(
        apiErr.response?.data?.message ||
          "Gagal menyimpan lowongan kerja. Silakan periksa kembali formulir."
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    form,
    isSubmitting,
    isEditMode: Boolean(selectedVacancy),
    isCloseConfirmOpen,
    handleSafeClose,
    confirmClose,
    cancelClose,
    onSubmit,
  };
}
