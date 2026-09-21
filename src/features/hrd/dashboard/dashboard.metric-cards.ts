import { useMemo } from "react";
import type { MetricCardColor, MetricCardCustomColor } from "@/components/custom";

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

export function useDashboardMetricCards() {
  const cards: DashboardMetricItem[] = useMemo(
    () => [
      {
        key: "lowongan_aktif",
        category: "LOWONGAN AKTIF",
        title: "kuota : 45 Orang",
        value: "3 Posisi",
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
        title: "12 Perlu Review",
        value: "128 Pelamar",
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
        title: "Psikotes & Interview",
        value: "45 Peserta",
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
        title: "Sync BKK Valid",
        value: "28 Peserta",
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
    ],
    [],
  );

  return { cards };
}

