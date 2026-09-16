import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Sparkles,
  RefreshCw,
  Search,
  Plus,
  GraduationCap,
  Briefcase,
  SlidersHorizontal,
  ArrowUpDown,
  Trash2,
} from "lucide-react";
import { PageHeader, DataTable } from "@/components/custom";
import { Button } from "@/components/ui/button";
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

import { adminTracerApi } from "./tracer-study.api";
import { TracerStatsCards } from "./tracer-study-stats-cards";
import { TracerDetailModal } from "./tracer-study-detail-modal";
import { TracerFormModal } from "./tracer-study-form-modal";
import { buildTracerColumns } from "./tracer-study-table";
import type {
  AdminTracerItem,
  TracerMetrics,
  TracerFilterOptions,
  TracerPaginationMeta,
  SubmitAdminTracerPayload,
} from "./tracer-study.schema";

export function TracerPage() {
  const [tracerList, setTracerList] = useState<AdminTracerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<TracerPaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const [metrics, setMetrics] = useState<TracerMetrics | null>(null);
  const [options, setOptions] = useState<TracerFilterOptions>({
    majors: [],
    graduation_years: [],
    career_statuses: [],
    available_alumni: [],
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [majorFilter, setMajorFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [isSyncing, setIsSyncing] = useState(false);

  const [activeDetailItem, setActiveDetailItem] = useState<AdminTracerItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminTracerItem | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [deletingItem, setDeletingItem] = useState<AdminTracerItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchMetricsAndOptions = useCallback(async () => {
    try {
      const [metricsData, optionsData] = await Promise.all([
        adminTracerApi.getTracerMetrics(),
        adminTracerApi.getTracerOptions(),
      ]);
      setMetrics(metricsData);
      setOptions(optionsData);
    } catch {
      // Ignored if error occurs in background
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const load = async () => {
      try {
        const [metricsData, optionsData] = await Promise.all([
          adminTracerApi.getTracerMetrics(),
          adminTracerApi.getTracerOptions(),
        ]);
        if (!isSubscribed) return;
        setMetrics(metricsData);
        setOptions(optionsData);
      } catch {
        // Ignored if error occurs in background
      }
    };

    void load();

    return () => {
      isSubscribed = false;
    };
  }, [fetchMetricsAndOptions]);

  const fetchTracerStudies = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {
        page: currentPage,
        per_page: perPage,
        sort_by: sortBy,
        sort_dir: sortDir,
      };

      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (statusFilter !== "all") params.career_status = statusFilter;
      if (majorFilter !== "all") params.major_id = majorFilter;
      if (yearFilter !== "all") params.graduation_year = yearFilter;

      const resData = await adminTracerApi.getTracerStudies(params);

      if (resData) {
        setTracerList(resData.data || []);
        if (resData.meta) {
          setMeta(resData.meta);
        } else if (
          resData.current_page !== undefined &&
          resData.last_page !== undefined &&
          resData.per_page !== undefined &&
          resData.total !== undefined
        ) {
          setMeta({
            current_page: resData.current_page,
            last_page: resData.last_page,
            per_page: resData.per_page,
            total: resData.total,
          });
        }
      }
    } catch {
      toast.error("Gagal memuat data tracer study.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, debouncedSearch, statusFilter, majorFilter, yearFilter, sortBy, sortDir]);

  useEffect(() => {
    let isSubscribed = true;

    const load = async () => {
      setLoading(true);
      try {
        const params: Record<string, unknown> = {
          page: currentPage,
          per_page: perPage,
          sort_by: sortBy,
          sort_dir: sortDir,
        };

        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        if (statusFilter !== "all") params.career_status = statusFilter;
        if (majorFilter !== "all") params.major_id = majorFilter;
        if (yearFilter !== "all") params.graduation_year = yearFilter;

        const resData = await adminTracerApi.getTracerStudies(params);
        if (!isSubscribed) return;

        if (resData) {
          setTracerList(resData.data || []);
          if (resData.meta) {
            setMeta(resData.meta);
          } else if (
            resData.current_page !== undefined &&
            resData.last_page !== undefined &&
            resData.per_page !== undefined &&
            resData.total !== undefined
          ) {
            setMeta({
              current_page: resData.current_page,
              last_page: resData.last_page,
              per_page: resData.per_page,
              total: resData.total,
            });
          }
        }
      } catch {
        if (isSubscribed) {
          toast.error("Gagal memuat data tracer study.");
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      isSubscribed = false;
    };
  }, [currentPage, perPage, debouncedSearch, statusFilter, majorFilter, yearFilter, sortBy, sortDir]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await adminTracerApi.syncTracerStudies();
      const count = res?.synced_count ?? 0;
      toast.success(
        count > 0
          ? `Berhasil menyinkronkan ${count} data penempatan & profil alumni ke Tracer Study.`
          : "Semua data alumni sudah tersinkronisasi."
      );
      fetchTracerStudies();
      fetchMetricsAndOptions();
    } catch {
      toast.error("Gagal menyinkronkan data profil dan penempatan alumni.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOpenDetail = useCallback(async (item: AdminTracerItem) => {
    setActiveDetailItem(item);
    setIsDetailOpen(true);
    try {
      const detail = await adminTracerApi.getTracerDetail(item.id);
      if (detail) {
        setActiveDetailItem(detail);
      }
    } catch {
      // Retain active item
    }
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = useCallback((item: AdminTracerItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  }, []);

  const handleSubmitForm = async (payload: SubmitAdminTracerPayload) => {
    setIsSubmittingForm(true);
    try {
      if (editingItem) {
        await adminTracerApi.updateTracerStudy(editingItem.id, payload);
        toast.success("Data tracer study alumni berhasil diperbarui.");
      } else {
        await adminTracerApi.createTracerStudy(payload);
        toast.success("Data tracer study alumni berhasil ditambahkan.");
      }

      setIsFormOpen(false);
      fetchTracerStudies();
      fetchMetricsAndOptions();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Terjadi kesalahan saat menyimpan data tracer study.";
      toast.error(msg);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      await adminTracerApi.deleteTracerStudy(deletingItem.id);
      toast.success("Data tracer study alumni berhasil dihapus (soft delete).");
      setDeletingItem(null);
      fetchTracerStudies();
      fetchMetricsAndOptions();
    } catch {
      toast.error("Gagal menghapus data tracer study alumni.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = useMemo(
    () =>
      buildTracerColumns({
        onDetail: handleOpenDetail,
        onEdit: handleOpenEdit,
        onDelete: (item) => setDeletingItem(item),
      }),
    [handleOpenDetail, handleOpenEdit]
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
      <PageHeader
        variant="admin"
        badge="Modul Monitoring Penempatan"
        badgeIcon={<Sparkles className="h-3.5 w-3.5" />}
        title="Penelurusan Alumni & Keterserapan DUDI"
        description="Temukan peluang karir terbaik dari industri mitra resmi SKARIGA."
      >
        <PageHeader.Button
          variant="glass"
          icon={<RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />}
          onClick={handleSync}
          disabled={isSyncing}
          className="cursor-pointer"
        >
          {isSyncing ? "Menyinkronkan..." : "Sync Profil & Penempatan"}
        </PageHeader.Button>
      </PageHeader>

      <TracerStatsCards
        metrics={metrics}
        activeStatus={statusFilter}
        onStatusChange={(status) => {
          setStatusFilter(status);
          setCurrentPage(1);
        }}
      />

      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Data Tracer Study & Profil Pelamar
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              Penyaluran data tersinkronisasi langsung dari akun Siswa/Alumni dan Modul Penempatan
            </p>
          </div>

          <Button
            type="button"
            onClick={handleOpenAdd}
            className="rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold h-10 px-4.5 gap-2 shrink-0 shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Data</span>
          </Button>
        </div>

        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
          <div className="relative w-full xl:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari nama alumni, NIS, tempat kerja..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9.5 pr-4 bg-slate-50/70 border-slate-200 rounded-xl h-10 text-xs placeholder:text-slate-400 shadow-2xs focus-visible:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[155px] h-10 rounded-xl bg-white border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs">
                <div className="flex items-center gap-2 truncate">
                  <Briefcase className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                  <SelectValue placeholder="Semua Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200">
                <SelectItem value="all" className="text-xs font-medium">
                  Semua Status
                </SelectItem>
                <SelectItem value="bekerja" className="text-xs font-medium">
                  Bekerja
                </SelectItem>
                <SelectItem value="lanjut_studi" className="text-xs font-medium">
                  Kuliah
                </SelectItem>
                <SelectItem value="wirausaha" className="text-xs font-medium">
                  Wirausaha
                </SelectItem>
                <SelectItem value="mencari_pekerjaan" className="text-xs font-medium">
                  Mencari Kerja
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={majorFilter}
              onValueChange={(val) => {
                setMajorFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[155px] h-10 rounded-xl bg-white border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs">
                <div className="flex items-center gap-2 truncate">
                  <GraduationCap className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                  <SelectValue placeholder="Semua Jurusan" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200">
                <SelectItem value="all" className="text-xs font-medium">
                  Semua Jurusan
                </SelectItem>
                {options.majors.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)} className="text-xs font-medium">
                    {m.name} ({m.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={yearFilter}
              onValueChange={(val) => {
                setYearFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[145px] h-10 rounded-xl bg-white border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs">
                <div className="flex items-center gap-2 truncate">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                  <SelectValue placeholder="Semua Angkatan" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200">
                <SelectItem value="all" className="text-xs font-medium">
                  Semua Angkatan
                </SelectItem>
                {options.graduation_years.map((y) => (
                  <SelectItem key={y} value={String(y)} className="text-xs font-medium">
                    Lulusan {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={`${sortBy}:${sortDir}`}
              onValueChange={(val) => {
                const [sb, sd] = val.split(":");
                setSortBy(sb);
                setSortDir(sd as "asc" | "desc");
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[155px] h-10 rounded-xl bg-white border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs">
                <div className="flex items-center gap-2 truncate">
                  <ArrowUpDown className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                  <SelectValue placeholder="Urutkan" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200">
                <SelectItem value="created_at:desc" className="text-xs font-medium">
                  Terbaru
                </SelectItem>
                <SelectItem value="name:asc" className="text-xs font-medium">
                  Nama (A - Z)
                </SelectItem>
                <SelectItem value="name:desc" className="text-xs font-medium">
                  Nama (Z - A)
                </SelectItem>
                <SelectItem value="salary:desc" className="text-xs font-medium">
                  Gaji Tertinggi
                </SelectItem>
                <SelectItem value="start_date:desc" className="text-xs font-medium">
                  Tanggal Masuk Kerja
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={tracerList}
          loading={loading}
          showNumbering={false}
          pagination={paginationConfig}
          emptyMessage="Tidak ada data tracer study yang ditemukan"
          emptyDescription="Coba sesuaikan filter pencarian, status karir, atau jurusan."
          emptyIcon={<Briefcase className="h-8 w-8 text-slate-400" />}
          getRowId={(item) => String(item.id)}
        />
      </div>

      <TracerDetailModal
        item={activeDetailItem}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <TracerFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitForm}
        editingItem={editingItem}
        availableAlumni={options.available_alumni || []}
        isSubmitting={isSubmittingForm}
      />

      <AlertDialog
        open={Boolean(deletingItem)}
        onOpenChange={(open) => !open && setDeletingItem(null)}
      >
        <AlertDialogContent className="rounded-3xl max-w-md p-6">
          <AlertDialogHeader>
            <div className="h-11 w-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-2">
              <Trash2 className="h-5 w-5" />
            </div>
            <AlertDialogTitle className="text-base font-bold text-slate-900">
              Hapus Data Tracer Study?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed">
              Data tracer study milik{" "}
              <strong className="text-slate-800">
                {deletingItem?.studentAlumni?.fullName || "Alumni"}
              </strong>{" "}
              akan dihapus dari sistem menggunakan mekanisme soft delete. Data masih dapat dipulihkan
              jika diperlukan di masa mendatang.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-2">
            <AlertDialogCancel
              disabled={isDeleting}
              className="rounded-xl text-xs font-semibold h-10 px-5"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold h-10 px-5 cursor-pointer shadow-xs"
            >
              {isDeleting ? "Menghapus..." : "Ya, Hapus Data"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export const TracerStudyPage = TracerPage;
