import { LaporanStatCard } from "./laporan-stat-card";
import type { RecruitmentMetrics, RecruitmentRow } from "../laporan.types";

interface TabRekrutmenProps {
  metrics: RecruitmentMetrics;
  data: RecruitmentRow[];
  isLoading?: boolean;
}

export function TabRekrutmen({ metrics, data, isLoading = false }: TabRekrutmenProps) {
  return (
    <div className="space-y-6">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LaporanStatCard
          label="Total Pelamar Terdaftar"
          value={`${metrics?.total_applicants ?? 0} Siswa / Alumni`}
          sublabel="*Berdasarkan hasil seleksi"
        />
        <LaporanStatCard
          label="Lolos Seleksi Akhir"
          value={`${metrics?.total_accepted ?? 0} Peserta`}
          sublabel={`Tingkat Kelulusan: ${metrics?.pass_rate ?? 0}%`}
          accentColor="text-emerald-600"
        />
        <LaporanStatCard
          label="Perusahaan Mitra Aktif"
          value={`${metrics?.active_companies ?? 0} Perusahaan`}
          sublabel="Berdasarkan Data Perusahaan"
          accentColor="text-blue-600"
        />
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4 text-center w-14">NO</th>
                <th className="px-6 py-4">PERUSAHAAN</th>
                <th className="px-6 py-4">POSISI / JABATAN</th>
                <th className="px-6 py-4 text-center">TOTAL PELAMAR</th>
                <th className="px-6 py-4 text-center">LOLOS ADMIN</th>
                <th className="px-6 py-4 text-center">LOLOS TES/INTERVIEW</th>
                <th className="px-6 py-4 text-center">DITERIMA</th>
                <th className="px-6 py-4 text-right">KELULUSAN (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-xs text-slate-400">
                    Memuat data laporan rekrutmen...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center">
                    <p className="text-xs font-semibold text-slate-600">Tidak ada data laporan rekrutmen</p>
                    <p className="mt-1 text-[11px] text-slate-400">Coba sesuaikan rentang waktu atau filter pelamar.</p>
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.no} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 text-center font-bold text-slate-800">{row.no}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{row.company_name}</td>
                    <td className="px-6 py-4 text-slate-600 font-normal">{row.job_title}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-900">{row.total_applicants}</td>
                    <td className="px-6 py-4 text-center font-bold text-primary">{row.passed_admin}</td>
                    <td className="px-6 py-4 text-center font-bold text-amber-600">{row.passed_interview}</td>
                    <td className="px-6 py-4 text-center font-bold text-emerald-600">{row.accepted}</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">{row.pass_rate_percentage}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
