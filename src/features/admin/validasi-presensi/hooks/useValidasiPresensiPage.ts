import { useState, useCallback, useEffect, useMemo } from "react";
import { api } from "@/api/axios";
import { toast } from "@/components/custom/sonner";
import {
  vacancyOptionsResponseSchema,
  type VacancyOption,
  cleanVacancyTitle,
} from "../types/validasi-presensi-schema";
import { useValidasiPresensiTable } from "./useValidasiPresensiTable";
import { useValidasiPresensiTableLog } from "./useValidasiPresensiTableLog";

export interface FormattedVacancyOption {
  id: string;
  positionTitle: string;
  companyName: string;
}

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

export function useValidasiPresensiPage() {
  const [selectedVacancy, setSelectedVacancy] = useState<string>("all");
  const [vacancies, setVacancies] = useState<VacancyOption[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const fetchVacancies = useCallback(async () => {
    try {
      const res = await api.get("/admin/attendances/vacancies");
      const parsed = vacancyOptionsResponseSchema.safeParse(res.data);
      if (parsed.success) {
        setVacancies(parsed.data.data);
      }
    } catch (err: unknown) {
      if (isApiError(err)) {
        toast.error(
          err.response?.data?.message || "Gagal memuat opsi lowongan.",
        );
      }
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    api
      .get("/admin/attendances/vacancies")
      .then((res) => {
        if (!ignore) {
          const parsed = vacancyOptionsResponseSchema.safeParse(res.data);
          if (parsed.success) {
            setVacancies(parsed.data.data);
          }
        }
      })
      .catch((err: unknown) => {
        if (!ignore && isApiError(err)) {
          toast.error(
            err.response?.data?.message || "Gagal memuat opsi lowongan.",
          );
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchVacancies();
      setRefreshKey((prev) => prev + 1);
      toast.success("Data presensi berhasil diperbarui.");
    } catch {
      toast.error("Gagal memperbarui data presensi.");
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchVacancies]);

  const formattedVacancies = useMemo<FormattedVacancyOption[]>(() => {
    return vacancies
      .map((vacancy) => ({
        id: String(vacancy.id),
        positionTitle: cleanVacancyTitle(vacancy.title),
        companyName: vacancy.company_name?.trim() || "",
      }))
      .sort((a, b) => {
        const companyComparison = a.companyName.localeCompare(
          b.companyName,
          "id",
          {
            sensitivity: "base",
          },
        );
        if (companyComparison !== 0) return companyComparison;
        return a.positionTitle.localeCompare(b.positionTitle, "id", {
          sensitivity: "base",
        });
      });
  }, [vacancies]);

  const table = useValidasiPresensiTable({
    selectedVacancy,
    refreshKey,
    onValidated: handleRefresh,
  });

  const tableLog = useValidasiPresensiTableLog({
    selectedVacancy,
    refreshKey,
  });

  const refreshButtonText = isRefreshing ? "Memperbarui..." : "Refresh Data";

  return {
    selectedVacancy,
    setSelectedVacancy,
    formattedVacancies,
    isRefreshing,
    handleRefresh,
    refreshButtonText,
    table,
    tableLog,
  };
}
