import { useState, useEffect, useCallback, useMemo } from "react";
import type { JobPlacement } from "./penempatan.schema";
import { penempatanApi } from "./penempatan.api";

export interface UsePenempatanTableOptions {
  data?: JobPlacement[];
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onUpdateStatus?: (item: JobPlacement) => void;
  onView?: (item: JobPlacement) => void;
  onEdit?: (item: JobPlacement) => void;
  onDelete?: (item: JobPlacement) => void | Promise<void>;
  companyId?: string;
  year?: string | number;
  search?: string;
  initialPageSize?: number;
  enabled?: boolean;
  refreshKey?: number;
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  const trimmed = dateStr.trim();
  const parts = trimmed.split(" ");
  if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
    const day = Number(parts[0]);
    const year = Number(parts[2]);
    if (
      !Number.isNaN(day) &&
      !Number.isNaN(year) &&
      year > 1900 &&
      parts[1].length >= 3
    ) {
      return trimmed;
    }
  }
  try {
    const d = new Date(trimmed);
    if (Number.isNaN(d.getTime())) return trimmed;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return trimmed;
  }
}

export function isTerminalStatus(status?: string | null): boolean {
  if (!status) return false;
  const s = status.toLowerCase();
  return (
    s.includes("resign") ||
    s.includes("kontrak") ||
    s.includes("habis") ||
    s.includes("pindah") ||
    s.includes("non-aktif") ||
    s.includes("keluar") ||
    s === "resigned" ||
    s === "moved" ||
    s === "contract_end"
  );
}

export function getEvaluationStatus(
  row: JobPlacement,
  targetMonths: number,
): string {
  const s3 = row.status3Months;
  if (targetMonths > 3 && (s3 === "-" || isTerminalStatus(s3))) {
    return "-";
  }

  const s6 = row.status6Months;
  if (targetMonths > 6 && (s6 === "-" || isTerminalStatus(s6))) {
    return "-";
  }

  if (targetMonths === 3 && row.status3Months) return row.status3Months;
  if (targetMonths === 6 && row.status6Months) return row.status6Months;
  if (targetMonths === 12 && row.status12Months) return row.status12Months;

  if (!row.startDate) return "Belum Waktunya";

  const start = new Date(row.startDate);
  if (Number.isNaN(start.getTime())) return "Belum Waktunya";

  const now = new Date();
  const diffMonths =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());

  if (diffMonths < targetMonths) {
    return "Belum Waktunya";
  }

  const statusCode = row.placementStatus?.code?.toLowerCase() || "";
  const statusName = row.placementStatus?.name?.toLowerCase() || "";

  if (
    statusCode === "resigned" ||
    statusName.includes("resign") ||
    statusName.includes("keluar")
  ) {
    return "Resign / Kontrak Habis";
  }
  if (
    statusCode === "moved" ||
    statusCode === "contract_end" ||
    statusName.includes("pindah") ||
    statusName.includes("kontrak") ||
    statusName.includes("habis")
  ) {
    return "Pindah Perusahaan Lain";
  }

  return "Masih Bekerja / Aktif";
}

export function getPlacementRowDetails(row: JobPlacement) {
  const alumniName = row.studentAlumni?.user?.fullName || row.alumniName || "-";
  const major = row.studentAlumni?.major || row.major || "";
  const yearVal = row.studentAlumni?.graduationYear || row.graduationYear || "";
  const subtitle =
    major && yearVal
      ? `${major} (${yearVal})`
      : major || (yearVal ? `(${yearVal})` : "-");
  const position =
    row.position ||
    row.jobApplication?.jobVacancy?.position ||
    row.jobApplication?.jobVacancy?.title ||
    row.studentAlumni?.currentPosition ||
    "-";

  const acceptedText = row.acceptedDate ? formatDate(row.acceptedDate) : "-";
  const startText = row.startDate ? formatDate(row.startDate) : "-";

  const s3 = row.status3Months || getEvaluationStatus(row, 3);
  const isTerminated3 = s3 === "-" || isTerminalStatus(s3);
  const val6 = isTerminated3
    ? "-"
    : row.status6Months || getEvaluationStatus(row, 6);
  const isTerminated6 = isTerminated3 || val6 === "-" || isTerminalStatus(val6);
  const val12 = isTerminated6
    ? "-"
    : row.status12Months || getEvaluationStatus(row, 12);

  return {
    alumniName,
    major,
    yearVal,
    subtitle,
    position,
    acceptedText,
    startText,
    s3,
    val6,
    val12,
  };
}

