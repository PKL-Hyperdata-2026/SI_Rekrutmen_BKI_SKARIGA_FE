import { api } from "@/api/axios";
import type { SelectionListEnvelope } from "./types";

export interface FetchSeleksiParams {
  job_vacancy_id?: string;
  stage_id?: string;
  attendance_status?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export const seleksiApi = {
  getRecruitmentSelections: (params?: FetchSeleksiParams) =>
    api.get<SelectionListEnvelope>("/admin/recruitment-selections", { params }),
  getVacancies: () =>
    api.get<{
      success?: boolean;
      message?: string;
      data?: {
        data?: Array<{
          id: string | number;
          title?: string;
          position?: string;
          company?: { name?: string } | null;
          companyName?: string | null;
        }>;
        meta?: unknown;
      } | Array<unknown>;
    }>("/admin/job-vacancies", {
      params: { page: 1, per_page: 100 },
    }),
  getStages: (category: string) =>
    api.get<{
      success?: boolean;
      message?: string;
      data?: {
        data?: Array<{
          id: string | number;
          name?: string;
          code?: string;
          sequence_order?: number;
          sequenceOrder?: number;
        }>;
        meta?: unknown;
      } | Array<unknown>;
    }>("/admin/standard-types", {
      params: { category, page: 1, per_page: 100 },
    }),
  getSelectionStagesFallback: () =>
    api.get<{
      success?: boolean;
      message?: string;
      data?: {
        data?: Array<{
          id: string | number;
          name?: string;
          code?: string;
          sequence_order?: number;
        }>;
      };
    }>("/admin/selection-stages", {
      params: { page: 1, per_page: 100 },
    }),
};
