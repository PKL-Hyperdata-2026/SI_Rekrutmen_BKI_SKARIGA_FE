import { useMemo } from "react";
import type {
  MetricCardColor,
  MetricCardCustomColor,
} from "@/components/custom";
import type { HrdDashboardMetrics } from "./dashboard.api";

export interface DashboardMetricItem {
  key: string;
  category: string;
  title: string;
  value: string;
  color?: MetricCardColor;
  customColor?: MetricCardCustomColor;
  isActive?: boolean;
  titleClassName?: string;
  categoryClassName?: string;
  valueClassName?: string;
  iconClassName?: string;
}

export function useDashboardMetricCards(metrics?: HrdDashboardMetrics) {
  const cards: DashboardMetricItem[] = useMemo(() => {
    const activeVacancies = metrics?.active_vacancies ?? 0;
    const totalQuota = metrics?.total_quota ?? 0;
    const totalApplicants = metrics?.total_applicants ?? 0;
    const pendingReviews = metrics?.pending_reviews ?? 0;
    const upcomingSchedules = metrics?.upcoming_schedules ?? 0;
    const acceptedCandidates = metrics?.accepted_candidates ?? 0;

    return [
      {
        key: "lowongan_aktif",
        category: "LOWONGAN AKTIF",
        title: `kuota : ${totalQuota} Orang`,
        value: `${activeVacancies} Posisi`,
        color: "custom",
        categoryClassName: "text-[#8D1D96] font-bold",
        titleClassName: "text-foreground font-bold",
        valueClassName: "text-[#8D1D96] font-extrabold",
        iconClassName: "text-[#8D1D96]",
        customColor: {
          category: "text-[#8D1D96]",
          icon: "text-[#8D1D96]",
          value: "text-[#8D1D96]",
          container:
            "hover:bg-[#FDF2F8]/60 hover:border-[#8D1D96]/50 hover:shadow-sm",
        },
      },
      {
        key: "total_pelamar",
        category: "TOTAL PELAMAR",
        title: `${pendingReviews} Perlu Review`,
        value: `${totalApplicants} Pelamar`,
        color: "custom",
        categoryClassName: "text-[#006A4E] font-bold",
        titleClassName: "text-foreground font-bold",
        valueClassName: "text-[#006A4E] font-extrabold",
        iconClassName: "text-[#006A4E]",
        customColor: {
          category: "text-[#006A4E]",
          icon: "text-[#006A4E]",
          value: "text-[#006A4E]",
          container:
            "hover:border-emerald-400 hover:bg-emerald-50/50 hover:shadow-sm",
        },
      },
      {
        key: "jadwal_seleksi",
        category: "JADWAL SELEKSI",
        title: "Agenda Mendatang",
        value: `${upcomingSchedules} Sesi`,
        color: "custom",
        categoryClassName: "text-[#0284C7] font-bold",
        titleClassName: "text-foreground font-bold",
        valueClassName: "text-[#0284C7] font-extrabold",
        iconClassName: "text-[#0284C7]",
        customColor: {
          category: "text-[#0284C7]",
          icon: "text-[#0284C7]",
          value: "text-[#0284C7]",
          container:
            "hover:border-cyan-400 hover:bg-cyan-50/50 hover:shadow-sm",
        },
      },
      {
        key: "diterima_kerja",
        category: "DITERIMA KERJA",
        title: "Penempatan Kerja",
        value: `${acceptedCandidates} Kandidat`,
        color: "custom",
        categoryClassName: "text-[#0369A1] font-bold",
        titleClassName: "text-foreground font-bold",
        valueClassName: "text-[#0369A1] font-extrabold",
        iconClassName: "text-[#0369A1]",
        customColor: {
          category: "text-[#0369A1]",
          icon: "text-[#0369A1]",
          value: "text-[#0369A1]",
          container:
            "hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-sm",
        },
      },
    ];
  }, [metrics]);

  return { cards };
}
