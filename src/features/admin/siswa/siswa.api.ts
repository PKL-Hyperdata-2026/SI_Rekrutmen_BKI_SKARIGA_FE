import { api } from "@/api/axios";
import type {
  SiswaItem,
  SiswaOptionsData,
} from "./siswa.schema";

export const siswaApi = {
  getStudents: (params?: {
    search?: string;
    major_id?: string;
    class_id?: string;
    employment_status_id?: string;
    graduation_year?: string | number;
    is_active?: string;
    sort_by?: string;
    sort_dir?: string;
    per_page?: number;
    page?: number;
  }) =>
    api.get<{
      success: boolean;
      message?: string;
      data: {
        data: SiswaItem[];
        current_page?: number;
        last_page?: number;
        total?: number;
      };
    }>("/admin/students", { params }),

  getStudentOptions: () =>
    api.get<{
      success: boolean;
      message?: string;
      data: SiswaOptionsData;
    }>("/admin/students/options"),

  getStudent: (id: number | string) =>
    api.get<{
      success: boolean;
      message?: string;
      data: SiswaItem;
    }>(`/admin/students/${id}`),

  createStudent: (payload: Record<string, unknown>) =>
    api.post<{
      success: boolean;
      message?: string;
      data: SiswaItem;
    }>("/admin/students", payload),

  updateStudent: (id: number | string, payload: Record<string, unknown>) =>
    api.put<{
      success: boolean;
      message?: string;
      data: SiswaItem;
    }>(`/admin/students/${id}`, payload),

  deleteStudent: (id: number | string) =>
    api.delete<{
      success: boolean;
      message?: string;
    }>(`/admin/students/${id}`),
};
