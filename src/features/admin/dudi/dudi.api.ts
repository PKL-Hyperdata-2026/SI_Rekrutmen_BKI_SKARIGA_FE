import { api } from "@/api/axios";
import type {
  DudiItem,
  DudiOptionsData,
} from "./dudi.schema";

export const dudiApi = {
  getCompanies: (params?: {
    search?: string;
    industry_id?: string;
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
        data: DudiItem[];
        current_page?: number;
        last_page?: number;
        total?: number;
      };
    }>("/admin/companies", { params }),

  getCompanyOptions: () =>
    api.get<{
      success: boolean;
      message?: string;
      data: DudiOptionsData;
    }>("/admin/companies/options"),

  getCompany: (id: number | string) =>
    api.get<{
      success: boolean;
      message?: string;
      data: DudiItem;
    }>(`/admin/companies/${id}`),

  createCompany: (payload: Record<string, unknown>) =>
    api.post<{
      success: boolean;
      message?: string;
      data: DudiItem;
    }>("/admin/companies", payload),

  updateCompany: (id: number | string, payload: Record<string, unknown>) =>
    api.put<{
      success: boolean;
      message?: string;
      data: DudiItem;
    }>(`/admin/companies/${id}`, payload),

  toggleCompanyActive: (id: number | string) =>
    api.patch<{
      success: boolean;
      message?: string;
      data: DudiItem;
    }>(`/admin/companies/${id}/toggle-active`),

  deleteCompany: (id: number | string) =>
    api.delete<{
      success: boolean;
      message?: string;
    }>(`/admin/companies/${id}`),
};
