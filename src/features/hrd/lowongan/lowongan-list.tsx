import { useState } from "react";
import {
  ClipboardList,
  Users,
  Pencil,
  Lock,
  RefreshCw,
  Briefcase,
  Loader2,
  Search,
  Trash2,
  RotateCcw,
  X,
  AlertTriangle,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Modal } from "@/components/custom/modal";
import { DataTablePagination } from "@/components/custom/data-table-pagination";
import { DatePicker } from "@/components/custom/date-picker";
import {
  type useLowonganList,
  type LowonganStatusFilter,
  type LowonganSortOption,
} from "./use-lowongan-list";
import {
  isEffectivelyActive,
  isPastDeadline,
  isQuotaFullItem,
  formatVacancyDeadline,
  quotaFillRatio,
  quotaFillClass,
} from "./lowongan-status";
import { LowonganStatusBadge } from "./lowongan-status-badge";
import { LowonganCard } from "./lowongan-card";
import type {
  HrdJobVacancyItem,
  HrdJobVacancyOptions,
} from "./lowongan.schema";

const STATUS_FILTER_OPTIONS: Array<{
  label: string;
  value: LowonganStatusFilter;
}> = [
  { label: "Semua", value: "" },
  { label: "Aktif", value: "active" },
  { label: "Ditutup", value: "closed" },
  { label: "Kuota Penuh", value: "quota_full" },
  { label: "Akan Kedaluwarsa", value: "expiring" },
];

const SORT_OPTIONS: Array<{
  label: string;
  value: LowonganSortOption;
}> = [
  { label: "Terbaru", value: "newest" },
  { label: "Deadline Terdekat", value: "deadline" },
  { label: "Kuota Paling Penuh", value: "quota" },
];

export interface LowonganListProps {
  listState: ReturnType<typeof useLowonganList>;
  options?: HrdJobVacancyOptions;
  selectedVacancyId?: string | null;
}

export type LowonganViewMode = "card" | "list";

const VIEW_MODE_STORAGE_KEY = "hrd-lowongan-view-mode";

function loadViewMode(): LowonganViewMode {
  try {
    return localStorage.getItem(VIEW_MODE_STORAGE_KEY) === "list"
      ? "list"
      : "card";
  } catch {
    return "card";
  }
}

