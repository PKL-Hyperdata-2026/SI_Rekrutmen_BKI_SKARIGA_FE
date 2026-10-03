import { api } from "@/api/axios";
import { unwrap } from "@/api/unwrap";
import type { ApiResponse } from "@/api/unwrap";
import type {
  VacancyOption,
  AttendanceQueueData,
} from "./validasi-presensi.schema";

export const validasiPresensiApi = {
  getVacancies: async (): Promise<VacancyOption[]> => {
    const res = await api.get<ApiResponse<VacancyOption[]>>(
      "/admin/attendances/vacancies",
    );
    return unwrap(res);
  },
  getQueue: async (
    params?: Record<string, string | number>,
  ): Promise<AttendanceQueueData> => {
    const res = await api.get<ApiResponse<AttendanceQueueData>>(
      "/admin/attendances/queue",
      { params },
    );
    return unwrap(res);
  },
  getHistory: async (
    params?: Record<string, string | number>,
  ): Promise<AttendanceQueueData> => {
    const res = await api.get<ApiResponse<AttendanceQueueData>>(
      "/admin/attendances/history",
      { params },
    );
    return unwrap(res);
  },
  bulkValidate: async (data: {
    attendance_ids: Array<string | number>;
    validation_status: "verified" | "rejected";
    system_action: string;
  }): Promise<{ affected: number }> => {
    const res = await api.patch<ApiResponse<{ affected: number }>>(
      "/admin/attendances/bulk-validate",
      data,
    );
    return unwrap(res);
  },
  validateSingle: async (
    id: string | number,
    data: {
      validation_status: "verified" | "rejected";
      system_action: string;
    },
  ): Promise<unknown> => {
    const res = await api.patch<ApiResponse<unknown>>(
      `/admin/attendances/${encodeURIComponent(String(id))}/validate`,
      data,
    );
    return unwrap(res);
  },
};
