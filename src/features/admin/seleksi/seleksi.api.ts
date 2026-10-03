import { api } from "@/api/axios";
import { unwrap } from "@/api/unwrap";
import type { ApiResponse } from "@/api/unwrap";
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
  getRecruitmentSelections: async (
    params?: FetchSeleksiParams,
  ): Promise<SelectionListEnvelope["data"]> => {
    const res = await api.get<ApiResponse<SelectionListEnvelope["data"]>>(
      "/admin/recruitment-selections",
      { params },
    );
    return unwrap(res);
  },
  getVacancies: async () => {
    const res = await api.get<{
      success?: boolean;
      message?: string;
      data?:
        | {
            data?: Array<{
              id: string | number;
              title?: string;
              position?: string;
              company?: { name?: string } | null;
              companyName?: string | null;
            }>;
            meta?: unknown;
          }
        | Array<unknown>;
    }>("/admin/job-vacancies", {
      params: { page: 1, per_page: 100 },
    });
    return res.data?.data;
  },
  getStages: async (category: string) => {
    const res = await api.get<{
      success?: boolean;
      message?: string;
      data?:
        | {
            data?: Array<{
              id: string | number;
              name?: string;
              code?: string;
              sequence_order?: number;
              sequenceOrder?: number;
            }>;
            meta?: unknown;
          }
        | Array<unknown>;
    }>("/admin/standard-types", {
      params: { category, page: 1, per_page: 100 },
    });
    return res.data?.data;
  },
  getSelectionStagesFallback: async () => {
    const res = await api.get<{
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
    });
    return res.data?.data;
  },
};
