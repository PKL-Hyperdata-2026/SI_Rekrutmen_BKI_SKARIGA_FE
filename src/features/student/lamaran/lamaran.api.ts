import { api } from "@/api/axios";
import type {
  StudentJobApplicationFilters,
  StudentJobApplicationListResponse,
  StudentJobApplicationDetailResponse,
} from "./lamaran.schema";

export const getStudentJobApplications = async (
  params?: StudentJobApplicationFilters
): Promise<StudentJobApplicationListResponse> => {
  const response = await api.get<StudentJobApplicationListResponse>(
    "/my-applications",
    { params }
  );
  return response.data;
};

export const getStudentJobApplicationDetail = async (
  id: number
): Promise<StudentJobApplicationDetailResponse> => {
  const response = await api.get<StudentJobApplicationDetailResponse>(
    `/my-applications/${id}`
  );
  return response.data;
};

export const lamaranApi = {
  getApplications: getStudentJobApplications,
  getApplicationDetail: getStudentJobApplicationDetail,
};
