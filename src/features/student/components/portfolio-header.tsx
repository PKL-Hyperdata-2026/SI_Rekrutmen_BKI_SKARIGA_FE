import { FileText, Eye } from "lucide-react";
import { PageHeader } from "@/components/custom/page-header";

export function PortfolioHeader() {
  return (
    <PageHeader
      variant="student"
      badge="Berkas Terverifikasi Sistem"
      badgeIcon={<FileText className="h-3.5 w-3.5" />}
      title="E-Portofolio & Profil Pelamar"
      description="Kelola biodata dan lampiran berkas PDF yang dapat di-review secara langsung oleh HRD Perusahaan."
    >
      <div className="bg-white/10 border border-white/25 backdrop-blur-[4px] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.15)] rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 flex items-center gap-3.5">
        <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
          <Eye className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-emerald-300 uppercase">
              Status Visibilitas HRD
            </span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-white mt-0.5">
            Siap di-Review oleh HRD
          </span>
        </div>
      </div>
    </PageHeader>
  );
}
