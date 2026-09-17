import { DataTable, type DataTableColumn } from "@/components/custom";
import { LaporanStatCard } from "./laporan-stat-card";
import type { AttendanceMetrics, AttendanceRow } from "../laporan.types";

interface TabAbsensiProps {
  metrics: AttendanceMetrics;
  data: AttendanceRow[];
  isLoading?: boolean;
}

const columns: DataTableColumn<AttendanceRow>[] = [
  {
    header: "AGENDA / TAHAPAN TES",
    accessorKey: "agenda_name",
    align: "left",
    cell: (row) => <span className="font-bold text-slate-900">{row.agenda_name}</span>,
  },
  {
    header: "TANGGAL KEGIATAN",
    accessorKey: "event_date",
    align: "left",
    cell: (row) => <span className="text-slate-600 font-normal">{row.event_date}</span>,
  },
  {
    header: "TARGET PESERTA",
    accessorKey: "target_participants",
    align: "center",
    headerClassName: "text-center",
    cell: (row) => <span className="font-bold text-slate-900">{row.target_participants}</span>,
  },
  {
    header: "HADIR (VALID)",
    accessorKey: "present_valid",
    align: "center",
    headerClassName: "text-center",
    cell: (row) => <span className="font-bold text-emerald-600">{row.present_valid}</span>,
  },
  {
    header: "TIDAK HADIR",
    accessorKey: "absent",
    align: "center",
    headerClassName: "text-center",
    cell: (row) => <span className="font-bold text-rose-600">{row.absent}</span>,
  },
  {
    header: "KEHADIRAN (%)",
    accessorKey: "attendance_rate",
    align: "right",
    headerClassName: "text-right",
    cell: (row) => <span className="font-bold text-emerald-600">{row.attendance_rate}%</span>,
  },
];

export function TabAbsensi({ metrics, data, isLoading = false }: TabAbsensiProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LaporanStatCard
          label="Kehadiran Sosialisasi"
          value={`${metrics?.sosialisasi_rate ?? 0}%`}
          sublabel="QR Code & GPS Validate"
          accentColor="text-emerald-600"
        />
        <LaporanStatCard
          label="Kehadiran Tes Seleksi / Psikotes"
          value={`${metrics?.psikotes_rate ?? 0}%`}
          sublabel="QR Code & GPS Validate"
          accentColor="text-primary"
        />
        <LaporanStatCard
          label="Kehadiran Interview HRD"
          value={`${metrics?.interview_rate ?? 0}%`}
          sublabel="Tepat Waktu Sesuai Jadwal"
          accentColor="text-blue-600"
        />
      </div>

      {/* Standard DataTable */}
      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        showNumbering={true}
        role="admin"
        className="[&_th]:py-3.5 [&_th]:px-6"
        rowClassName="[&>td]:py-4 [&>td]:px-6"
        emptyMessage="Tidak ada data laporan absensi"
        emptyDescription="Coba sesuaikan rentang waktu atau filter perusahaan."
      />
    </div>
  );
}
