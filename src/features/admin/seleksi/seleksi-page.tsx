import { PageHeader, StatCard } from "@/components/custom";
import { SeleksiFilter } from "./components/seleksi-filter";
import { SeleksiTable } from "./components/seleksi-table";
import { useSeleksi } from "./hooks/useSeleksi";
import { toast } from "@/components/custom/sonner";
import { Users, CheckCircle, Award, FileSpreadsheet } from "lucide-react";
import type { RecruitmentSelectionItem } from "./types";

export function SeleksiPage() {
  const {
    selections,
    loading,
    vacancyOptions,
    stageOptions,
    isLoadingOptions,
    selectedVacancyId,
    selectedStageId,
    selectedAttendance,
    search,
    currentPage,
    perPage,
    totalPages,
    totalItems,
    stats,
    setJobVacancyId,
    setStageId,
    setAttendanceStatus,
    setSearch,
    setCurrentPage,
    setPerPage,
  } = useSeleksi();

  const handleUpdateStatus = (item: RecruitmentSelectionItem) => {
    void item;
    toast.info("Fitur update status seleksi akan segera hadir.");
  };

  const handleImportExcel = () => {
    toast.info("Fitur Import Excel akan segera hadir.");
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <PageHeader
        variant="admin"
        title="Tracking & Hasil Seleksi"
        description="Pantau kehadiran, kelola tahapan seleksi rekrutmen peserta, dan kelola hasil akhir seleksi secara terpusat."
      >
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <PageHeader.Button
            variant="glass"
            icon={<FileSpreadsheet className="h-4 w-4" />}
            onClick={handleImportExcel}
            className="w-full sm:w-auto justify-center"
          >
            Import Excel
          </PageHeader.Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Pelamar" value={stats.totalPelamar} icon={Users} color="blue" />
        <StatCard label="Administrasi Lolos" value={stats.administrasiLolos} icon={CheckCircle} color="sky" />
        <StatCard label="Final Diterima" value={stats.finalDiterima} icon={Award} color="teal" />
      </div>

      <SeleksiFilter
        vacancyOptions={vacancyOptions}
        stageOptions={stageOptions}
        selectedVacancyId={selectedVacancyId}
        selectedStageId={selectedStageId}
        selectedAttendance={selectedAttendance}
        search={search}
        onVacancyChange={setJobVacancyId}
        onStageChange={setStageId}
        onAttendanceChange={setAttendanceStatus}
        onSearchChange={setSearch}
        isLoadingOptions={isLoadingOptions}
      />

      <SeleksiTable
        data={selections}
        loading={loading}
        currentPage={currentPage}
        pageSize={perPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPerPage}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}

export const SeleksiRekrutmenPage = SeleksiPage;
export default SeleksiPage;