export function LowonganList({
  listState,
  options,
  selectedVacancyId,
}: LowonganListProps) {
  const {
    vacancies,
    pagination,
    isLoading,
    fetchError,
    processingId,
    currentPage,
    search,
    statusFilter,
    majorFilter,
    targetFilter,
    jobTypeFilter,
    sort,
    handleSearchChange,
    handleClearSearch,
    handleStatusFilterChange,
    handleMajorFilterChange,
    handleTargetFilterChange,
    handleJobTypeFilterChange,
    handleSortChange,
    handleResetFilters,
    handleRetry,
    handlePageChange,
    handleToggleStatus,
    handleReopenVacancy,
    handleDeleteVacancy,
    handleViewApplicants,
    handleEditVacancy,
  } = listState;

  const [vacancyToClose, setVacancyToClose] =
    useState<HrdJobVacancyItem | null>(null);
  const [vacancyToReopen, setVacancyToReopen] =
    useState<HrdJobVacancyItem | null>(null);
  const [vacancyToDelete, setVacancyToDelete] =
    useState<HrdJobVacancyItem | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [reopenDeadline, setReopenDeadline] = useState("");
  const [reopenDeadlineError, setReopenDeadlineError] = useState<string | null>(
    null
  );
  const [viewMode, setViewMode] =
    useState<LowonganViewMode>(() => loadViewMode());

  const handleViewModeChange = (mode: LowonganViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
    } catch {
      // Preference is best-effort only; ignore storage failures.
    }
  };

  const openReopenConfirm = (item: HrdJobVacancyItem) => {
    setVacancyToReopen(item);
    setReopenDeadline("");
    setReopenDeadlineError(null);
  };

  const closeReopenConfirm = () => {
    setVacancyToReopen(null);
    setReopenDeadline("");
    setReopenDeadlineError(null);
  };

  const openDeleteConfirm = (item: HrdJobVacancyItem) => {
    setVacancyToDelete(item);
    setDeleteConfirmText("");
  };

  const closeDeleteConfirm = () => {
    setVacancyToDelete(null);
    setDeleteConfirmText("");
  };

  const isDeleteConfirmMatched =
    Boolean(vacancyToDelete) &&
    deleteConfirmText.trim() !== "" &&
    deleteConfirmText.trim() === (vacancyToDelete?.position ?? "").trim();

  const handleConfirmClose = async () => {
    if (!vacancyToClose) return;
    try {
      await handleToggleStatus(vacancyToClose);
      setVacancyToClose(null);
    } catch {
      // Retain dialog on error
    }
  };

  const handleConfirmReopen = async () => {
    if (!vacancyToReopen) return;
    if (reopenDeadline.trim() && isPastDeadline(reopenDeadline.trim())) {
      setReopenDeadlineError("Tanggal tidak boleh lewat dari hari ini.");
      return;
    }
    setReopenDeadlineError(null);
    try {
      await handleReopenVacancy(
        vacancyToReopen,
        reopenDeadline.trim() || undefined
      );
      closeReopenConfirm();
    } catch {
      // Retain dialog on error
    }
  };

  const handleConfirmDelete = async () => {
    if (!vacancyToDelete || !isDeleteConfirmMatched) return;
    try {
      await handleDeleteVacancy(vacancyToDelete);
      closeDeleteConfirm();
    } catch {
      // Retain dialog on error
    }
  };

  const hasActiveFilter = Boolean(
    search.trim() || statusFilter || majorFilter || targetFilter || jobTypeFilter
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 sm:p-6 lg:p-7 flex flex-col w-full min-w-0 max-w-full">
      {/* Header */}
      <div className="flex items-start gap-3 pb-5 border-b border-slate-100">
        <div className="mt-0.5 text-[#8D1D96]">
          <ClipboardList className="h-5 w-5 text-[#8D1D96] stroke-[2.2]" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            Daftar Lowongan Dipublikasikan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kelola seluruh lowongan kerja yang telah dipublikasikan kepada siswa
            dan alumni.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="pt-4 pb-2 flex flex-col gap-3">
        {/* Row 1: Search Input & Segmented Status Buttons */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari posisi, lokasi, atau jurusan..."
              aria-label="Cari posisi, lokasi, atau jurusan"
              className="pl-9.5 pr-9 h-10 rounded-xl border-slate-200 bg-[#F8F9FD] text-xs sm:text-sm placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-[#8D1D96] focus-visible:ring-[#8D1D96]/20"
            />
            {search.length > 0 && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Hapus teks pencarian"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Segmented Status Buttons */}
          <div
            role="group"
            aria-label="Filter status lowongan"
            className="inline-flex items-center p-1 bg-slate-100/90 rounded-xl gap-1 shrink-0 self-start md:self-auto"
          >
            {STATUS_FILTER_OPTIONS.map((filter) => {
              const isActive = statusFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleStatusFilterChange(filter.value)}
                  className={cn(
                    "h-8 px-3.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                    isActive
                      ? "bg-white text-[#8D1D96] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          <div
            role="group"
            aria-label="Mode tampilan daftar"
            className="inline-flex items-center p-1 bg-slate-100/90 rounded-xl gap-1 shrink-0 self-start md:self-auto"
          >
            <button
              type="button"
              aria-pressed={viewMode === "card"}
              aria-label="Tampilan kartu"
              title="Tampilan kartu"
              onClick={() => handleViewModeChange("card")}
              className={cn(
                "h-8 w-9 inline-flex items-center justify-center rounded-lg transition-all cursor-pointer",
                viewMode === "card"
                  ? "bg-white text-[#8D1D96] shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-pressed={viewMode === "list"}
              aria-label="Tampilan daftar"
              title="Tampilan daftar"
              onClick={() => handleViewModeChange("list")}
              className={cn(
                "h-8 w-9 inline-flex items-center justify-center rounded-lg transition-all cursor-pointer",
                viewMode === "list"
                  ? "bg-white text-[#8D1D96] shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Row 2: Dropdowns for Jurusan & Target Pelamar + Reset Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dropdown Jurusan */}
          <div className="w-full sm:w-56 shrink-0">
            <Select
              value={majorFilter || "all"}
              onValueChange={(val) =>
                handleMajorFilterChange(val === "all" ? "" : val)
              }
            >
              <SelectTrigger
                aria-label="Filter berdasarkan kategori jurusan"
                className="h-9.5 w-full rounded-xl border-slate-200 bg-[#F8F9FD] text-xs sm:text-sm text-slate-700"
              >
                <SelectValue placeholder="Semua Jurusan" />
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-60">
                <SelectItem value="all">Semua Jurusan</SelectItem>
                {options?.majors?.map((m) => (
                  <SelectItem key={String(m.id)} value={String(m.id)}>
                    {m.name} ({m.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dropdown Target Pelamar */}
          <div className="w-full sm:w-48 shrink-0">
            <Select
              value={targetFilter || "all"}
              onValueChange={(val) =>
                handleTargetFilterChange(val === "all" ? "" : val)
              }
            >
              <SelectTrigger
                aria-label="Filter berdasarkan target pelamar"
                className="h-9.5 w-full rounded-xl border-slate-200 bg-[#F8F9FD] text-xs sm:text-sm text-slate-700"
              >
                <SelectValue placeholder="Semua Target" />
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-60">
                <SelectItem value="all">Semua Target</SelectItem>
                {options?.targetApplicants?.map((t) => (
                  <SelectItem key={String(t.id)} value={String(t.id)}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dropdown Tipe Pekerjaan */}
          <div className="w-full sm:w-48 shrink-0">
            <Select
              value={jobTypeFilter || "all"}
              onValueChange={(val) =>
                handleJobTypeFilterChange(val === "all" ? "" : val)
              }
            >
              <SelectTrigger
                aria-label="Filter berdasarkan tipe pekerjaan"
                className="h-9.5 w-full rounded-xl border-slate-200 bg-[#F8F9FD] text-xs sm:text-sm text-slate-700"
              >
                <SelectValue placeholder="Semua Tipe" />
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-60">
                <SelectItem value="all">Semua Tipe</SelectItem>
                {options?.jobTypes?.map((jt) => (
                  <SelectItem key={String(jt.id)} value={String(jt.id)}>
                    {jt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dropdown Urutan */}
          <div className="w-full sm:w-52 shrink-0">
            <Select
              value={sort}
              onValueChange={(val) =>
                handleSortChange(val as LowonganSortOption)
              }
            >
              <SelectTrigger
                aria-label="Urutkan daftar lowongan"
                className="h-9.5 w-full rounded-xl border-slate-200 bg-[#F8F9FD] text-xs sm:text-sm text-slate-700"
              >
                <SelectValue placeholder="Urutan" />
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-60">
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Total Count */}
          <span className="ml-auto text-xs text-slate-500 font-medium">
            Total{" "}
            <span className="font-bold text-slate-800">
              {pagination?.total ?? 0}
            </span>{" "}
            lowongan
          </span>

          {/* Reset Filter Button */}
          {hasActiveFilter && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-9.5 px-3 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Reset Filter
            </Button>
          )}
        </div>
      </div>

      {/* Fetch Error Banner */}
      {fetchError && !isLoading && vacancies.length > 0 && (
        <div
          role="alert"
          className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50/60 px-4 py-3"
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-rose-700 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{fetchError} Data yang tampil mungkin tidak terbaru.</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="rounded-lg h-8 px-3 text-xs font-semibold text-rose-700 border-rose-200 bg-white hover:bg-rose-50 cursor-pointer shrink-0"
          >
            <RefreshCw className="h-3 w-3 mr-1.5" />
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="mt-4 flex-1 flex flex-col justify-between">
        {isLoading ? (
          viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border border-slate-100 bg-slate-50/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-16 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                  </div>
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-1/2 rounded-md" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-8 w-28 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-slate-100 bg-slate-50/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-48 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                </div>
                <Skeleton className="h-4 w-64 rounded-md" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-8 w-28 rounded-full" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </div>
            ))}
          </div>
          )
        ) : fetchError && vacancies.length === 0 ? (
          <div
            role="alert"
            className="flex flex-col items-center justify-center text-center py-16 px-4 bg-rose-50/40 rounded-2xl border border-dashed border-rose-200"
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-3">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">
              Gagal Memuat Daftar Lowongan
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              {fetchError} Periksa koneksi lalu coba lagi.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="mt-4 rounded-lg h-9 px-4 text-xs font-semibold text-rose-700 border-rose-200 bg-white hover:bg-rose-50 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Coba Lagi
            </Button>
          </div>
        ) : vacancies.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-[#8D1D96] mb-3">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">
              {hasActiveFilter
                ? "Tidak Ada Lowongan yang Cocok"
                : "Belum Ada Lowongan Dipublikasikan"}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              {hasActiveFilter
                ? "Tidak ditemukan lowongan yang cocok dengan filter atau kata kunci pencarian."
                : "Klik tombol Publikasikan Lowongan Baru di atas untuk menerbitkan posisi pekerjaan kepada siswa dan alumni."}
            </p>
          </div>
        ) : viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {vacancies.map((item: HrdJobVacancyItem) => (
              <LowonganCard
                key={item.id}
                item={item}
                isProcessing={processingId === item.id}
                isCurrentlyEdited={selectedVacancyId === item.id}
                onViewApplicants={handleViewApplicants}
                onEdit={handleEditVacancy}
                onClose={setVacancyToClose}
                onReopen={openReopenConfirm}
                onDelete={openDeleteConfirm}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3.5">
            {vacancies.map((item: HrdJobVacancyItem) => {
              const isProcessing = processingId === item.id;
              const isCurrentlyEdited = selectedVacancyId === item.id;
              const formattedDate = formatVacancyDeadline(item.deadline);
              const applicants = item.applicantsCount ?? 0;
              const quotaRatio = quotaFillRatio(item);

              const isExpired = isPastDeadline(item.deadline);
              const isQuotaFull = isQuotaFullItem(item);
              const isStaleData = isExpired || isQuotaFull;
              const effectiveActive = isEffectivelyActive(item);

              return (
                <div
                  key={item.id}
                  className={cn(
                    "p-4 sm:p-5 rounded-2xl border bg-white transition-all shadow-xs",
                    isCurrentlyEdited
                      ? "border-[#8D1D96] ring-2 ring-[#8D1D96]/20 bg-purple-50/20"
                      : "border-slate-200/70 hover:border-slate-300"
                  )}
                >
                  {/* Top row: Title + Status Badge & Pelamar / Kuota */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words">
                          {item.title || item.position}
                        </h3>
                        <LowonganStatusBadge item={item} />
                      </div>

                      {/* Details: Posisi, Lokasi, Batas */}
                      <div className="mt-1 text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
                        {item.title &&
                          item.position &&
                          item.title !== item.position && (
                            <>
                              <span className="font-medium text-slate-700">
                                Posisi: {item.position}
                              </span>
                              <span>•</span>
                            </>
                          )}
                        <span>Lokasi: {item.workLocation}</span>
                        <span>•</span>
                        <span>Batas: {formattedDate}</span>
                      </div>
                    </div>

                    {/* Pelamar / Kuota Progress Bar */}
                    <div className="shrink-0 flex flex-col items-start sm:items-end sm:pl-2 min-w-28">
                      <span className="text-xs font-semibold text-slate-600">
                        Pelamar / Kuota
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums">
                        {applicants}/{item.quota}
                      </span>
                      <div
                        role="progressbar"
                        aria-label="Kapasitas kuota pelamar"
                        aria-valuenow={applicants}
                        aria-valuemin={0}
                        aria-valuemax={item.quota}
                        className="w-24 sm:w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1"
                      >
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-300",
                            quotaFillClass(quotaRatio)
                          )}
                          style={{ width: `${quotaRatio * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Middle row: Badges for Target Pelamar and Jurusan */}
                  {((item.majors && item.majors.length > 0) ||
                    item.targetApplicant?.name) && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      {item.targetApplicant?.name && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-[#7A1384] border border-purple-200/70">
                          {item.targetApplicant.name}
                        </span>
                      )}
                      {item.majors?.map((m) => (
                        <span
                          key={String(m.id || m.code)}
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60"
                          title={m.name}
                        >
                          {m.code}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bottom row: Actions */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      {!effectiveActive && (
                        <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                          {isQuotaFull
                            ? "Kuota Terpenuhi"
                            : isExpired
                            ? `Batas Berakhir (${formattedDate})`
                            : `Ditutup Manual (Batas ${formattedDate})`}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleViewApplicants(item)}
                        aria-label={`Lihat pelamar posisi ${item.position}`}
                        className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold bg-[#F8EAF8] text-[#7A1384] hover:bg-[#F3DCF3] focus-visible:ring-2 focus-visible:ring-[#8D1D96]/40 focus-visible:outline-none transition-colors border border-[#7A1384]/20 cursor-pointer"
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span>Lihat Pelamar</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditVacancy(item)}
                        disabled={isProcessing}
                        aria-label={`Edit lowongan ${item.position}`}
                        className={cn(
                          "rounded-lg h-8 px-3 text-xs font-medium cursor-pointer transition-colors",
                          isCurrentlyEdited
                            ? "bg-[#8D1D96] text-white border-[#8D1D96] hover:bg-[#7A1384] hover:text-white"
                            : isStaleData
                              ? "text-amber-700 border-amber-300 bg-amber-50/60 hover:bg-amber-100/70"
                              : "text-slate-700 border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        <Pencil
                          className={cn(
                            "h-3 w-3 mr-1",
                            isStaleData &&
                              !isCurrentlyEdited &&
                              "text-amber-600"
                          )}
                        />
                        {isCurrentlyEdited
                          ? "Sedang Diedit"
                          : isStaleData
                            ? "Perbarui Batas / Kuota"
                            : "Edit"}
                      </Button>

                      {effectiveActive ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isProcessing}
                          onClick={() => setVacancyToClose(item)}
                          aria-label={`Tutup lowongan ${item.position}`}
                          className="rounded-lg h-8 px-3 text-xs font-medium text-rose-600 border-rose-200 bg-rose-50/40 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                        >
                          {isProcessing ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <Lock className="h-3 w-3 mr-1 text-rose-500" />
                              Tutup
                            </>
                          )}
                        </Button>
                      ) : (
                        !isStaleData && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isProcessing}
                            onClick={() => openReopenConfirm(item)}
                            aria-label={`Buka kembali lowongan ${item.position}`}
                            className="rounded-lg h-8 px-3 text-xs font-medium text-emerald-600 border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
                          >
                            {isProcessing ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <RefreshCw className="h-3 w-3 mr-1 text-emerald-500" />
                                Buka Kembali
                              </>
                            )}
                          </Button>
                        )
                      )}

                      {/* Delete Button */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => openDeleteConfirm(item)}
                        aria-label={`Hapus lowongan ${item.position}`}
                        className="rounded-lg h-8 px-3 text-xs font-medium text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 cursor-pointer"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="h-3 w-3 mr-1 text-rose-500" />
                            Hapus
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="pt-6 border-t border-slate-100 mt-4">
            <DataTablePagination
              currentPage={currentPage}
              totalPages={pagination.last_page}
              pageSize={pagination.per_page}
              totalItems={pagination.total}
              onPageChange={handlePageChange}
              role="hrd"
            />
          </div>
        )}
      </div>

      {/* Confirmation Modal to Close Vacancy */}
      <Modal
        open={Boolean(vacancyToClose)}
        onOpenChange={(open) => !open && setVacancyToClose(null)}
        title="Tutup Lowongan Pekerjaan"
        description={
          vacancyToClose
            ? `Tutup lowongan ${vacancyToClose.position}? Siswa dan alumni tidak dapat lagi melamar pada posisi ini.`
            : undefined
        }
        variant="hrd"
        headerStyle="white"
        size="sm"
        confirmText="Ya, Tutup Lowongan"
        cancelText="Batal"
        isLoading={processingId === vacancyToClose?.id}
        onConfirm={handleConfirmClose}
        onCancel={() => setVacancyToClose(null)}
      >
        <p className="text-xs sm:text-sm text-slate-600">
          Setelah ditutup, lowongan ini akan berstatus non-aktif. Kamu dapat membukanya kembali kapan saja selama batas pendaftaran belum terlewati.
        </p>
      </Modal>

      {/* Confirmation Modal to Reopen Vacancy */}
      <Modal
        open={Boolean(vacancyToReopen)}
        onOpenChange={(open) => !open && closeReopenConfirm()}
        title="Buka Kembali Lowongan"
        description={
          vacancyToReopen
            ? `Buka kembali lowongan ${vacancyToReopen.position}? Siswa dan alumni dapat kembali melamar pada posisi ini.`
            : undefined
        }
        variant="hrd"
        headerStyle="white"
        size="sm"
        confirmText="Ya, Buka Kembali"
        cancelText="Batal"
        isLoading={processingId === vacancyToReopen?.id}
        onConfirm={handleConfirmReopen}
        onCancel={closeReopenConfirm}
      >
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-slate-600">
            Lowongan akan berstatus aktif kembali dan tampil di katalog siswa
            dan alumni selama batas pendaftaran belum terlewati dan kuota belum
            penuh.
          </p>
          <div className="space-y-1.5">
            <label
              htmlFor="reopen-deadline"
              className="text-xs font-semibold text-slate-700"
            >
              Batas pendaftaran baru{" "}
              <span className="font-normal text-slate-400">
                (opsional, kosongkan jika tidak diubah)
              </span>
            </label>
            <DatePicker
              id="reopen-deadline"
              value={reopenDeadline}
              onChange={(val) => {
                setReopenDeadline(val);
                setReopenDeadlineError(null);
              }}
              placeholder="Pilih tanggal baru"
              variant="hrd"
              hasError={Boolean(reopenDeadlineError)}
            />
            {reopenDeadlineError && (
              <p
                role="alert"
                className="text-[11px] font-medium text-red-500 ml-0.5"
              >
                {reopenDeadlineError}
              </p>
            )}
            {vacancyToReopen && (
              <p className="text-[11px] text-slate-500">
                Batas saat ini: {formatVacancyDeadline(vacancyToReopen.deadline)}
              </p>
            )}
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal to Delete Vacancy */}
      <Modal
        open={Boolean(vacancyToDelete)}
        onOpenChange={(open) => !open && closeDeleteConfirm()}
        title="Hapus Lowongan Pekerjaan"
        description={
          vacancyToDelete
            ? `Hapus lowongan ${vacancyToDelete.position}? Tindakan ini tidak dapat dibatalkan.`
            : undefined
        }
        variant="hrd"
        headerStyle="white"
        size="sm"
        hideConfirmButton
        hideCancelButton
        onCancel={closeDeleteConfirm}
        footer={
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={closeDeleteConfirm}
              disabled={processingId === vacancyToDelete?.id}
              className="h-10 rounded-xl border-gray-200 hover:bg-gray-100 text-gray-700 font-medium px-5 cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              disabled={
                !isDeleteConfirmMatched ||
                processingId === vacancyToDelete?.id
              }
              className="h-10 rounded-xl font-semibold px-5 transition-all flex items-center justify-center gap-2 cursor-pointer bg-rose-600 hover:bg-rose-700 text-white shadow-sm disabled:opacity-40 disabled:pointer-events-none"
            >
              {processingId === vacancyToDelete?.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Ya, Hapus Lowongan</span>
                </>
              )}
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-rose-600 font-medium">
            Perhatian: Menghapus lowongan ini akan menghapus seluruh data
            lowongan serta{" "}
            <span className="font-bold">
              {vacancyToDelete?.applicantsCount ?? 0} pendaftaran pelamar
            </span>{" "}
            yang terkait secara permanen.
          </p>
          <div className="space-y-1.5">
            <label
              htmlFor="delete-confirm-name"
              className="text-xs font-semibold text-slate-700"
            >
              Ketik{" "}
              <span className="font-bold text-slate-900">
                {vacancyToDelete?.position}
              </span>{" "}
              untuk konfirmasi
            </label>
            <Input
              id="delete-confirm-name"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder={vacancyToDelete?.position ?? ""}
              autoComplete="off"
              className="h-10 w-full rounded-lg border border-slate-200 bg-[#F8F9FD] px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-rose-500 focus-visible:ring-2 focus-visible:ring-rose-500/20 outline-none transition-all"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default LowonganList;
