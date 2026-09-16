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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { DataTablePagination } from "@/components/custom/data-table-pagination";
import type { useLowonganList } from "./use-lowongan-list";
import type { HrdJobVacancyItem } from "./lowongan.schema";

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

      {/* Content */}
      <div className="mt-5 flex-1 flex flex-col justify-between">
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
              Belum Ada Lowongan Dipublikasikan
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Gunakan formulir di sebelah kiri untuk menerbitkan posisi lowongan
              pekerjaan baru kepada siswa dan alumni.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {vacancies.map((item: HrdJobVacancyItem) => {
              const isProcessing = processingId === item.id;
              const isCurrentlyEdited = selectedVacancyId === item.id;
              const formattedDate = formatDeadline(item.deadline);

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
                  {/* Top row: Title + Status Badge & Counter */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words">
                        {item.position}
                      </h3>
                      {item.isActive ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          Ditutup
                        </span>
                      )}
                    </div>

                    {/* Pelamar / Kuota */}
                    <div className="shrink-0 flex flex-col items-end pl-2">
                      <span className="text-[10px] sm:text-[11px] font-medium text-slate-500">
                        Pelamar / Kuota
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums">
                        {item.applicantsCount ?? 0}/{item.quota}
                      </span>
                    </div>
                  </div>

                  {/* Middle row: Meta details */}
                  <div className="mt-1.5 text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
                    <span>Lokasi: {item.workLocation}</span>
                    <span>•</span>
                    <span>Batas: {formattedDate}</span>
                  </div>

                  {/* Bottom row: Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      {!item.isActive && (
                        <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                          Selesai {formattedDate}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleViewApplicants(item)}
                        className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold bg-[#F8EAF8] text-[#7A1384] hover:bg-[#F3DCF3] transition-colors border border-[#7A1384]/20 cursor-pointer"
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span>Lihat Pelamar</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.isActive ? (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditVacancy(item)}
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

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isProcessing}
                            onClick={() => setVacancyToClose(item)}
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
                        </>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isProcessing}
                          onClick={() => handleToggleStatus(item)}
                          className="rounded-lg h-7.5 px-3 text-xs font-medium text-[#7A1384] border-[#7A1384]/30 bg-[#FDF2FD] hover:bg-[#F9E4F9] cursor-pointer"
                        >
                          {isProcessing ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <RefreshCw className="h-3 w-3 mr-1 text-[#7A1384]" />
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
          <div className="mt-6 pt-4 border-t border-slate-100">
            <DataTablePagination
              currentPage={currentPage}
              totalPages={pagination.last_page}
              totalItems={pagination.total}
              pageSize={pagination.per_page}
              onPageChange={handlePageChange}
              role="hrd"
              showItemInfo
            />
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Closing Vacancy */}
      <AlertDialog
        open={Boolean(vacancyToClose)}
        onOpenChange={(open) => !open && setVacancyToClose(null)}
      >
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg font-bold text-slate-900">
              Tutup Lowongan Pekerjaan?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-slate-600">
              Apakah Anda yakin ingin menutup lowongan posisi{" "}
              <strong className="text-slate-900 font-semibold">
                {vacancyToClose?.position}
              </strong>
              ? Siswa dan alumni tidak akan dapat mendaftar lagi setelah status ditutup.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-xl text-xs sm:text-sm">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmClose}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold"
            >
              Ya, Tutup Lowongan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
