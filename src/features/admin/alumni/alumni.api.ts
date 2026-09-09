import { api } from "@/api/axios";
import type { AlumniFilterParams, AlumniPaginatedResponse } from "./alumni.schema";

export const alumniApi = {
  getAlumni: (params?: AlumniFilterParams | Record<string, unknown>) =>
    api.get<{
      success?: boolean;
      message?: string;
      data: AlumniPaginatedResponse;
    } & AlumniPaginatedResponse>("/admin/alumni", { params }),
  getAlumniOptions: () =>
    api.get("/admin/alumni/options"),
  getAlumniById: (id: string | number) =>
    api.get(`/admin/alumni/${id}`),
  createAlumni: (data: Record<string, unknown>) =>
    api.post("/admin/alumni", data),
  updateAlumni: (id: string | number, data: Record<string, unknown>) =>
    api.put(`/admin/alumni/${id}`, data),
  deleteAlumni: (id: string | number) =>
    api.delete(`/admin/alumni/${id}`),
  uploadPortfolio: (studentId: string | number, formData: FormData) =>
    api.post(`/admin/students/${studentId}/portfolios`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deletePortfolio: (studentId: string | number, portfolioId: string | number) =>
    api.delete(`/admin/students/${studentId}/portfolios/${portfolioId}`),
};
