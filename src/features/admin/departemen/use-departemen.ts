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
import { departemenApi } from "./departemen.api";
import { useDepartmentFormModal } from "./departemen.form";
import { buildDepartmentColumns } from "./departemen-table";
import type {
  DepartmentItem,
  DepartmentQueryParams,
} from "./departemen.schema";

export const statusFilterOptions: FilterSelectOption[] = [
  { value: "all", label: "Semua Status" },
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Nonaktif" },
];

export function getDepartmentRowId(dept: DepartmentItem): string {
  return String(dept.id);
}

export function useDepartemen() {
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const debouncedSearch = useDebounce(search, 400);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchDepartments = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    try {
      const params: DepartmentQueryParams = { per_page: 50 };
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }
      if (statusFilter !== "all") {
        params.is_active = statusFilter === "active" ? 1 : 0;
      }

      const data = await departemenApi.getDepartments(
        params,
        controller.signal,
      );
      setDepartments(data);
    } catch (err: unknown) {
      if (departemenApi.isCancel(err)) {
        return;
      }
      setDepartments([]);
      toast.error("Gagal memuat data departemen.");
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchDepartments();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchDepartments]);

  const formModal = useDepartmentFormModal({
    onSuccess: fetchDepartments,
  });

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleToggleActive = useCallback(async (dept: DepartmentItem) => {
    try {
      await departemenApi.toggleDepartmentActive(dept.id);
      setDepartments((prev) =>
        prev.map((item) =>
          item.id === dept.id ? { ...item, isActive: !item.isActive } : item,
        ),
      );
      toast.success(`Status departemen ${dept.name} berhasil diubah.`);
    } catch {
      toast.error("Gagal mengubah status aktif departemen.");
    }
  }, []);

  const handleDelete = useCallback(
    async (dept: DepartmentItem) => {
      try {
        await departemenApi.deleteDepartment(dept.id);
        toast.success(`Departemen ${dept.name} berhasil dihapus.`);
        fetchDepartments();
      } catch (error: unknown) {
        toast.error(
          departemenApi.extractErrorMessage(
            error,
            "Gagal menghapus data departemen.",
          ),
        );
        throw error;
      }
    },
    [fetchDepartments],
  );

  const totalCount = departments.length;
  const { activeCount, totalMajorsCount } = useMemo(() => {
    let active = 0;
    let majors = 0;
    for (const d of departments) {
      if (d.isActive) {
        active++;
      }
      majors += d.majorsCount || 0;
    }
    return { activeCount: active, totalMajorsCount: majors };
  }, [departments]);

  const columns = useMemo(
    () =>
      buildDepartmentColumns({
        onToggleActive: handleToggleActive,
        onEdit: formModal.handleOpenEdit,
        onDelete: handleDelete,
      }),
    [handleToggleActive, formModal.handleOpenEdit, handleDelete],
  );

  return {
    departments,
    loading,
    search,
    setSearch,
    handleSearchChange,
    statusFilter,
    setStatusFilter,
    fetchDepartments,
    handleToggleActive,
    handleDelete,
    totalCount,
    activeCount,
    totalMajorsCount,
    columns,
    ...formModal,
  };
}
