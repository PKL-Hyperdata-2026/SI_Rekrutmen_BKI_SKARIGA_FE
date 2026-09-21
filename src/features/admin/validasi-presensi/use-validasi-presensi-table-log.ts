import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { validasiPresensiApi } from "./validasi-presensi.api";
import { toast } from "@/components/custom/sonner";
import {
  type AttendanceItem,
  attendanceItemSchema,
  attendanceQueueResponseSchema,
} from "./validasi-presensi.schema";

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

export interface UseValidasiPresensiTableLogProps {
  selectedVacancy: string;
  refreshKey: number;
}

export function getInitials(name?: string | null): string {
  if (!name) return "P";
  const parts = name
    .trim()
    .split(" ")
    .filter((p) => p.length > 0);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

export function formatAttendanceTime(dateStr?: string | null): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;

    const dateFormatted = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);

    const tzName =
      new Intl.DateTimeFormat("id-ID", {
        timeZoneName: "short",
      })
        .formatToParts(d)
        .find((p) => p.type === "timeZoneName")?.value || "";

    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return tzName
      ? `${dateFormatted}, ${hours}:${minutes} ${tzName}`
      : `${dateFormatted}, ${hours}:${minutes}`;
  } catch {
    return dateStr;
  }
}

export interface AttendanceTimeParts {
  date: string;
  time: string;
}

export function formatAttendanceParts(
  dateStr?: string | null,
): AttendanceTimeParts {
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
      new Intl.DateTimeFormat("id-ID", {
        timeZoneName: "short",
      })
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

export function useValidasiPresensiTableLog({
  selectedVacancy,
  refreshKey,
}: UseValidasiPresensiTableLogProps) {
  const [data, setData] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page: currentPage,
        per_page: pageSize,
      };

      if (selectedVacancy && selectedVacancy !== "all") {
        params.job_vacancy_id = selectedVacancy;
      }

      const response = await validasiPresensiApi.getHistory(params);
      const parsed = attendanceQueueResponseSchema.safeParse(response.data);

      if (parsed.success) {
        const queuePayload = parsed.data.data;
        if (Array.isArray(queuePayload)) {
          setData(queuePayload);
          setTotalPages(1);
          setTotalItems(queuePayload.length);
        } else {
          setData(queuePayload.data);
          if (queuePayload.meta) {
            setTotalPages(queuePayload.meta.last_page);
            setTotalItems(queuePayload.meta.total);
          } else {
            setTotalPages(1);
            setTotalItems(queuePayload.data.length);
          }
        }
      } else {
        const fallbackSchema = z.object({
          data: z.union([
            z.array(attendanceItemSchema),
            z.object({
              data: z.array(attendanceItemSchema),
            }),
          ]),
        });
        const fallbackParsed = fallbackSchema.safeParse(response.data);
        if (fallbackParsed.success) {
          const fallbackPayload = fallbackParsed.data.data;
          if (Array.isArray(fallbackPayload)) {
            setData(fallbackPayload);
            setTotalPages(1);
            setTotalItems(fallbackPayload.length);
          } else {
            setData(fallbackPayload.data);
            setTotalPages(1);
            setTotalItems(fallbackPayload.data.length);
          }
        }
      }
    } catch (err: unknown) {
      if (isApiError(err)) {
        toast.error(
          err.response?.data?.message ||
            "Gagal memuat riwayat validasi presensi.",
        );
      } else {
        toast.error("Gagal memuat riwayat validasi presensi.");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, selectedVacancy]);

  const [prevVacancy, setPrevVacancy] = useState(selectedVacancy);
  if (prevVacancy !== selectedVacancy) {
    setPrevVacancy(selectedVacancy);
    setCurrentPage(1);
  }

  useEffect(() => {
    let ignore = false;
    Promise.resolve().then(() => {
      if (!ignore) {
        fetchHistory();
      }
    });
    return () => {
      ignore = true;
    };
  }, [fetchHistory, refreshKey]);

  return {
    data,
    loading,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    setCurrentPage,
    setPageSize,
    formatAttendanceTime,
    getInitials,
  };
}
