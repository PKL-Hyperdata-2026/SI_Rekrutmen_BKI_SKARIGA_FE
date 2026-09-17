import { api } from "@/api/axios";
import type { StudentJobVacancy } from "./lowongan-kerja.card";

export interface RawMajor {
  id: number | string;
  name: string;
  code?: string;
  department_id?: number | string;
}

export interface StudentJobVacancyFilterOptions {
  departments?: { id: number | string; name: string; code?: string }[];
  companies?: { id: number | string; name: string }[];
  majors?: RawMajor[];
  jobTypes?: { id: number | string; name: string }[];
  targetApplicants?: { id: number | string; name: string; code?: string }[];
  workLocations?: (
    | string
    | { id?: number | string; name?: string; work_location?: string }
  )[];
}

export interface VacanciesPaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
}

export interface VacanciesPaginatedData {
  data: StudentJobVacancy[];
  meta?: VacanciesPaginationMeta;
}

export type VacanciesDataPayload = StudentJobVacancy[] | VacanciesPaginatedData;

export interface VacanciesApiResponse {
  data: VacanciesDataPayload;
}

export interface VacanciesQueryParams {
  per_page?: number;
  page?: number;
  department_id?: string;
  major_id?: string;
  target_applicant_id?: string;
  work_location?: string;
  search?: string;
  sort_direction?: "asc" | "desc";
  order_by?: "id" | "created_at" | "title" | "deadline";
}

export interface ApplyJobVacancyPayload {
  notes?: string;
}

export const lowonganKerjaApi = {
  getFilterOptions: async (): Promise<
    StudentJobVacancyFilterOptions | undefined
  > => {
    const response = await api.get<{ data: StudentJobVacancyFilterOptions }>(
      "/job-vacancies/options",
    );
    return response.data?.data;
  },

  getVacancies: async (
    params?: VacanciesQueryParams,
  ): Promise<VacanciesDataPayload | undefined> => {
    const response = await api.get<VacanciesApiResponse>("/job-vacancies", {
      params,
    });
    return response.data?.data;
  },

  getVacancyDetail: async (
    idOrSlug: string | number,
  ): Promise<StudentJobVacancy | undefined> => {
    const response = await api.get<{ data: StudentJobVacancy }>(
      `/job-vacancies/${encodeURIComponent(idOrSlug)}`,
    );
    return response.data?.data;
  },

  applyVacancy: async (
    idOrSlug: string | number,
    payload?: ApplyJobVacancyPayload,
  ): Promise<unknown> => {
    const response = await api.post(
      `/job-vacancies/${encodeURIComponent(idOrSlug)}/apply`,
      payload,
    );
    return response.data;
  },
};
