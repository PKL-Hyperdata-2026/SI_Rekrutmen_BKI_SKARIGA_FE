import { api } from "@/api/axios";
import type { StudentJobVacancy } from "../lowongan-kerja/lowongan-kerja.card";
import type { StudentJobApplication } from "../lamaran/lamaran.schema";
import type { NotificationItem } from "@/api/notification.api";
import type { StudentProfileData } from "../e-portfolio/e-portfolio.schema";

export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
}

export const studentDashboardApi = {
  getVacancies: async (perPage = 6) => {
    const response = await api.get<{
      data: PaginatedResponse<StudentJobVacancy> | StudentJobVacancy[];
    }>("/job-vacancies", {
      params: { per_page: perPage },
    });
    return response.data?.data;
  },

  getMyApplications: async (perPage = 6) => {
    const response = await api.get<{
      data: PaginatedResponse<StudentJobApplication> | StudentJobApplication[];
    }>("/my-applications", {
      params: { per_page: perPage },
    });
    return response.data?.data;
  },

  getNotifications: async (limit = 10) => {
    const response = await api.get<{
      data: PaginatedResponse<NotificationItem> | NotificationItem[];
    }>("/notification", {
      params: { limit },
    });
    return response.data?.data;
  },

  getProfile: async () => {
    const response = await api.get<{
      data: StudentProfileData;
    }>("/siswa/portfolio/profile");
    return response.data?.data;
  },
};
