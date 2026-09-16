import { LaporanStatCard } from "./laporan-stat-card";
import type { AttendanceMetrics, AttendanceRow } from "../laporan.types";

interface TabAbsensiProps {
  metrics: AttendanceMetrics;
  data: AttendanceRow[];
  isLoading?: boolean;
}

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

      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4 text-center w-14">NO</th>
                <th className="px-6 py-4">AGENDA / TAHAPAN TES</th>
                <th className="px-6 py-4">TANGGAL KEGIATAN</th>
                <th className="px-6 py-4 text-center">TARGET PESERTA</th>
                <th className="px-6 py-4 text-center">HADIR (VALID)</th>
                <th className="px-6 py-4 text-center">TIDAK HADIR</th>
                <th className="px-6 py-4 text-right">KEHADIRAN (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-xs text-slate-400">
                    Memuat data laporan absensi...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center">
                    <p className="text-xs font-semibold text-slate-600">Tidak ada data laporan absensi</p>
                    <p className="mt-1 text-[11px] text-slate-400">Coba sesuaikan rentang waktu atau filter perusahaan.</p>
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.no} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 text-center font-bold text-slate-800">{row.no}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{row.agenda_name}</td>
                    <td className="px-6 py-4 text-slate-600 font-normal">{row.event_date}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-900">{row.target_participants}</td>
                    <td className="px-6 py-4 text-center font-bold text-emerald-600">{row.present_valid}</td>
                    <td className="px-6 py-4 text-center font-bold text-rose-600">{row.absent}</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">{row.attendance_rate}%</td>
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
