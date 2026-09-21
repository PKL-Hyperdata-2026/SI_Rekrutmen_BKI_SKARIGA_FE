import { api } from "@/api/axios";
import type {
  BulkReviewPayload,
  GetReviewsParams,
  ReviewApplicant,
  ReviewFilterOptions,
  ReviewListResult,
  ReviewPayload,
  ReviewSummary,
} from "./review.schema";

interface BackendPaginatorEnvelope {
  data?: unknown;
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  } | null;
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  links?: unknown;
}

function isReviewApplicant(value: unknown): value is ReviewApplicant {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    (typeof record.id === "string" || typeof record.id === "number") &&
    Array.isArray(record.documents)
  );
}

function toApplicantRows(payload: unknown): ReviewApplicant[] {
  const raw: unknown[] = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as BackendPaginatorEnvelope | null)?.data)
      ? ((payload as BackendPaginatorEnvelope).data as unknown[])
      : [];
  return raw.filter(isReviewApplicant);
}

function toPaginationMeta(
  payload: unknown,
  fallbackCount: number,
  fallbackPerPage: number,
): ReviewListResult["meta"] {
  const envelope = (payload ?? {}) as BackendPaginatorEnvelope;
  const meta = envelope.meta ?? null;
  const currentPage = Number(
    meta?.current_page ?? envelope.current_page ?? 1,
  );
  const perPage = Number(
    meta?.per_page ?? envelope.per_page ?? fallbackPerPage,
  );
  const total = Number(meta?.total ?? envelope.total ?? fallbackCount);
  const lastPage = Number(
    meta?.last_page ??
      envelope.last_page ??
      Math.ceil(total / (perPage || 1)) ??
      1,
  );
  return {
    current_page: Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1,
    last_page: Number.isFinite(lastPage) && lastPage > 0 ? lastPage : 1,
    per_page: Number.isFinite(perPage) && perPage > 0 ? perPage : fallbackPerPage,
    total: Number.isFinite(total) && total >= 0 ? total : fallbackCount,
  };
}

function toCount(value: unknown): number {
  const num = Number(value ?? 0);
  return Number.isFinite(num) && num >= 0 ? Math.floor(num) : 0;
}

function toSummary(payload: unknown): ReviewSummary {
  const record =
    typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)
      : {};
  return {
    total: toCount(record.total),
    perlu_review: toCount(record.perlu_review),
    lolos_berkas: toCount(record.lolos_berkas),
    ditolak: toCount(record.ditolak),
  };
}

export interface BulkReviewResult {
  processed: number;
  succeeded: number;
  failed: number;
  failures: Array<{ id: number | string; message: string }>;
}

export const reviewApi = {
  async getReviews(params: GetReviewsParams & { signal?: AbortSignal } = {}): Promise<ReviewListResult> {
    const query: Record<string, string | number> = {};
    if (params.job_vacancy_id && params.job_vacancy_id !== "") {
      query.job_vacancy_id = params.job_vacancy_id;
    }
    if (params.review_status) {
      query.review_status = params.review_status;
    }
    if (params.search && params.search.trim() !== "") {
      query.search = params.search.trim();
    }
    query.page = params.page ?? 1;
    query.per_page = params.per_page ?? 10;
    query.sort_by = params.sort_by ?? "applied_at";
    query.sort_dir = params.sort_dir ?? "desc";

    const response = await api.get<{
      success: boolean;
      message?: string;
      data: {
        summary?: unknown;
        applicants?: unknown;
        filters?: ReviewFilterOptions;
      };
    }>("/hrd/applicant-reviews", { params: query, signal: params.signal });

    const payload = response.data?.data ?? {};
    const rows = toApplicantRows(payload.applicants);
    const meta = toPaginationMeta(payload.applicants, rows.length, query.per_page as number);

    return {
      rows,
      meta,
      summary: toSummary(payload.summary),
      filterOptions: (payload.filters ?? null) as ReviewFilterOptions | null,
    };
  },

  async getOptions(): Promise<ReviewFilterOptions> {
    const response = await api.get<{
      success: boolean;
      message?: string;
      data: ReviewFilterOptions;
    }>("/hrd/applicant-reviews/options");
    const payload = response.data?.data ?? { vacancies: [], review_statuses: [] };
    return {
      vacancies: Array.isArray(payload.vacancies) ? payload.vacancies : [],
      review_statuses: Array.isArray(payload.review_statuses)
        ? payload.review_statuses
        : [],
    };
  },

  async reviewApplicant(
    id: string,
    payload: ReviewPayload,
  ): Promise<{ success: boolean; message: string }> {
    const encodedId = encodeURIComponent(String(id));
    const response = await api.patch<{
      success: boolean;
      message: string;
    }>(`/hrd/applicant-reviews/${encodedId}/review`, payload);
    return {
      success: Boolean(response.data?.success),
      message: String(response.data?.message ?? ""),
    };
  },

  async bulkReview(payload: BulkReviewPayload): Promise<BulkReviewResult> {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: BulkReviewResult;
    }>("/hrd/applicant-reviews/bulk-review", payload);
    const result = response.data?.data ?? {
      processed: 0,
      succeeded: 0,
      failed: 0,
      failures: [],
    };
    return {
      processed: Number(result.processed ?? 0),
      succeeded: Number(result.succeeded ?? 0),
      failed: Number(result.failed ?? 0),
      failures: Array.isArray(result.failures) ? result.failures : [],
    };
  },
};
