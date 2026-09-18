import { useState, useEffect, useCallback } from "react";
import { type FilterSelectOption } from "@/components/custom/filter-select";
import { type JobVacancy } from "./lowongan-kerja.schema";
import { lowonganKerjaApi } from "./lowongan-kerja.api";

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

      const rawData = await lowonganKerjaApi.getVacancies(params);
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
    } catch (err: unknown) {
      setVacancies([]);
      setTotalItems(0);
      setTotalPages(1);
      void err;
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, selectedMajor, selectedTarget, currentPage, pageSize]);

  useEffect(() => {
    let isMounted = true;

    async function loadOptions() {
      setIsLoadingOptions(true);
      try {
        const data = await lowonganKerjaApi.getOptions();
        if (!isMounted || !data) return;

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
      } catch (err: unknown) {
        void err;
      } finally {
        if (isMounted) {
          setIsLoadingOptions(false);
        }
      }
    }

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadVacancies() {
      setLoading(true);
      try {
        const params: Record<string, string | number> = {
          page: currentPage,
          per_page: pageSize,
        };
        if (selectedStatus !== "all") params.status_id = selectedStatus;
        if (selectedMajor !== "all") params.major_id = selectedMajor;
        if (selectedTarget !== "all") params.target_applicant_id = selectedTarget;

        const rawData = await lowonganKerjaApi.getVacancies(params);
        if (!isMounted) return;

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
      } catch (err: unknown) {
        if (!isMounted) return;
        setVacancies([]);
        setTotalItems(0);
        setTotalPages(1);
        void err;
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadVacancies();

    return () => {
      isMounted = false;
    };
  }, [selectedStatus, selectedMajor, selectedTarget, currentPage, pageSize]);

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
