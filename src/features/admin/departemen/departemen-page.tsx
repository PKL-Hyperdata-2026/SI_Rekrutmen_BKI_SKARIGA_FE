import { useState, useEffect, useMemo, useCallback } from "react";
import { PageHeader, StatCard, DataTable } from "@/components/custom";
import {
  Building2,
  Search,
  Plus,
  Layers,
  CheckCircle2,
  GraduationCap,
  Pencil,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";
import { departemenApi } from "./departemen.api";
import { useDepartmentForm, toCreateDepartmentPayload } from "./departemen.form";
import { DepartmentForm } from "./departemen-form";
import { buildDepartmentColumns } from "./departemen-table";
import type { DepartmentItem } from "./departemen.schema";

export function DepartemenPage() {
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteDept, setDeleteDept] = useState<DepartmentItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const form = useDepartmentForm(editingDept);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { per_page: 50 };
      if (search) params.search = search;
      if (statusFilter !== "all") params.is_active = statusFilter === "active" ? 1 : 0;

      const res = await departemenApi.getDepartments(params);
      setDepartments(res.data?.data?.data || []);
    } catch {
      setDepartments([]);
      toast.error("Gagal memuat data departemen.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchDepartments();
    }, 300);
    return () => clearTimeout(timeout);
  }, [fetchDepartments]);

  const handleOpenCreate = () => {
    setEditingDept(null);
    form.reset({
      code: "",
      name: "",
      description: "",
      is_active: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = useCallback((item: DepartmentItem) => {
    setEditingDept(item);
    form.reset({
      code: item.code,
      name: item.name,
      description: item.description || "",
      is_active: item.isActive,
    });
    setIsFormOpen(true);
  }, [form]);

  const handleSubmitForm = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const payload = toCreateDepartmentPayload(values);

      if (editingDept) {
        await departemenApi.updateDepartment(editingDept.id, payload);
        toast.success("Data departemen berhasil diperbarui.");
      } else {
        await departemenApi.createDepartment(payload);
        toast.success("Departemen baru berhasil ditambahkan.");
      }

      setIsFormOpen(false);
      fetchDepartments();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Terjadi kesalahan saat menyimpan data departemen.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  });

  const handleToggleActive = useCallback(async (dept: DepartmentItem) => {
    try {
      await departemenApi.toggleDepartmentActive(dept.id);
      setDepartments((prev) =>
        prev.map((item) =>
          item.id === dept.id ? { ...item, isActive: !item.isActive } : item
        )
      );
      toast.success(`Status departemen ${dept.name} berhasil diubah.`);
    } catch {
      toast.error("Gagal mengubah status aktif departemen.");
    }
  }, []);

  const handleDelete = async () => {
    if (!deleteDept) return;
    setDeleting(true);
    try {
      await departemenApi.deleteDepartment(deleteDept.id);
      toast.success(`Departemen ${deleteDept.name} berhasil dihapus.`);
      setDeleteDept(null);
      fetchDepartments();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menghapus data departemen.";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  const totalCount = departments.length;
  const activeCount = useMemo(
    () => departments.filter((d) => d.isActive).length,
    [departments]
  );
  const totalMajorsCount = useMemo(
    () => departments.reduce((acc, curr) => acc + (curr.majorsCount || 0), 0),
    [departments]
  );

  const columns = useMemo(
    () =>
      buildDepartmentColumns({
        onToggleActive: handleToggleActive,
        onEdit: handleOpenEdit,
        onDelete: (item) => setDeleteDept(item),
      }),
    [handleToggleActive, handleOpenEdit]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        variant="admin"
        title="Data Departemen"
        description="Kelola struktur departemen induk dan bidang keahlian vokasi sekolah."
      >
        <PageHeader.Button
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={handleOpenCreate}
        >
          Tambah Departemen
        </PageHeader.Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Layers}
          color="purple"
          label="Total Departemen"
          value={totalCount}
        />
        <StatCard
          icon={CheckCircle2}
          color="teal"
          label="Departemen Aktif"
          value={activeCount}
        />
        <StatCard
          icon={GraduationCap}
          color="sky"
          label="Total Jurusan"
          value={totalMajorsCount}
        />
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari kode, nama departemen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9.5 pr-4 bg-slate-50 border-slate-200 rounded-xl h-10 text-xs placeholder:text-slate-400 shadow-2xs"
          />
        </div>

        <div className="flex w-full md:w-auto items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-36 h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Semua Status</SelectItem>
              <SelectItem value="active" className="text-xs">Aktif</SelectItem>
              <SelectItem value="inactive" className="text-xs">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={departments}
        loading={loading}
        emptyMessage="Tidak ada departemen yang ditemukan"
        emptyDescription="Silakan tambahkan departemen baru atau sesuaikan kata kunci pencarian"
        emptyIcon={<Building2 className="h-8 w-8 text-slate-400" />}
        getRowId={(dept) => String(dept.id)}
      />

      <Modal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        variant="admin"
        size="md"
        headerIcon={editingDept ? <Pencil className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
        title={editingDept ? "Edit Departemen" : "Tambah Departemen Baru"}
        description={
          editingDept
            ? "Perbarui informasi dan deskripsi bidang keahlian departemen."
            : "Lengkapi data departemen baru sebagai induk program keahlian/jurusan."
        }
        confirmText={editingDept ? "Perbarui Departemen" : "Simpan Departemen"}
        cancelText="Batal"
        isLoading={submitting}
        onConfirm={handleSubmitForm}
      >
        <form onSubmit={handleSubmitForm}>
          <DepartmentForm form={form} />
        </form>
      </Modal>

      <AlertDialog open={!!deleteDept} onOpenChange={(open) => !open && setDeleteDept(null)}>
        <AlertDialogContent className="rounded-3xl p-6 sm:p-7 border-none shadow-xl bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg text-slate-900">
              Hapus Departemen
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
              Apakah Anda yakin ingin menghapus data departemen <strong className="text-slate-900 font-semibold">{deleteDept?.name}</strong>? Tindakan ini tidak dapat dibatalkan jika masih memiliki jurusan terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-5 border-none bg-transparent p-0 flex-row justify-end gap-2.5">
            <AlertDialogCancel className="h-10 rounded-xl px-5 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium cursor-pointer">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="h-10 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl px-5 cursor-pointer shadow-sm"
            >
              {deleting ? "Menghapus..." : "Ya, Hapus Departemen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export const DataDepartemenPage = DepartemenPage;
