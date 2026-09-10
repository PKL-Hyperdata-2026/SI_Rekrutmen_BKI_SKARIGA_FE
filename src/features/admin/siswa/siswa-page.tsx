import { useState, useEffect, useMemo, useCallback } from "react";
import { PageHeader, DataTable } from "@/components/custom";
import {
  UserPlus,
  Layers,
  GraduationCap,
  Pencil,
  Search,
  Briefcase,
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
import { siswaApi } from "./siswa.api";
import {
  useSiswaForm,
  toSiswaPayload,
} from "./siswa.form";
import { SiswaForm } from "./siswa-form";
import { SiswaDetailModal } from "./siswa-detail-modal";
import { buildSiswaColumns } from "./siswa-table";
import type {
  SiswaItem,
  SiswaOptionsData,
  SiswaPaginationMeta,
} from "./siswa.schema";

export function SiswaPage() {
  const [students, setStudents] = useState<SiswaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [options, setOptions] = useState<SiswaOptionsData>({
    majors: [],
    classes: [],
    employment_statuses: [],
    companies: [],
    portfolio_types: [],
    graduation_years: [],
  });

  const [search, setSearch] = useState<string>("");
  const [majorFilter, setMajorFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(15);
  const [meta, setMeta] = useState<SiswaPaginationMeta>({
    current_page: 1,
    from: 1,
    last_page: 1,
    per_page: 15,
    to: 15,
    total: 0,
  });

  // Modal Form State
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<SiswaItem | null>(null);

  // Modal Detail State
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [activeDetailStudent, setActiveDetailStudent] = useState<SiswaItem | null>(null);

  // Delete Dialog State
  const [deleteStudent, setDeleteStudent] = useState<SiswaItem | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const form = useSiswaForm(editingStudent);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page: currentPage,
        per_page: perPage,
      };

      if (search.trim()) params.search = search.trim();
      if (majorFilter !== "all") params.major_id = majorFilter;
      if (classFilter !== "all") params.class_id = classFilter;
      if (statusFilter !== "all") params.employment_status_id = statusFilter;

      const res = await siswaApi.getStudents(params);
      const resData = res.data?.data;

      if (Array.isArray(resData)) {
        setStudents(resData);
        setMeta({
          current_page: 1,
          from: 1,
          last_page: 1,
          per_page: perPage,
          to: resData.length,
          total: resData.length,
        });
      } else if (resData?.data && Array.isArray(resData.data)) {
        setStudents(resData.data);
        const metaObj = resData.meta || resData;
        const totalCount =
          typeof metaObj.total === "number"
            ? metaObj.total
            : resData.data.length;

        setMeta({
          current_page: Number(metaObj.current_page) || currentPage,
          from: metaObj.from ?? 1,
          last_page: Number(metaObj.last_page) || 1,
          per_page: Number(metaObj.per_page) || perPage,
          to: metaObj.to ?? resData.data.length,
          total: totalCount,
        });
      } else {
        setStudents([]);
        setMeta({
          current_page: 1,
          from: 0,
          last_page: 1,
          per_page: perPage,
          to: 0,
          total: 0,
        });
      }
    } catch {
      setStudents([]);
      setMeta({
        current_page: 1,
        from: 0,
        last_page: 1,
        per_page: perPage,
        to: 0,
        total: 0,
      });
      toast.error("Gagal memuat data siswa.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, search, majorFilter, classFilter, statusFilter]);

  useEffect(() => {
    let ignore = false;
    siswaApi
      .getFilterOptions()
      .then((filterOptions) => {
        if (!ignore) {
          setOptions(filterOptions);
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
      graduation_year: "",
      employment_status_id: "",
      current_company_id: "",
      current_position: "",
      social_media: "",
      is_active: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = useCallback(
    (item: SiswaItem) => {
      setEditingStudent(item);

      const socialMediaValue =
        typeof item.socialMedia === "string"
          ? item.socialMedia
          : (item.socialMedia?.profile_url as string) || "";

      form.reset({
        nis: item.nis,
        full_name: item.fullName || item.user?.fullName || "",
        email: item.email || item.user?.email || "",
        phone: item.phone || item.user?.phone || "",
        major_id: item.majorId ? String(item.majorId) : "",
        class_id: item.classId ? String(item.classId) : "",
        password: "",
        graduation_year: item.graduationYear ? String(item.graduationYear) : "",
        employment_status_id: item.employmentStatusId
          ? String(item.employmentStatusId)
          : "",
        current_company_id: item.currentCompanyId
          ? String(item.currentCompanyId)
          : "",
        current_position: item.currentPosition || "",
        social_media: socialMediaValue,
        is_active: item.isActive,
      });
      setIsFormOpen(true);
    },
    [form]
  );

  const handleOpenDetail = useCallback(async (item: SiswaItem) => {
    setActiveDetailStudent(item);
    setIsDetailOpen(true);
    try {
      const res = await siswaApi.getStudent(item.id);
      if (res.data?.data) {
        setActiveDetailStudent(res.data.data);
      }
    } catch {
      // Menggunakan data awal jika endpoint detail lambat merespons
    }
  }, []);

  const handleSubmitForm = form.handleSubmit(async (values) => {
    try {
      const payload = toSiswaPayload(values);

      if (editingStudent) {
        await siswaApi.updateStudent(editingStudent.id, payload);
        toast.success("Data siswa berhasil diperbarui.");
      } else {
        await siswaApi.createStudent(payload);
        toast.success("Data siswa baru berhasil ditambahkan.");
      }

      setIsFormOpen(false);
      fetchStudents();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Terjadi kesalahan saat menyimpan data siswa.";
      toast.error(msg);
    }
  });

  const handleDelete = async () => {
    if (!deleteStudent) return;
    setDeleting(true);
    try {
      await siswaApi.deleteStudent(deleteStudent.id);
      const studentName = deleteStudent.fullName || deleteStudent.user?.fullName || "Siswa";
      toast.success(`Data siswa ${studentName} berhasil dihapus.`);
      setDeleteStudent(null);
      fetchStudents();
    } catch {
      toast.error("Gagal menghapus data siswa.");
    } finally {
      setDeleting(false);
    }
  };

  const handleUploadPortfolio = async (studentId: number | string, formData: FormData) => {
    try {
      const res = await siswaApi.uploadPortfolio(studentId, formData);
      if (res.data?.data) {
        setActiveDetailStudent(res.data.data);
      }
      toast.success("Berkas portofolio berhasil diunggah.");
      fetchStudents();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal mengunggah berkas portofolio.";
      toast.error(msg);
      throw err;
    }
  };

  const handleDeletePortfolio = async (
    studentId: number | string,
    portfolioId: number | string
  ) => {
    try {
      const res = await siswaApi.deletePortfolio(studentId, portfolioId);
      if (res.data?.data) {
        setActiveDetailStudent(res.data.data);
      }
      toast.success("Berkas portofolio berhasil dihapus.");
      fetchStudents();
    } catch {
      toast.error("Gagal menghapus berkas portofolio.");
    }
  };

  const columns = useMemo(
    () =>
      buildSiswaColumns({
        onDetail: handleOpenDetail,
        onEdit: handleOpenEdit,
        onDelete: (item) => setDeleteStudent(item),
      }),
    [handleOpenDetail, handleOpenEdit]
  );

  return (
    <div className="space-y-6">
      {/* 1. Page Header Sesuai Desain Figma */}
      <PageHeader
        variant="admin"
        badge="Master data Modul"
        badgeIcon={<Layers className="h-3.5 w-3.5" />}
        title="Data Siswa Kelas 12 Aktif"
        description="Temukan peluang karir terbaik dari industri mitra resmi SKARIGA."
      >
        <PageHeader.Button
          variant="primary"
          icon={<UserPlus className="h-4 w-4" />}
          onClick={handleOpenCreate}
        >
          Tambah Siswa
        </PageHeader.Button>
      </PageHeader>

      {/* 2. Filter Bar Sesuai Desain Figma */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        {/* Search Bar */}
        <div className="relative w-full lg:flex-1 lg:max-w-xl min-w-0 sm:min-w-[320px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari nama siswa, NIS, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9.5 pr-4 bg-slate-50/60 border-slate-200 rounded-xl h-10 text-xs placeholder:text-slate-400 shadow-2xs focus-visible:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Filter 1: Semua Jurusan */}
          <Select
            value={majorFilter}
            onValueChange={(val) => {
              setMajorFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[160px] sm:w-[185px] h-10 rounded-xl bg-white border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50/80 transition-colors shadow-2xs cursor-pointer">
              <div className="flex items-center gap-2 truncate">
                <GraduationCap className="h-4 w-4 text-sky-600 shrink-0" />
                <SelectValue placeholder="Semua Jurusan" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-md">
              <SelectItem value="all" className="text-xs font-medium">Semua Jurusan</SelectItem>
              {options.majors.map((m) => (
                <SelectItem key={m.id} value={String(m.id)} className="text-xs font-medium">
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filter 2: Semua Kelas */}
          <Select
            value={classFilter}
            onValueChange={(val) => {
              setClassFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[130px] sm:w-[150px] h-10 rounded-xl bg-white border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50/80 transition-colors shadow-2xs cursor-pointer">
              <SelectValue placeholder="Semua Kelas" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-md">
              <SelectItem value="all" className="text-xs font-medium">Semua Kelas</SelectItem>
              {(options.classes || []).map((c) => (
                <SelectItem key={c.id} value={String(c.id)} className="text-xs font-medium">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filter 3: Status Kerja : Semua */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[170px] sm:w-[195px] h-10 rounded-xl bg-white border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50/80 transition-colors shadow-2xs cursor-pointer">
              <div className="flex items-center gap-2 truncate">
                <Briefcase className="h-4 w-4 text-emerald-600 shrink-0" />
                <SelectValue placeholder="Semua Status Kerja" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-md">
              <SelectItem value="all" className="text-xs font-medium">Semua Status Kerja</SelectItem>
              {(options.employment_statuses || []).map((st) => (
                <SelectItem key={st.id} value={String(st.id)} className="text-xs font-medium">
                  {st.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Total Count Badge Sesuai Figma */}
          <div className="hidden sm:inline-flex items-center justify-end px-3.5 h-10 rounded-xl border border-slate-200/80 bg-white text-xs font-medium text-slate-600 whitespace-nowrap shadow-2xs">
            Total : <span className="font-bold text-purple-700 ml-1">{meta.total} Siswa/Siswi</span>
          </div>
        </div>
      </div>

      {/* 3. Table Sesuai Desain Figma */}
      <DataTable
        columns={columns}
        data={students}
        loading={loading}
        showNumbering={true}
        numberStartIndex={(meta.current_page - 1) * meta.per_page + 1}
        pagination={{
          currentPage: meta.current_page,
          totalPages: meta.last_page,
          totalItems: meta.total,
          pageSize: meta.per_page,
          onPageChange: (page) => setCurrentPage(page),
          onPageSizeChange: (size) => {
            setPerPage(size);
            setCurrentPage(1);
          },
          role: "admin",
        }}
        emptyMessage="Tidak ada data siswa yang ditemukan"
        emptyDescription="Ubah filter jurusan atau status kerja yang dipilih."
        getRowId={(student) => String(student.id)}
      />

      {/* Modal Form Tambah / Edit */}
      <Modal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        variant="admin"
        size="md"
        headerIcon={
          editingStudent ? <Pencil className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />
        }
        title={editingStudent ? "Edit Data Siswa" : "Tambah Siswa Baru"}
        description={
          editingStudent
            ? "Perbarui informasi profil siswa, penempatan rombel kelas, dan status keterserapan."
            : "Lengkapi data siswa baru untuk menerbitkan akun akses portal karir BKI Skariga."
        }
        confirmText={editingStudent ? "Perbarui Siswa" : "Simpan Siswa"}
        cancelText="Batal"
        isLoading={form.formState.isSubmitting}
        onConfirm={handleSubmitForm}
      >
        <form onSubmit={handleSubmitForm}>
          <SiswaForm
            form={form}
            classFallbackLabel={editingStudent?.class?.name}
            majorFallbackLabel={editingStudent?.major?.name}
            statusFallbackLabel={editingStudent?.employmentStatus?.name}
            companyFallbackLabel={editingStudent?.currentCompany?.name}
            isEditing={Boolean(editingStudent)}
          />
        </form>
      </Modal>

      {/* Modal Detail & Portofolio Siswa */}
      <SiswaDetailModal
        isOpen={isDetailOpen}
        student={activeDetailStudent}
        options={options}
        onClose={() => {
          setIsDetailOpen(false);
          setActiveDetailStudent(null);
        }}
        onUploadPortfolio={handleUploadPortfolio}
        onDeletePortfolio={handleDeletePortfolio}
      />

      {/* Dialog Konfirmasi Hapus Siswa */}
      <AlertDialog
        open={Boolean(deleteStudent)}
        onOpenChange={(open) => !open && setDeleteStudent(null)}
      >
        <AlertDialogContent className="rounded-3xl p-6 sm:p-7 border-none shadow-xl bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg text-slate-900">
              Hapus Data Siswa
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
              Apakah Anda yakin ingin menghapus data siswa{" "}
              <strong className="text-slate-900 font-semibold">
                {deleteStudent?.fullName || deleteStudent?.user?.fullName}
              </strong>{" "}
              (NIS: {deleteStudent?.nis})? Akun portal terkait akan dinonaktifkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-5 border-none bg-transparent p-0 flex-row justify-end gap-2.5">
            <AlertDialogCancel className="h-10 rounded-xl px-5 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium cursor-pointer">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="h-10 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl px-5 cursor-pointer shadow-sm"
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
