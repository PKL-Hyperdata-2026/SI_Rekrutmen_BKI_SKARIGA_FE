import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  type ChangeEvent,
} from "react";
import { toast } from "@/components/custom/sonner";
import { useDebounce } from "@/hooks/use-debounce";
import type { FilterSelectOption } from "@/components/custom/filter-select";
import { jurusanApi } from "./jurusan.api";
import { useMajorFormModal } from "./jurusan.form";
import { buildMajorColumns } from "./jurusan-table";
import type {
  MajorItem,
  DepartmentOption,
  MajorQueryParams,
} from "./jurusan.schema";

export const defaultStatusFilterOptions: FilterSelectOption[] = [
  { value: "all", label: "Semua Status" },
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Nonaktif" },
];

export function getMajorRowId(major: MajorItem): string {
  return String(major.id);
}

export function useJurusan() {
  const [majors, setMajors] = useState<MajorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentOptions, setDepartmentOptions] = useState<
    DepartmentOption[]
  >([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const debouncedSearch = useDebounce(search, 400);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchMajors = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    try {
      const params: MajorQueryParams = {
        page: currentPage,
        per_page: pageSize,
      };
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }
      if (deptFilter !== "all") {
        params.department_id = deptFilter;
      }
      if (statusFilter !== "all") {
        params.is_active = statusFilter === "active" ? 1 : 0;
      }

      const resData = await jurusanApi.getMajors(params, controller.signal);
      const items = resData?.data || [];
      const total = resData?.meta?.total ?? resData?.total ?? items.length;
      const lastPage = resData?.meta?.last_page ?? resData?.last_page ?? 1;

      setMajors(items);
      setTotalPages(lastPage);
      setTotalItems(total);
    } catch (err: unknown) {
      if (jurusanApi.isCancel(err)) {
        return;
      }
      setMajors([]);
      setTotalPages(1);
      setTotalItems(0);
      toast.error(
        jurusanApi.extractErrorMessage(err, "Gagal memuat data jurusan."),
      );
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, [currentPage, pageSize, debouncedSearch, deptFilter, statusFilter]);

  const formModal = useMajorFormModal({
    onSuccess: fetchMajors,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, deptFilter, statusFilter]);

  useEffect(() => {
    fetchMajors();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchMajors]);

  useEffect(() => {
    let ignore = false;
    setLoadingOptions(true);
    jurusanApi
      .getMajorOptions()
      .then((data) => {
        if (!ignore && data?.departments) {
          setDepartmentOptions(data.departments);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) {
          setLoadingOptions(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleToggleActive = useCallback(async (item: MajorItem) => {
    try {
      await jurusanApi.toggleMajorActive(item.id);
      toast.success(`Status ${item.name} berhasil diubah.`);
      setMajors((prev) =>
        prev.map((m) =>
          m.id === item.id ? { ...m, isActive: !m.isActive } : m,
        ),
      );
    } catch (err: unknown) {
      toast.error(
        jurusanApi.extractErrorMessage(err, "Gagal mengubah status jurusan."),
      );
    }
  }, []);

  const handleDelete = useCallback(
    async (item: MajorItem) => {
      try {
        await jurusanApi.deleteMajor(item.id);
        toast.success(`Jurusan ${item.name} berhasil dihapus.`);
        fetchMajors();
      } catch (err: unknown) {
        toast.error(
          jurusanApi.extractErrorMessage(err, "Gagal menghapus data jurusan."),
        );
        throw err;
      }
    },
    [fetchMajors],
  );

  const totalCount = totalItems;
  const activeCount = useMemo(
    () => majors.filter((m) => m.isActive).length,
    [majors],
  );
  const totalDeptCount = departmentOptions.length;

  const deptFilterOptions = useMemo<FilterSelectOption[]>(() => {
    return [
      { value: "all", label: "Semua Departemen" },
      ...departmentOptions.map((d) => ({
        value: String(d.id),
        label: `${d.name} (${d.code})`,
      })),
    ];
  }, [departmentOptions]);

  const columns = useMemo(
    () =>
      buildMajorColumns({
        onToggleActive: handleToggleActive,
        onEdit: formModal.handleOpenEdit,
        onDelete: handleDelete,
      }),
    [handleToggleActive, formModal.handleOpenEdit, handleDelete],
  );

  return {
    majors,
    loading,
    search,
    setSearch,
    handleSearchChange,
    deptFilter,
    setDeptFilter,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    departmentOptions,
    loadingOptions,
    fetchMajors,
    handleToggleActive,
    handleDelete,
    totalCount,
    activeCount,
    totalDeptCount,
    deptFilterOptions,
    statusFilterOptions: defaultStatusFilterOptions,
    columns,
    ...formModal,
  };
}
