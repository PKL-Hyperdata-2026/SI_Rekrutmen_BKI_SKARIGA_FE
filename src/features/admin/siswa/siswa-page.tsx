import { useState, useEffect, useMemo, useCallback } from "react";
import { PageHeader, StatCard, DataTable } from "@/components/custom";
import {
  UserPlus,
  Search,
  Users,
  GraduationCap,
  School,
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
import { siswaApi } from "./siswa.api";
import { useSiswaForm, toCreateSiswaPayload } from "./siswa.form";
import { SiswaForm } from "./siswa-form";
import { buildSiswaColumns } from "./siswa-table";
import type { SiswaItem, SiswaOptionItem } from "./siswa.schema";

export function SiswaPage() {
  const [students, setStudents] = useState<SiswaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [majors, setMajors] = useState<SiswaOptionItem[]>([]);
  const [classes, setClasses] = useState<SiswaOptionItem[]>([]);

  const [search, setSearch] = useState("");
  const [majorFilter, setMajorFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<SiswaItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteStudent, setDeleteStudent] = useState<SiswaItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const form = useSiswaForm(editingStudent);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (majorFilter !== "all") params.major_id = majorFilter;
      if (classFilter !== "all") params.class_id = classFilter;

      const res = await siswaApi.getStudents(params);
      setStudents(res.data?.data?.data || []);
    } catch {
      setStudents([]);
      toast.error("Gagal memuat data siswa.");
    } finally {
      setLoading(false);
    }
  }, [search, majorFilter, classFilter]);

  useEffect(() => {
    let ignore = false;
    siswaApi
      .getStudentOptions()
      .then((res) => {
        if (!ignore && res.data?.data) {
          setMajors(res.data.data.majors || []);
          setClasses(res.data.data.classes || []);
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(timeout);
  }, [fetchStudents]);

  const handleOpenCreate = () => {
    setEditingStudent(null);
    form.reset({
      nis: "",
      full_name: "",
      email: "",
      phone: "",
      major_id: "",
      class_id: "",
      password: "",
      is_active: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = useCallback((item: SiswaItem) => {
    setEditingStudent(item);
    form.reset({
      nis: item.nis,
      full_name: item.fullName,
      email: item.email,
      phone: item.phone || "",
      major_id: item.majorId ? String(item.majorId) : "",
      class_id: item.classId ? String(item.classId) : "",
      password: "",
      is_active: item.isActive,
    });
    setIsFormOpen(true);
  }, [form]);

  const handleSubmitForm = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const payload = toCreateSiswaPayload(values);

      if (editingStudent) {
        await siswaApi.updateStudent(editingStudent.id, payload);
        toast.success("Data siswa berhasil diperbarui.");
      } else {
        await siswaApi.createStudent(payload);
        toast.success("Data siswa berhasil ditambahkan.");
      }

      setIsFormOpen(false);
      fetchStudents();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Terjadi kesalahan saat menyimpan data siswa.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  });

  const handleDelete = async () => {
    if (!deleteStudent) return;
    setDeleting(true);
    try {
      await siswaApi.deleteStudent(deleteStudent.id);
      toast.success(`Data siswa ${deleteStudent.fullName} berhasil dihapus.`);
      setDeleteStudent(null);
      fetchStudents();
    } catch {
      toast.error("Gagal menghapus data siswa.");
    } finally {
      setDeleting(false);
    }
  };

  const activeCount = useMemo(
    () => students.filter((s) => s.isActive).length,
    [students]
  );

  const columns = useMemo(
    () =>
      buildSiswaColumns({
        onEdit: handleOpenEdit,
        onDelete: (item) => setDeleteStudent(item),
      }),
    [handleOpenEdit]
  );


  return (
    <div className="space-y-6">
      <PageHeader
        variant="admin"
        title="Data Siswa Kelas 12 Aktif"
        description="Kelola data siswa aktif, NIS, jurusan, kelas, dan akun akses portal karir siswa."
      >
        <PageHeader.Button
          variant="primary"
          icon={<UserPlus className="h-4 w-4" />}
          onClick={handleOpenCreate}
        >
          Tambah Siswa
        </PageHeader.Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Siswa Kelas 12"
          value={students.length}
          icon={Users}
          color="blue"
        />
        <StatCard
          label="Siswa Akun Aktif"
          value={activeCount}
          icon={School}
          color="amber"
        />
        <StatCard
          label="Kompetensi Keahlian"
          value={majors.length}
          icon={GraduationCap}
          color="sky"
        />
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari nama siswa, NIS, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9.5 pr-4 bg-slate-50 border-slate-200 rounded-xl h-10 text-xs placeholder:text-slate-400 shadow-2xs"
          />
        </div>

        <div className="flex w-full md:w-auto items-center gap-3">
          <Select value={majorFilter} onValueChange={setMajorFilter}>
            <SelectTrigger className="w-full md:w-48 h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer">
              <SelectValue placeholder="Semua Jurusan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Semua Jurusan</SelectItem>
              {majors.map((m) => (
                <SelectItem key={m.id} value={String(m.id)} className="text-xs">
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-full md:w-40 h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer">
              <SelectValue placeholder="Semua Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Semua Kelas</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c.id} value={String(c.id)} className="text-xs">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={students}
        loading={loading}
        emptyMessage="Tidak ada data siswa yang ditemukan"
        emptyDescription="Coba sesuaikan kata kunci pencarian atau filter jurusan/kelas"
        emptyIcon={<Users className="h-8 w-8 text-slate-400" />}
        getRowId={(student) => String(student.id)}
      />

      <Modal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        variant="admin"
        size="md"
        headerIcon={editingStudent ? <Pencil className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
        title={editingStudent ? "Edit Data Siswa" : "Tambah Siswa Baru"}
        description={
          editingStudent
            ? "Perbarui informasi profil siswa, penempatan rombel kelas, dan jurusan."
            : "Lengkapi data siswa baru untuk menerbitkan akun akses portal BKI Skariga."
        }
        confirmText={editingStudent ? "Perbarui Siswa" : "Simpan Siswa"}
        cancelText="Batal"
        isLoading={submitting}
        onConfirm={handleSubmitForm}
      >
        <form onSubmit={handleSubmitForm}>
          <SiswaForm
            form={form}
            majors={majors}
            classes={classes}
            isEditing={!!editingStudent}
          />
        </form>
      </Modal>

      <AlertDialog open={!!deleteStudent} onOpenChange={(open) => !open && setDeleteStudent(null)}>
        <AlertDialogContent className="rounded-3xl p-6 sm:p-7 border-none shadow-xl bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg text-slate-900">
              Hapus Data Siswa
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
              Apakah Anda yakin ingin menghapus data siswa <strong className="text-slate-900 font-semibold">{deleteStudent?.fullName}</strong> ({deleteStudent?.nis})? Akun portal terkait akan langsung dinonaktifkan.
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
              {deleting ? "Menghapus..." : "Ya, Hapus Siswa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export const DataSiswaPage = SiswaPage;
