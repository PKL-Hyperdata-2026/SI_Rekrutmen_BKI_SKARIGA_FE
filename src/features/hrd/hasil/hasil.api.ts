import { api } from "@/api/axios";
import type {
  SelectionResultItem,
  SelectionResultSummary,
  SelectionResultFilterParams,
} from "./hasil.schema";

export interface SelectionResultOptionsData {
  vacancies: Array<{ value: string | number; label: string; extra?: { title: string } }>;
  decisions: Array<{ value: string; label: string }>;
}

export interface SelectionResultsResponse {
  summary: SelectionResultSummary;
  applicants: {
    data: SelectionResultItem[];
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
  filters: SelectionResultOptionsData;
}

export const hasilApi = {
  getSelectionResults: async (params?: SelectionResultFilterParams): Promise<SelectionResultsResponse> => {
    const response = await api.get<{
      success: boolean;
      data: SelectionResultsResponse;
    }>("/hrd/selection-results", { params });
    return response.data.data;
  },

  getOptions: async (): Promise<SelectionResultOptionsData> => {
    const response = await api.get<{
      success: boolean;
      data: SelectionResultOptionsData;
    }>("/hrd/selection-results/options");
    return response.data.data;
  },

  saveEvaluation: async (applicationId: string | number, payload: FormData): Promise<SelectionResultItem> => {
    const response = await api.post<{
      success: boolean;
      data: SelectionResultItem;
    }>(`/hrd/selection-results/${applicationId}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  updateDecision: async (
    applicationId: string | number,
    decision: "diterima" | "tidak_diterima" | "cadangan" | "pending"
  ): Promise<SelectionResultItem> => {
    const response = await api.patch<{
      success: boolean;
      data: SelectionResultItem;
    }>(`/hrd/selection-results/${applicationId}/decision`, { decision });
    return response.data.data;
  },

  publish: async (jobVacancyId: string | number): Promise<number> => {
    const response = await api.post<{
      success: boolean;
      data: { published_count: number };
    }>("/hrd/selection-results/publish", { job_vacancy_id: jobVacancyId });
    return response.data.data.published_count;
  },

  saveDraft: async (jobVacancyId: string | number): Promise<number> => {
    const response = await api.post<{
      success: boolean;
      data: { draft_count: number };
    }>("/hrd/selection-results/draft", { job_vacancy_id: jobVacancyId });
    return response.data.data.draft_count;
  },
};
