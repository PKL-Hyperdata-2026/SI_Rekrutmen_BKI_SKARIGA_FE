import { useState, useEffect, useMemo, useCallback } from "react";
import { FormProvider } from "react-hook-form";
import { PageHeader, DataTable } from "@/components/custom";
import {
  GraduationCap,
  Briefcase,
  Plus,
  FileSpreadsheet,
  Sparkles,
  Search,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { alumniApi, type AlumniFilterOptions } from "./alumni.api";
import {
  useAlumniForm,
  toCreateAlumniPayload,
} from "./alumni.form";
import { AlumniFormModal } from "./alumni-form";
import { AlumniDetailModal } from "./alumni-detail-modal";
import { buildAlumniColumns } from "./alumni-table";
import type {
  AlumniItem,
  AlumniPaginationMeta,
} from "./alumni.schema";

const FALLBACK_EMPLOYMENT_STATUSES = [
  { id: "1", name: "Bekerja (Kolektif/Mandiri)" },
  { id: "2", name: "Wirausaha" },
  { id: "3", name: "Melanjutkan Studi" },
  { id: "4", name: "Belum Bekerja" },
];

function resolveReferenceName(
  ref: string | { name?: string } | null | undefined
): string | undefined {
  if (!ref || typeof ref === "string") return undefined;
  return ref.name;
}

function resolveClassMajorFallbackLabel(
  alumni: AlumniItem | null
): string | undefined {
  if (!alumni) return undefined;
  const className = resolveReferenceName(alumni.class);
  const majorName = resolveReferenceName(alumni.major);
  if (className) return majorName ? `${className} - ${majorName}` : className;
  if (majorName) return `Jurusan: ${majorName}`;
  return undefined;
}

export function AlumniPage() {
  const [alumniList, setAlumniList] = useState<AlumniItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<AlumniPaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 15;

  const [options, setOptions] = useState<AlumniFilterOptions>({
    statuses: [],
    portfolioTypes: [],
    graduationYears: [],
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<AlumniItem | null>(null);

  // Detail modal state
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeDetailAlumni, setActiveDetailAlumni] =
    useState<AlumniItem | null>(null);

  // Delete dialog state
  const [deleteAlumni, setDeleteAlumni] = useState<AlumniItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const form = useAlumniForm(editingAlumni);

  const fetchAlumni = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {
        page: currentPage,
        per_page: perPage,
      };
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (yearFilter !== "all") params.graduation_year = yearFilter;
      if (statusFilter !== "all") params.employment_status_id = statusFilter;

      const res = await alumniApi.getAlumni(params);
      const resPayload = res.data as Record<string, any> | undefined;
      const nested = resPayload?.data;

      if (Array.isArray(nested)) {
        setAlumniList(nested as AlumniItem[]);
        const metaObj = resPayload?.meta;
        if (metaObj) {
          setMeta(metaObj);
        } else {
          setMeta({
            current_page: resPayload?.current_page || currentPage,
            last_page: resPayload?.last_page || 1,
            per_page: resPayload?.per_page || perPage,
            total: resPayload?.total ?? nested.length,
            from: resPayload?.from ?? 1,
            to: resPayload?.to ?? nested.length,
          });
        }
      } else if (
        nested &&
        typeof nested === "object" &&
        Array.isArray(nested.data)
      ) {
        setAlumniList(nested.data as AlumniItem[]);
        if (nested.meta) {
          setMeta(nested.meta);
        } else {
          setMeta({
            current_page: nested.current_page || currentPage,
            last_page: nested.last_page || 1,
            per_page: nested.per_page || perPage,
            total: nested.total ?? nested.data.length,
            from: nested.from ?? 1,
            to: nested.to ?? nested.data.length,
          });
        }
      } else {
        setAlumniList([]);
        setMeta(null);
      }
    } catch {
      setAlumniList([]);
      setMeta(null);
      toast.error("Gagal memuat data alumni.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, debouncedSearch, yearFilter, statusFilter]);

  useEffect(() => {
    let ignore = false;
    alumniApi
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
    fetchAlumni();
  }, [fetchAlumni]);

  const handleYearFilterChange = (val: string) => {
    setYearFilter(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handleOpenCreate = () => {
    setEditingAlumni(null);
    form.reset({
      mode: "graduate",
      user_id: "",
      nis: "",
      full_name: "",
      phone: "",
      email: "",
      major_id: "",
      class_id: "",
      graduation_year: String(new Date().getFullYear()),
      employment_status_id: "",
      current_company_id: "",
      current_position: "",
      profile_url: "",
      company_name_manual: "",
      starting_salary: "",
      waiting_time_months: "",
      is_active: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = useCallback(
    (item: AlumniItem) => {
      setEditingAlumni(item);

      const profileUrl =
        typeof item.socialMedia === "string"
          ? item.socialMedia
          : (item.socialMedia?.profile_url as string) ||
            (item.socialMedia?.linkedin as string) ||
            "";

      form.reset({
        mode: item.userId ? "graduate" : "manual",
        user_id: item.userId ? String(item.userId) : "",
        nis: item.nis || "",
        full_name: item.fullName || item.user?.fullName || "",
        phone: item.phone || item.user?.phone || "",
        email: item.email || item.user?.email || "",
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
        profile_url: profileUrl,
        company_name_manual: item.currentCompany?.name || "",
        starting_salary: item.startingSalary ? String(item.startingSalary) : "",
        waiting_time_months: item.waitingTimeMonths
          ? String(item.waitingTimeMonths)
          : "",
        is_active: item.isActive ?? true,
      });
      setIsFormOpen(true);
    },
    [form],
  );

  const handleSubmitForm = form.handleSubmit(async (values) => {
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
    }
  });

  const handleOpenDetail = useCallback(async (item: AlumniItem) => {
    setActiveDetailAlumni(item);
    setIsDetailOpen(true);
    try {
      const res = await alumniApi.getAlumniById(item.id);
      const detail = res.data?.data || res.data;
      if (detail && typeof detail === "object") {
        setActiveDetailAlumni(detail as AlumniItem);
      }
    } catch {
      // Retain item if request fails
    }
  }, []);

  const handleUploadPortfolio = async (
    alumniId: string | number,
    formData: FormData,
  ) => {
    await alumniApi.uploadPortfolio(alumniId, formData);
    fetchAlumni();
  };

  const handleDeletePortfolio = async (
    alumniId: string | number,
    portfolioId: string | number,
  ) => {
    await alumniApi.deletePortfolio(alumniId, portfolioId);
    fetchAlumni();
  };

  const handleUpdateAlumniFromDetail = async (
    id: string | number,
    payload: Record<string, unknown>,
  ) => {
    const res = await alumniApi.updateAlumni(id, payload);
    const updated = res.data?.data;
    if (updated && typeof updated === "object") {
      setActiveDetailAlumni((prev) =>
        prev ? { ...prev, ...updated } : (updated as AlumniItem),
      );
    }
    fetchAlumni();
  };

  const handleRefreshDetail = async () => {
    if (activeDetailAlumni?.id) {
      try {
        const res = await alumniApi.getAlumniById(activeDetailAlumni.id);
        const detail = res.data?.data || res.data;
        if (detail && typeof detail === "object") {
          setActiveDetailAlumni(detail as AlumniItem);
        }
      } catch {}
    }
    fetchAlumni();
  };

  const handleDelete = async () => {
    if (!deleteAlumni) return;
    setDeleting(true);
    try {
      await alumniApi.deleteAlumni(deleteAlumni.id);
      const name =
        deleteAlumni.fullName || deleteAlumni.user?.fullName || "Alumni";
      toast.success(`Data alumni ${name} berhasil dihapus.`);
      setDeleteAlumni(null);
      fetchAlumni();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menghapus data alumni.";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  const employmentStatusOptions = useMemo(() => {
    if (options.statuses && options.statuses.length > 0) {
      return options.statuses;
    }
    return FALLBACK_EMPLOYMENT_STATUSES;
  }, [options.statuses]);

  const columns = useMemo(
    () =>
      buildAlumniColumns({
        onDetail: handleOpenDetail,
        onEdit: handleOpenEdit,
        onDelete: (item) => setDeleteAlumni(item),
        currentPage,
        perPage,
      }),
    [handleOpenDetail, handleOpenEdit, currentPage, perPage],
  );

  const paginationConfig = useMemo(() => {
    if (!meta || meta.last_page <= 1) return undefined;
    return {
      currentPage,
      totalPages: meta.last_page,
      totalItems: meta.total,
      pageSize: perPage,
      onPageChange: (page: number) => setCurrentPage(page),
    };
  }, [meta, currentPage, perPage]);

  return (
    <div className="space-y-6">
      {/* 1. Page Header Sesuai Desain Figma & Theme Admin */}
      <PageHeader
        variant="admin"
        badge="Master data Modul"
        badgeIcon={<Sparkles className="h-3.5 w-3.5" />}
        title="Data Alumni Skariga"
        description="Temukan peluang karir terbaik dari industri mitra resmi SKARIGA."
      >
        <PageHeader.Button
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={handleOpenCreate}
        >
          Tambah Alumni
        </PageHeader.Button>
        <PageHeader.Button
          variant="glass"
          icon={<FileSpreadsheet className="h-4 w-4 text-purple-200" />}
          onClick={() => toast.info("Fitur Import Excel akan segera hadir.")}
        >
          Import Excel
        </PageHeader.Button>
      </PageHeader>

      {/* 2. Filter Bar Sesuai Desain Figma + Master Siswa Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        {/* Search Bar */}
        <div className="relative w-full lg:flex-1 lg:max-w-md min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari nama alumni, NIS, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9.5 pr-4 bg-slate-50/60 border-slate-200 rounded-xl h-10 text-xs placeholder:text-slate-400 shadow-2xs focus-visible:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Dropdown 1: Angkatan */}
          <Select value={yearFilter} onValueChange={handleYearFilterChange}>
            <SelectTrigger className="w-[150px] sm:w-[170px] h-10 rounded-xl bg-white border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50/80 transition-colors shadow-2xs cursor-pointer">
              <div className="flex items-center gap-2 truncate">
                <GraduationCap className="h-4 w-4 text-purple-600 shrink-0" />
                <SelectValue placeholder="Semua Angkatan" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-md">
              <SelectItem value="all" className="text-xs font-medium">
                Semua Angkatan
              </SelectItem>
              {(options.graduationYears || []).map((yr) => (
                <SelectItem
                  key={yr}
                  value={String(yr)}
                  className="text-xs font-medium"
                >
                  Lulusan {yr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Dropdown 2: Status Karir */}
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[175px] sm:w-[200px] h-10 rounded-xl bg-white border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50/80 transition-colors shadow-2xs cursor-pointer">
              <div className="flex items-center gap-2 truncate">
                <Briefcase className="h-4 w-4 text-purple-600 shrink-0" />
                <SelectValue placeholder="Status Karir : Semua" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-md">
              <SelectItem value="all" className="text-xs font-medium">
                Status Karir : Semua
              </SelectItem>
              {employmentStatusOptions.map((st) => (
                <SelectItem
                  key={st.id}
                  value={String(st.id)}
                  className="text-xs font-medium"
                >
                  {st.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Total Count Pill */}
          <div className="font-bold text-purple-700 bg-purple-50/70 border border-purple-100 px-3.5 py-2 rounded-xl text-xs whitespace-nowrap shadow-2xs">
            Total : {meta?.total !== undefined ? meta.total : alumniList.length}{" "}
            Alumni
          </div>
        </div>
      </div>

      {/* 3. Data Table & Pagination */}
      <DataTable
        columns={columns}
        data={alumniList}
        loading={loading}
        showNumbering={false}
        pagination={paginationConfig}
        emptyMessage="Tidak ada data alumni yang ditemukan"
        emptyDescription="Coba sesuaikan filter angkatan atau status karir."
        emptyIcon={<GraduationCap className="h-8 w-8 text-slate-400" />}
        getRowId={(alumni) => String(alumni.id)}
      />

      {/* 4. Form Modal (Create / Edit) */}
      <FormProvider {...form}>
        <AlumniFormModal
          form={form}
          classMajorFallbackLabel={resolveClassMajorFallbackLabel(editingAlumni)}
          statusFallbackLabel={resolveReferenceName(editingAlumni?.employmentStatus)}
          isEditing={Boolean(editingAlumni)}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitForm}
          isSubmitting={form.formState.isSubmitting}
        />
      </FormProvider>

      {/* 5. Detail & E-Portfolio Modal */}
      <AlumniDetailModal
        open={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setActiveDetailAlumni(null);
        }}
        onOpenChange={(open) => {
          setIsDetailOpen(open);
          if (!open) setActiveDetailAlumni(null);
        }}
        alumni={activeDetailAlumni}
        portfolioTypes={options.portfolioTypes}
        onUpdateAlumni={handleUpdateAlumniFromDetail}
        onUploadPortfolio={handleUploadPortfolio}
        onDeletePortfolio={handleDeletePortfolio}
        onRefresh={handleRefreshDetail}
      />

      {/* 6. Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(deleteAlumni)}
        onOpenChange={(open) => !open && setDeleteAlumni(null)}
      >
        <AlertDialogContent className="rounded-3xl p-6 sm:p-7 border-none shadow-xl bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg text-slate-900">
              Hapus Data Alumni
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
              Apakah Anda yakin ingin menghapus data alumni{" "}
              <strong className="text-slate-900 font-semibold">
                {deleteAlumni?.fullName ||
                  deleteAlumni?.user?.fullName ||
                  "ini"}
              </strong>
              ? Data ini akan dipindahkan ke arsip sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-5 border-none bg-transparent p-0 flex-row justify-end gap-2.5">
            <AlertDialogCancel
              disabled={deleting}
              className="h-10 rounded-xl px-5 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="h-10 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl px-5 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  <span>Menghapus...</span>
                </>
              ) : (
                "Ya, Hapus Alumni"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export const DataAlumniPage = AlumniPage;
