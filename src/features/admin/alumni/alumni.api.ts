import { api } from "@/api/axios";
import { unwrap } from "@/api/unwrap";
import type { ApiResponse } from "@/api/unwrap";
import { selectOptionsApi } from "@/api/select-options";
import type {
  AsyncSelectItem,
  FetchPageOptions,
  SelectPageResult,
  SelectQuery,
} from "@/api/select-options";
import type {
  AlumniFilterParams,
  AlumniItem,
  AlumniPaginatedResponse,
  AlumniReferenceItem,
} from "./alumni.schema";

export interface AlumniFilterOptions {
  statuses: AlumniReferenceItem[];
  portfolioTypes: AlumniReferenceItem[];
  graduationYears: number[];
}

const FILTER_PAGE_SIZE = 100;

function toReferenceItems(items: AsyncSelectItem[]): AlumniReferenceItem[] {
  return items.map((item) => ({
    id: item.value,
    code: typeof item.extra?.code === "string" ? item.extra.code : undefined,
    name: item.label,
  }));
}

export function buildGraduationYears(): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 11 }, (_, i) => currentYear - i);
}

export async function getClassMajorSelectPage(
  query: SelectQuery,
  opts?: FetchPageOptions,
): Promise<SelectPageResult> {
  const [classes, majors] = await Promise.all([
    selectOptionsApi.getStandardTypes("class", query, opts),
    selectOptionsApi.getMajors(query, opts),
  ]);

  const classItems: AsyncSelectItem[] = classes.items.map((item) => {
    const resolvedMajorName =
      typeof item.extra?.resolvedMajorName === "string"
        ? item.extra.resolvedMajorName
        : "";
    return {
      value: `class_${item.value}`,
      label: resolvedMajorName
        ? `${item.label} - ${resolvedMajorName}`
        : item.label,
      extra: { ...item.extra, kind: "class" },
    };
  });

  const majorItems: AsyncSelectItem[] = majors.items.map((item) => ({
    value: `major_${item.value}`,
    label: `Jurusan: ${item.label}`,
    extra: { ...item.extra, kind: "major" },
  }));

  return {
    items: [...classItems, ...majorItems],
    hasMore: classes.hasMore || majors.hasMore,
    total: classes.total + majors.total,
  };
}

export async function suggestCompanies(
  search: string,
): Promise<AsyncSelectItem[]> {
  if (search.trim().length < 2) return [];
  const page = await selectOptionsApi.getCompanies({
    search: search.trim(),
    page: 1,
    per_page: 20,
  });
  return page.items;
}

export const alumniApi = {
  getAlumni: async (
    params?: AlumniFilterParams | Record<string, unknown>,
  ): Promise<AlumniPaginatedResponse> => {
    const res = await api.get<ApiResponse<AlumniPaginatedResponse>>(
      "/admin/alumni",
      { params },
    );
    return unwrap(res);
  },

  getFilterOptions: async (): Promise<AlumniFilterOptions> => {
    const baseQuery = { search: "", page: 1, per_page: FILTER_PAGE_SIZE };
    const [statuses, portfolioTypes] = await Promise.all([
      selectOptionsApi.getStandardTypes("employment_status", baseQuery),
      selectOptionsApi.getStandardTypes("portfolio_type", baseQuery),
    ]);
    return {
      statuses: toReferenceItems(statuses.items),
      portfolioTypes: toReferenceItems(portfolioTypes.items),
      graduationYears: buildGraduationYears(),
    };
  },

  getAlumniById: async (id: string | number): Promise<AlumniItem> => {
    const res = await api.get<ApiResponse<AlumniItem>>(`/admin/alumni/${id}`);
    return unwrap(res);
  },

  createAlumni: async (data: Record<string, unknown>): Promise<AlumniItem> => {
    const res = await api.post<ApiResponse<AlumniItem>>("/admin/alumni", data);
    return unwrap(res);
  },

  updateAlumni: async (
    id: string | number,
    data: Record<string, unknown>,
  ): Promise<AlumniItem> => {
    const res = await api.put<ApiResponse<AlumniItem>>(
      `/admin/alumni/${id}`,
      data,
    );
    return unwrap(res);
  },

  deleteAlumni: async (id: string | number): Promise<void> => {
    await api.delete(`/admin/alumni/${id}`);
  },

  uploadPortfolio: async (
    studentId: string | number,
    formData: FormData,
  ): Promise<AlumniItem> => {
    const res = await api.post<ApiResponse<AlumniItem>>(
      `/admin/students/${studentId}/portfolios`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return unwrap(res);
  },

  deletePortfolio: async (
    studentId: string | number,
    portfolioId: string | number,
  ): Promise<AlumniItem> => {
    const res = await api.delete<ApiResponse<AlumniItem>>(
      `/admin/students/${studentId}/portfolios/${portfolioId}`,
    );
    return unwrap(res);
  },
};
