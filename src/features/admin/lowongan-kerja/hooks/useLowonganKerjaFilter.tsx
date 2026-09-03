import { useState, useEffect, useMemo, useCallback } from "react";
import { type FilterSelectOption } from "@/components/custom/filter-select";
import { type JobVacancy, type JobVacancyOptionsData } from "../types";
import { api } from "@/api/axios";

const DEFAULT_STATUS_OPTIONS: FilterSelectOption[] = [
  { value: "all", label: "Semua Status Lowongan" },
  { value: "published", label: "Aktif / Dibuka" },
  { value: "closed", label: "Ditutup / Expired" },
];

const DEFAULT_MAJOR_OPTIONS: FilterSelectOption[] = [
  { value: "all", label: "Semua Jurusan" },
];

const DEFAULT_TARGET_OPTIONS: FilterSelectOption[] = [
  { value: "all", label: "Semua Target" },
  { value: "alumni", label: "Alumni" },
  { value: "siswa", label: "Siswa" },
];

export function useLowonganKerjaFilter() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMajor, setSelectedMajor] = useState("all");
  const [selectedTarget, setSelectedTarget] = useState("all");

  const [statusOptions, setStatusOptions] = useState<FilterSelectOption[]>(
    DEFAULT_STATUS_OPTIONS,
  );
  const [majorOptions, setMajorOptions] = useState<FilterSelectOption[]>(
    DEFAULT_MAJOR_OPTIONS,
  );
  const [targetOptions, setTargetOptions] = useState<FilterSelectOption[]>(
    DEFAULT_TARGET_OPTIONS,
  );

  const [vacancies, setVacancies] = useState<JobVacancy[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchOptions = useCallback(async () => {
    setIsLoadingOptions(true);
    try {
      const response = await api.get<{ data: JobVacancyOptionsData }>(
        "/admin/job-vacancies/options",
      );
      const data = response.data?.data;

      if (data) {
        if (Array.isArray(data.vacancyStatuses)) {
          setStatusOptions([
            { value: "all", label: "Semua Status Lowongan" },
            ...data.vacancyStatuses.map((s) => ({
              value: String(s.id),
              label: s.name,
            })),
          ]);
        }

        if (Array.isArray(data.majors)) {
          setMajorOptions([
            { value: "all", label: "Semua Jurusan" },
            ...data.majors.map((m) => ({
              value: String(m.id),
              label: m.code ? `${m.name} (${m.code})` : m.name,
            })),
          ]);
        }

        if (Array.isArray(data.targetApplicants)) {
          setTargetOptions([
            { value: "all", label: "Semua Target" },
            ...data.targetApplicants.map((t) => ({
              value: String(t.id),
              label: t.name,
            })),
          ]);
        }
      }
    } catch {
    } finally {
      setIsLoadingOptions(false);
    }
  }, []);

  const fetchVacancies = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page: currentPage,
        per_page: pageSize,
      };
      if (selectedStatus !== "all") params.status_id = selectedStatus;
      if (selectedMajor !== "all") params.major_id = selectedMajor;
      if (selectedTarget !== "all") params.target_applicant_id = selectedTarget;

      const response = await api.get("/admin/job-vacancies", { params });
      const rawData = response.data?.data;
      const rows: JobVacancy[] = Array.isArray(rawData?.data)
        ? rawData.data
        : Array.isArray(rawData)
          ? rawData
          : [];

      setVacancies(rows);

      const meta = rawData?.meta || rawData;
      if (meta && typeof meta.total === "number") {
        setTotalItems(meta.total);
        setTotalPages(meta.last_page || Math.ceil(meta.total / pageSize) || 1);
      } else {
        setTotalItems(rows.length);
        setTotalPages(Math.ceil(rows.length / pageSize) || 1);
      }
    } catch {
      setVacancies([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, selectedMajor, selectedTarget, currentPage, pageSize]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  const handleStatusChange = useCallback((val: string) => {
    setSelectedStatus(val);
    setCurrentPage(1);
  }, []);

  const handleMajorChange = useCallback((val: string) => {
    setSelectedMajor(val);
    setCurrentPage(1);
  }, []);

  const handleTargetChange = useCallback((val: string) => {
    setSelectedTarget(val);
    setCurrentPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const totalCompaniesCount = useMemo(() => {
    const ids = new Set(
      vacancies
        .map((v) => v.companyId ?? v.company?.id)
        .filter((id): id is string | number => id !== undefined && id !== null && id !== ""),
    );
    return ids.size;
  }, [vacancies]);

  return {
    selectedStatus,
    selectedMajor,
    selectedTarget,
    setSelectedStatus: handleStatusChange,
    setSelectedMajor: handleMajorChange,
    setSelectedTarget: handleTargetChange,
    statusOptions,
    majorOptions,
    targetOptions,
    vacancies,
    totalCompaniesCount,
    loading,
    isLoadingOptions,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    setCurrentPage,
    setPageSize: handlePageSizeChange,
    refetchVacancies: fetchVacancies,
  };
}
