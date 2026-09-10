import { useState, useEffect, useMemo, useCallback } from "react";
import { PageHeader, StatCard, DataTable } from "@/components/custom";
import {
  GraduationCap,
  Search,
  Plus,
  Building2,
  CheckCircle2,
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
import { Modal } from "@/components/custom/modal";
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
import { toast } from "@/components/custom/sonner";
import { jurusanApi } from "./jurusan.api";
import { useMajorForm, toCreateMajorPayload } from "./jurusan.form";
import { MajorForm } from "./jurusan-form";
import { buildMajorColumns } from "./jurusan-table";
import type { MajorItem, DepartmentOption } from "./jurusan.schema";

export function JurusanPage() {
  const [majors, setMajors] = useState<MajorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentOptions, setDepartmentOptions] = useState<DepartmentOption[]>([]);

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMajor, setEditingMajor] = useState<MajorItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteMajor, setDeleteMajor] = useState<MajorItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const form = useMajorForm(editingMajor);

  const fetchMajors = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { per_page: 50 };
      if (search) params.search = search;
      if (deptFilter !== "all") params.department_id = deptFilter;
      if (statusFilter !== "all") params.is_active = statusFilter === "active" ? 1 : 0;

      const res = await jurusanApi.getMajors(params);
      setMajors(res.data?.data?.data || []);
    } catch {
      setMajors([]);
      toast.error("Gagal memuat data jurusan.");
    } finally {
      setLoading(false);
    }
  }, [search, deptFilter, statusFilter]);

  useEffect(() => {
    let ignore = false;
    jurusanApi
      .getMajorOptions()
      .then((res) => {
        if (!ignore && res.data?.data?.departments) {
          setDepartmentOptions(res.data.data.departments);
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchMajors();
    }, 300);
    return () => clearTimeout(timeout);
  }, [fetchMajors]);

  const handleOpenCreate = () => {
    setEditingMajor(null);
    form.reset({
      department_id: departmentOptions[0] ? String(departmentOptions[0].id) : "",
      code: "",
      name: "",
      description: "",
      is_active: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = useCallback((item: MajorItem) => {
    setEditingMajor(item);
    form.reset({
      department_id: String(item.departmentId),
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
      const payload = toCreateMajorPayload(values);

      if (editingMajor) {
        await jurusanApi.updateMajor(editingMajor.id, payload);
        toast.success("Data jurusan berhasil diperbarui.");
      } else {
        await jurusanApi.createMajor(payload);
        toast.success("Jurusan baru berhasil ditambahkan.");
      }

      setIsFormOpen(false);
      fetchMajors();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Terjadi kesalahan saat menyimpan data jurusan.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  });

  const handleToggleActive = useCallback(async (major: MajorItem) => {
    try {
      await jurusanApi.toggleMajorActive(major.id);
      setMajors((prev) =>
        prev.map((item) =>
          item.id === major.id ? { ...item, isActive: !item.isActive } : item
        )
      );
      toast.success(`Status jurusan ${major.name} berhasil diubah.`);
    } catch {
      toast.error("Gagal mengubah status aktif jurusan.");
    }
  }, []);

  const handleDelete = async () => {
    if (!deleteMajor) return;
    setDeleting(true);
    try {
      await jurusanApi.deleteMajor(deleteMajor.id);
      toast.success(`Jurusan ${deleteMajor.name} berhasil dihapus.`);
      setDeleteMajor(null);
      fetchMajors();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menghapus data jurusan.";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  const totalCount = majors.length;
  const activeCount = useMemo(
    () => majors.filter((m) => m.isActive).length,
    [majors]
  );
  const totalDeptCount = useMemo(
    () => new Set(majors.map((m) => String(m.departmentId))).size,
    [majors]
  );

  const columns = useMemo(
    () =>
      buildMajorColumns({
        onToggleActive: handleToggleActive,
        onEdit: handleOpenEdit,
        onDelete: (item) => setDeleteMajor(item),
      }),
    [handleToggleActive, handleOpenEdit]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        variant="admin"
        title="Data Jurusan"
        description="Kelola program keahlian dan konsentrasi vokasi berdasarkan departemen induk."
      >
        <PageHeader.Button
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={handleOpenCreate}
        >
          Tambah Jurusan
        </PageHeader.Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={GraduationCap}
          color="sky"
          label="Total Jurusan"
          value={totalCount}
        />
        <StatCard
          icon={CheckCircle2}
          color="teal"
          label="Jurusan Aktif"
          value={activeCount}
        />
        <StatCard
          icon={Building2}
          color="purple"
          label="Departemen Terkait"
          value={totalDeptCount}
        />
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari kode, nama jurusan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9.5 pr-4 bg-slate-50 border-slate-200 rounded-xl h-10 text-xs placeholder:text-slate-400 shadow-2xs"
          />
        </div>

        <div className="flex w-full md:w-auto items-center gap-3">
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-full md:w-56 h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer">
              <SelectValue placeholder="Semua Departemen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Semua Departemen</SelectItem>
              {departmentOptions.map((d) => (
                <SelectItem key={d.id} value={String(d.id)} className="text-xs">
                  {d.name} ({d.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
        data={majors}
        loading={loading}
        emptyMessage="Tidak ada jurusan yang ditemukan"
        emptyDescription="Silakan tambahkan jurusan baru atau sesuaikan kata kunci pencarian"
        emptyIcon={<GraduationCap className="h-8 w-8 text-slate-400" />}
        getRowId={(major) => String(major.id)}
      />

      <Modal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        variant="admin"
        size="md"
        headerIcon={editingMajor ? <Pencil className="h-5 w-5" /> : <GraduationCap className="h-5 w-5" />}
        title={editingMajor ? "Edit Jurusan" : "Tambah Jurusan Baru"}
        description={
          editingMajor
            ? "Perbarui informasi dan induk departemen program keahlian."
            : "Lengkapi data jurusan baru dan pilih departemen induk keahlian."
        }
        confirmText={editingMajor ? "Perbarui Jurusan" : "Simpan Jurusan"}
        cancelText="Batal"
        isLoading={submitting}
        onConfirm={handleSubmitForm}
      >
        <form onSubmit={handleSubmitForm}>
          <MajorForm form={form} departments={departmentOptions} />
        </form>
      </Modal>

      <AlertDialog open={!!deleteMajor} onOpenChange={(open) => !open && setDeleteMajor(null)}>
        <AlertDialogContent className="rounded-3xl p-6 sm:p-7 border-none shadow-xl bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg text-slate-900">
              Hapus Jurusan
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
              Apakah Anda yakin ingin menghapus data jurusan <strong className="text-slate-900 font-semibold">{deleteMajor?.name}</strong>? Tindakan ini tidak dapat dibatalkan jika masih digunakan oleh data siswa/alumni atau lowongan kerja.
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
              {deleting ? "Menghapus..." : "Ya, Hapus Jurusan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export const DataJurusanPage = JurusanPage;
