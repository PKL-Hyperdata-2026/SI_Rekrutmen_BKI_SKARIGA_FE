import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "@/components/ui/sonner";
import { lowonganKerjaApi } from "./lowongan-kerja.api";
import type { StudentJobVacancy } from "./lowongan-kerja.card";
import {
  formatDeadlineDate,
  formatMajorsLabel,
  stripHtmlTags,
} from "./lowongan-kerja.card";

interface UseLowonganKerjaFormProps {
  vacancy: StudentJobVacancy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplySuccess?: () => void;
}

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function isApiError(error: unknown): error is ApiErrorResponse {
  if (typeof error !== "object" || error === null) {
    return false;
  }
  return "response" in error;
}

export function parseQualificationLines(text?: string | null): string[] {
  if (!text || !text.trim()) {
    return [];
  }
  const clean = stripHtmlTags(text);
  return clean
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function useLowonganKerjaForm({
  vacancy,
  open,
  onOpenChange,
  onApplySuccess,
}: UseLowonganKerjaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailedVacancy, setDetailedVacancy] =
    useState<StudentJobVacancy | null>(null);

  const fetchDetail = useCallback(async (id: string) => {
    setIsLoadingDetail(true);
    try {
      const data = await lowonganKerjaApi.getVacancyDetail(id);
      if (data) {
        setDetailedVacancy(data);
      }
    } catch {
      setDetailedVacancy(null);
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  useEffect(() => {
    if (open && vacancy?.id) {
      fetchDetail(vacancy.id);
    } else if (!open) {
      setDetailedVacancy(null);
    }
  }, [open, vacancy?.id, fetchDetail]);

  const activeVacancy = detailedVacancy ?? vacancy;
  const hasApplied = Boolean(activeVacancy?.hasApplied);

  const formattedDeadline = useMemo(
    () => formatDeadlineDate(activeVacancy?.deadline),
    [activeVacancy?.deadline],
  );

  const majorsLabel = useMemo(
    () => formatMajorsLabel(activeVacancy?.majors),
    [activeVacancy?.majors],
  );

  const cleanDescription = useMemo(
    () => stripHtmlTags(activeVacancy?.description),
    [activeVacancy?.description],
  );

  const qualificationLines = useMemo(
    () => parseQualificationLines(activeVacancy?.qualification),
    [activeVacancy?.qualification],
  );

  const handleSubmitApplication = useCallback(async () => {
    if (!activeVacancy?.id) {
      toast.error("Data lowongan tidak valid.");
      return;
    }

    if (hasApplied) {
      toast.error("Anda sudah melamar lowongan ini.");
      return;
    }

    setIsSubmitting(true);
    try {
      await lowonganKerjaApi.applyVacancy(activeVacancy.id);
      toast.success("Lamaran berhasil dikirim!");
      setDetailedVacancy((prev) =>
        prev ? { ...prev, hasApplied: true } : null,
      );
      onOpenChange(false);
      onApplySuccess?.();
    } catch (err: unknown) {
      let errorMessage = "Gagal mengirim lamaran. Silakan coba lagi.";
      if (isApiError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [activeVacancy?.id, hasApplied, onOpenChange, onApplySuccess]);

  return {
    activeVacancy,
    hasApplied,
    isSubmitting,
    isLoadingDetail,
    formattedDeadline,
    majorsLabel,
    cleanDescription,
    qualificationLines,
    handleSubmitApplication,
  };
}
