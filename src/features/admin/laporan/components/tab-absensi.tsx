import { DataTable, type DataTableColumn } from "@/components/custom";
import { LaporanStatCard } from "./laporan-stat-card";
import { UserCheck, ClipboardCheck, Users } from "lucide-react";
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
          tag="SOSIALISASI"
          tagColor="text-emerald-600"
          label="Kehadiran Sosialisasi"
          value={`${metrics?.sosialisasi_rate ?? 0}%`}
          accentColor="text-emerald-600"
          icon={<UserCheck className="h-6 w-6 text-emerald-600 shrink-0" strokeWidth={1.85} />}
        />
        <LaporanStatCard
          tag="TES SELEKSI"
          tagColor="text-[#4F28D9]"
          label="Kehadiran Tes Seleksi / Psikotes"
          value={`${metrics?.psikotes_rate ?? 0}%`}
          accentColor="text-[#4F28D9]"
          icon={<ClipboardCheck className="h-6 w-6 text-[#4F28D9] shrink-0" strokeWidth={1.85} />}
        />
        <LaporanStatCard
          tag="INTERVIEW HRD"
          tagColor="text-blue-600"
          label="Kehadiran Interview HRD"
          value={`${metrics?.interview_rate ?? 0}%`}
          accentColor="text-blue-600"
          icon={<Users className="h-6 w-6 text-blue-600 shrink-0" strokeWidth={1.85} />}
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