export function usePenempatanTable(options: UsePenempatanTableOptions = {}) {
  const {
    data: propData,
    loading: propLoading,
    currentPage: propCurrentPage,
    totalPages: propTotalPages,
    totalItems: propTotalItems,
    pageSize: propPageSize,
    onPageChange: propOnPageChange,
    onPageSizeChange: propOnPageSizeChange,
    onUpdateStatus,
    onEdit,
    companyId,
    year,
    search,
    initialPageSize = 10,
    enabled: propEnabled,
    refreshKey,
  } = options;

  const isControlled = propData !== undefined;
  const enabled = propEnabled !== undefined ? propEnabled : !isControlled;

  const [internalData, setInternalData] = useState<JobPlacement[]>([]);
  const [internalLoading, setInternalLoading] = useState<boolean>(enabled);
  const [internalCurrentPage, setInternalCurrentPage] = useState<number>(1);
  const [internalPageSize, setInternalPageSize] = useState<number>(
    propPageSize ?? initialPageSize,
  );
  const [internalTotalPages, setInternalTotalPages] = useState<number>(1);
  const [internalTotalItems, setInternalTotalItems] = useState<number>(0);

  const fetchPlacements = useCallback(async () => {
    if (!enabled) return;
    setInternalLoading(true);
    try {
      const params: Record<string, unknown> = {
        page: internalCurrentPage,
        per_page: internalPageSize,
      };

      if (companyId) params.company_id = companyId;
      if (year) params.year = year;
      if (search) params.search = search;

      const rawData = await penempatanApi.getPlacements(params);

      const rows: JobPlacement[] = Array.isArray(rawData?.data)
        ? rawData.data
        : Array.isArray(rawData)
          ? rawData
          : [];

      setInternalData(rows);

      const meta = rawData?.meta;
      if (meta && typeof meta.total === "number") {
        setInternalTotalItems(meta.total);
        setInternalTotalPages(
          meta.last_page || Math.ceil(meta.total / internalPageSize) || 1,
        );
      } else {
        setInternalTotalItems(rows.length);
        setInternalTotalPages(Math.ceil(rows.length / internalPageSize) || 1);
      }
    } catch {
      setInternalData([]);
      setInternalTotalItems(0);
      setInternalTotalPages(1);
    } finally {
      setInternalLoading(false);
    }
  }, [enabled, internalCurrentPage, internalPageSize, companyId, year, search]);

  useEffect(() => {
    fetchPlacements();
  }, [fetchPlacements, refreshKey]);

  const data = isControlled ? propData : internalData;
  const loading = isControlled ? (propLoading ?? false) : internalLoading;
  const currentPage = isControlled
    ? (propCurrentPage ?? 1)
    : internalCurrentPage;
  const totalPages = isControlled ? (propTotalPages ?? 1) : internalTotalPages;
  const totalItems = isControlled
    ? (propTotalItems ?? data.length)
    : internalTotalItems;
  const pageSize = isControlled ? (propPageSize ?? 10) : internalPageSize;

  const onPageChange = useCallback(
    (page: number) => {
      if (isControlled) {
        propOnPageChange?.(page);
      } else {
        setInternalCurrentPage(page);
      }
    },
    [isControlled, propOnPageChange],
  );

  const onPageSizeChange = useCallback(
    (size: number) => {
      if (isControlled) {
        propOnPageSizeChange?.(size);
      } else {
        setInternalPageSize(size);
        setInternalCurrentPage(1);
      }
    },
    [isControlled, propOnPageSizeChange],
  );

  const handleAction = useMemo(
    () => onUpdateStatus || onEdit,
    [onUpdateStatus, onEdit],
  );

  const numberStartIndex = useMemo(
    () => (currentPage - 1) * pageSize + 1,
    [currentPage, pageSize],
  );

  return {
    data,
    loading,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    numberStartIndex,
    onPageChange,
    onPageSizeChange,
    setCurrentPage: onPageChange,
    setPageSize: onPageSizeChange,
    handleAction,
    refetch: fetchPlacements,
    formatDate,
    isTerminalStatus,
    getEvaluationStatus,
    getPlacementRowDetails,
  };
}
