import { useMemo } from "react";
import { Users, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { Modal } from "@/components/custom/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/custom/data-table";
import { cn } from "@/lib/utils";
import type { JadwalItem, PesertaJadwalItem } from "./jadwal.schema";
import {
  formatScheduleDateTime,
  getStatusKehadiranBadgeClass,
} from "./jadwal.status";

export interface JadwalPesertaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agenda: JadwalItem | null;
  pesertaList: PesertaJadwalItem[];
  loading?: boolean;
  onSendReminder: (pesertaId: string | number) => Promise<void>;
  sendingReminderId?: string | number | null;
}

export function JadwalPesertaModal({
  open,
  onOpenChange,
  agenda,
  pesertaList,
  loading = false,
  onSendReminder,
  sendingReminderId = null,
}: JadwalPesertaModalProps) {
  const columns = useMemo<DataTableColumn<PesertaJadwalItem>[]>(
    () => [
      {
        header: "NO",
        align: "center",
        className: "text-center px-3 py-3 w-12 font-bold text-xs text-slate-700 tabular-nums",
        headerClassName: "text-center px-3 select-none font-bold text-xs text-foreground tracking-wider w-12",
        cell: (_, index) => index + 1,
      },
      {
        header: "NAMA KANDIDAT",
        className: "min-w-[170px] px-3.5 py-3",
        headerClassName: "px-3.5 select-none font-bold text-xs text-foreground tracking-wider",
        cell: (row) => (
          <span className="font-bold text-slate-900 text-xs sm:text-sm">
            {row.namaKandidat}
          </span>
        ),
      },
      {
        header: "NIS/NISN",
        className: "min-w-[140px] px-3.5 py-3 tabular-nums",
        headerClassName: "px-3.5 select-none font-bold text-xs text-foreground tracking-wider",
        cell: (row) => (
          <span className="text-xs text-slate-600 font-medium">
            {row.nis ? `${row.nis} - ${row.nisn}` : row.nisn || "-"}
          </span>
        ),
      },
      {
        header: "KONTAK/EMAIL",
        className: "min-w-[170px] px-3.5 py-3",
        headerClassName: "px-3.5 select-none font-bold text-xs text-foreground tracking-wider",
        cell: (row) => (
          <span className="text-xs text-slate-600 font-medium">
            {row.email}
          </span>
        ),
      },
      {
        header: "STATUS SESI",
        align: "center",
        className: "text-center px-3 py-3",
        headerClassName: "text-center px-3 select-none font-bold text-xs text-foreground tracking-wider",
        cell: (row) => (
          <Badge
            variant="outline"
            className={cn(
              "rounded-full px-3.5 py-0.5 text-xs font-semibold shadow-none whitespace-nowrap",
              getStatusKehadiranBadgeClass(row.statusKehadiran)
            )}
          >
            {row.statusKehadiranLabel}
          </Badge>
        ),
      },
      {
        header: "AKSI",
        align: "center",
        className: "text-center px-3 py-3 min-w-[150px]",
        headerClassName: "text-center px-3 select-none font-bold text-xs text-foreground tracking-wider",
        cell: (row) => {
          const isSending = sendingReminderId === row.id;
          return (
            <button
              type="button"
              disabled={isSending}
              onClick={() => onSendReminder(row.id)}
              className="h-8 px-3 rounded-lg bg-linear-to-r from-sidebar-strip to-sidebar-gradient-from hover:opacity-90 disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer shadow-2xs transition-opacity"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <span>Kirim Reminder</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          );
        },
      },
    ],
    [onSendReminder, sendingReminderId]
  );

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      variant="hrd"
      headerStyle="white"
      size="lg"
      title={`Daftar Peserta: ${agenda?.namaAgenda || "Agenda Tes"}`}
      description="Lihat daftar peserta pada tahap seleksi berikut."
      headerIcon={<Users className="h-5 w-5 text-purple-800" />}
      footer={
        <div className="flex items-center justify-end w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 px-6 rounded-xl border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
          >
            Tutup
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 py-2">
        {/* Top Summary Card */}
        {agenda && (
          <div className="rounded-xl border border-purple-200/80 bg-purple-50/20 p-3.5 sm:p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div>
              <span className="text-xs font-medium text-slate-500 block">
                Lokasi & Waktu
              </span>
              <p className="text-xs sm:text-sm font-bold text-blue-600 mt-0.5 leading-snug tabular-nums">
                {formatScheduleDateTime(agenda.tanggalPelaksanaan, agenda.waktuMulai)}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 leading-tight">
                {agenda.lokasi}
              </p>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-500 block">
                Total Peserta
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 leading-snug tabular-nums">
                {agenda.totalPeserta} Siswa / Alumni
              </p>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-500 block">
                Posisi Lowongan
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                {agenda.posisiLowongan}
              </p>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-500 block">
                Status Sesi
              </span>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs sm:text-sm font-bold text-emerald-600">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{agenda.statusSesiLabel}</span>
              </div>
            </div>
          </div>
        )}

        {/* Participants Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <DataTable
            columns={columns}
            data={pesertaList}
            loading={loading}
            emptyMessage="Belum ada kandidat terdaftar pada sesi ini"
            emptyDescription="Pelamar yang lolos seleksi berkas akan otomatis muncul di sini."
          />
        </div>
      </div>
    </Modal>
  );
}
