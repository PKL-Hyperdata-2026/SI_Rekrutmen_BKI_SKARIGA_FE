import { useEffect, useState, useCallback } from "react";
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
  position: "",
  major_id: "",
  target_applicant_id: "",
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

  // Resolve major_id
  let resolvedMajorId = "";
  if (vacancy.majors && vacancy.majors.length > 0 && options?.majors) {
    const firstMajor = vacancy.majors[0];
    const match = options.majors.find(
      (m) =>
        String(m.id) === String(firstMajor.id) ||
        (firstMajor.code &&
          m.code.toLowerCase() === firstMajor.code.toLowerCase()) ||
        (firstMajor.name &&
          m.name.toLowerCase() === firstMajor.name.toLowerCase())
    );
    resolvedMajorId = match ? String(match.id) : String(firstMajor.id);
  } else if (vacancy.majorIds && vacancy.majorIds.length > 0) {
    resolvedMajorId = String(vacancy.majorIds[0]);
  }

  // Resolve target_applicant_id
  let resolvedTargetId = "";
  const target = vacancy.targetApplicant;
  const targetId = vacancy.targetApplicantId || target?.id;
  if ((target || targetId) && options?.targetApplicants) {
    const match = options.targetApplicants.find(
      (t) =>
        (targetId && String(t.id) === String(targetId)) ||
        (target?.code &&
          t.code.toLowerCase() === target.code.toLowerCase()) ||
        (target?.name &&
          t.name.toLowerCase() === target.name.toLowerCase())
    );
    resolvedTargetId = match ? String(match.id) : String(targetId || "");
  }

  return {
    position: vacancy.position || "",
    major_id: resolvedMajorId,
    target_applicant_id: resolvedTargetId,
    quota: vacancy.quota !== undefined && vacancy.quota !== null ? String(vacancy.quota) : "",
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
  return {
    position: values.position.trim(),
    quota: Number(values.quota),
    deadline: values.deadline,
    major_ids: [values.major_id],
    target_applicant_id: values.target_applicant_id,
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

  const isEditMode = Boolean(selectedVacancy?.id);

  // Sync selected vacancy into form fields
  useEffect(() => {
    if (selectedVacancy) {
      form.reset(toLowonganDefaultValues(selectedVacancy, options));
    } else {
      form.reset(defaultLowonganFormValues);
    }
  }, [selectedVacancy, options, form]);

  const handleReset = useCallback(() => {
    form.reset(defaultLowonganFormValues);
    onClearSelection();
  }, [form, onClearSelection]);

  const onSubmit = async (values: LowonganFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = toSubmitLowonganPayload(values);

      if (isEditMode && selectedVacancy?.id) {
        await hrdLowonganApi.updateVacancy(selectedVacancy.id, payload);
        toast.success("Lowongan kerja berhasil diperbarui.");
      } else {
        await hrdLowonganApi.createVacancy(payload);
        toast.success("Lowongan kerja berhasil dipublikasikan.");
      }

      handleReset();
      onSuccess();
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { message?: string; errors?: Record<string, string[]> } };
      };
      if (apiErr.response?.data?.errors) {
        const errors = apiErr.response.data.errors;
        if (errors.position?.[0]) form.setError("position", { message: errors.position[0] });
        if (errors.quota?.[0]) form.setError("quota", { message: errors.quota[0] });
        if (errors.deadline?.[0]) form.setError("deadline", { message: errors.deadline[0] });
        if (errors.major_ids?.[0]) form.setError("major_id", { message: errors.major_ids[0] });
        if (errors.target_applicant_id?.[0]) {
          form.setError("target_applicant_id", { message: errors.target_applicant_id[0] });
        }
        if (errors.work_location?.[0]) form.setError("work_location", { message: errors.work_location[0] });
        if (errors.qualification?.[0]) form.setError("qualification", { message: errors.qualification[0] });
      } else {
        toast.error(
          apiErr.response?.data?.message ||
            (isEditMode
              ? "Gagal memperbarui lowongan kerja."
              : "Gagal mempublikasikan lowongan kerja.")
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    isEditMode,
    handleReset,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
