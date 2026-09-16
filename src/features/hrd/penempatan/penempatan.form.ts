import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  jobPlacementFormSchema,
  jobPlacementUpdateStatusFormSchema,
  type JobPlacementFormValues,
  type JobPlacementUpdateStatusFormValues,
  type JobPlacement,
} from "./penempatan.schema";

export function toPenempatanDefaultValues(
  placement?: JobPlacement | null,
  companyId?: string,
): JobPlacementFormValues {
  if (!placement) {
    return {
      studentAlumniId: "",
      companyId: companyId || "",
      position: "",
      acceptedDate: "",
      startDate: "",
      jobApplicationId: null,
      placementStatusId: null,
      notes: null,
    };
  }

  return {
    studentAlumniId: String(
      placement.studentAlumniId || placement.studentAlumni?.id || "",
    ),
    companyId: String(
      placement.companyId || placement.company?.id || companyId || "",
    ),
    position: placement.position || "",
    acceptedDate: placement.acceptedDate || "",
    startDate: placement.startDate || "",
    jobApplicationId: placement.jobApplicationId
      ? String(placement.jobApplicationId)
      : null,
    placementStatusId: placement.placementStatusId
      ? String(placement.placementStatusId)
      : null,
    notes: placement.notes || null,
  };
}

export function toSubmitPenempatanPayload(
  values: JobPlacementFormValues,
  authUserCompanyId?: string,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    student_alumni_id: values.studentAlumniId,
    position: values.position.trim(),
    accepted_date: values.acceptedDate,
    start_date: values.startDate,
  };

  const resolvedCompanyId = authUserCompanyId || values.companyId || undefined;
  if (resolvedCompanyId) {
    payload.company_id = resolvedCompanyId;
  }

  return payload;
}

export function toPenempatanUpdateStatusDefaultValues(): JobPlacementUpdateStatusFormValues {
  return {
    period: "",
    workStatus: "",
    notes: "",
  };
}

export function usePenempatanForm(
  initialData?: JobPlacement | null,
  companyId?: string,
) {
  return useForm<JobPlacementFormValues>({
    resolver: zodResolver(jobPlacementFormSchema),
    defaultValues: toPenempatanDefaultValues(initialData, companyId),
    mode: "onBlur",
  });
}

export function usePenempatanUpdateStatusForm() {
  return useForm<JobPlacementUpdateStatusFormValues>({
    resolver: zodResolver(jobPlacementUpdateStatusFormSchema),
    defaultValues: toPenempatanUpdateStatusDefaultValues(),
    mode: "onBlur",
  });
}
