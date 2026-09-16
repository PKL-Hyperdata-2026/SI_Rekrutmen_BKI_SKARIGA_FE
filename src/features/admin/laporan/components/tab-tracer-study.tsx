import { LaporanStatCard } from "./laporan-stat-card";
import type { TracerStudyMetrics, TracerStudyRow } from "../laporan.types";

interface TabTracerStudyProps {
  metrics: TracerStudyMetrics;
  data: TracerStudyRow[];
  isLoading?: boolean;
}

export function TabTracerStudy({ metrics, data, isLoading = false }: TabTracerStudyProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LaporanStatCard
          label="Rata-Rata Masa Tunggu kerja"
          value={metrics?.avg_waiting_time ?? "-"}
          sublabel="Target BKK: <3 Bulan"
          accentColor="text-blue-600"
        />
        <LaporanStatCard
          label="Sebaran Perusahaan"
          value={`${metrics?.industries_count ?? 0} Industri`}
          sublabel="Tipe Sektor Bisnis"
          accentColor="text-slate-900"
        />
        <LaporanStatCard
          label="Sebaran Wilayah Kerja"
          value={`${metrics?.regions_count ?? 0} Kota/Provinsi`}
          sublabel="Berdasarkan Data Perusahaan"
          accentColor="text-blue-600"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4 text-center w-14">NO</th>
                <th className="px-6 py-4">TAHUN LULUS</th>
                <th className="px-6 py-4 text-center">MASA TUNGGU AVG</th>
                <th className="px-6 py-4 text-center">BERTAHAN 3 BULAN</th>
                <th className="px-6 py-4 text-center">BERTAHAN 6 BULAN</th>
                <th className="px-6 py-4 text-center">BERTAHAN 12 BULAN</th>
                <th className="px-6 py-4">DOMINASI WILAYAH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-xs text-slate-400">
                    Memuat data tracer study...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center">
                    <p className="text-xs font-semibold text-slate-600">Tidak ada data tracer study</p>
                    <p className="mt-1 text-[11px] text-slate-400">Coba sesuaikan rentang waktu atau filter tahun lulus.</p>
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.no} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 text-center font-bold text-slate-800">{row.no}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{row.graduation_year}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-900">{row.waiting_time_avg}</td>
                    <td className="px-6 py-4 text-center font-bold text-emerald-600">{row.retention_3_months}</td>
                    <td className="px-6 py-4 text-center font-bold text-amber-600">{row.retention_6_months}</td>
                    <td className="px-6 py-4 text-center font-bold text-primary">{row.retention_12_months}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{row.dominant_region}</td>
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
