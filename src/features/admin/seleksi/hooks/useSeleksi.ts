import { useState, useEffect, useCallback } from "react";
import { api } from "@/api/axios";
import type {
  RecruitmentSelectionItem,
  SelectionJobVacancyOption,
  SelectionStageOption,
  SelectionSummaryStats,
  SelectionListEnvelope,
  SelectionPaginationMeta,
} from "../types";

type AttendanceFilterValue = "all" | "hadir" | "tidak_hadir" | "belum_absensi";

// Backend actual payload: data: { summary: {total_applicants, total_passed_admin, total_accepted}, applicants: {data:[], meta:{...}} }
function normalizeSelectionsPayload(
  envelope: SelectionListEnvelope
): { rows: RecruitmentSelectionItem[]; meta: SelectionPaginationMeta | null; summary: SelectionSummaryStats | null } {
  const raw = envelope.data as unknown;

  // Case 1: raw is array (legacy direct array pagination)
  if (Array.isArray(raw)) {
    const metaEnvelope = (envelope as unknown as Record<string, unknown>).meta as SelectionPaginationMeta | undefined;
    const total = (envelope as unknown as Record<string, unknown>).total as number | undefined;
    const currentPage = (envelope as unknown as Record<string, unknown>).current_page as number | undefined;
    const lastPage = (envelope as unknown as Record<string, unknown>).last_page as number | undefined;
    const perPage = (envelope as unknown as Record<string, unknown>).per_page as number | undefined;
    if (metaEnvelope) return { rows: raw as RecruitmentSelectionItem[], meta: metaEnvelope, summary: null };
    if (currentPage !== undefined || lastPage !== undefined || total !== undefined) {
      return {
        rows: raw as RecruitmentSelectionItem[],
        meta: {
          current_page: currentPage ?? 1,
          last_page: lastPage ?? 1,
          per_page: perPage ?? raw.length,
          total: total ?? raw.length,
        },
        summary: null,
      };
    }
    return { rows: raw as RecruitmentSelectionItem[], meta: null, summary: null };
  }

  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;

    // 1) Preferred new backend structure: data.applicants.data & data.applicants.meta & data.summary
    if (obj.applicants && typeof obj.applicants === "object") {
      const applicants = obj.applicants as Record<string, unknown>;
      const nestedData = applicants.data as unknown;
      if (Array.isArray(nestedData)) {
        const rows = nestedData as RecruitmentSelectionItem[];
        const meta =
          (applicants.meta as SelectionPaginationMeta | undefined) ??
          ((applicants.current_page !== undefined || applicants.last_page !== undefined || applicants.total !== undefined)
            ? {
                current_page: (applicants.current_page as number) ?? 1,
                last_page: (applicants.last_page as number) ?? 1,
                per_page: (applicants.per_page as number) ?? rows.length,
                total: (applicants.total as number) ?? rows.length,
                from: (applicants.from as number | null) ?? null,
                to: (applicants.to as number | null) ?? null,
              }
            : null) ??
          ((envelope as unknown as Record<string, unknown>).meta as SelectionPaginationMeta | undefined) ??
          null;

        const summaryRaw = obj.summary as Record<string, unknown> | undefined;
        const summary: SelectionSummaryStats | null = summaryRaw
          ? {
              totalPelamar: Number(summaryRaw.total_applicants ?? summaryRaw.totalPelamar ?? summaryRaw.total ?? 0),
              administrasiLolos: Number(summaryRaw.total_passed_admin ?? summaryRaw.administrasiLolos ?? 0),
              finalDiterima: Number(summaryRaw.total_accepted ?? summaryRaw.finalDiterima ?? 0),
            }
          : null;

        return { rows, meta, summary };
      }
    }

    // 2) Legacy shape: data: { data: [], meta: {} }  (paginated without summary wrapper)
    if (Array.isArray((obj as { data?: unknown }).data)) {
      const nested = obj as {
        data: RecruitmentSelectionItem[];
        meta?: SelectionPaginationMeta;
        current_page?: number;
        last_page?: number;
        total?: number;
        per_page?: number;
        from?: number | null;
        to?: number | null;
        summary?: Record<string, unknown>;
      };
      const metaFromNested =
        nested.meta ??
        (nested.current_page !== undefined || nested.last_page !== undefined || nested.total !== undefined
          ? {
              current_page: nested.current_page ?? 1,
              last_page: nested.last_page ?? 1,
              per_page: nested.per_page ?? nested.data.length,
              total: nested.total ?? nested.data.length,
              from: nested.from ?? null,
              to: nested.to ?? null,
            }
          : undefined);
      const rootMeta = (envelope as unknown as { meta?: SelectionPaginationMeta }).meta;
      const summaryRaw = (nested as unknown as Record<string, unknown>).summary as Record<string, unknown> | undefined;
      const summary: SelectionSummaryStats | null = summaryRaw
        ? {
            totalPelamar: Number(summaryRaw.total_applicants ?? 0),
            administrasiLolos: Number(summaryRaw.total_passed_admin ?? 0),
            finalDiterima: Number(summaryRaw.total_accepted ?? 0),
          }
        : null;
      return {
        rows: nested.data,
        meta: metaFromNested ?? rootMeta ?? null,
        summary,
      };
    }

    // 3) Check if object itself contains summary but no applicants wrapper (defensive)
    if (obj.summary && typeof obj.summary === "object") {
      const summaryRaw = obj.summary as Record<string, unknown>;
      const summary: SelectionSummaryStats = {
        totalPelamar: Number(summaryRaw.total_applicants ?? 0),
        administrasiLolos: Number(summaryRaw.total_passed_admin ?? 0),
        finalDiterima: Number(summaryRaw.total_accepted ?? 0),
      };
      return { rows: [], meta: null, summary };
    }
  }

  return { rows: [], meta: null, summary: null };
}

