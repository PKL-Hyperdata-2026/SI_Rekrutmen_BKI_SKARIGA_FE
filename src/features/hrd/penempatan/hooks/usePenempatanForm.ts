import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/api/axios";
import { toast } from "@/components/custom/sonner";
import { useAppSelector } from "@/hooks/useApp";
import {
  jobPlacementFormSchema,
  type PenempatanCompanyOption,
  type PenempatanStudentOption,
  type PenempatanFormOptionsData,
  type JobPlacement,
} from "../types/penempatan-schema";
import { type SearchableSelectOption } from "@/components/ui/searchable-select";

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

export interface UsePenempatanFormOptions {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  placement?: JobPlacement | null;
  initialCompanies?: PenempatanCompanyOption[];
  initialStudentsAlumni?: PenempatanStudentOption[];
}

export interface JobPlacementPayload {
  student_alumni_id: string;
  position: string;
  accepted_date: string;
  start_date: string;
  company_id?: string;
}

export function usePenempatanForm({
  open,
  onOpenChange,
  onSuccess,
  placement,
  initialCompanies,
  initialStudentsAlumni,
}: UsePenempatanFormOptions) {
  const authUser = useAppSelector((state) => state.auth?.user);
  const isEditMode = Boolean(placement);

  const [studentAlumniId, setStudentAlumniId] = useState("");
  const [companyId, setCompanyId] = useState(
    authUser?.company?.id ? String(authUser.company.id) : "",
  );
  const [position, setPosition] = useState("");
  const [acceptedDate, setAcceptedDate] = useState("");
  const [startDate, setStartDate] = useState("");

  const [companies, setCompanies] = useState<PenempatanCompanyOption[]>(
    initialCompanies || [],
  );
  const [studentsAlumni, setStudentsAlumni] = useState<
    PenempatanStudentOption[]
  >(initialStudentsAlumni || []);

  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = useCallback(() => {
    setStudentAlumniId("");
    setCompanyId(authUser?.company?.id ? String(authUser.company.id) : "");
    setPosition("");
    setAcceptedDate("");
    setStartDate("");
    setErrors({});
  }, [authUser?.company?.id]);

  const fetchOptions = useCallback(async () => {
    setIsLoadingOptions(true);
    try {
      const response = await api.get<{
        success: boolean;
        data: PenempatanFormOptionsData;
      }>("/admin/job-placements/options");

      const data = response.data?.data;
      if (data) {
        if (Array.isArray(data.companies)) {
          setCompanies(data.companies);
        }
        if (Array.isArray(data.students_alumni)) {
          setStudentsAlumni(data.students_alumni);
        }
      }
    } catch {
    } finally {
      setIsLoadingOptions(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      if (placement) {
        setStudentAlumniId(
          String(
            placement.studentAlumniId || placement.studentAlumni?.id || "",
          ),
        );
        setCompanyId(
          String(
            placement.companyId ||
              placement.company?.id ||
              authUser?.company?.id ||
              "",
          ),
        );
        setPosition(placement.position || "");
        setAcceptedDate(placement.acceptedDate || "");
        setStartDate(placement.startDate || "");
      } else {
        resetForm();
      }
      fetchOptions();
    } else {
      resetForm();
    }
  }, [open, placement, fetchOptions, resetForm, authUser?.company?.id]);

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleStudentChange = useCallback(
    (val: string) => {
      setStudentAlumniId(val);
      clearFieldError("studentAlumniId");
    },
    [clearFieldError],
  );

  const handleCompanyChange = useCallback(
    (val: string) => {
      setCompanyId(val);
      clearFieldError("companyId");
    },
    [clearFieldError],
  );

  const handlePositionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | string) => {
      const val = typeof e === "string" ? e : e.target.value;
      setPosition(val);
      clearFieldError("position");
    },
    [clearFieldError],
  );

  const handleAcceptedDateChange = useCallback(
    (val: string) => {
      setAcceptedDate(val);
      clearFieldError("acceptedDate");
    },
    [clearFieldError],
  );

  const handleStartDateChange = useCallback(
    (val: string) => {
      setStartDate(val);
      clearFieldError("startDate");
    },
    [clearFieldError],
  );

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

  const studentOptions: SearchableSelectOption[] = useMemo(() => {
    return studentsAlumni.map((s) => ({
      value: String(s.id),
      label: s.fullName
        ? s.majorName
          ? `${s.fullName} (${s.majorName})`
          : s.fullName
        : `Pelamar #${s.id}`,
    }));
  }, [studentsAlumni]);

  const companyOptions: SearchableSelectOption[] = useMemo(() => {
    return companies.map((c) => ({
      value: String(c.id),
      label: c.name,
    }));
  }, [companies]);

  const validate = useCallback((): boolean => {
    const result = jobPlacementFormSchema.safeParse({
      studentAlumniId,
      companyId,
      position,
      acceptedDate,
      startDate,
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

    setErrors({});
    return true;
  }, [studentAlumniId, companyId, position, acceptedDate, startDate]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!validate()) return;

      setIsSubmitting(true);

      try {
        const resolvedCompanyId =
          authUser?.role === "hrd" && authUser?.company?.id
            ? String(authUser.company.id)
            : companyId ||
              (authUser?.company?.id ? String(authUser.company.id) : undefined);

        const payload: JobPlacementPayload = {
          student_alumni_id: studentAlumniId,
          position: position.trim(),
          accepted_date: acceptedDate,
          start_date: startDate,
        };

        if (resolvedCompanyId) {
          payload.company_id = resolvedCompanyId;
        }

        if (isEditMode && placement?.id) {
          await api.put(`/admin/job-placements/${placement.id}`, payload);
          toast.success("Data penempatan kerja berhasil diperbarui.");
        } else {
          await api.post("/admin/job-placements", payload);
          toast.success("Data penempatan kerja berhasil disimpan.");
        }

        onSuccess?.();
        handleOpenChange(false);
      } catch (err: unknown) {
        let msg = "Terjadi kesalahan sistem saat menyimpan data.";
        if (isApiError(err)) {
          msg =
            err.response?.data?.message || "Gagal menyimpan penempatan kerja.";
          const apiErrors = err.response?.data?.errors;
          if (apiErrors) {
            const mappedErrors: Record<string, string> = {};
            const keyMap: Record<string, string> = {
              student_alumni_id: "studentAlumniId",
              company_id: "companyId",
              position: "position",
              accepted_date: "acceptedDate",
              start_date: "startDate",
            };
            for (const [key, msgs] of Object.entries(apiErrors)) {
              if (Array.isArray(msgs) && msgs.length > 0) {
                const targetKey = keyMap[key] || key;
                mappedErrors[targetKey] = msgs[0];
              }
            }
            setErrors(mappedErrors);
          }
        }
        toast.error(msg, {
          title: isEditMode ? "Gagal Memperbarui Data" : "Gagal Menyimpan Data",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      validate,
      studentAlumniId,
      companyId,
      authUser?.role,
      authUser?.company?.id,
      position,
      acceptedDate,
      startDate,
      isEditMode,
      placement?.id,
      onSuccess,
      handleOpenChange,
    ],
  );

  const title = isEditMode ? "Edit Penempatan Kerja" : "Form Penempatan Kerja";
  const description = isEditMode
    ? "Perbarui informasi penempatan kerja."
    : "Lengkapi informasi penempatan untuk pendataan.";

  const submitButtonText = useMemo(() => {
    if (isSubmitting) {
      return isEditMode ? "Menyimpan Perubahan..." : "Menyimpan...";
    }
    return isEditMode ? "Perbarui Data" : "Simpan Data";
  }, [isSubmitting, isEditMode]);

  const hasError = useCallback(
    (field: string) => Boolean(errors[field]),
    [errors],
  );

  return {
    studentAlumniId,
    setStudentAlumniId: handleStudentChange,
    companyId,
    setCompanyId: handleCompanyChange,
    position,
    setPosition: handlePositionChange,
    acceptedDate,
    setAcceptedDate: handleAcceptedDateChange,
    startDate,
    setStartDate: handleStartDateChange,
    companies,
    studentsAlumni,
    studentOptions,
    companyOptions,
    isLoadingOptions,
    isSubmitting,
    isEditMode,
    title,
    description,
    submitButtonText,
    errors,
    hasError,
    handleOpenChange,
    handleCancel,
    handleSubmit,
    resetForm,
  };
}
