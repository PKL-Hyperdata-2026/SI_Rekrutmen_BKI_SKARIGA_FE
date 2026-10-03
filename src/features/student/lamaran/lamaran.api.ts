import { api } from "@/api/axios";
import { unwrap } from "@/api/unwrap";
import type { ApiResponse } from "@/api/unwrap";
import type {
  StudentJobApplicationFilters,
  StudentJobApplicationListResponse,
  StudentJobApplication,
} from "./lamaran.schema";

export const getStudentJobApplications = async (
  params?: StudentJobApplicationFilters,
): Promise<StudentJobApplicationListResponse["data"]> => {
  const response = await api.get<
    ApiResponse<StudentJobApplicationListResponse["data"]>
  >("/my-applications", { params });
  return unwrap(response);
};

export const getStudentJobApplicationDetail = async (
  id: number | string,
): Promise<StudentJobApplication> => {
  const response = await api.get<ApiResponse<StudentJobApplication>>(
    `/my-applications/${id}`,
  );
  return unwrap(response);
};

export const lamaranApi = {
  getApplications: getStudentJobApplications,
  getApplicationDetail: getStudentJobApplicationDetail,
};
