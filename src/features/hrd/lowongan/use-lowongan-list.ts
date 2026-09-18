import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "@/components/custom/sonner";
import type {
  HrdJobVacancyItem,
  HrdJobVacancyPagination,
  VacancyEffectiveStatusFilter,
  VacancySortOption,
} from "./lowongan.schema";
import { hrdLowonganApi } from "./lowongan.api";
import { isPastDeadline } from "./lowongan-status";

export type LowonganStatusFilter = VacancyEffectiveStatusFilter;
export type LowonganSortOption = VacancySortOption;

export interface UseLowonganListProps {
  onVacancyUpdated: () => void;
  onEditVacancy: (item: HrdJobVacancyItem) => void;
}

export function buildReviewLink(id: string | number): string {
  return `/hrd/review?vacancy_id=${encodeURIComponent(String(id))}`;
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
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LowonganStatusFilter>("");
  const [majorFilter, setMajorFilter] = useState<string>("");
  const [targetFilter, setTargetFilter] = useState<string>("");
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("");
  const [sort, setSort] = useState<LowonganSortOption>("newest");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const vacancies = vacanciesData?.data ?? [];

  const abortControllerRef = useRef<AbortController | null>(null);
  const isFirstSearchRender = useRef(true);
  const lastFetchedParamsRef = useRef<{
    page: number;
    search: string;
    status: LowonganStatusFilter;
    major: string;
    target: string;
    jobType: string;
    sort: LowonganSortOption;
  }>({
    page: 0,
    search: "",
    status: "",
    major: "",
    target: "",
    jobType: "",
    sort: "newest",
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

  // Unified single fetch routine.
  // lastFetchedParamsRef only updates on success. Updating it at fetch start
  // breaks the initial load under StrictMode remount: the first fetch gets
  // aborted on cleanup, but the guard already marks its params as fetched,
  // so the second effect run skips the retry and the list stays empty.
  const fetchVacancies = useCallback(
    async (
      page: number = currentPage,
      searchQuery: string = debouncedSearch,
      status: LowonganStatusFilter = statusFilter,
      major: string = majorFilter,
      target: string = targetFilter,
      jobType: string = jobTypeFilter,
      sortOpt: LowonganSortOption = sort
    ) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setFetchError(null);
      try {
        const queryParams: {
          page: number;
          per_page: number;
          search?: string;
          effective_status?: LowonganStatusFilter;
          sort?: LowonganSortOption;
          major_id?: string;
          target_applicant_id?: string;
          job_type_id?: string;
        } = {
          page,
          per_page: 10,
        };

        if (searchQuery.trim()) {
          queryParams.search = searchQuery.trim();
        }

        // Effective status and sort run server-side. The backend covers
        // the whole dataset, so no client-side narrowing is needed.
        if (status) {
          queryParams.effective_status = status;
        }
        queryParams.sort = sortOpt;

        if (major) {
          queryParams.major_id = major;
        }

        if (target) {
          queryParams.target_applicant_id = target;
        }

        if (jobType) {
          queryParams.job_type_id = jobType;
        }

        const res = await hrdLowonganApi.getVacancies(queryParams, {
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setVacanciesData(res);
          lastFetchedParamsRef.current = {
            page,
            search: searchQuery,
            status,
            major,
            target,
            jobType,
            sort: sortOpt,
          };
          if (page !== currentPage) {
            setCurrentPage(page);
          }
        }
      } catch (err: unknown) {
        if (isAbortError(err)) {
          return;
        }
        setFetchError("Gagal memuat daftar lowongan kerja.");
        toast.error("Gagal memuat daftar lowongan kerja.");
      } finally {
        if (abortControllerRef.current === controller) {
          setIsLoading(false);
        }
      }
    },
    [
      currentPage,
      debouncedSearch,
      statusFilter,
      majorFilter,
      targetFilter,
      jobTypeFilter,
      sort,
    ]
  );

  // Main effect coordinating with debouncedSearch, currentPage, and all filters
  useEffect(() => {
    if (
      lastFetchedParamsRef.current.page === currentPage &&
      lastFetchedParamsRef.current.search === debouncedSearch &&
      lastFetchedParamsRef.current.status === statusFilter &&
      lastFetchedParamsRef.current.major === majorFilter &&
      lastFetchedParamsRef.current.target === targetFilter &&
      lastFetchedParamsRef.current.jobType === jobTypeFilter &&
      lastFetchedParamsRef.current.sort === sort
    ) {
      return;
    }

    void fetchVacancies(
      currentPage,
      debouncedSearch,
      statusFilter,
      majorFilter,
      targetFilter,
      jobTypeFilter,
      sort
    );
  }, [
    currentPage,
    debouncedSearch,
    statusFilter,
    majorFilter,
    targetFilter,
    jobTypeFilter,
    sort,
    fetchVacancies,
  ]);

  const handlePageChange = useCallback((page: number) => {
    abortControllerRef.current?.abort();
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearch(query);
  }, []);

  const handleClearSearch = useCallback(() => {
    abortControllerRef.current?.abort();
    setSearch("");
    setDebouncedSearch("");
    setCurrentPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((status: LowonganStatusFilter) => {
    abortControllerRef.current?.abort();
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const handleMajorFilterChange = useCallback((majorId: string) => {
    abortControllerRef.current?.abort();
    setMajorFilter(majorId);
    setCurrentPage(1);
  }, []);

  const handleTargetFilterChange = useCallback((targetId: string) => {
    abortControllerRef.current?.abort();
    setTargetFilter(targetId);
    setCurrentPage(1);
  }, []);

  const handleJobTypeFilterChange = useCallback((jobTypeId: string) => {
    abortControllerRef.current?.abort();
    setJobTypeFilter(jobTypeId);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((nextSort: LowonganSortOption) => {
    abortControllerRef.current?.abort();
    setSort(nextSort);
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    abortControllerRef.current?.abort();
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("");
    setMajorFilter("");
    setTargetFilter("");
    setJobTypeFilter("");
    setSort("newest");
    setFetchError(null);
    setCurrentPage(1);
  }, []);

  const handleRetry = useCallback(() => {
    void fetchVacancies(
      currentPage,
      debouncedSearch,
      statusFilter,
      majorFilter,
      targetFilter,
      jobTypeFilter,
      sort
    );
  }, [
    fetchVacancies,
    currentPage,
    debouncedSearch,
    statusFilter,
    majorFilter,
    targetFilter,
    jobTypeFilter,
    sort,
  ]);

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
        await fetchVacancies(
          currentPage,
          debouncedSearch,
          statusFilter,
          majorFilter,
          targetFilter,
          jobTypeFilter,
          sort
        );
        onVacancyUpdated();
      } catch (err: unknown) {
        const apiErr = err as { response?: { data?: { message?: string } } };
        toast.error(
          apiErr.response?.data?.message ||
            (nextActive
              ? "Gagal mengaktifkan lowongan kerja."
              : "Gagal menutup lowongan kerja.")
        );
        throw err;
      } finally {
        setProcessingId(null);
      }
    },
    [
      currentPage,
      debouncedSearch,
      statusFilter,
      majorFilter,
      targetFilter,
      jobTypeFilter,
      sort,
      fetchVacancies,
      onEditVacancy,
      onVacancyUpdated,
    ]
  );

  const handleReopenVacancy = useCallback(
    async (item: HrdJobVacancyItem, newDeadline?: string) => {
      const trimmedDeadline = (newDeadline ?? "").trim();
      if (trimmedDeadline) {
        setProcessingId(item.id);
        try {
          await hrdLowonganApi.updateVacancy(item.id, {
            deadline: trimmedDeadline,
          });
          toast.success("Batas pendaftaran berhasil diperbarui.");
        } catch (err: unknown) {
          const apiErr = err as {
            response?: { data?: { message?: string } };
          };
          toast.error(
            apiErr.response?.data?.message ||
              "Gagal memperbarui batas pendaftaran."
          );
          setProcessingId(null);
          throw err;
        }
        setProcessingId(null);
      }
      await handleToggleStatus({
        ...item,
        deadline: trimmedDeadline || item.deadline,
      });
    },
    [handleToggleStatus]
  );

  const handleDeleteVacancy = useCallback(
    async (item: HrdJobVacancyItem) => {
      setProcessingId(item.id);
      try {
        const res = await hrdLowonganApi.deleteVacancy(item.id);
        toast.success(res.message || "Lowongan kerja berhasil dihapus.");
        const targetPage =
          vacancies.length === 1 && currentPage > 1
            ? currentPage - 1
            : currentPage;

        await fetchVacancies(
          targetPage,
          debouncedSearch,
          statusFilter,
          majorFilter,
          targetFilter,
          jobTypeFilter,
          sort
        );
        onVacancyUpdated();
      } catch (err: unknown) {
        const apiErr = err as { response?: { data?: { message?: string } } };
        toast.error(
          apiErr.response?.data?.message || "Gagal menghapus lowongan kerja."
        );
        throw err;
      } finally {
        setProcessingId(null);
      }
    },
    [
      vacancies.length,
      currentPage,
      debouncedSearch,
      statusFilter,
      majorFilter,
      targetFilter,
      jobTypeFilter,
      sort,
      fetchVacancies,
      onVacancyUpdated,
    ]
  );

  const handleViewApplicants = useCallback(
    (item: HrdJobVacancyItem) => {
      navigate(buildReviewLink(item.id));
    },
    [navigate]
  );

  return {
    vacancies,
    pagination: vacanciesData,
    isLoading,
    fetchError,
    processingId,
    currentPage,
    search,
    statusFilter,
    majorFilter,
    targetFilter,
    jobTypeFilter,
    sort,
    fetchVacancies,
    handlePageChange,
    handleSearchChange,
    handleClearSearch,
    handleStatusFilterChange,
    handleMajorFilterChange,
    handleTargetFilterChange,
    handleJobTypeFilterChange,
    handleSortChange,
    handleResetFilters,
    handleRetry,
    handleToggleStatus,
    handleReopenVacancy,
    handleDeleteVacancy,
    handleViewApplicants,
    handleEditVacancy: onEditVacancy,
  };
}
