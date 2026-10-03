import { api } from "@/api/axios";
import { unwrap } from "@/api/unwrap";
import type { ApiResponse, PaginatedData } from "@/api/unwrap";
import type { DudiItem, DudiOptionsData } from "./dudi.schema";

export const dudiApi = {
  getCompanies: async (params?: {
    search?: string;
    industry_id?: string;
    is_active?: string;
    sort_by?: string;
    sort_dir?: string;
    per_page?: number;
    page?: number;
  }): Promise<PaginatedData<DudiItem>> => {
    const res = await api.get<ApiResponse<PaginatedData<DudiItem>>>(
      "/admin/companies",
      { params },
    );
    return unwrap(res);
  },

  getCompanyOptions: async (): Promise<DudiOptionsData> => {
    const res = await api.get<ApiResponse<DudiOptionsData>>(
      "/admin/companies/options",
    );
    return unwrap(res);
  },

  getCompany: async (id: number | string): Promise<DudiItem> => {
    const res = await api.get<ApiResponse<DudiItem>>(`/admin/companies/${id}`);
    return unwrap(res);
  },

  createCompany: async (
    payload: Record<string, unknown>,
  ): Promise<DudiItem> => {
    const res = await api.post<ApiResponse<DudiItem>>(
      "/admin/companies",
      payload,
    );
    return unwrap(res);
  },

  updateCompany: async (
    id: number | string,
    payload: Record<string, unknown>,
  ): Promise<DudiItem> => {
    const res = await api.put<ApiResponse<DudiItem>>(
      `/admin/companies/${id}`,
      payload,
    );
    return unwrap(res);
  },

  toggleCompanyActive: async (id: number | string): Promise<DudiItem> => {
    const res = await api.patch<ApiResponse<DudiItem>>(
      `/admin/companies/${id}/toggle-active`,
    );
    return unwrap(res);
  },

  deleteCompany: async (id: number | string): Promise<void> => {
    await api.delete(`/admin/companies/${id}`);
  },
};
