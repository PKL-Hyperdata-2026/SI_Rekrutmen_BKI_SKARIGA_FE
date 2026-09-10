import { api } from "@/api/axios";

export interface AsyncSelectItem {
  value: string;
  label: string;
  extra?: Record<string, unknown>;
}

export interface SelectQuery {
  search: string;
  page: number;
  per_page: number;
}

export interface SelectPageResult {
  items: AsyncSelectItem[];
  hasMore: boolean;
  total: number;
}

export interface FetchPageOptions {
  signal?: AbortSignal;
}

export type FetchSelectPage = (
  query: SelectQuery,
  opts?: FetchPageOptions
) => Promise<SelectPageResult>;

interface PaginatedEnvelope {
  success: boolean;
  message?: string;
  data?: {
    data?: AsyncSelectItem[];
    meta?: {
      current_page?: number;
      last_page?: number;
      total?: number;
    };
  };
}

function toSelectPage(res: { data?: PaginatedEnvelope }): SelectPageResult {
  const payload = res.data?.data;
  const items = Array.isArray(payload?.data) ? payload.data : [];
  const meta = payload?.meta;
  const currentPage = meta?.current_page ?? 1;
  const lastPage = meta?.last_page ?? 1;
  return {
    items,
    hasMore: currentPage < lastPage,
    total: meta?.total ?? items.length,
  };
}

function buildParams(query: SelectQuery, extra?: Record<string, string | number | boolean>) {
  return {
    search: query.search || undefined,
    page: query.page,
    per_page: query.per_page,
    ...extra,
  };
}

const SELECT_CACHE_TTL_MS = 60_000;

interface SelectCacheEntry {
  fetchedAt: number;
  data: SelectPageResult;
}

const selectPageCache = new Map<string, SelectCacheEntry>();

function selectCacheKey(url: string, params: Record<string, unknown>): string {
  return `${url}|${JSON.stringify(params)}`;
}

export function clearSelectOptionsCache(): void {
  selectPageCache.clear();
}

async function fetchSelectPage(
  url: string,
  query: SelectQuery,
  extra?: Record<string, string | number | boolean>,
  opts?: FetchPageOptions
): Promise<SelectPageResult> {
  const params = buildParams(query, extra);
  const key = selectCacheKey(url, params);

  const cached = selectPageCache.get(key);
  if (cached && Date.now() - cached.fetchedAt < SELECT_CACHE_TTL_MS) {
    return cached.data;
  }

  const res = await api.get<PaginatedEnvelope>(url, {
    params,
    signal: opts?.signal,
  });
  const page = toSelectPage(res);

  if (!opts?.signal?.aborted) {
    selectPageCache.set(key, {
      fetchedAt: Date.now(),
      data: page,
    });
  }

  return page;
}

export const selectOptionsApi = {
  getCompanies: (query: SelectQuery, opts?: FetchPageOptions) =>
    fetchSelectPage("/admin/companies", query, { for_select: 1 }, opts),

  getStudents: (query: SelectQuery, eligible = false, opts?: FetchPageOptions) =>
    fetchSelectPage(
      "/admin/students",
      query,
      {
        for_select: 1,
        ...(eligible ? { eligible: 1 } : {}),
      },
      opts
    ),

  getMajors: (query: SelectQuery, opts?: FetchPageOptions) =>
    fetchSelectPage("/admin/majors", query, { for_select: 1 }, opts),

  getDepartments: (query: SelectQuery, opts?: FetchPageOptions) =>
    fetchSelectPage("/admin/departments", query, { for_select: 1 }, opts),

  getStandardTypes: (
    category: string,
    query: SelectQuery,
    opts?: FetchPageOptions
  ) => fetchSelectPage("/admin/standard-types", query, { category }, opts),

  getHrdStudentsAlumni: (query: SelectQuery, opts?: FetchPageOptions) =>
    fetchSelectPage("/hrd/students-alumni", query, undefined, opts),
};
