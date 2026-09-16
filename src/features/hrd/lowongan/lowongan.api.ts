import { api } from "@/api/axios";
import type {
  HrdJobVacancyPagination,
  HrdJobVacancyStatistics,
  HrdJobVacancyOptions,
  LowonganPayload,
} from "./lowongan.schema";

export const hrdLowonganApi = {
  async getVacancies(params: {
    search?: string;
    page?: number;
    per_page?: number;
  } = {}): Promise<HrdJobVacancyPagination> {
    const response = await api.get("/hrd/job-vacancies", { params });
    const payload = response.data?.data;
    if (payload && Array.isArray(payload.data)) {
      return payload as HrdJobVacancyPagination;
    }
    return {
      data: Array.isArray(payload) ? payload : [],
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: Array.isArray(payload) ? payload.length : 0,
      from: null,
      to: null,
    };
  },

  async getStatistics(): Promise<HrdJobVacancyStatistics> {
    const response = await api.get("/hrd/job-vacancies/statistics");
    const payload = response.data?.data || {};
    return {
      active: Number(payload.active ?? 0),
      draft_closed: Number(payload.draft_closed ?? 0),
    };
  },

  async getOptions(): Promise<HrdJobVacancyOptions> {
    const response = await api.get("/hrd/job-vacancies/options");
    const payload = response.data?.data || {};
    return {
      majors: Array.isArray(payload.majors) ? payload.majors : [],
      targetApplicants: Array.isArray(payload.targetApplicants)
        ? payload.targetApplicants
        : [],
      jobTypes: Array.isArray(payload.jobTypes) ? payload.jobTypes : [],
      vacancyStatuses: Array.isArray(payload.vacancyStatuses)
        ? payload.vacancyStatuses
        : [],
    };
  },

  async createVacancy(data: LowonganPayload) {
    const response = await api.post("/hrd/job-vacancies", data);
    return response.data;
  },

  async updateVacancy(id: string | number, data: Partial<LowonganPayload>) {
    const response = await api.put(`/hrd/job-vacancies/${id}`, data);
    return response.data;
  },

  async deleteVacancy(id: string | number) {
    const response = await api.delete(`/hrd/job-vacancies/${id}`);
    return response.data;
  },

  async toggleActive(id: string | number, isActive: boolean) {
    const response = await api.patch(`/hrd/job-vacancies/${id}/status`, {
      is_active: isActive,
    });
    return response.data;
  },
};
