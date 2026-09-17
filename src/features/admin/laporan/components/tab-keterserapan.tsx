import { DataTable, type DataTableColumn } from "@/components/custom";
import { LaporanStatCard } from "./laporan-stat-card";
import type { AbsorptionMetrics, AbsorptionRow } from "../laporan.types";

interface TabKeterserapanProps {
  metrics: AbsorptionMetrics;
  data: AbsorptionRow[];
  isLoading?: boolean;
}

const columns: DataTableColumn<AbsorptionRow>[] = [
  {
    header: "JURUSAN",
    accessorKey: "major_name",
    align: "left",
    cell: (row) => <span className="font-bold text-slate-900">{row.major_name}</span>,
  },
  {
    header: "JUMLAH LULUSAN",
    accessorKey: "total_graduates",
    align: "center",
    headerClassName: "text-center",
    cell: (row) => <span className="font-bold text-slate-900">{row.total_graduates}</span>,
  },
  {
    header: "BEKERJA (DUDI)",
    accessorKey: "working_dudi",
    align: "center",
    headerClassName: "text-center",
    cell: (row) => <span className="font-bold text-emerald-600">{row.working_dudi}</span>,
  },
  {
    header: "LANJUT STUDI",
    accessorKey: "higher_education",
    align: "center",
    headerClassName: "text-center",
    cell: (row) => <span className="font-bold text-amber-600">{row.higher_education}</span>,
  },
  {
    header: "WIRAUSAHA",
    accessorKey: "entrepreneur",
    align: "center",
    headerClassName: "text-center",
    cell: (row) => <span className="font-bold text-primary">{row.entrepreneur}</span>,
  },
  {
    header: "BELUM BEKERJA",
    accessorKey: "unemployed",
    align: "center",
    headerClassName: "text-center",
    cell: (row) => <span className="font-bold text-rose-600">{row.unemployed}</span>,
  },
  {
    header: "KETERSERAPAN (%)",
    accessorKey: "absorption_rate",
    align: "right",
    headerClassName: "text-right",
    cell: (row) => <span className="font-bold text-emerald-600">{row.absorption_rate}%</span>,
  },
];

export function TabKeterserapan({ metrics, data, isLoading = false }: TabKeterserapanProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LaporanStatCard
          label="Keterserapan Kelas 12"
          value={`${metrics?.class_12_rate ?? 0}%`}
          sublabel="Diterima Sebelum Lulus"
          accentColor="text-emerald-600"
        />
        <LaporanStatCard
          label="Keterserapan Alumni"
          value={`${metrics?.alumni_rate ?? 0}%`}
          sublabel="Lulusan Terakhir"
          accentColor="text-amber-600"
        />
        <LaporanStatCard
          label="Bekerja di DUDI"
          value={`${metrics?.working_dudi_rate ?? 0}%`}
          sublabel="Sesuai Jurusan"
          accentColor="text-blue-600"
        />
        <LaporanStatCard
          label="Kuliah / Wirausaha"
          value={`${metrics?.study_entrepreneur_rate ?? 0}%`}
          sublabel="Lanjut Studi & Usaha"
          accentColor="text-primary"
        />
      </div>

      {/* Standard DataTable */}
      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        showNumbering={true}
        role="admin"
        emptyMessage="Tidak ada data laporan keterserapan"
        emptyDescription="Coba sesuaikan rentang waktu atau filter jurusan."
      />
    </div>
  );
}
