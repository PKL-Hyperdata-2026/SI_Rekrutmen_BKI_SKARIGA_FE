import { DataTable, type DataTableColumn } from "@/components/custom";
import { LaporanStatCard } from "./laporan-stat-card";
import { Clock, Building2, MapPin } from "lucide-react";
import type { TracerStudyMetrics, TracerStudyRow } from "../laporan.types";

interface TabTracerStudyProps {
  metrics: TracerStudyMetrics;
  data: TracerStudyRow[];
  isLoading?: boolean;
}

const columns: DataTableColumn<TracerStudyRow>[] = [
  {
    header: "TAHUN LULUS",
    accessorKey: "graduation_year",
    align: "left",
    cell: (row) => <span className="font-bold text-slate-900">{row.graduation_year}</span>,
  },
  {
    header: "MASA TUNGGU AVG",
    accessorKey: "waiting_time_avg",
    align: "center",
    headerClassName: "text-center",
    cell: (row) => <span className="font-bold text-slate-900">{row.waiting_time_avg}</span>,
  },
  {
    header: "BERTAHAN 3 BULAN",
    accessorKey: "retention_3_months",
    align: "center",
    headerClassName: "text-center",
    cell: (row) => <span className="font-bold text-emerald-600">{row.retention_3_months}</span>,
  },
  {
    header: "BERTAHAN 6 BULAN",
    accessorKey: "retention_6_months",
    align: "center",
    headerClassName: "text-center",
    cell: (row) => <span className="font-bold text-amber-600">{row.retention_6_months}</span>,
  },
  {
    header: "BERTAHAN 12 BULAN",
    accessorKey: "retention_12_months",
    align: "center",
    headerClassName: "text-center",
    cell: (row) => <span className="font-bold text-primary">{row.retention_12_months}</span>,
  },
  {
    header: "DOMINASI WILAYAH",
    accessorKey: "dominant_region",
    align: "left",
    cell: (row) => <span className="font-bold text-slate-900">{row.dominant_region}</span>,
  },
];

export function TabTracerStudy({ metrics, data, isLoading = false }: TabTracerStudyProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LaporanStatCard
          tag="MASA TUNGGU"
          tagColor="text-blue-600"
          label="Rata-Rata Masa Tunggu kerja"
          value={metrics?.avg_waiting_time ?? "-"}
          accentColor="text-blue-600"
          icon={<Clock className="h-6 w-6 text-blue-600 shrink-0" strokeWidth={1.85} />}
        />
        <LaporanStatCard
          tag="SEBARAN INDUSTRI"
          tagColor="text-[#4F28D9]"
          label="Sebaran Perusahaan"
          value={`${metrics?.industries_count ?? 0} Industri`}
          accentColor="text-[#4F28D9]"
          icon={<Building2 className="h-6 w-6 text-[#4F28D9] shrink-0" strokeWidth={1.85} />}
        />
        <LaporanStatCard
          tag="WILAYAH KERJA"
          tagColor="text-emerald-600"
          label="Sebaran Wilayah Kerja"
          value={`${metrics?.regions_count ?? 0} Kota/Provinsi`}
          accentColor="text-emerald-600"
          icon={<MapPin className="h-6 w-6 text-emerald-600 shrink-0" strokeWidth={1.85} />}
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
        emptyMessage="Tidak ada data laporan tracer study"
        emptyDescription="Coba sesuaikan rentang waktu atau filter tahun kelulusan."
      />
    </div>
  );
}
