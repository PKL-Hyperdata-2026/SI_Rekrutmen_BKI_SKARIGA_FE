import { DataTable, type DataTableColumn } from "@/components/custom";
import { LaporanStatCard } from "./laporan-stat-card";
import { FileCheck, CheckCircle, Building2 } from "lucide-react";
import type { RecruitmentMetrics, RecruitmentRow } from "../laporan.types";

interface TabRekrutmenProps {
  metrics: RecruitmentMetrics;
  data: RecruitmentRow[];
  isLoading?: boolean;
}

const columns: DataTableColumn<RecruitmentRow>[] = [
  {
    header: "PERUSAHAAN",
    accessorKey: "company_name",
    align: "left",
    cell: (row) => <span className="font-bold text-slate-900">{row.company_name}</span>,
  },
  {
    header: "POSISI / JABATAN",
    accessorKey: "job_title",
    align: "left",
    cell: (row) => <span className="text-slate-600 font-normal">{row.job_title}</span>,
  },
  {
    header: "TOTAL PELAMAR",
    accessorKey: "total_applicants",
    align: "center",
    headerClassName: "text-center",
    cell: (row) => <span className="font-bold text-slate-900">{row.total_applicants}</span>,
  },
  {
    header: "LOLOS ADMIN",
    accessorKey: "passed_admin",
    align: "center",
    headerClassName: "text-center",
    cell: (row) => <span className="font-bold text-primary">{row.passed_admin}</span>,
  },
  {
    header: "LOLOS TES/INTERVIEW",
    accessorKey: "passed_interview",
    align: "center",
    headerClassName: "text-center",
    cell: (row) => <span className="font-bold text-amber-600">{row.passed_interview}</span>,
  },
  {
    header: "DITERIMA",
    accessorKey: "accepted",
    align: "center",
    headerClassName: "text-center",
    cell: (row) => <span className="font-bold text-emerald-600">{row.accepted}</span>,
  },
  {
    header: "KELULUSAN (%)",
    accessorKey: "pass_rate_percentage",
    align: "right",
    headerClassName: "text-right",
    cell: (row) => <span className="font-bold text-emerald-600">{row.pass_rate_percentage}%</span>,
  },
];

export function TabRekrutmen({ metrics, data, isLoading = false }: TabRekrutmenProps) {
  return (
    <div className="space-y-6">
      {/* 3 Metric Cards - Sesuai Styling Seleksi Rekrutmen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LaporanStatCard
          tag="TOTAL PELAMAR"
          tagColor="text-[#4F28D9]"
          label="Total Pelamar Terdaftar"
          value={`${metrics?.total_applicants ?? 0} Siswa / Alumni`}
          accentColor="text-[#4F28D9]"
          icon={<FileCheck className="h-6 w-6 text-[#4F28D9] shrink-0" strokeWidth={1.85} />}
        />
        <LaporanStatCard
          tag="LOLOS SELEKSI"
          tagColor="text-[#00875A]"
          label="Lolos Seleksi Akhir"
          value={`${metrics?.total_accepted ?? 0} Peserta`}
          accentColor="text-[#00875A]"
          icon={<CheckCircle className="h-6 w-6 text-[#00875A] shrink-0" strokeWidth={1.85} />}
        />
        <LaporanStatCard
          tag="MITRA INDUSTRI"
          tagColor="text-blue-600"
          label="Perusahaan Mitra Aktif"
          value={`${metrics?.active_companies ?? 0} Perusahaan`}
          accentColor="text-blue-600"
          icon={<Building2 className="h-6 w-6 text-blue-600 shrink-0" strokeWidth={1.85} />}
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
        emptyMessage="Tidak ada data laporan rekrutmen"
        emptyDescription="Coba sesuaikan rentang waktu atau filter pelamar."
      />
    </div>
  );
}
