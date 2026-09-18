import { useState } from "react";
import { PageHeader } from "@/components/custom/page-header";
import { SeleksiFilter } from "./components/seleksi-filter";
import { SeleksiTable } from "./components/seleksi-table";
import { CekStatusModal } from "./components/cek-status-modal";
import { useSeleksi } from "./hooks/useSeleksi";
import { toast } from "@/components/custom/sonner";
import { FileCheck, CheckCircle, FileSpreadsheet } from "lucide-react";
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

  const [cekStatusItem, setCekStatusItem] = useState<RecruitmentSelectionItem | null>(null);
  const [isCekStatusOpen, setIsCekStatusOpen] = useState(false);

  const handleCekStatus = (item: RecruitmentSelectionItem) => {
    setCekStatusItem(item);
    setIsCekStatusOpen(true);
  };

  const handleImportExcel = () => {
    toast.info("Fitur Import Excel akan segera hadir.");
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {/* Banner Header - Figma precise */}
      <PageHeader
        variant="admin"
        badge="✦ Seleksi Rekrutmen"
        title="Tracking & Hasil Seleksi"
        description="Temukan peluang karir terbaik dari industri mitra resmi SKARIGA."
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

      {/* Kartu Ringkasan Statistik - 3 Cards Horizontal Figma - Presisi rapat & proporsional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: TAHAP 1 - Pendaftaran - ungu */}
        <div className="relative bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col gap-2 overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#4F28D9]">
                TAHAP 1
              </span>
              <span className="text-sm font-bold text-slate-900 leading-tight">Pendaftaran</span>
            </div>
            {/* Outline dokumen dengan checklist kecil ungu di pojok - standalone tanpa wrapper */}
            <FileCheck className="h-6 w-6 text-[#4F28D9] shrink-0" strokeWidth={1.85} />
          </div>
          <div className="mt-0.5">
            <span className="text-xl font-bold tracking-tight text-[#4F28D9]">
              {stats.totalPelamar} Pelamar
            </span>
          </div>
        </div>

        {/* Card 2: TAHAP 2 - Administrasi - oranye - folder solid dengan check */}
        <div className="relative bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col gap-2 overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#E68A00]">
                TAHAP 2
              </span>
              <span className="text-sm font-bold text-slate-900 leading-tight">Administrasi</span>
            </div>
            {/* Folder solid oranye dengan tanda checklist - pakai SVG kustom untuk presisi Figma */}
            <span className="shrink-0 text-[#E68A00] inline-flex h-6 w-6 items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9.1a1 1 0 0 1 .77.36l1.13 1.38A1 1 0 0 0 11.77 7H18.5A2.5 2.5 0 0 1 21 9.5V16A2.5 2.5 0 0 1 18.5 18.5H5.5A2.5 2.5 0 0 1 3 16V7.5Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 13.5L11 15.5L15.5 10.5"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <div className="mt-0.5">
            <span className="text-xl font-bold tracking-tight text-[#E68A00]">
              {stats.administrasiLolos} Lolos
            </span>
          </div>
        </div>

        {/* Card 3: TAHAP FINAL - Penempatan - hijau - checklist lingkaran outline */}
        <div className="relative bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col gap-2 overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#00875A]">
                TAHAP FINAL
              </span>
              <span className="text-sm font-bold text-slate-900 leading-tight">Penempatan</span>
            </div>
            <CheckCircle className="h-6 w-6 text-[#00875A] shrink-0" strokeWidth={1.85} />
          </div>
          <div className="mt-0.5">
            <span className="text-xl font-bold tracking-tight text-[#00875A]">
              {stats.finalDiterima} Diterima
            </span>
          </div>
        </div>
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
        onCekStatus={handleCekStatus}
      />

      <CekStatusModal
        open={isCekStatusOpen}
        onOpenChange={setIsCekStatusOpen}
        item={cekStatusItem}
      />
    </div>
  );
}

export const SeleksiRekrutmenPage = SeleksiPage;
export default SeleksiPage;
