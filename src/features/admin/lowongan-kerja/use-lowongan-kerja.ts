import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLowonganKerjaFilter } from "./lowongan-kerja.filter";
import { type JobVacancy } from "./lowongan-kerja.schema";
import { lowonganKerjaApi } from "./lowongan-kerja.api";
import { toast } from "@/components/custom/sonner";

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
  const navigate = useNavigate();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailVacancy, setDetailVacancy] = useState<JobVacancy | null>(null);

  const detailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filter = useLowonganKerjaFilter();

  const handleCreate = useCallback(() => {
    navigate("/admin/lowongan/create");
  }, [navigate]);

  const handleView = useCallback((item: JobVacancy) => {
    if (detailTimerRef.current) {
      clearTimeout(detailTimerRef.current);
      detailTimerRef.current = null;
    }
    setDetailVacancy(item);
    setIsDetailOpen(true);
  }, []);

  const handleDetailOpenChange = useCallback((open: boolean) => {
    if (detailTimerRef.current) {
      clearTimeout(detailTimerRef.current);
      detailTimerRef.current = null;
    }
    setIsDetailOpen(open);
    if (!open) {
      detailTimerRef.current = setTimeout(() => {
        setDetailVacancy(null);
      }, 260);
    }
  }, []);

  const handleDeleteVacancy = useCallback(
    async (item: JobVacancy) => {
      try {
        await lowonganKerjaApi.deleteVacancy(item.id);
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
    isDetailOpen,
    detailVacancy,
    handleCreate,
    handleView,
    handleDetailOpenChange,
    handleDeleteVacancy,
    ...filter,
  };
}
