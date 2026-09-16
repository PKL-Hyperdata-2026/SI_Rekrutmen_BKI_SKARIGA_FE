import { useState, useEffect, useCallback, useMemo } from "react";
import { z } from "zod";
import { api } from "@/api/axios";
import { toast } from "@/components/custom/sonner";
import {
  type AttendanceItem,
  attendanceItemSchema,
  attendanceQueueResponseSchema,
} from "../types/validasi-presensi-schema";

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

export interface UseValidasiPresensiTableProps {
  selectedVacancy: string;
  refreshKey: number;
  onValidated?: () => void;
}

export function getInitials(name?: string | null): string {
  if (!name) return "P";
  const parts = name
    .trim()
    .split(" ")
    .filter((p) => p.length > 0);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

export interface TestScheduleParts {
  date: string;
  time: string;
}

export function formatTestScheduleParts(
  dateStr?: string | null,
): TestScheduleParts {
  if (!dateStr) return { date: "-", time: "" };
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return { date: "-", time: "" };
    const dateFormatted = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
    const tzName =
      new Intl.DateTimeFormat("id-ID", { timeZoneName: "short" })
        .formatToParts(d)
        .find((p) => p.type === "timeZoneName")?.value || "";
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return {
      date: dateFormatted,
      time: tzName ? `${hours}:${minutes} ${tzName}` : `${hours}:${minutes}`,
    };
  } catch {
    return { date: dateStr, time: "" };
  }
}

export function formatTestSchedule(dateStr?: string | null): string {
  const parts = formatTestScheduleParts(dateStr);
  if (!parts.time) return parts.date;
  return `${parts.date}, ${parts.time}`;
}

interface TestDateInfo {
  dateKey: string;
  diffScore: number;
  timestamp: number;
}

function getTestDateInfo(dateStr?: string | null): TestDateInfo {
  if (!dateStr) {
    return {
      dateKey: "9999-12-31",
      diffScore: Number.MAX_SAFE_INTEGER,
      timestamp: Number.MAX_SAFE_INTEGER,
    };
  }

  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) {
    return {
      dateKey: "9999-12-31",
      diffScore: Number.MAX_SAFE_INTEGER,
      timestamp: Number.MAX_SAFE_INTEGER,
    };
  }

  const now = new Date();
  const todayZero = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const targetZero = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
  ).getTime();
  const dayDiff = Math.round((targetZero - todayZero) / 86400000);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const absDiff = Math.abs(dayDiff);

  return {
    dateKey: `${year}-${month}-${day}`,
    diffScore: dayDiff >= 0 ? absDiff * 2 : absDiff * 2 + 0.5,
    timestamp: d.getTime(),
  };
}

export function sortAttendanceItems(items: AttendanceItem[]): AttendanceItem[] {
  return [...items].sort((a, b) => {
    const infoA = getTestDateInfo(
      a.stage.scheduledAt || a.attendedAt || a.createdAt,
    );
    const infoB = getTestDateInfo(
      b.stage.scheduledAt || b.attendedAt || b.createdAt,
    );

    if (infoA.diffScore !== infoB.diffScore) {
      return infoA.diffScore - infoB.diffScore;
    }

    if (infoA.dateKey !== infoB.dateKey) {
      return infoA.dateKey.localeCompare(infoB.dateKey);
    }

    const companyA = (a.vacancy.companyName || "").trim().toLowerCase();
    const companyB = (b.vacancy.companyName || "").trim().toLowerCase();

    if (companyA !== companyB) {
      return companyA.localeCompare(companyB);
    }

    if (infoA.timestamp !== infoB.timestamp) {
      return infoA.timestamp - infoB.timestamp;
    }

    const applicantA = (a.applicant.name || "").trim().toLowerCase();
    const applicantB = (b.applicant.name || "").trim().toLowerCase();

    return applicantA.localeCompare(applicantB);
  });
}

