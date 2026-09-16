import { api } from "@/api/axios";
import type {
  PenempatanFormOptionsData,
  PenempatanMetricsData,
  JobPlacement,
} from "./penempatan.schema";

export const penempatanApi = {
  getOptions: async () => {
    const response = await api.get<{
      success: boolean;
      data: PenempatanFormOptionsData;
    }>("/hrd/job-placements/options");
    return response.data?.data;
  },

  getMetrics: async (params?: { company_id?: string; year?: string | number }) => {
    const response = await api.get<{
      success: boolean;
      message?: string;
      data: PenempatanMetricsData;
    }>("/hrd/job-placements/metrics", { params });
    return response.data?.data;
  },

  getPlacements: async (params?: Record<string, unknown>) => {
    const response = await api.get<{
      success: boolean;
      data: {
        data: JobPlacement[];
        meta?: {
          current_page: number;
          last_page: number;
          per_page: number;
          total: number;
        };
      };
    }>("/hrd/job-placements", { params });
    return response.data?.data;
  },

  createPlacement: async (payload: Record<string, unknown>) => {
    const response = await api.post("/hrd/job-placements", payload);
    return response.data;
  },

  updatePlacement: async (
    id: string | number,
    payload: Record<string, unknown>,
  ) => {
    const placementId = encodeURIComponent(String(id));
    const response = await api.put(
      `/hrd/job-placements/${placementId}`,
      payload,
    );
    return response.data;
  },

  deletePlacement: async (id: string | number) => {
    const placementId = encodeURIComponent(String(id));
    const response = await api.delete(`/hrd/job-placements/${placementId}`);
    return response.data;
  },
};
