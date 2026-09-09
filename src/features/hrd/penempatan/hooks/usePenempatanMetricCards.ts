import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/api/axios";
import type { PenempatanMetricsData } from "../types/penempatan-schema";

export interface UsePenempatanMetricCardsOptions {
  companyId?: string;
  year?: string | number;
  refreshKey?: number;
}

const DEFAULT_METRICS: PenempatanMetricsData = {
  total: {
    count: 0,
    label: "Alumni",
    title: "Semua Data",
    category: "TOTAL DITERIMA KERJA",
  },
  evaluation3Months: {
    count: 0,
    label: "Bertahan",
    title: "3 Bulan",
    category: "EVALUASI",
  },
  evaluation6Months: {
    count: 0,
    label: "Bertahan",
    title: "6 Bulan",
    category: "EVALUASI",
  },
  evaluation12Months: {
    count: 0,
    label: "Bertahan",
    title: "12 Bulan",
    category: "EVALUASI",
  },
};

export interface MetricCardItemConfig {
  key: string;
  category: string;
  title: string;
  value: string;
  color: "custom" | "amber" | "emerald" | "blue";
  customColor?: {
    category: string;
    icon: string;
    value: string;
    container: string;
  };
}

export function usePenempatanMetricCards(
  options: UsePenempatanMetricCardsOptions = {},
) {
  const { companyId, year, refreshKey } = options;

  const [metrics, setMetrics] =
    useState<PenempatanMetricsData>(DEFAULT_METRICS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMetrics = useCallback(
    async (showSkeleton = false) => {
      if (showSkeleton) {
        setIsLoading(true);
      }
      try {
        const response = await api.get<{
          success: boolean;
          message?: string;
          data: PenempatanMetricsData;
        }>("/admin/job-placements/metrics", {
          params: { company_id: companyId, year },
        });

        if (response.data?.data) {
          setMetrics(response.data.data);
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    },
    [companyId, year],
  );

  useEffect(() => {
    fetchMetrics(true);
  }, [fetchMetrics, refreshKey]);

  const refetchMetrics = useCallback(() => fetchMetrics(false), [fetchMetrics]);

  const cards: MetricCardItemConfig[] = useMemo(
    () => [
      {
        key: "total",
        category: metrics.total.category || "TOTAL DITERIMA KERJA",
        title: metrics.total.title || "Semua Data",
        value: `${metrics.total.count} ${metrics.total.label || "Alumni"}`,
        color: "custom",
        customColor: {
          category: "text-[#8D1D96]",
          icon: "text-[#8D1D96]",
          value: "text-[#8D1D96]",
          container:
            "hover:border-[#D069D7] hover:bg-[#FDF2F8]/50 hover:shadow-sm",
        },
      },
      {
        key: "eval3",
        category: metrics.evaluation3Months.category || "EVALUASI",
        title: metrics.evaluation3Months.title || "3 Bulan",
        value: `${metrics.evaluation3Months.count} ${metrics.evaluation3Months.label || "Bertahan"}`,
        color: "amber",
      },
      {
        key: "eval6",
        category: metrics.evaluation6Months.category || "EVALUASI",
        title: metrics.evaluation6Months.title || "6 Bulan",
        value: `${metrics.evaluation6Months.count} ${metrics.evaluation6Months.label || "Bertahan"}`,
        color: "emerald",
      },
      {
        key: "eval12",
        category: metrics.evaluation12Months.category || "EVALUASI",
        title: metrics.evaluation12Months.title || "12 Bulan",
        value: `${metrics.evaluation12Months.count} ${metrics.evaluation12Months.label || "Bertahan"}`,
        color: "blue",
      },
    ],
    [metrics],
  );

  return {
    metrics,
    cards,
    isLoading,
    refetchMetrics,
  };
}
