import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  jobVacancyFormSchema,
  type JobVacancyFormValues,
  type JobVacancy,
  type MajorItem,
  type StandardTypeItem,
} from "./lowongan-kerja.schema";

export function toJobVacancyDefaultValues(
  vacancy?: JobVacancy | null,
  majors?: MajorItem[],
  targets?: StandardTypeItem[],
): JobVacancyFormValues {
  if (!vacancy) {
    return {
      companyId: "",
      position: "",
      quota: "",
      deadline: "",
      majorId: "all",
      targetId: "all",
      workLocation: "",
      qualification: "",
      sendNotification: false,
    };
  }

  const vacCompanyId = vacancy.companyId || vacancy.company?.id;
  const resolvedCompanyId = vacCompanyId ? String(vacCompanyId) : "";

  let resolvedMajorId = "all";
  if (vacancy.majors && vacancy.majors.length > 0) {
    const vacMajor = vacancy.majors[0];
    const matchedMajor = majors?.find(
      (m) =>
        String(m.id) === String(vacMajor.id) ||
        (vacMajor.code &&
          m.code?.toLowerCase() === vacMajor.code.toLowerCase()) ||
        (vacMajor.name &&
          m.name?.toLowerCase() === vacMajor.name.toLowerCase()),
    );
    resolvedMajorId = matchedMajor
      ? String(matchedMajor.id)
      : String(vacMajor.id);
  } else if (vacancy.majorIds && vacancy.majorIds.length > 0) {
    const firstMajorId = String(vacancy.majorIds[0]);
    const matchedMajor = majors?.find((m) => String(m.id) === firstMajorId);
    resolvedMajorId = matchedMajor ? String(matchedMajor.id) : firstMajorId;
  }

  let resolvedTargetId = "all";
  const vacTarget = vacancy.targetApplicant;
  const vacTargetId = vacancy.targetApplicantId || vacTarget?.id;
  if (vacTarget || vacTargetId) {
    const matchedTarget = targets?.find(
      (t) =>
        (vacTargetId && String(t.id) === String(vacTargetId)) ||
        (vacTarget?.code &&
          t.code?.toLowerCase() === vacTarget.code.toLowerCase()) ||
        (vacTarget?.name &&
          t.name?.toLowerCase() === vacTarget.name.toLowerCase()),
    );
    resolvedTargetId = matchedTarget
      ? String(matchedTarget.id)
      : String(vacTargetId || "all");
  }

  return {
    companyId: resolvedCompanyId,
    position: vacancy.position || vacancy.title || "",
    quota:
      vacancy.quota !== undefined && vacancy.quota !== null
        ? String(vacancy.quota)
        : "",
    deadline: vacancy.deadline ? String(vacancy.deadline).substring(0, 10) : "",
    majorId: resolvedMajorId,
    targetId: resolvedTargetId,
    workLocation: vacancy.workLocation || "",
    qualification: vacancy.qualification || vacancy.description || "",
    sendNotification: false,
  };
}

export function toSubmitJobVacancyPayload(
  values: JobVacancyFormValues,
): Record<string, unknown> {
  const parsedQuota = parseInt(values.quota, 10);
  return {
    company_id: values.companyId,
    position: values.position.trim(),
    title: values.position.trim(),
    quota: parsedQuota > 0 ? parsedQuota : 1,
    deadline: values.deadline,
    work_location: values.workLocation.trim(),
    qualification: values.qualification.trim(),
    send_notification: values.sendNotification,
    major_ids:
      values.majorId && values.majorId !== "all" ? [values.majorId] : [],
    target_applicant_id:
      values.targetId && values.targetId !== "all" ? values.targetId : null,
  };
}

export function useLowonganKerjaForm(
  initialData?: JobVacancy | null,
  majors?: MajorItem[],
  targets?: StandardTypeItem[],
) {
  return useForm<JobVacancyFormValues>({
    resolver: zodResolver(jobVacancyFormSchema),
    defaultValues: toJobVacancyDefaultValues(initialData, majors, targets),
    mode: "onBlur",
  });
}
