import { api } from "@/api/axios";
import type {
  AlumniItem,
  AlumniOptionsData,
} from "./alumni.schema";

export const alumniApi = {
  getAlumni: (params?: {
    search?: string;
    graduation_year?: string | number;
    major_id?: string;
    employment_status_id?: string;
    current_company_id?: string;
    sort_by?: string;
    sort_dir?: string;
    per_page?: number;
    page?: number;
  }) =>
    api.get<{
      success: boolean;
      message?: string;
      data: {
        data: AlumniItem[];
        current_page?: number;
        last_page?: number;
        total?: number;
      };
    }>("/admin/alumni", { params }),

  getAlumniOptions: () =>
    api.get<{
      success: boolean;
      message?: string;
      data: AlumniOptionsData;
    }>("/admin/alumni/options"),

  getSingleAlumni: (id: number | string) =>
    api.get<{
      success: boolean;
      message?: string;
      data: AlumniItem;
    }>(`/admin/alumni/${id}`),

  createAlumni: (payload: Record<string, unknown>) =>
    api.post<{
      success: boolean;
      message?: string;
      data: AlumniItem;
    }>("/admin/alumni", payload),

  updateAlumni: (id: number | string, payload: Record<string, unknown>) =>
    api.put<{
      success: boolean;
      message?: string;
      data: AlumniItem;
    }>(`/admin/alumni/${id}`, payload),

  deleteAlumni: (id: number | string) =>
    api.delete<{
      success: boolean;
      message?: string;
    }>(`/admin/alumni/${id}`),
};
