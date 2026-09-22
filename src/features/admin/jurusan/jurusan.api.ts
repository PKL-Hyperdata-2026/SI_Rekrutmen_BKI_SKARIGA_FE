import axios from "axios";
import { api } from "@/api/axios";
import {
  majorItemSchema,
  majorOptionsDataSchema,
  majorPaginatedResponseSchema,
  type MajorItem,
  type MajorOptionsData,
  type MajorQueryParams,
  type MajorPaginatedResponse,
  type MajorPayload,
} from "./jurusan.schema";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null;
}

export function extractApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError(error) && isRecord(error.response?.data)) {
    const message = error.response.data.message;
    if (typeof message === "string") {
      return message;
    }
  }
  return fallback;
}

export function isApiCancel(error: unknown): boolean {
  return axios.isCancel(error);
}

export const jurusanApi = {
  getMajors: async (
    params?: MajorQueryParams,
    signal?: AbortSignal,
  ): Promise<MajorPaginatedResponse> => {
    const response = await api.get<ApiResponse<MajorPaginatedResponse>>(
      "/admin/majors",
      { params, signal },
    );
    const parsed = majorPaginatedResponseSchema.safeParse(response.data?.data);
    return parsed.success
      ? parsed.data
      : {
          data: [],
          current_page: 1,
          last_page: 1,
          total: 0,
        };
  },

  getMajorOptions: async (): Promise<MajorOptionsData> => {
    const response = await api.get<ApiResponse<MajorOptionsData>>(
      "/admin/majors/options",
    );
    const parsed = majorOptionsDataSchema.safeParse(response.data?.data);
    return parsed.success ? parsed.data : { departments: [] };
  },

  getMajor: async (id: number | string): Promise<MajorItem> => {
    const response = await api.get<ApiResponse<MajorItem>>(
      `/admin/majors/${encodeURIComponent(String(id))}`,
    );
    const parsed = majorItemSchema.safeParse(response.data?.data);
    return parsed.success ? parsed.data : response.data.data;
  },

  createMajor: async (payload: MajorPayload): Promise<MajorItem> => {
    const response = await api.post<ApiResponse<MajorItem>>(
      "/admin/majors",
      payload,
    );
    const parsed = majorItemSchema.safeParse(response.data?.data);
    return parsed.success ? parsed.data : response.data.data;
  },

  updateMajor: async (
    id: number | string,
    payload: MajorPayload,
  ): Promise<MajorItem> => {
    const response = await api.put<ApiResponse<MajorItem>>(
      `/admin/majors/${encodeURIComponent(String(id))}`,
      payload,
    );
    const parsed = majorItemSchema.safeParse(response.data?.data);
    return parsed.success ? parsed.data : response.data.data;
  },

  toggleMajorActive: async (id: number | string): Promise<MajorItem> => {
    const response = await api.patch<ApiResponse<MajorItem>>(
      `/admin/majors/${encodeURIComponent(String(id))}/toggle-active`,
    );
    const parsed = majorItemSchema.safeParse(response.data?.data);
    return parsed.success ? parsed.data : response.data.data;
  },

  deleteMajor: async (id: number | string): Promise<void> => {
    await api.delete<ApiResponse<null>>(
      `/admin/majors/${encodeURIComponent(String(id))}`,
    );
  },

  isCancel: isApiCancel,
  extractErrorMessage: extractApiErrorMessage,
};
