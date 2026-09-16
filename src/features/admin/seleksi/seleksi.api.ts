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
};
