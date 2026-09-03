import { useState, useEffect, useCallback } from "react";
import { api } from "@/api/axios";
import { toast } from "@/components/ui/sonner";
import {
  type Company,
  type MajorItem,
  type StandardTypeItem,
  type JobVacancy,
  type JobVacancyOptionsData,
} from "../types";
import { jobVacancyFormSchema } from "../schemas/schemas";

export interface UseLowonganKerjaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  vacancy?: JobVacancy | null;
  initialCompanies?: Company[];
  initialMajors?: MajorItem[];
  initialTargetApplicants?: StandardTypeItem[];
}

export function useLowonganKerjaForm({
  open,
  onOpenChange,
  onSuccess,
  vacancy,
  initialCompanies,
  initialMajors,
  initialTargetApplicants,
}: UseLowonganKerjaFormProps) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies || []);
  const [majors, setMajors] = useState<MajorItem[]>(initialMajors || []);
  const [targetApplicants, setTargetApplicants] = useState<StandardTypeItem[]>(
    initialTargetApplicants || [],
  );

  const [companyId, setCompanyId] = useState("");
  const [position, setPosition] = useState("");
  const [quota, setQuota] = useState("");
  const [deadline, setDeadline] = useState("");
  const [majorId, setMajorId] = useState("all");
  const [targetId, setTargetId] = useState("all");
  const [workLocation, setWorkLocation] = useState("");
  const [qualification, setQualification] = useState("");
  const [sendNotification, setSendNotification] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleCompanyChange = useCallback(
    (val: string) => {
      setCompanyId(val);
      clearFieldError("companyId");
    },
    [clearFieldError],
  );

  const handlePositionChange = useCallback(
    (val: string) => {
      setPosition(val);
      clearFieldError("position");
    },
    [clearFieldError],
  );

  const handleQuotaChange = useCallback(
    (val: string) => {
      setQuota(val);
      clearFieldError("quota");
    },
    [clearFieldError],
  );

  const handleDeadlineChange = useCallback(
    (val: string) => {
      setDeadline(val);
      clearFieldError("deadline");
    },
    [clearFieldError],
  );

  const handleMajorChange = useCallback(
    (val: string) => {
      setMajorId(val);
      clearFieldError("majorId");
    },
    [clearFieldError],
  );

  const handleTargetChange = useCallback(
    (val: string) => {
      setTargetId(val);
      clearFieldError("targetId");
    },
    [clearFieldError],
  );

  const handleWorkLocationChange = useCallback(
    (val: string) => {
      setWorkLocation(val);
      clearFieldError("workLocation");
    },
    [clearFieldError],
  );

  const handleQualificationChange = useCallback(
    (val: string) => {
      setQualification(val);
      clearFieldError("qualification");
    },
    [clearFieldError],
  );

  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const fetchOptions = useCallback(async () => {
    setIsLoadingOptions(true);
    try {
      const res = await api.get<{ data: JobVacancyOptionsData }>(
        "/admin/job-vacancies/options",
      );
      const data = res.data?.data;
      if (data) {
        if (Array.isArray(data.companies)) setCompanies(data.companies);
        if (Array.isArray(data.majors)) setMajors(data.majors);
        if (Array.isArray(data.targetApplicants))
          setTargetApplicants(data.targetApplicants);
      }
    } catch {
    } finally {
      setIsLoadingOptions(false);
    }
  }, []);

  const [isLoadingData, setIsLoadingData] = useState(false);

  const [activeVacancy, setActiveVacancy] = useState<JobVacancy | null>(
    vacancy ?? null,
  );

  useEffect(() => {
    if (open) {
      setActiveVacancy(vacancy ?? null);
    }
  }, [open, vacancy]);

  const isEditMode = Boolean(activeVacancy?.id);

  const resetForm = useCallback(() => {
    setCompanyId("");
    setPosition("");
    setQuota("");
    setDeadline("");
    setMajorId("all");
    setTargetId("all");
    setWorkLocation("");
    setQualification("");
    setSendNotification(false);
    setErrors({});
    setErrorMsg("");
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initializeForm() {
      if (!open) {
        setIsLoadingData(false);
        return;
      }

      if (vacancy) {
        setIsLoadingData(true);

        if (!initialCompanies || initialCompanies.length === 0) {
          try {
            await fetchOptions();
          } catch {}
        }

        if (!isMounted) return;

        setCompanyId(String(vacancy.companyId || vacancy.company?.id || ""));
        setPosition(vacancy.position || vacancy.title || "");
        setQuota(
          vacancy.quota !== undefined && vacancy.quota !== null
            ? String(vacancy.quota)
            : "",
        );
        setDeadline(
          vacancy.deadline ? String(vacancy.deadline).substring(0, 10) : "",
        );
        setMajorId(
          vacancy.majors && vacancy.majors.length > 0
            ? String(vacancy.majors[0].id)
            : vacancy.majorIds && vacancy.majorIds.length > 0
              ? String(vacancy.majorIds[0])
              : "all",
        );
        setTargetId(
          vacancy.targetApplicantId
            ? String(vacancy.targetApplicantId)
            : vacancy.targetApplicant?.id
              ? String(vacancy.targetApplicant.id)
              : "all",
        );
        setWorkLocation(vacancy.workLocation || "");
        setQualification(vacancy.qualification || vacancy.description || "");
        setSendNotification(false);
        setErrors({});
        setErrorMsg("");

        setTimeout(() => {
          if (isMounted) {
            setIsLoadingData(false);
          }
        }, 200);
      } else {
        setIsLoadingData(false);
        if (!initialCompanies || initialCompanies.length === 0) {
          fetchOptions();
        }
        resetForm();
      }
    }

    initializeForm();

    return () => {
      isMounted = false;
    };
  }, [open, vacancy, initialCompanies, fetchOptions, resetForm]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg("");

      const validationResult = jobVacancyFormSchema.safeParse({
        companyId,
        position,
        quota,
        deadline,
        majorId,
        targetId,
        workLocation,
        qualification,
        sendNotification,
      });

      if (!validationResult.success) {
        const newErrors: Record<string, string> = {};
        for (const issue of validationResult.error.issues) {
          const field = issue.path[0];
          if (field && !newErrors[String(field)]) {
            newErrors[String(field)] = issue.message;
          }
        }
        setErrors(newErrors);
        return;
      }

      setErrors({});
      setIsSubmitting(true);
      try {
        const parsedQuota = parseInt(quota, 10);

        const payload: Record<string, unknown> = {
          company_id: companyId,
          position: position.trim(),
          title: position.trim(),
          quota: parsedQuota > 0 ? parsedQuota : 1,
          deadline: deadline,
          work_location: workLocation.trim(),
          qualification: qualification.trim(),
          send_notification: sendNotification,
          major_ids: majorId && majorId !== "all" ? [majorId] : [],
          target_applicant_id:
            targetId && targetId !== "all" ? targetId : null,
        };

        if (isEditMode && activeVacancy?.id) {
          await api.put(`/admin/job-vacancies/${activeVacancy.id}`, payload);
          toast.success("Lowongan kerja berhasil diperbarui.");
        } else {
          await api.post("/admin/job-vacancies", payload);
          toast.success("Lowongan kerja berhasil dipublikasikan.");
        }

        handleOpenChange(false);
        onSuccess?.();
      } catch (err: unknown) {
        const axiosErr = err as {
          response?: {
            data?: {
              message?: string;
              errors?: Record<string, string[]>;
            };
          };
        };

        if (axiosErr.response?.data?.errors) {
          const backendErrors: Record<string, string> = {};
          const errMap = axiosErr.response.data.errors;
          if (errMap.company_id) backendErrors.companyId = errMap.company_id[0];
          if (errMap.position) backendErrors.position = errMap.position[0];
          if (errMap.quota) backendErrors.quota = errMap.quota[0];
          if (errMap.deadline) backendErrors.deadline = errMap.deadline[0];
          if (errMap.major_ids) backendErrors.majorId = errMap.major_ids[0];
          if (errMap.target_applicant_id)
            backendErrors.targetId = errMap.target_applicant_id[0];
          if (errMap.work_location)
            backendErrors.workLocation = errMap.work_location[0];
          if (errMap.qualification)
            backendErrors.qualification = errMap.qualification[0];
          setErrors(backendErrors);
        }

        setErrorMsg(
          axiosErr.response?.data?.message ||
            (isEditMode
              ? "Terjadi kesalahan saat memperbarui lowongan kerja."
              : "Terjadi kesalahan saat mempublikasikan lowongan kerja."),
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isEditMode,
      activeVacancy,
      companyId,
      position,
      quota,
      deadline,
      majorId,
      targetId,
      workLocation,
      qualification,
      sendNotification,
      handleOpenChange,
      onSuccess,
    ],
  );

  return {
    companies,
    majors,
    targetApplicants,
    companyId,
    setCompanyId: handleCompanyChange,
    position,
    setPosition: handlePositionChange,
    quota,
    setQuota: handleQuotaChange,
    deadline,
    setDeadline: handleDeadlineChange,
    majorId,
    setMajorId: handleMajorChange,
    targetId,
    setTargetId: handleTargetChange,
    workLocation,
    setWorkLocation: handleWorkLocationChange,
    qualification,
    setQualification: handleQualificationChange,
    sendNotification,
    setSendNotification,
    errors,
    isSubmitting,
    isLoadingData,
    isLoadingOptions,
    isEditMode,
    errorMsg,
    resetForm,
    handleOpenChange,
    handleSubmit,
  };
}
