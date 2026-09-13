import { api } from "@/api/axios";
import type {
  AdminTracerItem,
  TracerMetrics,
  TracerFilterOptions,
  TracerListResponse,
  SubmitAdminTracerPayload,
} from "./tracer.schema";

export const adminTracerApi = {
  getTracerStudies: async (params?: Record<string, unknown>): Promise<TracerListResponse> => {
    const res = await api.get("/admin/tracer-studies", { params });
    return res.data?.data || res.data;
  },

  getTracerMetrics: async (): Promise<TracerMetrics> => {
    const res = await api.get("/admin/tracer-studies/metrics");
    return res.data?.data || res.data;
  },

  getTracerOptions: async (): Promise<TracerFilterOptions> => {
    const res = await api.get("/admin/tracer-studies/options");
    return res.data?.data || res.data;
  },

  getTracerDetail: async (id: string | number): Promise<AdminTracerItem> => {
    const res = await api.get(`/admin/tracer-studies/${id}`);
    return res.data?.data || res.data;
  },

  createTracerStudy: async (payload: SubmitAdminTracerPayload) => {
    const res = await api.post("/admin/tracer-studies", payload);
    return res.data?.data || res.data;
  },

  updateTracerStudy: async (id: string | number, payload: SubmitAdminTracerPayload) => {
    const res = await api.put(`/admin/tracer-studies/${id}`, payload);
    return res.data?.data || res.data;
  },

  deleteTracerStudy: async (id: string | number) => {
    const res = await api.delete(`/admin/tracer-studies/${id}`);
    return res.data?.data || res.data;
  },

  syncTracerStudies: async () => {
    const res = await api.post("/admin/tracer-studies/sync");
    return res.data?.data || res.data;
  },
};