export function useValidasiPresensiTable({
  selectedVacancy,
  refreshKey,
  onValidated,
}: UseValidasiPresensiTableProps) {
  const [data, setData] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page: currentPage,
        per_page: pageSize,
      };

      if (selectedVacancy && selectedVacancy !== "all") {
        params.job_vacancy_id = selectedVacancy;
      }

      const response = await api.get("/admin/attendances/queue", { params });
      const parsed = attendanceQueueResponseSchema.safeParse(response.data);

      if (parsed.success) {
        const queuePayload = parsed.data.data;
        if (Array.isArray(queuePayload)) {
          setData(queuePayload);
          setTotalPages(1);
          setTotalItems(queuePayload.length);
        } else {
          setData(queuePayload.data);
          setTotalPages(queuePayload.meta?.last_page || 1);
          setTotalItems(queuePayload.meta?.total || queuePayload.data.length);
        }
      } else {
        const fallbackParsed = z
          .object({
            data: z.union([
              z.array(attendanceItemSchema),
              z.object({ data: z.array(attendanceItemSchema) }),
            ]),
          })
          .safeParse(response.data);

        if (fallbackParsed.success) {
          const fallbackPayload = fallbackParsed.data.data;
          const items = Array.isArray(fallbackPayload)
            ? fallbackPayload
            : fallbackPayload.data;
          setData(items);
          setTotalPages(1);
          setTotalItems(items.length);
        }
      }
    } catch (err: unknown) {
      if (isApiError(err)) {
        toast.error(
          err.response?.data?.message || "Gagal memuat antrean presensi.",
        );
      } else {
        toast.error("Gagal memuat antrean presensi.");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, selectedVacancy]);

  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [isBulking, setIsBulking] = useState(false);

  const handleSelectRow = useCallback(
    (id: string | number, checked: boolean) => {
      setSelectedIds((prev) =>
        checked ? [...prev, id] : prev.filter((item) => item !== id),
      );
    },
    [],
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedIds(checked ? data.map((item) => item.id) : []);
    },
    [data],
  );

  const handleBulkValidate = useCallback(
    async (status: "verified" | "rejected") => {
      if (selectedIds.length === 0) return;
      setIsBulking(true);
      const systemAction =
        status === "verified" ? "Diteruskan ke HRD" : "Gugur / Tidak Hadir";
      try {
        try {
          await api.patch("/admin/attendances/bulk-validate", {
            attendance_ids: selectedIds,
            validation_status: status,
            system_action: systemAction,
          });
        } catch {
          await Promise.all(
            selectedIds.map((id) =>
              api.patch(
                `/admin/attendances/${encodeURIComponent(String(id))}/validate`,
                {
                  validation_status: status,
                  system_action: systemAction,
                },
              ),
            ),
          );
        }

        toast.success(
          status === "verified"
            ? `Berhasil memvalidasi kehadiran ${selectedIds.length} pelamar.`
            : `Berhasil menolak kehadiran ${selectedIds.length} pelamar.`,
        );

        setSelectedIds([]);
        await fetchQueue();
        onValidated?.();
      } catch (err: unknown) {
        if (isApiError(err)) {
          toast.error(
            err.response?.data?.message || "Gagal memproses validasi massal.",
          );
        } else {
          toast.error("Gagal memproses validasi massal.");
        }
      } finally {
        setIsBulking(false);
      }
    },
    [selectedIds, fetchQueue, onValidated],
  );

  const [prevVacancy, setPrevVacancy] = useState(selectedVacancy);
  if (prevVacancy !== selectedVacancy) {
    setPrevVacancy(selectedVacancy);
    setCurrentPage(1);
  }

  const selectionKey = `${currentPage}-${pageSize}-${selectedVacancy}-${refreshKey}`;
  const [prevSelectionKey, setPrevSelectionKey] = useState(selectionKey);
  if (prevSelectionKey !== selectionKey) {
    setPrevSelectionKey(selectionKey);
    setSelectedIds([]);
  }

  useEffect(() => {
    let ignore = false;
    Promise.resolve().then(() => {
      if (!ignore) {
        fetchQueue();
      }
    });
    return () => {
      ignore = true;
    };
  }, [fetchQueue, refreshKey]);

  const sortedData = useMemo(() => {
    return sortAttendanceItems(data);
  }, [data]);

  return {
    data: sortedData,
    loading,
    selectedIds,
    isBulking,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    setCurrentPage,
    setPageSize,
    handleBulkValidate,
    handleSelectRow,
    handleSelectAll,
    getInitials,
  };
}
