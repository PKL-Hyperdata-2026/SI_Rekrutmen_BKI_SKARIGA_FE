import { Sparkles, Printer } from "lucide-react";
import { PageHeader } from "@/components/custom";

interface LaporanHeaderProps {
  onPrint?: () => void;
}

export function LaporanHeader({ onPrint }: LaporanHeaderProps) {
  return (
    <div className="print:hidden">
      <PageHeader
        variant="admin"
        badge="Master Data Modul"
        badgeIcon={<Sparkles className="h-3.5 w-3.5" />}
        title="Laporan Rekrutmen & Tracer Study"
        description="Temukan peluang karir terbaik dari industri mitra resmi SKARIGA."
      >
        <PageHeader.Button
          variant="glass"
          icon={<Printer className="h-4 w-4" />}
          onClick={onPrint}
          className="cursor-pointer font-semibold shadow-sm"
        >
          Cetak Laporan / PDF
        </PageHeader.Button>
      </PageHeader>
    </div>
  );
}
