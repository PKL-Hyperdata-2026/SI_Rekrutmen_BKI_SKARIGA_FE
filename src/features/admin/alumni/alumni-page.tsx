import { useState, useEffect, useMemo, useCallback } from "react";
import { PageHeader, StatCard, DataTable } from "@/components/custom";
import {
  UserPlus,
  Search,
  Users,
  GraduationCap,
  Briefcase,
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
import { toast } from "@/components/custom/sonner";
import { alumniApi } from "./alumni.api";
import { useAlumniForm, toCreateAlumniPayload } from "./alumni.form";
import { AlumniForm } from "./alumni-form";
import { buildAlumniColumns } from "./alumni-table";
import type { AlumniItem, AlumniOptionsData } from "./alumni.schema";

export function AlumniPage() {
  const [alumniList, setAlumniList] = useState<AlumniItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<AlumniOptionsData>({
    companies: [],
    majors: [],
    classes: [],
    employment_statuses: [],
    graduation_years: [],
  });

  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [majorFilter, setMajorFilter] = useState("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<AlumniItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteAlumni, setDeleteAlumni] = useState<AlumniItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const form = useAlumniForm(editingAlumni);

  const fetchAlumni = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (yearFilter !== "all") params.graduation_year = yearFilter;
      if (majorFilter !== "all") params.major_id = majorFilter;

      const res = await alumniApi.getAlumni(params);
      setAlumniList(res.data?.data?.data || []);
    } catch {
      setAlumniList([]);
      toast.error("Gagal memuat data alumni.");
    } finally {
      setLoading(false);
    }
  }, [search, yearFilter, majorFilter]);

  useEffect(() => {
    let ignore = false;
    alumniApi
      .getAlumniOptions()
      .then((res) => {
        if (!ignore && res.data?.data) {
          setOptions(res.data.data);
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAlumni();
    }, 300);
    return () => clearTimeout(timeout);
  }, [fetchAlumni]);

  const handleOpenCreate = () => {
    setEditingAlumni(null);
    form.reset({
      user_id: "",
      nis: "",
      full_name: "",
      phone: "",
      major_id: "",
      class_id: "",
      graduation_year: String(new Date().getFullYear()),
      employment_status_id: "",
      current_company_id: "",
      current_position: "",
      starting_salary: "",
      waiting_time_months: "",
      is_active: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = useCallback((item: AlumniItem) => {
    setEditingAlumni(item);
    form.reset({
      user_id: item.userId ? String(item.userId) : "",
      nis: item.nis || "",
      full_name: item.fullName || item.user?.fullName || "",
      phone: item.phone || item.user?.phone || "",
      major_id: item.majorId ? String(item.majorId) : "",
      class_id: item.classId ? String(item.classId) : "",
      graduation_year: item.graduationYear
        ? String(item.graduationYear)
        : String(new Date().getFullYear()),
      employment_status_id: item.employmentStatusId
        ? String(item.employmentStatusId)
        : "",
      current_company_id: item.currentCompanyId
        ? String(item.currentCompanyId)
        : "",
      current_position: item.currentPosition || "",
      starting_salary: item.startingSalary ? String(item.startingSalary) : "",
      waiting_time_months: item.waitingTimeMonths
        ? String(item.waitingTimeMonths)
        : "",
      is_active: item.isActive,
    });
    setIsFormOpen(true);
  }, [form]);

  const handleSubmitForm = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const payload = toCreateAlumniPayload(values);

      if (editingAlumni) {
        await alumniApi.updateAlumni(editingAlumni.id, payload);
        toast.success("Data alumni berhasil diperbarui.");
      } else {
        await alumniApi.createAlumni(payload);
        toast.success("Data alumni berhasil ditambahkan.");
      }

      setIsFormOpen(false);
      fetchAlumni();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Terjadi kesalahan saat menyimpan data alumni.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  });

  const handleDelete = async () => {
    if (!deleteAlumni) return;
    setDeleting(true);
    try {
      await alumniApi.deleteAlumni(deleteAlumni.id);
      const name = deleteAlumni.fullName || deleteAlumni.user?.fullName || "Alumni";
      toast.success(`Data alumni ${name} berhasil dihapus.`);
      setDeleteAlumni(null);
      fetchAlumni();
    } catch {
      toast.error("Gagal menghapus data alumni.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo(
    () =>
      buildAlumniColumns({
        onEdit: handleOpenEdit,
        onDelete: (item) => setDeleteAlumni(item),
      }),
    [handleOpenEdit]
  );


  return (
    <div className="space-y-6">
      <PageHeader
        variant="admin"
        title="Data Alumni Skariga"
        description="Database riwayat lulusan, status keterserapan kerja, wirausaha, dan lanjut studi."
      >
        <PageHeader.Button
          variant="primary"
          icon={<UserPlus className="h-4 w-4" />}
          onClick={handleOpenCreate}
        >
          Tambah Alumni
        </PageHeader.Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Alumni Terdata"
          value={alumniList.length}
          icon={Users}
          color="blue"
        />
        <StatCard
          label="Terserap Kerja & Wirausaha"
          value={
            alumniList.filter((a) => Boolean(a.employmentStatus || a.currentCompany))
              .length
          }
          icon={Briefcase}
          color="teal"
        />
        <StatCard
          label="Angkatan Kelulusan"
          value={options.graduation_years?.length || 0}
          icon={GraduationCap}
          color="sky"
        />
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari nama alumni, NIS, perusahaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9.5 pr-4 bg-slate-50 border-slate-200 rounded-xl h-10 text-xs placeholder:text-slate-400 shadow-2xs"
          />
        </div>

        <div className="flex w-full md:w-auto items-center gap-3">
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-full md:w-44 h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer">
              <SelectValue placeholder="Semua Angkatan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Semua Angkatan</SelectItem>
              {(options.graduation_years || []).map((yr) => (
                <SelectItem key={yr} value={String(yr)} className="text-xs">
                  Lulusan {yr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={majorFilter} onValueChange={setMajorFilter}>
            <SelectTrigger className="w-full md:w-48 h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer">
              <SelectValue placeholder="Semua Jurusan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Semua Jurusan</SelectItem>
              {(options.majors || []).map((m) => (
                <SelectItem key={m.id} value={String(m.id)} className="text-xs">
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={alumniList}
        loading={loading}
        emptyMessage="Tidak ada data alumni yang ditemukan"
        emptyDescription="Coba sesuaikan kata kunci pencarian atau filter angkatan/jurusan"
        emptyIcon={<Users className="h-8 w-8 text-slate-400" />}
        getRowId={(alumni) => String(alumni.id)}
      />

      <Modal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        variant="admin"
        size="md"
        headerIcon={editingAlumni ? <Pencil className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
        title={editingAlumni ? "Edit Data Alumni" : "Tambah Data Alumni"}
        description={
          editingAlumni
            ? "Perbarui riwayat penelusuran karir, status keterserapan, dan profil alumni."
            : "Lengkapi data alumni untuk integrasi pelacakan tracer study BKI Skariga."
        }
        confirmText={editingAlumni ? "Perbarui Alumni" : "Simpan Alumni"}
        cancelText="Batal"
        isLoading={submitting}
        onConfirm={handleSubmitForm}
      >
        <form onSubmit={handleSubmitForm}>
          <AlumniForm
            form={form}
            options={options}
            isEditing={!!editingAlumni}
          />
        </form>
      </Modal>

      <AlertDialog open={!!deleteAlumni} onOpenChange={(open) => !open && setDeleteAlumni(null)}>
        <AlertDialogContent className="rounded-3xl p-6 sm:p-7 border-none shadow-xl bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg text-slate-900">
              Hapus Data Alumni
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
              Apakah Anda yakin ingin menghapus data alumni{" "}
              <strong className="text-slate-900 font-semibold">
                {deleteAlumni?.fullName || deleteAlumni?.user?.fullName}
              </strong>
              ? Data ini akan dipindahkan ke arsip sistem.
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
              {deleting ? "Menghapus..." : "Ya, Hapus Alumni"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export const DataAlumniPage = AlumniPage;
