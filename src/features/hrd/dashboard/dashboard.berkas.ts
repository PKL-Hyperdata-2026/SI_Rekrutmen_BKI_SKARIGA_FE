import { useMemo } from "react";
import type { HrdDashboardSummaryBerkas } from "./dashboard.api";

export interface BerkasFeatureItem {
  id: string;
  title: string;
  description: string;
}

export function useDashboardBerkas(summary?: HrdDashboardSummaryBerkas) {
  const features: BerkasFeatureItem[] = useMemo(() => {
    const withPortfolio = summary?.with_portfolio ?? 0;
    const withoutPortfolio = summary?.without_portfolio ?? 0;
    const total = summary?.total_applicants ?? 0;

    return [
      {
        id: "with_portfolio",
        title: `${withPortfolio} Pelamar Siap Review`,
        description: "Pelamar dengan CV & berkas portofolio terunggah",
      },
      {
        id: "without_portfolio",
        title: `${withoutPortfolio} Belum Lengkap Berkas`,
        description: "Pelamar belum melampirkan portofolio kejuruan",
      },
      {
        id: "total_applicants",
        title: `${total} Total Berkas Terdaftar`,
        description: "Seluruh berkas lamaran aktif di perusahaan Anda",
      },
    ];
  }, [summary]);

  return { features };
}
