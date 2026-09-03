import { useState, useCallback } from "react";
import { useLowonganKerjaFilter } from "./useLowonganKerjaFilter";
import { type JobVacancy } from "../types";
import { api } from "@/api/axios";
import { toast } from "@/components/ui/sonner";

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function isApiError(err: unknown): err is ApiErrorResponse {
  return typeof err === "object" && err !== null && "response" in err;
}

export function useLowonganKerja() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState<JobVacancy | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailVacancy, setDetailVacancy] = useState<JobVacancy | null>(null);

  const filter = useLowonganKerjaFilter();

  const handleOpenCreate = useCallback(() => {
    setSelectedVacancy(null);
    setIsFormOpen(true);
  }, []);

  const handleView = useCallback((item: JobVacancy) => {
    setDetailVacancy(item);
    setIsDetailOpen(true);
  }, []);

  const handleEdit = useCallback((item: JobVacancy) => {
    setSelectedVacancy(item);
    setIsFormOpen(true);
  }, []);

  const handleFormOpenChange = useCallback((open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setTimeout(() => {
        setSelectedVacancy(null);
      }, 350);
    }
  }, []);

  const handleDetailOpenChange = useCallback((open: boolean) => {
    setIsDetailOpen(open);
    if (!open) {
      setTimeout(() => {
        setDetailVacancy(null);
      }, 350);
    }
  }, []);

  const handleDeleteVacancy = useCallback(
    async (item: JobVacancy) => {
      try {
        await api.delete(`/admin/job-vacancies/${item.id}`);
        toast.success("Lowongan kerja berhasil dihapus.");
        filter.refetchVacancies();
      } catch (err: unknown) {
        if (isApiError(err)) {
          toast.error(
            err.response?.data?.message || "Gagal menghapus lowongan kerja.",
          );
        } else {
          toast.error("Gagal menghapus lowongan kerja.");
        }
      }
    },
    [filter],
  );

  return {
    isFormOpen,
    selectedVacancy,
    isDetailOpen,
    detailVacancy,
    handleOpenCreate,
    handleView,
    handleEdit,
    handleFormOpenChange,
    handleDetailOpenChange,
    handleDeleteVacancy,
    ...filter,
  };
}
