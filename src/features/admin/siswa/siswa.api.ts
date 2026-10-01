import { api } from "@/api/axios";
import { unwrap } from "@/api/unwrap";
import type { ApiResponse } from "@/api/unwrap";
import { selectOptionsApi } from "@/api/select-options";
import type { AsyncSelectItem } from "@/api/select-options";
import type {
  SiswaFilterParams,
  SiswaItem,
  SiswaOptionItem,
  SiswaOptionsData,
  SiswaPaginatedResponse,
} from "./siswa.schema";

function toOptionItems(items: AsyncSelectItem[]): SiswaOptionItem[] {
  return items.map((item) => ({
    id: item.value,
    code: typeof item.extra?.code === "string" ? item.extra.code : undefined,
    name: item.label,
  }));
}

const FILTER_PAGE_SIZE = 100;

export const siswaApi = {
  getStudents: async (
    params?: SiswaFilterParams,
  ): Promise<SiswaPaginatedResponse> => {
    const res = await api.get<ApiResponse<SiswaPaginatedResponse>>(
      "/admin/students",
      { params },
    );
    return unwrap(res);
  },

  getFilterOptions: async (): Promise<SiswaOptionsData> => {
    const baseQuery = { search: "", page: 1, per_page: FILTER_PAGE_SIZE };
    const [majors, classes, statuses, portfolioTypes] = await Promise.all([
      selectOptionsApi.getMajors(baseQuery),
      selectOptionsApi.getStandardTypes("class", baseQuery),
      selectOptionsApi.getStandardTypes("employment_status", baseQuery),
      selectOptionsApi.getStandardTypes("portfolio_type", baseQuery),
    ]);
    return {
      majors: toOptionItems(majors.items),
      classes: toOptionItems(classes.items),
      employment_statuses: toOptionItems(statuses.items),
      companies: [],
      portfolio_types: toOptionItems(portfolioTypes.items),
      graduation_years: [],
    };
  },

  getStudent: async (id: number | string): Promise<SiswaItem> => {
    const res = await api.get<ApiResponse<SiswaItem>>(`/admin/students/${id}`);
    return unwrap(res);
  },

  createStudent: async (
    payload: Record<string, unknown>,
  ): Promise<SiswaItem> => {
    const res = await api.post<ApiResponse<SiswaItem>>(
      "/admin/students",
      payload,
    );
    return unwrap(res);
  },

  updateStudent: async (
    id: number | string,
    payload: Record<string, unknown>,
  ): Promise<SiswaItem> => {
    const res = await api.put<ApiResponse<SiswaItem>>(
      `/admin/students/${id}`,
      payload,
    );
    return unwrap(res);
  },

  deleteStudent: async (id: number | string): Promise<void> => {
    await api.delete(`/admin/students/${id}`);
  },

  uploadPortfolio: async (
    studentId: number | string,
    formData: FormData,
  ): Promise<SiswaItem> => {
    const res = await api.post<ApiResponse<SiswaItem>>(
      `/admin/students/${studentId}/portfolios`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return unwrap(res);
  },

  deletePortfolio: async (
    studentId: number | string,
    portfolioId: number | string,
  ): Promise<SiswaItem> => {
    const res = await api.delete<ApiResponse<SiswaItem>>(
      `/admin/students/${studentId}/portfolios/${portfolioId}`,
    );
    return unwrap(res);
  },
};
