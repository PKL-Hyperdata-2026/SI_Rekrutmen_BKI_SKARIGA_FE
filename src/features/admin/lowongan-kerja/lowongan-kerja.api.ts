import { api } from "@/api/axios";
import {
  selectOptionsApi,
  type SelectQuery,
  type FetchPageOptions,
  type SelectPageResult,
} from "@/api/select-options";
import type {
  JobVacancy,
  JobVacancyOptionsData,
} from "./lowongan-kerja.schema";

export const lowonganKerjaApi = {
  getCompanies: (
    query: SelectQuery,
    opts?: FetchPageOptions,
  ): Promise<SelectPageResult> => selectOptionsApi.getCompanies(query, opts),

  getOptions: async () => {
    const response = await api.get<{ data: JobVacancyOptionsData }>(
      "/admin/job-vacancies/options",
    );
    return response.data?.data;
  },

  getVacancies: async (params?: Record<string, string | number>) => {
    const response = await api.get("/admin/job-vacancies", { params });
    return response.data?.data;
  },

  getVacancyDetail: async (id: number | string) => {
    const response = await api.get<{ data: JobVacancy }>(
      `/admin/job-vacancies/${id}`,
    );
    return response.data?.data;
  },

  createVacancy: async (payload: Record<string, unknown>) => {
    const response = await api.post("/admin/job-vacancies", payload);
    return response.data;
  },

  updateVacancy: async (
    id: number | string,
    payload: Record<string, unknown>,
  ) => {
    const response = await api.put(`/admin/job-vacancies/${id}`, payload);
    return response.data;
  },

  deleteVacancy: async (id: number | string) => {
    const response = await api.delete(`/admin/job-vacancies/${id}`);
    return response.data;
  },
};
