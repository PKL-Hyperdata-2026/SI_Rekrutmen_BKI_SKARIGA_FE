import { Building2, Plus, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/custom";
import { Skeleton } from "@/components/ui/skeleton";
import { useLowonganPage } from "./use-lowongan-page";
import { LowonganForm } from "./lowongan-form";
import { LowonganList } from "./lowongan-list";

export function LowonganPage() {
  const {
    statistics,
    options,
    isLoadingMeta,
    metaError,
    fetchMeta,
    selectedVacancy,
    isFormOpen,
    handleOpenCreate,
    handleFormOpenChange,
    form,
    list,
  } = useLowonganPage();

  const totalVacancies = statistics.active + statistics.draft_closed;

  return (
    <div className="w-full max-w-full min-w-0 flex flex-col gap-5 sm:gap-6 overflow-x-hidden">
      <PageHeader
        variant="hrd"
        badge="Mitra Perusahaan BKK Skariga"
        badgeIcon={<Building2 className="h-3.5 w-3.5" />}
        title="Manajemen Posisi Rekrutmen"
        description="Buat & Kelola Lowongan Pekerjaan."
        className="p-4.5 sm:p-7 rounded-2xl sm:rounded-3xl max-w-full overflow-hidden"
      >
        <PageHeader.Button
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={handleOpenCreate}
          className="w-full sm:w-auto justify-center"
        >
          Publikasikan Lowongan Baru
        </PageHeader.Button>
        <PageHeader.StatCard
          items={[
            {
              label: "Lowongan Aktif",
              value: isLoadingMeta ? (
                <Skeleton className="h-6 w-10 bg-white/20" />
              ) : (
                statistics.active
              ),
            },
            {
              label: "Draft / Tutup",
              value: isLoadingMeta ? (
                <Skeleton className="h-6 w-10 bg-white/20" />
              ) : (
                statistics.draft_closed
              ),
            },
            {
              label: "Total",
              value: isLoadingMeta ? (
                <Skeleton className="h-6 w-10 bg-white/20" />
              ) : (
                totalVacancies
              ),
            },
          ]}
        />
      </PageHeader>

      {metaError && !isLoadingMeta && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/70 px-4 py-3"
        >
          <span className="text-xs sm:text-sm text-rose-700 font-medium">
            {metaError} Angka ringkasan mungkin tidak terbaru.
          </span>
          <button
            type="button"
            onClick={() => void fetchMeta()}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Muat Ulang
          </button>
        </div>
      )}

      <LowonganList
        listState={list}
        options={options}
        selectedVacancyId={selectedVacancy?.id}
      />

      <LowonganForm
        open={isFormOpen}
        onOpenChange={handleFormOpenChange}
        formState={form}
        options={options}
        isLoadingOptions={isLoadingMeta}
      />
    </div>
  );
}

export default LowonganPage;
