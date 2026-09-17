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
  const trimmedTitle = values.title?.trim();

  return {
    title: trimmedTitle || position,
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

interface UseLowonganFormProps {
  options: HrdJobVacancyOptions;
  selectedVacancy: HrdJobVacancyItem | null;
  onClearSelection: () => void;
  onSuccess: () => void;
}

export function useLowonganForm({
  options,
  selectedVacancy,
  onClearSelection,
  onSuccess,
}: UseLowonganFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LowonganFormValues>({
    resolver: zodResolver(lowonganFormSchema),
    defaultValues: defaultLowonganFormValues,
  });

  const { reset } = form;
  const prevSelectedVacancyIdRef = useRef<string | number | null | undefined>(undefined);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const currentId = selectedVacancy?.id ?? null;

    if (prevSelectedVacancyIdRef.current === undefined) {
      prevSelectedVacancyIdRef.current = currentId;
      if (selectedVacancy) {
        reset(toLowonganDefaultValues(selectedVacancy, optionsRef.current));
      }
      return;
    }

    if (currentId !== prevSelectedVacancyIdRef.current) {
      prevSelectedVacancyIdRef.current = currentId;
      reset(toLowonganDefaultValues(selectedVacancy, optionsRef.current));
    }
  }, [selectedVacancy, reset]);

  const handleReset = useCallback(() => {
    onClearSelection();
    reset(defaultLowonganFormValues);
  }, [onClearSelection, reset]);

  const onSubmit = form.handleSubmit(async (values) => {
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

      handleReset();
      onSuccess();
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { message?: string; errors?: Record<string, string[]> } };
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
    handleReset,
    onSubmit,
  };
}
