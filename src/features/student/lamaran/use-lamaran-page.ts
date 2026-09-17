import { useState, useEffect, useCallback, useMemo } from "react";
import { startOfMonth, endOfMonth, format } from "date-fns";
import type { DateRangeValue } from "@/components/custom";
import type { StudentJobApplication } from "./lamaran.schema";
import { getStudentJobApplications } from "./lamaran.api";

export function useLamaranPage() {
  const [applications, setApplications] = useState<StudentJobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

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
      const params: Record<string, string | number> = {
        page: currentPage,
        per_page: pageSize,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (statusFilter !== "all") {
        params.status_code = statusFilter;
      }

      if (dateRange?.from) {
        params.start_date = format(dateRange.from, "yyyy-MM-dd");
      }

      if (dateRange?.to) {
        params.end_date = format(dateRange.to, "yyyy-MM-dd");
      }

      const res = await getStudentJobApplications(params);
      const rawData = res?.data;
      const apiData = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];

      setApplications(apiData);

      if (rawData && !Array.isArray(rawData) && rawData.meta) {
        setTotalPages(rawData.meta.last_page || 1);
        setTotalItems(rawData.meta.total ?? apiData.length);
      } else if (rawData && !Array.isArray(rawData) && typeof rawData.total === "number") {
        setTotalPages(
          rawData.last_page || Math.ceil(rawData.total / pageSize) || 1
        );
        setTotalItems(rawData.total);
      } else {
        setTotalItems(apiData.length);
        setTotalPages(Math.max(1, Math.ceil(apiData.length / pageSize)));
      }
    } catch {
      setApplications([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, currentPage, pageSize, dateRange]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchApplications();
    }, 300);

    return () => clearTimeout(timeout);
  }, [fetchApplications]);

  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  }, []);

  const handleDateRangeChange = useCallback((range: DateRangeValue | undefined) => {
    setDateRange(range);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((_size: number) => {
    // Page size is fixed to 5 per page
  }, []);

  const handleOpenInstruction = useCallback((app: StudentJobApplication) => {
    setSelectedApplicationForInstruction(app);
    setInstructionModalOpen(true);
  }, []);

  const handleCloseInstruction = useCallback(() => {
    setInstructionModalOpen(false);
    setSelectedApplicationForInstruction(null);
  }, []);

  const filteredApplications = applications;

  const stats = useMemo(() => {
    const total = totalItems || applications.length;
    const diterima = applications.filter(
      (a) => a.status?.code === "accepted"
    ).length;
    const gagal = applications.filter(
      (a) => a.status?.code === "rejected"
    ).length;
    return { total, diterima, gagal };
  }, [applications, totalItems]);

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
    search,
    setSearch: handleSearchChange,
    statusFilter,
    setStatusFilter: handleStatusChange,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    setCurrentPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    dateRange,
    setDateRange: handleDateRangeChange,
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
