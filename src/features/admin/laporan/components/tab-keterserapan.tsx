import { DataTable, type DataTableColumn } from "@/components/custom";
import { LaporanStatCard } from "./laporan-stat-card";
import { GraduationCap, Award, Building2, BookOpen } from "lucide-react";
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
          tag="KELAS 12"
          tagColor="text-emerald-600"
          label="Keterserapan Kelas 12"
          value={`${metrics?.class_12_rate ?? 0}%`}
          accentColor="text-emerald-600"
          icon={<GraduationCap className="h-6 w-6 text-emerald-600 shrink-0" strokeWidth={1.85} />}
        />
        <LaporanStatCard
          tag="ALUMNI"
          tagColor="text-amber-600"
          label="Keterserapan Alumni"
          value={`${metrics?.alumni_rate ?? 0}%`}
          accentColor="text-amber-600"
          icon={<Award className="h-6 w-6 text-amber-600 shrink-0" strokeWidth={1.85} />}
        />
        <LaporanStatCard
          tag="BEKERJA"
          tagColor="text-blue-600"
          label="Bekerja di DUDI"
          value={`${metrics?.working_dudi_rate ?? 0}%`}
          accentColor="text-blue-600"
          icon={<Building2 className="h-6 w-6 text-blue-600 shrink-0" strokeWidth={1.85} />}
        />
        <LaporanStatCard
          tag="STUDI & WIRAUSAHA"
          tagColor="text-[#4F28D9]"
          label="Kuliah / Wirausaha"
          value={`${metrics?.study_entrepreneur_rate ?? 0}%`}
          accentColor="text-[#4F28D9]"
          icon={<BookOpen className="h-6 w-6 text-[#4F28D9] shrink-0" strokeWidth={1.85} />}
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
        emptyMessage="Tidak ada data laporan keterserapan"
        emptyDescription="Coba sesuaikan rentang waktu atau filter jurusan."
      />
    </div>
  );
}
