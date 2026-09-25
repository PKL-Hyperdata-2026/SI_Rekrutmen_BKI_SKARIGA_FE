import { ClipboardCheck, SearchX, TriangleAlert, X } from "lucide-react";
import { PageHeader } from "@/components/custom";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReviewFilterBar } from "./review-filter-bar";
import { ReviewSummaryCards } from "./review-summary-cards";
import { ReviewTable } from "./review-table";
import { ReviewConfirmModal } from "./review-confirm-modal";
import { useReviewPage } from "./use-review-page";
import type { ReviewDecisionValues } from "./review.schema";

export function ReviewPage() {
  const {
    rows,
    loading,
    error,
    summary,
    options,
    isLoadingOptions,
    vacancyFilter,
    statusFilter,
    searchInput,
    search,
    activeFilterCount,
    page,
    pageSize,
    totalPages,
    totalItems,
    selectedIds,
    confirm,
    isProcessing,
    handleVacancyChange,
    handleStatusChange,
    handleSearchInputChange,
    clearSearch,
    resetFilters,
    handlePageChange,
    handlePageSizeChange,
    handleSelectAll,
    handleSelectRow,
    clearSelection,
    openSingleConfirm,
    openBulkConfirm,
    openBulkReject,
    closeConfirm,
    submitConfirm,
    retry,
  } = useReviewPage();

  return (
    <CardContent className="flex w-full min-w-0 max-w-full flex-col gap-5 overflow-x-hidden p-0 sm:gap-6">
      <PageHeader
        variant="hrd"
        badge="Seleksi Administrasi"
        title="Review Pelamar dan Verifikasi Berkas"
        description="Tinjau kelengkapan berkas dan tentukan kelulusan seleksi administrasi setiap pelamar. Pilih kartu ringkasan untuk pindah status dengan cepat."
        className="max-w-full overflow-hidden rounded-2xl p-5 sm:rounded-3xl sm:p-7"
      >
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <PageHeader.Button
            variant="glass"
            icon={<ClipboardCheck className="h-4 w-4 stroke-[2.5]" />}
            onClick={openBulkConfirm}
            disabled={selectedIds.length === 0 || isProcessing}
            className="w-full justify-center border border-white/30 bg-white/20 font-semibold text-white shadow-xs hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {selectedIds.length > 0
              ? `Loloskan (${selectedIds.length})`
              : "Loloskan Terpilih"}
          </PageHeader.Button>
          <PageHeader.Button
            variant="dark"
            icon={<X className="h-4 w-4 stroke-[2.5]" />}
            onClick={openBulkReject}
            disabled={selectedIds.length === 0 || isProcessing}
            className="w-full justify-center border border-white/20 font-semibold text-rose-100 shadow-xs hover:bg-black/40 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {selectedIds.length > 0
              ? `Tolak (${selectedIds.length})`
              : "Tolak Terpilih"}
          </PageHeader.Button>
        </div>
      </PageHeader>

      <ReviewSummaryCards
        summary={summary}
        activeFilter={statusFilter}
        loading={loading}
        onSelect={handleStatusChange}
      />

      <ReviewFilterBar
        options={options}
        vacancyFilter={vacancyFilter}
        statusFilter={statusFilter}
        searchInput={searchInput}
        activeFilterCount={activeFilterCount}
        totalItems={totalItems}
        isLoadingOptions={isLoadingOptions}
        onVacancyChange={handleVacancyChange}
        onStatusChange={handleStatusChange}
        onSearchChange={handleSearchInputChange}
        onClearSearch={clearSearch}
        onReset={resetFilters}
      />

      {error !== null && !loading ? (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4" role="alert">
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-rose-600" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-rose-800">Gagal memuat data pelamar</p>
            <p className="mt-0.5 text-sm text-rose-700">{error}. Periksa koneksi lalu tekan Coba lagi.</p>
            <Button
              type="button"
              variant="outline"
              onClick={retry}
              className="mt-3 h-11 min-h-[44px] cursor-pointer rounded-xl border-rose-300 bg-white px-4 text-sm font-semibold text-rose-700 hover:bg-rose-100"
            >
              Coba lagi
            </Button>
          </div>
        </div>
      ) : null}

      {search !== undefined && searchInput.trim() !== "" && rows.length === 0 && !loading && error === null ? (
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <SearchX className="mt-0.5 size-5 shrink-0 text-slate-400" />
          <div>
            <p className="text-sm font-bold text-slate-800">Tidak ada pelamar ditemukan</p>
            <p className="mt-0.5 text-sm text-slate-500">Sesuaikan filter posisi atau status review.</p>
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              className="mt-3 h-11 min-h-[44px] cursor-pointer rounded-xl px-4 text-sm font-semibold"
            >
              Reset filter
            </Button>
          </div>
        </div>
      ) : null}

      <ReviewTable
        data={rows}
        loading={loading}
        currentPage={page}
        pageSize={pageSize}
        totalPages={totalPages}
        totalItems={totalItems}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onDecide={openSingleConfirm}
      />

      {selectedIds.length > 0 ? (
        <button
          type="button"
          onClick={clearSelection}
          className="self-start cursor-pointer rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-700"
        >
          Bersihkan pilihan ({selectedIds.length})
        </button>
      ) : null}

      <ReviewConfirmModal
        confirm={confirm}
        isProcessing={isProcessing}
        onOpenChange={(open: boolean) => {
          if (!open) closeConfirm();
        }}
        onConfirm={(values: ReviewDecisionValues) => {
          void submitConfirm(values);
        }}
      />
    </CardContent>
  );
}

export const ReviewPelamarPage = ReviewPage;
export default ReviewPage;
