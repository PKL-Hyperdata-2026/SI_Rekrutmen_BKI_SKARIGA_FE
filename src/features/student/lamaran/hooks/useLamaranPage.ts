import { useState, useEffect, useCallback, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import type { DateRangeValue } from "@/components/custom";
import type { StudentJobApplication } from "../lamaran.schema";
import { getStudentJobApplications } from "../lamaran.api";

export function useLamaranPage() {
  const [applications, setApplications] = useState<StudentJobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRangeValue | undefined>(() => {
    const today = new Date();
    return {
      from: startOfMonth(today),
      to: endOfMonth(today),
    };
  });

  const [instructionModalOpen, setInstructionModalOpen] = useState(false);
  const [selectedApplicationForInstruction, setSelectedApplicationForInstruction] =
    useState<StudentJobApplication | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStudentJobApplications();
      const rawData = res?.data;
      const apiData = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];
      setApplications(apiData);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleOpenInstruction = useCallback((app: StudentJobApplication) => {
    setSelectedApplicationForInstruction(app);
    setInstructionModalOpen(true);
  }, []);

  const handleCloseInstruction = useCallback(() => {
    setInstructionModalOpen(false);
    setSelectedApplicationForInstruction(null);
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (statusFilter !== "all") {
        if (
          statusFilter === "in_progress" &&
          app.status?.code !== "in_progress" &&
          app.status?.code !== "pending"
        ) {
          return false;
        }
        if (statusFilter === "accepted" && app.status?.code !== "accepted") {
          return false;
        }
        if (statusFilter === "rejected" && app.status?.code !== "rejected") {
          return false;
        }
      }

      if (dateRange?.from) {
        const dateStr = app.appliedAt || app.createdAt;
        if (dateStr) {
          try {
            const appDate = parseISO(dateStr);
            const fromDate = startOfDay(dateRange.from);
            const toDate = dateRange.to
              ? endOfDay(dateRange.to)
              : endOfDay(dateRange.from);
            if (!isWithinInterval(appDate, { start: fromDate, end: toDate })) {
              return false;
            }
          } catch {
          }
        }
      }

      return true;
    });
  }, [applications, statusFilter, dateRange]);

  const stats = useMemo(() => {
    const total = applications.length;
    const diterima = applications.filter(
      (a) => a.status?.code === "accepted"
    ).length;
    const gagal = applications.filter(
      (a) => a.status?.code === "rejected"
    ).length;
    return { total, diterima, gagal };
  }, [applications]);

  const headerConfig = useMemo(
    () => ({
      title: "Status Seleksi & Pelacakan Lamaran",
      description:
        "Pantau perkembangan tahapan seleksi secara otomatis & real-time.",
      badge: "Modul Rekrutmen Terintegrasi",
    }),
    []
  );

  return {
    applications,
    filteredApplications,
    loading,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    instructionModalOpen,
    setInstructionModalOpen,
    selectedApplicationForInstruction,
    handleOpenInstruction,
    handleCloseInstruction,
    fetchApplications,
    stats,
    headerConfig,
  };
}

export const useLamaran = useLamaranPage;
