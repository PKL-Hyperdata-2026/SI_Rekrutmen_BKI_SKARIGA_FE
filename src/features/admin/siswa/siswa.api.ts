import { api } from "@/api/axios";
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
  getStudents: (params?: SiswaFilterParams) =>
    api.get<{
      success: boolean;
      message?: string;
      data: SiswaPaginatedResponse;
    }>("/admin/students", { params }),

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
