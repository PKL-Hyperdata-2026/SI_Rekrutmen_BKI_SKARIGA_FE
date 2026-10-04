import { useState, useEffect, useCallback } from "react";
import { hrdDashboardApi, type HrdDashboardData } from "./dashboard.api";

export function useHrdDashboard() {
  const [data, setData] = useState<HrdDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await hrdDashboardApi.getDashboard();
      setData(res);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat data dashboard HRD.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    loading,
    error,
    refresh: fetchDashboard,
  };
}
