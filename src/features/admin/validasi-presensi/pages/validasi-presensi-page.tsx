import { PageHeader } from "@/components/custom/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardContent, CardDescription } from "@/components/ui/card";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useValidasiPresensiPage } from "../hooks/useValidasiPresensiPage";
import { ValidasiPresensiTable } from "../components/validasi-presensi-table";
import { ValidasiPresensiTableLog } from "../components/validasi-presensi-table-log";

export function ValidasiPresensiPage() {
  const {
    isRefreshing,
    handleRefresh,
    refreshButtonText,
    selectedVacancy,
    setSelectedVacancy,
    formattedVacancies,
    table,
    tableLog,
  } = useValidasiPresensiPage();

  return (
    <CardContent className="w-full max-w-full min-w-0 space-y-5 sm:space-y-6 p-0 border-none shadow-none bg-transparent overflow-hidden">
      <PageHeader
        variant="admin"
        title="Validasi Presensi Pelamar"
        description="Verifikasi dan validasi kehadiran peserta seleksi rekrutmen di lokasi tes secara realtime."
        className="[&>div]:flex-col [&>div]:2xl:flex-row [&>div]:items-stretch [&>div]:2xl:items-center gap-4 sm:gap-6"
      >
        <CardContent className="w-full 2xl:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 min-w-0 p-0">
          <PageHeader.Button
            variant="primary"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full sm:w-auto justify-center h-10 rounded-lg text-xs sm:text-sm font-semibold"
            icon={
              <RotateCw
                className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              />
            }
          >
            {refreshButtonText}
          </PageHeader.Button>
          <Select value={selectedVacancy} onValueChange={setSelectedVacancy}>
            <SelectTrigger className="w-full sm:w-72 min-w-0 bg-white/15 hover:bg-white/25 text-white border border-white/25 rounded-lg px-3.5 h-10 text-xs sm:text-sm font-medium backdrop-blur-xs shadow-xs transition-all duration-200 cursor-pointer gap-2 [&_svg]:text-white! [&_svg]:opacity-100! **:data-[slot=select-value]:min-w-0 **:data-[slot=select-value]:text-left">
              <SelectValue
                placeholder="Filter Berdasarkan Lowongan"
                className="truncate"
              />
            </SelectTrigger>
            <SelectContent
              align="end"
              className="w-[calc(100vw-3rem)] sm:w-84 max-w-sm"
            >
              <SelectItem value="all" className="text-xs py-2 cursor-pointer">
                <CardDescription
                  className="truncate font-medium text-inherit font-sans text-xs"
                  title="Filter Berdasarkan Lowongan"
                >
                  Filter Berdasarkan Lowongan
                </CardDescription>
              </SelectItem>
              {formattedVacancies.map((vacancy) => (
                <SelectItem
                  key={vacancy.id}
                  value={vacancy.id}
                  className="text-xs py-2 cursor-pointer"
                >
                  <CardContent className="flex flex-col text-left leading-snug min-w-0 gap-0.5 p-0">
                    <CardDescription
                      className="font-semibold truncate text-inherit font-sans text-xs"
                      title={vacancy.companyName || vacancy.positionTitle}
                    >
                      {vacancy.companyName || vacancy.positionTitle}
                    </CardDescription>
                    {vacancy.companyName ? (
                      <CardDescription
                        className="text-[11px] opacity-75 truncate text-inherit font-sans"
                        title={vacancy.positionTitle}
                      >
                        {vacancy.positionTitle}
                      </CardDescription>
                    ) : null}
                  </CardContent>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </PageHeader>

      <ValidasiPresensiTable
        data={table.data}
        loading={table.loading}
        selectedIds={table.selectedIds}
        isBulking={table.isBulking}
        currentPage={table.currentPage}
        totalPages={table.totalPages}
        totalItems={table.totalItems}
        pageSize={table.pageSize}
        onPageChange={table.setCurrentPage}
        onPageSizeChange={table.setPageSize}
        onSelectRow={table.handleSelectRow}
        onSelectAll={table.handleSelectAll}
        onBulkValidate={table.handleBulkValidate}
      />

      <ValidasiPresensiTableLog
        data={tableLog.data}
        loading={tableLog.loading}
        currentPage={tableLog.currentPage}
        totalPages={tableLog.totalPages}
        totalItems={tableLog.totalItems}
        pageSize={tableLog.pageSize}
        onPageChange={tableLog.setCurrentPage}
        onPageSizeChange={tableLog.setPageSize}
      />
    </CardContent>
  );
}