function computeStatsFallback(
  rows: RecruitmentSelectionItem[],
  totalItems: number
): SelectionSummaryStats {
  let administrasiLolos = 0;
  let finalDiterima = 0;

  for (const item of rows) {
    const statusCode = item.status?.code?.toLowerCase().trim() ?? "";
    const statusName = item.status?.name?.toLowerCase().trim() ?? "";
    const adminStatus = item.selectionResult?.adminSelectionStatus?.toLowerCase().trim() ?? "";
    const decision = item.selectionResult?.decision?.toLowerCase().trim() ?? "";
    const resultStatus = item.selectionResult?.status?.toLowerCase().trim() ?? "";

    const isAdministrasiLolos =
      statusCode === "lolos_administrasi" ||
      statusCode === "administrasi_lolos" ||
      statusName.includes("lolos administrasi") ||
      statusName.includes("administrasi lolos") ||
      adminStatus === "lolos" ||
      adminStatus === "passed" ||
      adminStatus.includes("lolos");

    if (isAdministrasiLolos) administrasiLolos += 1;

    const isFinalDiterima =
      statusCode === "diterima" ||
      statusCode === "final_diterima" ||
      statusCode === "lolos_final" ||
      statusName.includes("diterima") ||
      statusName.includes("lolos final") ||
      decision === "diterima" ||
      decision === "accepted" ||
      decision.includes("diterima") ||
      resultStatus === "diterima" ||
      resultStatus.includes("diterima");

    if (isFinalDiterima) finalDiterima += 1;
  }

  return {
    totalPelamar: totalItems,
    administrasiLolos,
    finalDiterima,
  };
}

export interface UseSeleksiReturn {
  selections: RecruitmentSelectionItem[];
  loading: boolean;
  error: string | null;
  vacancyOptions: SelectionJobVacancyOption[];
  stageOptions: SelectionStageOption[];
  isLoadingOptions: boolean;
  selectedVacancyId: string;
  selectedStageId: string;
  selectedAttendance: AttendanceFilterValue;
  search: string;
  debouncedSearch: string;
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  stats: SelectionSummaryStats;
  setJobVacancyId: (val: string) => void;
  setStageId: (val: string) => void;
  setAttendanceStatus: (val: string) => void;
  setSearch: (val: string) => void;
  setCurrentPage: (page: number) => void;
  setPerPage: (size: number) => void;
  refetch: () => Promise<void>;
}

