import { api } from "@/api/axios";
import type {
  AdminTracerItem,
  TracerMetrics,
  TracerFilterOptions,
  SubmitAdminTracerPayload,
} from "./tracer.schema";

export const adminTracerApi = {
  getTracerStudies: (params?: Record<string, unknown>) => {
    return api.get("/admin/tracer-studies", { params });
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

  createTracerStudy: (payload: SubmitAdminTracerPayload) => {
    return api.post("/admin/tracer-studies", payload);
  },

  updateTracerStudy: (id: string | number, payload: SubmitAdminTracerPayload) => {
    return api.put(`/admin/tracer-studies/${id}`, payload);
  },

  deleteTracerStudy: (id: string | number) => {
    return api.delete(`/admin/tracer-studies/${id}`);
  },

  syncTracerStudies: async () => {
    const res = await api.post("/admin/tracer-studies/sync");
    return res.data;
  },
};
