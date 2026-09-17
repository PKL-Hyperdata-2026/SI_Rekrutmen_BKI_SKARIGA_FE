import { useState } from "react";
import { format, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  ClipboardList,
  Users,
  Pencil,
  Lock,
  RefreshCw,
  Briefcase,
  Loader2,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/custom/modal";
import { DataTablePagination } from "@/components/custom/data-table-pagination";
import {
  isPastDeadline,
  type useLowonganList,
  type LowonganStatusFilter,
} from "./use-lowongan-list";
import type { HrdJobVacancyItem } from "./lowongan.schema";

const STATUS_FILTER_OPTIONS: Array<{
  label: string;
  value: LowonganStatusFilter;
}> = [
  { label: "Semua", value: "" },
  { label: "Aktif", value: "active" },
  { label: "Ditutup", value: "closed" },
];

interface LowonganListProps {
  listState: ReturnType<typeof useLowonganList>;
  selectedVacancyId?: string | null;
}

function formatDeadline(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  try {
    const cleanStr = dateStr.split("T")[0];
    return format(parseISO(cleanStr), "d MMM yyyy", { locale: idLocale });
  } catch {
    return dateStr;
  }
}

export function LowonganList({
  listState,
  selectedVacancyId,
}: LowonganListProps) {
  const {
    vacancies,
    pagination,
    isLoading,
    processingId,
    currentPage,
    search,
    statusFilter,
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
    handleToggleStatus,
    handleViewApplicants,
    handleEditVacancy,
  } = listState;

  const [vacancyToClose, setVacancyToClose] =
    useState<HrdJobVacancyItem | null>(null);

  const handleConfirmClose = () => {
    if (!vacancyToClose) return;
    handleToggleStatus(vacancyToClose);
    setVacancyToClose(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 sm:p-6 lg:p-7 flex flex-col h-full">
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

      {/* Search Input Bar & Status Filter */}
      <div className="pt-4 pb-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari posisi, lokasi, atau jurusan..."
            aria-label="Cari posisi, lokasi, atau jurusan"
            className="pl-9.5 pr-4 h-10 rounded-xl border-slate-200 bg-[#F8F9FD] text-xs sm:text-sm placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-[#8D1D96] focus-visible:ring-[#8D1D96]/20"
          />
        </div>
        <div
          role="group"
          aria-label="Filter status lowongan"
          className="flex items-center gap-1.5 shrink-0"
        >
          {STATUS_FILTER_OPTIONS.map((filter) => {
            const isActive = statusFilter === filter.value;
            return (
              <Button
                key={filter.value}
                type="button"
                variant="outline"
                size="sm"
                aria-pressed={isActive}
                onClick={() => handleStatusFilterChange(filter.value)}
                className={cn(
                  "h-10 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                  isActive
                    ? "bg-[#8D1D96] text-white border-[#8D1D96] hover:bg-[#7A1384] hover:text-white"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 flex-1 flex flex-col justify-between">
        {isLoading ? (
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
        ) : vacancies.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-[#8D1D96] mb-3">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">
              {search || statusFilter
                ? "Tidak Ada Lowongan yang Cocok"
                : "Belum Ada Lowongan Dipublikasikan"}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              {search || statusFilter
                ? "Tidak ditemukan lowongan yang cocok dengan filter atau kata kunci pencarian."
                : "Gunakan formulir di sebelah kiri untuk menerbitkan posisi lowongan pekerjaan baru kepada siswa dan alumni."}
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {vacancies.map((item: HrdJobVacancyItem) => {
              const isProcessing = processingId === item.id;
              const isCurrentlyEdited = selectedVacancyId === item.id;
              const formattedDate = formatDeadline(item.deadline);
              const applicants = item.applicantsCount ?? 0;
              const quotaRatio =
                item.quota > 0 ? Math.min(applicants / item.quota, 1) : 0;

              // Rule: Batas sudah lewat OR quota penuh OR tidak aktif = terhitung tutup
              const isExpired = isPastDeadline(item.deadline);
              const isQuotaFull = Boolean(
                item.quota > 0 && applicants >= item.quota
              );
              const isEffectivelyActive =
                item.isActive && !isExpired && !isQuotaFull;

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
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words">
                          {item.title || item.position}
                        </h3>
                        {isEffectivelyActive ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                            Aktif
                          </span>
                        ) : isQuotaFull ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
                            Ditutup (Kuota Penuh)
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/70">
                            Ditutup (Batas Lewat)
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            Ditutup
                          </span>
                        )}
                      </div>

                      {/* Location & Deadline & Position distinction */}
                      <div className="mt-1 text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
                        {item.title && item.position && item.title !== item.position && (
                          <>
                            <span className="font-medium text-slate-700">Posisi: {item.position}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>Lokasi: {item.workLocation}</span>
                        <span>•</span>
                        <span>Batas: {formattedDate}</span>
                      </div>
                    </div>

                    {/* Pelamar / Kuota with Progress Bar */}
                    <div className="shrink-0 flex flex-col items-end pl-2 min-w-20">
                      <span className="text-xs font-semibold text-slate-600">
                        Pelamar / Kuota
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums">
                        {applicants}/{item.quota}
                      </span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-300",
                            quotaRatio >= 1
                              ? "bg-rose-500"
                              : quotaRatio >= 0.75
                              ? "bg-amber-500"
                              : "bg-[#8D1D96]"
                          )}
                          style={{ width: `${quotaRatio * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Middle row: Badges for Jurusan & Target */}
                  {((item.majors && item.majors.length > 0) ||
                    item.targetApplicant?.name) && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      {item.targetApplicant?.name && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 text-[#7A1384] border border-purple-200/70">
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
                      {!isEffectivelyActive && (
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

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditVacancy(item)}
                        aria-label={`Edit lowongan ${item.position}`}
                        className={cn(
                          "rounded-lg h-7.5 px-3 text-xs font-medium cursor-pointer transition-colors",
                          isCurrentlyEdited
                            ? "bg-[#8D1D96] text-white border-[#8D1D96] hover:bg-[#7A1384] hover:text-white"
                            : "text-slate-700 border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        {isCurrentlyEdited ? "Sedang Diedit" : "Edit"}
                      </Button>

                      {isEffectivelyActive ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isProcessing}
                          onClick={() => setVacancyToClose(item)}
                          aria-label={`Tutup lowongan ${item.position}`}
                          className="rounded-lg h-7.5 px-3 text-xs font-medium text-rose-600 border-rose-200 bg-rose-50/40 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
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
                      ) : isExpired || isQuotaFull ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isProcessing}
                          onClick={() => handleEditVacancy(item)}
                          aria-label={`Perbarui batas atau kuota lowongan ${item.position}`}
                          className="rounded-lg h-7.5 px-3 text-xs font-medium text-amber-700 border-amber-300 bg-amber-50/60 hover:bg-amber-100/70 cursor-pointer"
                        >
                          <Pencil className="h-3 w-3 mr-1 text-amber-600" />
                          Perbarui Batas / Kuota
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isProcessing}
                          onClick={() => handleToggleStatus(item)}
                          aria-label={`Buka kembali lowongan ${item.position}`}
                          className="rounded-lg h-7.5 px-3 text-xs font-medium text-emerald-600 border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
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
                      )}
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
        onConfirm={handleConfirmClose}
        onCancel={() => setVacancyToClose(null)}
      >
        <p className="text-xs sm:text-sm text-slate-600">
          Setelah ditutup, lowongan ini akan berstatus non-aktif. Kamu dapat membukanya kembali kapan saja selama batas pendaftaran belum terlewati.
        </p>
      </Modal>
    </div>
  );
}
