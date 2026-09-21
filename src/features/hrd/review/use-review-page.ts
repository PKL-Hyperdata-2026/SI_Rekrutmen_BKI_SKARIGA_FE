import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "@/components/custom/sonner";
import { reviewApi } from "./review.api";
import { filterSelectableIds, isSelectableRow } from "./review.status";
import {
  toBulkReviewPayload,
  toReviewPayload,
  type ReviewApplicant,
  type ReviewDecision,
  type ReviewDecisionValues,
  type ReviewFilterOptions,
  type ReviewStatusFilter,
  type ReviewSummary,
} from "./review.schema";

export interface ReviewBulkPreviewItem {
  id: string;
  name: string;
  position: string;
}

export interface ReviewConfirmState {
  mode: "single" | "bulk";
  decision: ReviewDecision;
  applicant: ReviewApplicant | null;
  bulkIds: string[];
  bulkPreview: ReviewBulkPreviewItem[];
}

const DEFAULT_SUMMARY: ReviewSummary = {
  total: 0,
  perlu_review: 0,
  lolos_berkas: 0,
  ditolak: 0,
};

const DEFAULT_OPTIONS: ReviewFilterOptions = {
  vacancies: [],
  review_statuses: [],
};

export function useReviewPage() {
  const [rows, setRows] = useState<ReviewApplicant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<ReviewSummary>(DEFAULT_SUMMARY);
  const [options, setOptions] = useState<ReviewFilterOptions>(DEFAULT_OPTIONS);
  const [isLoadingOptions, setIsLoadingOptions] = useState<boolean>(true);

  const [vacancyFilter, setVacancyFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<ReviewStatusFilter>("perlu_review");
  const [searchInput, setSearchInput] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<ReviewConfirmState | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | null>(null);

  const fetchOptions = useCallback(async () => {
    setIsLoadingOptions(true);
    try {
      const result = await reviewApi.getOptions();
      setOptions(result);
    } catch {
      setOptions(DEFAULT_OPTIONS);
    } finally {
      setIsLoadingOptions(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch awal sinkron dengan API eksternal, loading wajib diset sebelum request async
    void fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    if (debounceRef.current !== null) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => {
      if (debounceRef.current !== null) window.clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  const fetchReviews = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      const result = await reviewApi.getReviews({
        job_vacancy_id: vacancyFilter === "" ? undefined : vacancyFilter,
        review_status: statusFilter,
        search: search === "" ? undefined : search,
        page,
        per_page: pageSize,
        sort_by: "applied_at",
        sort_dir: "desc",
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      setRows(result.rows);
      setSummary(result.summary);
      setTotalPages(result.meta.last_page || 1);
      setTotalItems(result.meta.total);
      if (result.filterOptions) {
        setOptions(result.filterOptions);
        setIsLoadingOptions(false);
      }
      setSelectedIds((prev) => {
        const valid = new Set(result.rows.map((row) => row.id));
        return prev.filter((id) => valid.has(id));
      });
    } catch (err) {
      if (controller.signal.aborted) return;
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Gagal memuat data pelamar.";
      setError(message);
      toast.error(message);
      setRows([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      if (abortRef.current === controller) {
        setLoading(false);
      }
    }
  }, [vacancyFilter, statusFilter, search, page, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch sinkron dengan API eksternal, loading dan error wajib diset sebelum request async
    void fetchReviews();
  }, [fetchReviews, refreshKey]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (vacancyFilter !== "") count += 1;
    if (statusFilter !== "perlu_review") count += 1;
    if (search !== "") count += 1;
    return count;
  }, [vacancyFilter, statusFilter, search]);

  const handleVacancyChange = useCallback((value: string) => {
    setVacancyFilter(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    const next: ReviewStatusFilter =
      value === "lolos_berkas" || value === "ditolak" || value === "semua"
        ? value
        : "perlu_review";
    setStatusFilter(next);
    setPage(1);
  }, []);

  const handleSearchInputChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setVacancyFilter("");
    setStatusFilter("perlu_review");
    setSearchInput("");
    setSearch("");
    setPage(1);
  }, []);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (!checked) {
        setSelectedIds([]);
        return;
      }
      const selectable = rows.filter(isSelectableRow).map((row) => row.id);
      setSelectedIds(selectable);
    },
    [rows],
  );

  const handleSelectRow = useCallback((id: string | number, checked: boolean) => {
    const key = String(id);
    setSelectedIds((prev) => {
      if (checked) {
        return prev.includes(key) ? prev : [...prev, key];
      }
      return prev.filter((item) => item !== key);
    });
  }, []);

  const openSingleConfirm = useCallback(
    (applicant: ReviewApplicant, decision: ReviewDecision) => {
      setConfirm({
        mode: "single",
        decision,
        applicant,
        bulkIds: [],
        bulkPreview: [],
      });
    },
    [],
  );

  const eligibleRows = useCallback(() => {
    const eligibleSet = new Set(
      rows.filter(isSelectableRow).map((row) => row.id),
    );
    const eligibleIds = filterSelectableIds(selectedIds, eligibleSet);
    return rows.filter((row) => eligibleIds.includes(row.id));
  }, [rows, selectedIds]);

  const toBulkPreview = useCallback(
    (eligible: ReviewApplicant[]): ReviewBulkPreviewItem[] =>
      eligible.map((row) => ({
        id: row.id,
        name: row.applicant?.name?.trim() !== "" ? String(row.applicant?.name) : "-",
        position: row.vacancy?.position?.trim() !== "" ? String(row.vacancy?.position) : "-",
      })),
    [],
  );

  const openBulkConfirm = useCallback(() => {
    const eligible = eligibleRows();
    if (eligible.length === 0) {
      toast.warning("Pilih minimal 1 pelamar yang perlu review di halaman ini.");
      return;
    }
    setConfirm({
      mode: "bulk",
      decision: "lolos",
      applicant: null,
      bulkIds: eligible.map((row) => row.id),
      bulkPreview: toBulkPreview(eligible),
    });
  }, [eligibleRows, toBulkPreview]);

  const openBulkReject = useCallback(() => {
    const eligible = eligibleRows();
    if (eligible.length === 0) {
      toast.warning("Pilih minimal 1 pelamar yang perlu review di halaman ini.");
      return;
    }
    setConfirm({
      mode: "bulk",
      decision: "tidak_lolos",
      applicant: null,
      bulkIds: eligible.map((row) => row.id),
      bulkPreview: toBulkPreview(eligible),
    });
  }, [eligibleRows, toBulkPreview]);

  const closeConfirm = useCallback(() => {
    if (isProcessing) return;
    setConfirm(null);
  }, [isProcessing]);

  const submitConfirm = useCallback(async (values: ReviewDecisionValues) => {
    if (!confirm || isProcessing) return;
    setIsProcessing(true);
    try {
      if (confirm.mode === "single" && confirm.applicant) {
        const payload = toReviewPayload(values);
        const result = await reviewApi.reviewApplicant(confirm.applicant.id, payload);
        toast.success(result.message || "Keputusan pelamar berhasil disimpan.");
      } else {
        const payload = toBulkReviewPayload(confirm.bulkIds, values);
        const result = await reviewApi.bulkReview(payload);
        if (result.failed > 0) {
          toast.warning(
            `${result.succeeded} pelamar diproses, ${result.failed} gagal diproses.`,
          );
        } else if (confirm.decision === "tidak_lolos") {
          toast.success(`${result.succeeded} pelamar berhasil ditolak.`);
        } else {
          toast.success(`${result.succeeded} pelamar berhasil diloloskan.`);
        }
        setSelectedIds([]);
      }
      setConfirm(null);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Gagal menyimpan keputusan review.";
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  }, [confirm, isProcessing]);

  const selectableCount = useMemo(
    () => rows.filter(isSelectableRow).length,
    [rows],
  );

  return {
    rows,
    loading,
    error,
    summary,
    options,
    isLoadingOptions,
    vacancyFilter,
    statusFilter,
    searchInput,
    search,
    activeFilterCount,
    page,
    pageSize,
    totalPages,
    totalItems,
    selectedIds,
    confirm,
    isProcessing,
    selectableCount,
    handleVacancyChange,
    handleStatusChange,
    handleSearchInputChange,
    clearSearch,
    resetFilters,
    handlePageChange,
    handlePageSizeChange,
    handleSelectAll,
    handleSelectRow,
    clearSelection,
    openSingleConfirm,
    openBulkConfirm,
    openBulkReject,
    closeConfirm,
    submitConfirm,
    retry: () => setRefreshKey((prev) => prev + 1),
    refetch: () => setRefreshKey((prev) => prev + 1),
  };
}

export type UseReviewPageReturn = ReturnType<typeof useReviewPage>;
