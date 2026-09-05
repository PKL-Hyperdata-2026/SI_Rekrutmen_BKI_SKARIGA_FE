import { PageHeader } from "@/components/custom";
import { LowonganKerjaFilter } from "./components/lowongan-kerja-filter";
import { LowonganKerjaTable } from "./components/lowongan-kerja-table";
import { LowonganKerjaForm } from "./components/lowongan-kerja-form";
import { LowonganKerjaDetailForm } from "./components/lowongan-kerja-detail-form";
import { useLowonganKerja } from "./hooks/useLowonganKerja";
import { Store, Printer } from "lucide-react";

export function LowonganKerjaPage() {
  const {
    isFormOpen,
    selectedVacancy,
    isDetailOpen,
    detailVacancy,
    handleOpenCreate,
    handleView,
    handleEdit,
    handleFormOpenChange,
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
    totalCompaniesCount,
    loading,
    isLoadingOptions,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    setCurrentPage,
    setPageSize,
    refetchVacancies,
  } = useLowonganKerja();

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <PageHeader
        variant="admin"
        title="Data Lowongan Kerja"
        description="Manajemen pembukaan lowongan kerja, kualifikasi, kuota pelamar, dan jadwal seleksi."
      >
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <PageHeader.Button
            variant="primary"
            icon={<Store className="h-4 w-4" />}
            onClick={handleOpenCreate}
            className="w-full sm:w-auto justify-center"
          >
            Tambah Lowongan Kerja
          </PageHeader.Button>
          <PageHeader.Button
            variant="glass"
            icon={<Printer className="h-4 w-4" />}
            className="w-full sm:w-auto justify-center"
          >
            Import Excel
          </PageHeader.Button>
        </div>
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
        totalCount={totalCompaniesCount}
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
        onEdit={handleEdit}
        onDelete={handleDeleteVacancy}
      />

      <LowonganKerjaDetailForm
        open={isDetailOpen}
        onOpenChange={handleDetailOpenChange}
        vacancy={detailVacancy}
      />

      <LowonganKerjaForm
        open={isFormOpen}
        onOpenChange={handleFormOpenChange}
        vacancy={selectedVacancy}
        onSuccess={refetchVacancies}
      />
    </div>
  );
}
