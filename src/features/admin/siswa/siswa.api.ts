import { api } from "@/api/axios";
import type {
  SiswaFilterParams,
  SiswaItem,
  SiswaOptionsData,
  SiswaPaginatedResponse,
} from "./siswa.schema";

export const siswaApi = {
  getStudents: (params?: SiswaFilterParams) =>
    api.get<{
      success: boolean;
      message?: string;
      data: SiswaPaginatedResponse;
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

  uploadPortfolio: (studentId: number | string, formData: FormData) =>
    api.post<{
      success: boolean;
      message?: string;
      data: SiswaItem;
    }>(`/admin/students/${studentId}/portfolios`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deletePortfolio: (studentId: number | string, portfolioId: number | string) =>
    api.delete<{
      success: boolean;
      message?: string;
      data: SiswaItem;
    }>(`/admin/students/${studentId}/portfolios/${portfolioId}`),
};
