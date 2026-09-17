import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "@/components/custom/sonner";
import type {
  HrdJobVacancyItem,
  HrdJobVacancyPagination,
} from "./lowongan.schema";
import { hrdLowonganApi } from "./lowongan.api";

export type LowonganStatusFilter = "" | "active" | "closed";

interface UseLowonganListProps {
  onVacancyUpdated: () => void;
  onEditVacancy: (item: HrdJobVacancyItem) => void;
}

function isPastDeadline(deadline: string | null | undefined): boolean {
  if (!deadline) return false;
  try {
    const cleanStr = deadline.split("T")[0];
    const todayStr = new Date().toLocaleDateString("en-CA");
    return cleanStr < todayStr;
  } catch {
    return false;
  }
}

function isAbortError(err: unknown): boolean {
  if (axios.isCancel(err)) return true;
  const error = err as { name?: string; code?: string };
  return (
    error?.name === "CanceledError" ||
    error?.name === "AbortError" ||
    error?.code === "ERR_CANCELED"
  );
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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LowonganStatusFilter>("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const isFirstSearchRender = useRef(true);
  const lastFetchedParamsRef = useRef<{
    page: number;
    search: string;
    status: LowonganStatusFilter;
  }>({
    page: 0,
    search: "",
    status: "",
  });

  // Dedicated unmount cleanup effect
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Debounce search query by 350ms and reset page on debounced search update
  useEffect(() => {
    if (isFirstSearchRender.current) {
      isFirstSearchRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage((prev) => (prev !== 1 ? 1 : prev));
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // Unified single fetch routine
  const fetchVacancies = useCallback(
    async (
      page: number = currentPage,
      searchQuery: string = debouncedSearch,
      status: LowonganStatusFilter = statusFilter
    ) => {
      lastFetchedParamsRef.current = {
        page,
        search: searchQuery,
        status,
      };

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      try {
        const queryParams: {
          page: number;
          search?: string;
          per_page: number;
          is_active?: boolean;
        } = {
          page,
          search: searchQuery.trim() || undefined,
          per_page: 10,
        };

        if (status === "active") {
          queryParams.is_active = true;
        } else if (status === "closed") {
          queryParams.is_active = false;
        }

        const res = await hrdLowonganApi.getVacancies(queryParams, {
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setVacanciesData(res);
          if (page !== currentPage) {
            setCurrentPage(page);
          }
        }
      } catch (err: unknown) {
        if (isAbortError(err)) {
          return;
        }
        toast.error("Gagal memuat daftar lowongan kerja.");
      } finally {
        if (abortControllerRef.current === controller) {
          setIsLoading(false);
        }
      }
    },
    [currentPage, debouncedSearch, statusFilter]
  );

  // Main effect coordinating with debouncedSearch, currentPage, and statusFilter
  useEffect(() => {
    if (
      lastFetchedParamsRef.current.page === currentPage &&
      lastFetchedParamsRef.current.search === debouncedSearch &&
      lastFetchedParamsRef.current.status === statusFilter
    ) {
      return;
    }

    void fetchVacancies(currentPage, debouncedSearch, statusFilter);
  }, [currentPage, debouncedSearch, statusFilter, fetchVacancies]);

  const handlePageChange = useCallback((page: number) => {
    abortControllerRef.current?.abort();
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearch(query);
  }, []);

  const handleStatusFilterChange = useCallback((status: LowonganStatusFilter) => {
    abortControllerRef.current?.abort();
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const handleToggleStatus = useCallback(
    async (item: HrdJobVacancyItem) => {
      const nextActive = !item.isActive;

      // Closing active vacancy is always permitted.
      // Past deadline check only intercepts when activating.
      if (nextActive && isPastDeadline(item.deadline)) {
        toast.error(
          "Batas pendaftaran lowongan ini telah berakhir. Perbarui tanggal batas pendaftaran untuk mengaktifkan kembali."
        );
        onEditVacancy(item);
        return;
      }

      setProcessingId(item.id);
      try {
        await hrdLowonganApi.toggleActive(item.id, nextActive);
        toast.success(
          nextActive
            ? "Lowongan kerja berhasil dibuka kembali."
            : "Lowongan kerja berhasil ditutup."
        );
        await fetchVacancies(currentPage, debouncedSearch, statusFilter);
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
    [
      currentPage,
      debouncedSearch,
      statusFilter,
      fetchVacancies,
      onEditVacancy,
      onVacancyUpdated,
    ]
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
    statusFilter,
    fetchVacancies,
    handlePageChange,
    handleSearchChange,
    handleStatusFilterChange,
    handleToggleStatus,
    handleViewApplicants,
    handleEditVacancy: onEditVacancy,
  };
}
