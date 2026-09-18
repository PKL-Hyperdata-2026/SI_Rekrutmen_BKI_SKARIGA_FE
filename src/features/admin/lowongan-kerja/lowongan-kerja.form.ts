import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/custom/sonner";
import {
  jobVacancyFormSchema,
  isHtmlEmpty,
  type JobVacancyFormValues,
  type JobVacancy,
  type MajorItem,
  type StandardTypeItem,
} from "./lowongan-kerja.schema";
import { lowonganKerjaApi } from "./lowongan-kerja.api";

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

function isJobVacancyFormField(
  field: string,
): field is keyof JobVacancyFormValues {
  return (
    field === "companyId" ||
    field === "position" ||
    field === "quota" ||
    field === "deadline" ||
    field === "majorId" ||
    field === "targetId" ||
    field === "workLocation" ||
    field === "description" ||
    field === "qualification" ||
    field === "sendNotification"
  );
}

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
      targetId: "",
      workLocation: "",
      description: "",
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

  let resolvedTargetId = "";
  const vacTarget = vacancy?.targetApplicant;
  const vacTargetId = vacancy?.targetApplicantId || vacTarget?.id;
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
      : String(vacTargetId || "");
  } else if (vacancy && targets && targets.length > 0) {
    const defaultBoth = targets.find((t) => t.code === "class_12_and_alumni");
    resolvedTargetId = defaultBoth ? String(defaultBoth.id) : "";
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
    description: vacancy.description || "",
    qualification: vacancy.qualification || "",
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
    description:
      values.description && !isHtmlEmpty(values.description)
        ? values.description.trim()
        : null,
    qualification:
      values.qualification && !isHtmlEmpty(values.qualification)
        ? values.qualification.trim()
        : "",
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

export function useLowonganKerjaFormPage(customId?: string) {
  const { id: routeId } = useParams<{ id: string }>();
  const vacancyId = customId || routeId;
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate("/admin/lowongan");
  }, [navigate]);

  const [majors, setMajors] = useState<MajorItem[]>([]);
  const [targetApplicants, setTargetApplicants] = useState<StandardTypeItem[]>(
    [],
  );
  const [companyFallbackLabel, setCompanyFallbackLabel] = useState<
    string | undefined
  >(undefined);
  const [loadedVacancyId, setLoadedVacancyId] = useState<
    string | number | null
  >(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isEditMode = Boolean(vacancyId);

  const form = useLowonganKerjaForm(null, majors, targetApplicants);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
    control,
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
      setErrorMsg("");

      if (!vacancyId) {
        setCompanyFallbackLabel(undefined);
        setIsLoadingData(true);
        const optionsRes = await fetchOptions();
        if (!isMounted) return;
        const resolvedMajors = optionsRes?.majors ?? [];
        const resolvedTargets = optionsRes?.targetApplicants ?? [];
        reset(toJobVacancyDefaultValues(null, resolvedMajors, resolvedTargets));
        setIsLoadingData(false);
        return;
      }

      setIsLoadingData(true);
      try {
        const [optionsRes, vacancyRes] = await Promise.all([
          fetchOptions(),
          lowonganKerjaApi.getVacancyDetail(vacancyId),
        ]);

        if (!isMounted) return;

        if (vacancyRes) {
          setLoadedVacancyId(vacancyRes.id);
          const resolvedMajors = optionsRes?.majors ?? [];
          const resolvedTargets = optionsRes?.targetApplicants ?? [];

          const companyName = vacancyRes.company?.name;
          if (companyName) {
            setCompanyFallbackLabel(companyName);
          }

          reset(
            toJobVacancyDefaultValues(
              vacancyRes,
              resolvedMajors,
              resolvedTargets,
            ),
          );
        } else {
          setErrorMsg("Data lowongan tidak ditemukan.");
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        if (isApiError(err)) {
          setErrorMsg(
            err.response?.data?.message || "Gagal memuat data lowongan kerja.",
          );
        } else {
          setErrorMsg("Gagal memuat data lowongan kerja.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [vacancyId, fetchOptions, reset]);

  const onFormSubmit = handleSubmit(async (values: JobVacancyFormValues) => {
    setErrorMsg("");
    clearErrors();

    try {
      const payload = toSubmitJobVacancyPayload(values);

      if (isEditMode) {
        const targetIdToUpdate = loadedVacancyId || vacancyId;
        if (!targetIdToUpdate) {
          toast.error("ID lowongan tidak valid");
          return;
        }
        await lowonganKerjaApi.updateVacancy(targetIdToUpdate, payload);
        toast.success("Lowongan kerja berhasil diperbarui.");
      } else {
        await lowonganKerjaApi.createVacancy(payload);
        toast.success("Lowongan kerja berhasil ditambahkan.");
      }
      navigate("/admin/lowongan");
    } catch (err: unknown) {
      if (isApiError(err)) {
        const responseData = err.response?.data;
        if (responseData?.errors) {
          Object.entries(responseData.errors).forEach(([field, msgs]) => {
            const mappedKey =
              field === "company_id"
                ? "companyId"
                : field === "work_location"
                  ? "workLocation"
                  : field === "major_ids"
                    ? "majorId"
                    : field === "target_applicant_id"
                      ? "targetId"
                      : field;

            if (isJobVacancyFormField(mappedKey) && msgs && msgs[0]) {
              setError(mappedKey, { type: "manual", message: msgs[0] });
            }
          });
        }
        setErrorMsg(
          responseData?.message || "Terjadi kesalahan saat menyimpan data.",
        );
        toast.error(
          responseData?.message || "Terjadi kesalahan saat menyimpan data.",
        );
      } else {
        setErrorMsg("Terjadi kesalahan jaringan.");
        toast.error("Terjadi kesalahan jaringan.");
      }
    }
  });

  return {
    isEditMode,
    isLoadingData,
    isLoadingOptions,
    errorMsg,
    register,
    setValue,
    companyId,
    deadline,
    majorId,
    targetId,
    sendNotification,
    companyFallbackLabel,
    setCompanyFallbackLabel,
    majors,
    targetApplicants,
    errors,
    control,
    isSubmitting,
    onFormSubmit,
    handleBack,
    getCompanies: lowonganKerjaApi.getCompanies,
  };
}
