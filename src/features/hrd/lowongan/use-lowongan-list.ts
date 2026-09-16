import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/custom/sonner";
import type {
  HrdJobVacancyItem,
  HrdJobVacancyPagination,
} from "./lowongan.schema";
import { hrdLowonganApi } from "./lowongan.api";

interface UseLowonganListProps {
  onVacancyUpdated: () => void;
  onEditVacancy: (item: HrdJobVacancyItem) => void;
}

export function useLowonganList({
  onVacancyUpdated,
  onEditVacancy,
}: UseLowonganListProps) {
  const navigate = useNavigate();
  const [vacanciesData, setVacanciesData] =
    useState<HrdJobVacancyPagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchVacancies = useCallback(async (page = 1, searchQuery = "") => {
    setIsLoading(true);
    try {
      const res = await hrdLowonganApi.getVacancies({
        page,
        search: searchQuery || undefined,
        per_page: 10,
      });
      setVacanciesData(res);
      setCurrentPage(res.current_page);
    } catch {
      toast.error("Gagal memuat daftar lowongan kerja.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      try {
        const res = await hrdLowonganApi.getVacancies({
          page: currentPage,
          search: search || undefined,
          per_page: 10,
        });
        if (isMounted) {
          setVacanciesData(res);
        }
      } catch {
        if (isMounted) {
          toast.error("Gagal memuat daftar lowongan kerja.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, [currentPage, search]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearch(query);
    setCurrentPage(1);
  }, []);

  const handleToggleStatus = useCallback(
    async (item: HrdJobVacancyItem) => {
      const nextActive = !item.isActive;
      setProcessingId(item.id);
      try {
        await hrdLowonganApi.toggleActive(item.id, nextActive);
        toast.success(
          nextActive
            ? "Lowongan kerja berhasil dibuka kembali."
            : "Lowongan kerja berhasil ditutup."
        );
        fetchVacancies(currentPage, search);
        onVacancyUpdated();
      } catch (err: unknown) {
        const apiErr = err as { response?: { data?: { message?: string } } };
        toast.error(
          apiErr.response?.data?.message ||
            (nextActive
              ? "Gagal mengaktifkan lowongan kerja."
              : "Gagal menutup lowongan kerja.")
        );
      } finally {
        setProcessingId(null);
      }
    },
    [currentPage, search, fetchVacancies, onVacancyUpdated]
  );

  const handleViewApplicants = useCallback(
    (item: HrdJobVacancyItem) => {
      navigate(`/hrd/review?vacancy_id=${item.id}`);
    },
    [navigate]
  );

  return {
    vacancies: vacanciesData?.data ?? [],
    pagination: vacanciesData,
    isLoading,
    processingId,
    currentPage,
    search,
    fetchVacancies,
    handlePageChange,
    handleSearchChange,
    handleToggleStatus,
    handleViewApplicants,
    handleEditVacancy: onEditVacancy,
  };
}
