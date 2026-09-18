import { PageHeader } from "@/components/custom";
import { CardContent } from "@/components/ui/card";
import { LowonganKerjaFilter } from "./lowongan-kerja-filter";
import { LowonganKerjaTable } from "./lowongan-kerja-table";
import { LowonganKerjaDetail } from "./lowongan-kerja-detail";
import { useLowonganKerja } from "./lowongan-kerja.page";
import { Store } from "lucide-react";

export function LowonganKerjaPage() {
  const {
    isDetailOpen,
    detailVacancy,
    handleCreate,
    handleView,
    handleDetailOpenChange,
    handleDeleteVacancy,
    selectedStatus,
    selectedMajor,
    selectedTarget,
    setSelectedStatus,
    setSelectedMajor,
    setSelectedTarget,
    statusOptions,
    majorOptions,
    targetOptions,
    vacancies,
    loading,
    isLoadingOptions,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    setCurrentPage,
    setPageSize,
  } = useLowonganKerja();

  return (
    <CardContent className="flex flex-col gap-5 sm:gap-6 p-0">
      <PageHeader
        variant="admin"
        title="Data Lowongan Kerja"
        description="Manajemen pembukaan lowongan kerja, kualifikasi, kuota pelamar, dan jadwal seleksi."
      >
        <CardContent className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 p-0">
          <PageHeader.Button
            variant="primary"
            icon={<Store className="h-4 w-4" />}
            onClick={handleCreate}
            className="w-full sm:w-auto justify-center"
          >
            Tambah Lowongan Kerja
          </PageHeader.Button>
        </CardContent>
      </PageHeader>

      <LowonganKerjaFilter
        statusOptions={statusOptions}
        majorOptions={majorOptions}
        targetOptions={targetOptions}
        defaultStatus={selectedStatus}
        defaultMajor={selectedMajor}
        defaultTarget={selectedTarget}
        onStatusChange={setSelectedStatus}
        onMajorChange={setSelectedMajor}
        onTargetChange={setSelectedTarget}
        totalCount={totalItems}
        totalLabel="Lowongan Kerja"
        isLoading={isLoadingOptions}
      />

      <LowonganKerjaTable
        data={vacancies}
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onView={handleView}
        onDelete={handleDeleteVacancy}
      />

      <LowonganKerjaDetail
        open={isDetailOpen}
        onOpenChange={handleDetailOpenChange}
        vacancy={detailVacancy}
      />
    </CardContent>
  );
}
