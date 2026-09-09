import { api } from "@/api/axios";
import type { MajorItem, MajorOptionsData } from "./jurusan.schema";

export const jurusanApi = {
  getMajors: (params?: {
    search?: string;
    department_id?: string | number;
    is_active?: string | number;
    sort_by?: string;
    sort_dir?: string;
    per_page?: number;
    page?: number;
  }) =>
    api.get<{
      success: boolean;
      message?: string;
      data: {
        data: MajorItem[];
        current_page?: number;
        last_page?: number;
        total?: number;
      };
    }>("/admin/majors", { params }),

  getMajorOptions: () =>
    api.get<{
      success: boolean;
      message?: string;
      data: MajorOptionsData;
    }>("/admin/majors/options"),

  getMajor: (id: number | string) =>
    api.get<{
      success: boolean;
      message?: string;
      data: MajorItem;
    }>(`/admin/majors/${id}`),

  createMajor: (payload: Record<string, unknown>) =>
    api.post<{
      success: boolean;
      message?: string;
      data: MajorItem;
    }>("/admin/majors", payload),

  updateMajor: (id: number | string, payload: Record<string, unknown>) =>
    api.put<{
      success: boolean;
      message?: string;
      data: MajorItem;
    }>(`/admin/majors/${id}`, payload),

  toggleMajorActive: (id: number | string) =>
    api.patch<{
      success: boolean;
      message?: string;
      data: MajorItem;
    }>(`/admin/majors/${id}/toggle-active`),

  deleteMajor: (id: number | string) =>
    api.delete<{
      success: boolean;
      message?: string;
    }>(`/admin/majors/${id}`),
};
