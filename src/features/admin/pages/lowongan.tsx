import { PageHeader } from "@/components/custom";
import { LowonganKerjaFilter } from "@/features/admin/lowongan-kerja/components/lowongan-kerja-filter";
import { LowonganKerjaTable } from "@/features/admin/lowongan-kerja/components/lowongan-kerja-table";
import { LowonganKerjaForm } from "@/features/admin/lowongan-kerja/components/lowongan-kerja-form";
import { LowonganKerjaDetailForm } from "@/features/admin/lowongan-kerja/components/lowongan-kerja-detail-form";
import { useLowonganKerja } from "@/features/admin/lowongan-kerja/hooks/useLowonganKerja";
import { Store, Printer } from "lucide-react";

export const LowonganKerjaPage = () => {
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
        <PageHeader.Button
          variant="primary"
          icon={<Store className="h-4 w-4" />}
          onClick={handleOpenCreate}
        >
          Tambah Lowongan Kerja
        </PageHeader.Button>
        <PageHeader.Button
          variant="glass"
          icon={<Printer className="h-4 w-4" />}
        >
          Import Excel
        </PageHeader.Button>
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
};
