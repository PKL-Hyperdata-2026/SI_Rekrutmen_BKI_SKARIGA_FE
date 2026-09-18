import { api } from "@/api/axios";
import type {
  HrdJobVacancyPagination,
  HrdJobVacancyStatistics,
  HrdJobVacancyOptions,
  HrdJobVacancyItem,
  LowonganPayload,
  GetVacanciesParams,
} from "./lowongan.schema";

export interface HrdJobVacancyMutationResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

type AbortSignalOption = { signal?: AbortSignal } | AbortSignal;

function resolveSignal(option?: AbortSignalOption): AbortSignal | undefined {
  if (option instanceof AbortSignal) return option;
  return option?.signal;
}

function toVacancyPagination(payload: unknown): HrdJobVacancyPagination {
  const record = (payload ?? {}) as {
    meta?: Record<string, unknown>;
    data?: unknown;
    current_page?: unknown;
    last_page?: unknown;
    per_page?: unknown;
    total?: unknown;
    from?: number | null;
    to?: number | null;
  };
  const meta = record.meta;
  const data = Array.isArray(record.data)
    ? record.data
    : Array.isArray(payload)
      ? payload
      : [];
  return {
    data: data as HrdJobVacancyItem[],
    current_page: Number(meta?.current_page ?? record.current_page ?? 1),
    last_page: Number(meta?.last_page ?? record.last_page ?? 1),
    per_page: Number(meta?.per_page ?? record.per_page ?? 10),
    total: Number(meta?.total ?? record.total ?? data.length),
    from: (meta?.from as number | null) ?? record.from ?? null,
    to: (meta?.to as number | null) ?? record.to ?? null,
  };
}

export const hrdLowonganApi = {
  async getVacancies(
    params: GetVacanciesParams = {},
    options?: AbortSignalOption
  ): Promise<HrdJobVacancyPagination> {
    const response = await api.get("/hrd/job-vacancies", {
      params,
      signal: resolveSignal(options),
    });
    return toVacancyPagination(response.data?.data);
  },

  async getStatistics(
    options?: AbortSignalOption
  ): Promise<HrdJobVacancyStatistics> {
    const response = await api.get("/hrd/job-vacancies/statistics", {
      signal: resolveSignal(options),
    });
    const payload = response.data?.data || {};
    return {
      active: Number(payload.activeCount ?? payload.active ?? 0),
      draft_closed: Number(
        payload.draftOrClosedCount ?? payload.draft_closed ?? 0
      ),
    };
  },

  async getOptions(
    options?: AbortSignalOption
  ): Promise<HrdJobVacancyOptions> {
    const response = await api.get("/hrd/job-vacancies/options", {
      signal: resolveSignal(options),
    });
    const payload = response.data?.data || {};
    return {
      majors: Array.isArray(payload.majors) ? payload.majors : [],
      targetApplicants: Array.isArray(payload.targetApplicants)
        ? payload.targetApplicants
        : [],
      jobTypes: Array.isArray(payload.jobTypes) ? payload.jobTypes : [],
      vacancyStatuses: Array.isArray(payload.vacancyStatuses)
        ? payload.vacancyStatuses
        : [],
    };
  },

  async createVacancy(
    data: LowonganPayload
  ): Promise<HrdJobVacancyMutationResponse> {
    const response = await api.post<HrdJobVacancyMutationResponse>(
      "/hrd/job-vacancies",
      data
    );
    return response.data;
  },

  async updateVacancy(
    id: string | number,
    data: Partial<LowonganPayload>
  ): Promise<HrdJobVacancyMutationResponse> {
    const encodedId = encodeURIComponent(String(id));
    const response = await api.put<HrdJobVacancyMutationResponse>(
      `/hrd/job-vacancies/${encodedId}`,
      data
    );
    return response.data;
  },

  async deleteVacancy(
    id: string | number
  ): Promise<HrdJobVacancyMutationResponse> {
    const encodedId = encodeURIComponent(String(id));
    const response = await api.delete<HrdJobVacancyMutationResponse>(
      `/hrd/job-vacancies/${encodedId}`
    );
    return response.data;
  },

  async toggleActive(
    id: string | number,
    isActive: boolean
  ): Promise<HrdJobVacancyMutationResponse> {
    const encodedId = encodeURIComponent(String(id));
    const response = await api.patch<HrdJobVacancyMutationResponse>(
      `/hrd/job-vacancies/${encodedId}/toggle-active`,
      { is_active: isActive }
    );
    return response.data;
  },
};