export function useSeleksi(): UseSeleksiReturn {
  const [selections, setSelections] = useState<RecruitmentSelectionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [vacancyOptions, setVacancyOptions] = useState<SelectionJobVacancyOption[]>([
    { value: "all", label: "Semua Lowongan" },
  ]);
  const [stageOptions, setStageOptions] = useState<SelectionStageOption[]>([
    { value: "all", label: "Semua Tahapan" },
  ]);
  const [isLoadingOptions, setIsLoadingOptions] = useState<boolean>(true);

  const [selectedVacancyId, setSelectedVacancyId] = useState<string>("all");
  const [selectedStageId, setSelectedStageId] = useState<string>("all");
  const [selectedAttendance, setSelectedAttendance] =
    useState<AttendanceFilterValue>("all");

  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [stats, setStats] = useState<SelectionSummaryStats>({
    totalPelamar: 0,
    administrasiLolos: 0,
    finalDiterima: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchOptions = useCallback(async () => {
    setIsLoadingOptions(true);
    try {
      const vacancyReq = api.get<{
        success?: boolean;
        message?: string;
        data?: {
          data?: Array<{
            id: string | number;
            title?: string;
            position?: string;
            company?: { name?: string } | null;
            companyName?: string | null;
          }>;
          meta?: unknown;
        } | Array<unknown>;
      }>("/admin/job-vacancies", {
        params: { page: 1, per_page: 100 },
      });

      const stageReq = api
        .get<{
          success?: boolean;
          message?: string;
          data?: {
            data?: Array<{
              id: string | number;
              name?: string;
              code?: string;
              sequence_order?: number;
              sequenceOrder?: number;
            }>;
            meta?: unknown;
          } | Array<unknown>;
        }>("/admin/standard-types", {
          params: { category: "stage_type", page: 1, per_page: 100 },
        })
        .catch(() =>
          api.get<{
            success?: boolean;
            message?: string;
            data?: {
              data?: Array<{
                id: string | number;
                name?: string;
                code?: string;
                sequence_order?: number;
                sequenceOrder?: number;
              }>;
              meta?: unknown;
            } | Array<unknown>;
          }>("/admin/standard-types", {
            params: { category: "selection_stage", page: 1, per_page: 100 },
          })
        )
        .catch(() =>
          api.get<{
            success?: boolean;
            message?: string;
            data?: {
              data?: Array<{
                id: string | number;
                name?: string;
                code?: string;
                sequence_order?: number;
              }>;
            };
          }>("/admin/selection-stages", {
            params: { page: 1, per_page: 100 },
          }).catch(() => null)
        );

      const [vacancyRes, stageRes] = await Promise.all([vacancyReq, stageReq]);

      const rawVacancyData = vacancyRes.data?.data;
      const vacancyRows: Array<{
        id: string | number;
        title?: string;
        position?: string;
        company?: { name?: string } | null;
        companyName?: string | null;
      }> = Array.isArray(rawVacancyData)
        ? (rawVacancyData as unknown as typeof vacancyRows)
        : Array.isArray((rawVacancyData as { data?: unknown })?.data)
          ? ((rawVacancyData as { data: typeof vacancyRows }).data as typeof vacancyRows)
          : [];

      if (vacancyRows.length > 0) {
        const mappedVacancies: SelectionJobVacancyOption[] = vacancyRows.map((v) => {
          const companyLabel =
            v.company?.name ?? v.companyName ?? null;
          const base = v.title ?? v.position ?? `Lowongan #${String(v.id)}`;
          const pos = v.position ? ` - ${v.position}` : "";
          const suffix = companyLabel ? ` • ${companyLabel}` : "";
          return {
            value: String(v.id),
            label: `${base}${pos}${suffix}`,
            position: v.position ?? undefined,
            companyName: companyLabel ?? undefined,
          };
        });
        setVacancyOptions([{ value: "all", label: "Semua Lowongan" }, ...mappedVacancies]);
      }

      if (stageRes) {
        const rawStageData = stageRes.data?.data;
        const stageRows: Array<{
          id: string | number;
          name?: string;
          code?: string;
          sequence_order?: number;
          sequenceOrder?: number;
          metadata?: Record<string, unknown>;
        }> = Array.isArray(rawStageData)
          ? (rawStageData as unknown as typeof stageRows)
          : Array.isArray((rawStageData as { data?: unknown })?.data)
            ? ((rawStageData as { data: typeof stageRows }).data as typeof stageRows)
            : [];

        if (stageRows.length > 0) {
          const mappedStages: SelectionStageOption[] = stageRows.map((s) => ({
            value: String(s.id),
            label: s.name ?? s.code ?? `Tahapan #${String(s.id)}`,
            sequenceOrder: s.sequence_order ?? s.sequenceOrder ?? undefined,
          }));
          setStageOptions([{ value: "all", label: "Semua Tahapan" }, ...mappedStages]);
        }
      }
    } catch {
      // keep fallback options
    } finally {
      setIsLoadingOptions(false);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const fetchSelections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {
        page: currentPage,
        per_page: perPage,
      };
      if (selectedVacancyId !== "all") params.job_vacancy_id = selectedVacancyId;
      if (selectedStageId !== "all") params.stage_id = selectedStageId;
      if (selectedAttendance !== "all") {
        // UI pakai "belum_absensi" tapi backend expects "belum" (validasi in: hadir,tidak_hadir,belum)
        const attendanceParam = selectedAttendance === "belum_absensi" ? "belum" : selectedAttendance;
        params.attendance_status = attendanceParam;
      }
      if (debouncedSearch) params.search = debouncedSearch;

      const res = await api.get<SelectionListEnvelope>("/admin/recruitment-selections", {
        params,
      });

      const envelope = res.data;
      const { rows, meta, summary } = normalizeSelectionsPayload(envelope);

      setSelections(rows);

      // Pagination meta dari data.applicants.meta (sesuai payload backend)
      if (meta) {
        setTotalItems(meta.total);
        setTotalPages(meta.last_page || Math.ceil(meta.total / perPage) || 1);
      } else {
        // fallback: jika meta kosong, gunakan summary.totalPelamar sebagai total
        const fallbackTotal = summary?.totalPelamar ?? rows.length;
        setTotalItems(fallbackTotal);
        setTotalPages(Math.ceil(fallbackTotal / perPage) || 1);
      }

      // Summary cards dari data.summary (jangan hitung manual dari rows karena paginated)
      if (summary) {
        setStats(summary);
      } else {
        // fallback legacy: hitung dari rows bila backend tidak kirim summary
        const fallbackTotal = meta?.total ?? rows.length;
        setStats(computeStatsFallback(rows, fallbackTotal));
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Gagal memuat data seleksi rekrutmen.";
      setError(message);
      setSelections([]);
      setTotalItems(0);
      setTotalPages(1);
      setStats({ totalPelamar: 0, administrasiLolos: 0, finalDiterima: 0 });
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, selectedVacancyId, selectedStageId, selectedAttendance, debouncedSearch]);

  useEffect(() => {
    fetchSelections();
  }, [fetchSelections]);

  const handleVacancyChange = useCallback((val: string) => {
    setSelectedVacancyId(val);
    setCurrentPage(1);
  }, []);

  const handleStageChange = useCallback((val: string) => {
    setSelectedStageId(val);
    setCurrentPage(1);
  }, []);

  const handleAttendanceChange = useCallback((val: string) => {
    const normalized: AttendanceFilterValue =
      val === "hadir" || val === "tidak_hadir" || val === "belum_absensi" ? (val as AttendanceFilterValue) : "all";
    setSelectedAttendance(normalized);
    setCurrentPage(1);
  }, []);

  const handlePerPageChange = useCallback((size: number) => {
    setPerPage(size);
    setCurrentPage(1);
  }, []);

  return {
    selections,
    loading,
    error,
    vacancyOptions,
    stageOptions,
    isLoadingOptions,
    selectedVacancyId,
    selectedStageId,
    selectedAttendance,
    search,
    debouncedSearch,
    currentPage,
    perPage,
    totalPages,
    totalItems,
    stats,
    setJobVacancyId: handleVacancyChange,
    setStageId: handleStageChange,
    setAttendanceStatus: handleAttendanceChange,
    setSearch,
    setCurrentPage,
    setPerPage: handlePerPageChange,
    refetch: fetchSelections,
  };
}
