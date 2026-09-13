import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { AdminTracerItem } from "./tracer.schema";

interface TracerDetailModalProps {
  item: AdminTracerItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatCurrency = (val?: number | null): string => {
  if (val === null || val === undefined || isNaN(val)) return "-";
  return "Rp. " + new Intl.NumberFormat("id-ID").format(val);
};

export function TracerDetailModal({
  item,
  isOpen,
  onClose,
}: TracerDetailModalProps) {
  if (!item) return null;

  const fullName = item.studentAlumni?.fullName || "Nama Tidak Diketahui";
  const nis = item.studentAlumni?.nis || "-";
  const majorName = item.studentAlumni?.major?.name || "Semua Jurusan";

  const getStatusKeterserapan = () => {
    switch (item.careerStatus) {
      case "bekerja":
        return "Bekerja / Aktif";
      case "lanjut_studi":
        return "Kuliah / Aktif";
      case "wirausaha":
        return "Wirausaha / Aktif";
      case "mencari_pekerjaan":
        return "Mencari Kerja";
      default:
        return "Aktif";
    }
  };

  const getStatusColor = () => {
    switch (item.careerStatus) {
      case "bekerja":
        return "text-emerald-600";
      case "lanjut_studi":
        return "text-purple-600";
      case "wirausaha":
        return "text-blue-600";
      case "mencari_pekerjaan":
        return "text-rose-600";
      default:
        return "text-emerald-600";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 max-w-md sm:max-w-lg border-0 rounded-3xl overflow-hidden shadow-2xl bg-white focus:outline-hidden">
        {/* Header Gradien Ungu Sesuai Mockup */}
        <div className="relative bg-gradient-to-r from-indigo-950 via-indigo-800 to-indigo-600 p-5 sm:p-6 text-white">
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="absolute top-5 right-5 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="space-y-1 pr-8">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
              Detail Profil Alumni
            </h2>
            <p className="text-xs text-white/80 font-normal">
              Terintegrasi dengan akun modul Siswa/Alumni.
            </p>
          </div>
        </div>

        {/* Body Modal Berisi 2 Card Sesuai Mockup */}
        <div className="p-5 sm:p-6 space-y-4 bg-slate-50">
          {/* Card 1: Profil Alumni */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-500 font-medium">Nama</span>
              <span className="font-bold text-indigo-950 text-right">
                {fullName}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-500 font-medium">NIS & Jurusan</span>
              <span className="font-semibold text-slate-800 text-right">
                {nis} • {majorName}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-500 font-medium">
                Status keterserapan
              </span>
              <span className={`font-bold text-right ${getStatusColor()}`}>
                {getStatusKeterserapan()}
              </span>
            </div>
          </div>

          {/* Card 2: Detail Penempatan / Karir */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs space-y-3">
            {item.careerStatus === "bekerja" && (
              <>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">
                    Perusahaan / Kampus
                  </span>
                  <span className="font-bold text-indigo-950 text-right">
                    {item.companyName || "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">
                    Jabatan / Prodi
                  </span>
                  <span className="font-semibold text-slate-800 text-right">
                    {item.jobTitle || "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">
                    Lokasi / Wilayah
                  </span>
                  <span className="font-medium text-slate-700 text-right">
                    {item.jobLocation || "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">
                    Masa Tunggu Kerja
                  </span>
                  <span className="font-semibold text-slate-800 text-right">
                    {item.waitingPeriod || "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">Gaji Awal</span>
                  <span className="font-bold text-blue-500 text-right">
                    {formatCurrency(item.minimumSalary || item.maximumSalary)}
                  </span>
                </div>
              </>
            )}

            {item.careerStatus === "lanjut_studi" && (
              <>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">
                    Perusahaan / Kampus
                  </span>
                  <span className="font-bold text-indigo-950 text-right">
                    {item.universityName || "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">
                    Jabatan / Prodi
                  </span>
                  <span className="font-semibold text-slate-800 text-right">
                    {item.studyProgram || "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">
                    Lokasi / Wilayah
                  </span>
                  <span className="font-medium text-slate-700 text-right">
                    {item.jobLocation || "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">Kategori</span>
                  <span className="font-medium text-slate-700 text-right">
                    {item.companySector || "Perguruan Tinggi"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">
                    Masa Tunggu
                  </span>
                  <span className="font-semibold text-slate-800 text-right">
                    {item.waitingPeriod || "0 Bulan"}
                  </span>
                </div>
              </>
            )}

            {item.careerStatus === "wirausaha" && (
              <>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">Nama Usaha</span>
                  <span className="font-bold text-indigo-950 text-right">
                    {item.businessName || "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">
                    Bidang Usaha
                  </span>
                  <span className="font-semibold text-slate-800 text-right">
                    {item.businessField || "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">
                    Lokasi / Wilayah
                  </span>
                  <span className="font-medium text-slate-700 text-right">
                    {item.jobLocation || item.businessAddress || "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">
                    Akun Media Sosial
                  </span>
                  <span className="font-medium text-blue-600 text-right">
                    {item.instagramAccount || "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">
                    Rata-rata Omzet
                  </span>
                  <span className="font-bold text-emerald-600 text-right">
                    {item.averageRevenue
                      ? `Rp. ${item.averageRevenue}`
                      : "-"}
                  </span>
                </div>
              </>
            )}

            {item.careerStatus === "mencari_pekerjaan" && (
              <div className="py-2 space-y-2 text-center">
                <p className="text-xs sm:text-sm font-semibold text-rose-600">
                  Sedang Mencari Pekerjaan
                </p>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Alumni saat ini belum memiliki penempatan kerja aktif maupun
                  studi lanjut dan sedang dalam proses pencarian peluang karir.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
