import { useState, useEffect, useCallback, useMemo } from "react";
import { useLowonganKerjaFilter } from "./lowongan-kerja.filter";
import type { StudentJobVacancy } from "./lowongan-kerja.card";
import {
  lowonganKerjaApi,
  type VacanciesQueryParams,
} from "./lowongan-kerja.api";

export function useLowonganKerjaPage() {
  const filter = useLowonganKerjaFilter();
  const [vacancies, setVacancies] = useState<StudentJobVacancy[]>([]);
  const [isLoadingVacancies, setIsLoadingVacancies] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filter.selectedDepartment,
    filter.selectedMajor,
    filter.selectedTarget,
    filter.selectedLocation,
  ]);

  const fetchVacancies = useCallback(async () => {
    setIsLoadingVacancies(true);
    try {
      const params: VacanciesQueryParams = {
        per_page: 9,
        page: currentPage,
        sort_direction: "asc",
        order_by: "id",
      };

      if (filter.selectedDepartment !== "all") {
        params.department_id = filter.selectedDepartment;
      }
      if (filter.selectedMajor !== "all") {
        params.major_id = filter.selectedMajor;
      }
      if (filter.selectedTarget !== "all") {
        params.target_applicant_id = filter.selectedTarget;
      }
      if (filter.selectedLocation !== "all") {
        params.work_location = filter.selectedLocation;
      }

      const payload = await lowonganKerjaApi.getVacancies(params);
      if (Array.isArray(payload)) {
        setVacancies(payload);
        setLastPage(1);
        setTotalItems(payload.length);
      } else if (payload && Array.isArray(payload.data)) {
        setVacancies(payload.data);
        if (payload.meta) {
          setLastPage(payload.meta.last_page || 1);
          setTotalItems(payload.meta.total || payload.data.length);
        } else {
          setLastPage(1);
          setTotalItems(payload.data.length);
        }
      } else {
        setVacancies([]);
        setLastPage(1);
        setTotalItems(0);
      }
    } catch {
      setVacancies([]);
      setLastPage(1);
      setTotalItems(0);
    } finally {
      setIsLoadingVacancies(false);
    }
  }, [
    filter.selectedDepartment,
    filter.selectedMajor,
    filter.selectedTarget,
    filter.selectedLocation,
    currentPage,
  ]);

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  const [selectedVacancy, setSelectedVacancy] =
    useState<StudentJobVacancy | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleApply = useCallback((vacancy: StudentJobVacancy) => {
    setSelectedVacancy(vacancy);
    setIsFormOpen(true);
  }, []);

  const handleFormOpenChange = useCallback((open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setSelectedVacancy(null);
    }
  }, []);

  const hasVacancies = vacancies.length > 0;

  const emptyTitle = useMemo(() => {
    return filter.isFiltered
      ? "Tidak Ada Lowongan yang Sesuai"
      : "Belum Ada Lowongan Tersedia";
  }, [filter.isFiltered]);

  const emptyDescription = useMemo(() => {
    return filter.isFiltered
      ? "Tidak ada lowongan pekerjaan yang cocok dengan kriteria filter yang Anda pilih. Coba sesuaikan atau atur ulang filter pencarian."
      : "Saat ini belum ada lowongan pekerjaan yang dibuka untuk kualifikasi atau jurusan Anda. Silakan periksa kembali secara berkala.";
  }, [filter.isFiltered]);

  return {
    filter,
    vacancies,
    hasVacancies,
    isLoadingVacancies,
    emptyTitle,
    emptyDescription,
    currentPage,
    lastPage,
    totalItems,
    selectedVacancy,
    isFormOpen,
    onFormOpenChange: handleFormOpenChange,
    onPageChange: handlePageChange,
    reloadVacancies: fetchVacancies,
    handleApply,
  };
}
