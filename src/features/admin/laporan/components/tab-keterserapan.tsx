import { LaporanStatCard } from "./laporan-stat-card";
import type { AbsorptionMetrics, AbsorptionRow } from "../laporan.types";

interface TabKeterserapanProps {
  metrics: AbsorptionMetrics;
  data: AbsorptionRow[];
  isLoading?: boolean;
}

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

      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4 text-center w-14">NO</th>
                <th className="px-6 py-4">JURUSAN</th>
                <th className="px-6 py-4 text-center">JUMLAH LULUSAN</th>
                <th className="px-6 py-4 text-center">BEKERJA(DUDI)</th>
                <th className="px-6 py-4 text-center">LANJUT STUDI</th>
                <th className="px-6 py-4 text-center">WIRAUSAHA</th>
                <th className="px-6 py-4 text-center">BELUM BEKERJA</th>
                <th className="px-6 py-4 text-right">KETERSERAPAN (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-xs text-slate-400">
                    Memuat data laporan keterserapan...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center">
                    <p className="text-xs font-semibold text-slate-600">Tidak ada data laporan keterserapan</p>
                    <p className="mt-1 text-[11px] text-slate-400">Coba sesuaikan rentang waktu atau filter jurusan.</p>
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.no} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 text-center font-bold text-slate-800">{row.no}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{row.major_name}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-900">{row.total_graduates}</td>
                    <td className="px-6 py-4 text-center font-bold text-emerald-600">{row.working_dudi}</td>
                    <td className="px-6 py-4 text-center font-bold text-amber-600">{row.higher_education}</td>
                    <td className="px-6 py-4 text-center font-bold text-primary">{row.entrepreneur}</td>
                    <td className="px-6 py-4 text-center font-bold text-rose-600">{row.unemployed}</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">{row.absorption_rate}%</td>
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
