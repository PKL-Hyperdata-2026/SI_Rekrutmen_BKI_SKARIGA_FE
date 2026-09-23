import { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/custom/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { JadwalItem } from "./jadwal.schema";
import {
  formatScheduleDateTime,
  getStatusSesiBadgeClass,
  getTahapSeleksiBadgeClass,
} from "./jadwal.status";

export interface JadwalTableProps {
  data: JadwalItem[];
  loading?: boolean;
  onOpenPeserta: (agenda: JadwalItem) => void;
  onNavigateHasil: (agenda: JadwalItem) => void;
}

export function JadwalTable({
  data,
  loading = false,
  onOpenPeserta,
  onNavigateHasil,
}: JadwalTableProps) {
  const columns = useMemo<DataTableColumn<JadwalItem>[]>(
    () => [
      {
        header: "NO",
        align: "center",
        className: "text-center px-3 py-4 w-12 font-bold text-xs text-slate-700 tabular-nums",
        headerClassName: "text-center px-3 select-none font-bold text-xs text-foreground tracking-wider w-12",
        cell: (_, index) => index + 1,
      },
      {
        header: "AGENDA / TES",
        className: "min-w-[190px] px-4 py-3.5",
        headerClassName: "px-4 select-none font-bold text-xs text-foreground tracking-wider",
        cell: (row) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-slate-900 text-xs sm:text-sm">
              {row.namaAgenda}
            </span>
            <span className="text-xs text-slate-500 font-medium tabular-nums">
              Peserta: {row.totalPeserta} Peserta
            </span>
          </div>
        ),
      },
      {
        header: "POSISI LOWONGAN",
        className: "min-w-[180px] px-4 py-3.5",
        headerClassName: "px-4 select-none font-bold text-xs text-foreground tracking-wider",
        cell: (row) => (
          <span className="font-bold text-slate-800 text-xs sm:text-sm">
            {row.posisiLowongan}
          </span>
        ),
      },
      {
        header: "TAHAP SELEKSI",
        align: "center",
        className: "text-center px-3 py-3.5",
        headerClassName: "text-center px-3 select-none font-bold text-xs text-foreground tracking-wider",
        cell: (row) => (
          <Badge
            variant="outline"
            className={cn(
              "rounded-full px-3.5 py-0.5 text-xs font-semibold shadow-none whitespace-nowrap",
              getTahapSeleksiBadgeClass(row.tahapSeleksi)
            )}
          >
            {row.tahapSeleksiLabel}
          </Badge>
        ),
      },
      {
        header: "WAKTU & LOKASI",
        className: "min-w-[190px] px-4 py-3.5",
        headerClassName: "px-4 select-none font-bold text-xs text-foreground tracking-wider",
        cell: (row) => (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs sm:text-sm font-bold text-blue-600 tabular-nums">
              {formatScheduleDateTime(row.tanggalPelaksanaan, row.waktuMulai)}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {row.lokasi}
            </span>
          </div>
        ),
      },
      {
        header: "STATUS SESI",
        align: "center",
        className: "text-center px-3 py-3.5",
        headerClassName: "text-center px-3 select-none font-bold text-xs text-foreground tracking-wider",
        cell: (row) => (
          <Badge
            variant="outline"
            className={cn(
              "rounded-full px-3.5 py-0.5 text-xs font-semibold shadow-none whitespace-nowrap",
              getStatusSesiBadgeClass(row.statusSesi)
            )}
          >
            {row.statusSesiLabel}
          </Badge>
        ),
      },
      {
        header: "AKSI",
        align: "center",
        className: "text-center px-3 py-3.5 min-w-[210px]",
        headerClassName: "text-center px-3 select-none font-bold text-xs text-foreground tracking-wider",
        cell: (row) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenPeserta(row)}
              className="h-8 px-3 rounded-lg border-purple-200 text-purple-900 bg-purple-50/50 hover:bg-purple-100/60 font-semibold text-xs cursor-pointer shadow-none"
            >
              Peserta
            </Button>
            <button
              type="button"
              onClick={() => onNavigateHasil(row)}
              className="h-8 px-3 rounded-lg bg-linear-to-r from-sidebar-strip to-sidebar-gradient-from hover:opacity-90 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer shadow-2xs transition-opacity"
            >
              <span>{row.hasHasil ? "Lihat Hasil" : "Input Hasil"}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
      },
    ],
    [onOpenPeserta, onNavigateHasil]
  );

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage="Belum ada agenda jadwal tes"
        emptyDescription="Klik tombol 'Buat Agenda Tes' di atas untuk membuat jadwal sesi seleksi baru."
      />
    </div>
  );
}
