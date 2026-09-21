import axios from "axios";
import { api } from "@/api/axios";
import {
  departmentItemSchema,
  type DepartmentItem,
  type DepartmentPayload,
  type DepartmentQueryParams,
} from "./departemen.schema";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface PaginatedData<T> {
  data: T[];
  current_page?: number;
  last_page?: number;
  total?: number;
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

export const departemenApi = {
  getDepartments: async (
    params?: DepartmentQueryParams,
    signal?: AbortSignal,
  ): Promise<DepartmentItem[]> => {
    const response = await api.get<ApiResponse<PaginatedData<DepartmentItem>>>(
      "/admin/departments",
      { params, signal },
    );
    const rawItems = response.data?.data?.data ?? [];
    const parsed = departmentItemSchema.array().safeParse(rawItems);
    return parsed.success ? parsed.data : [];
  },

  getDepartmentOptions: async (): Promise<DepartmentItem[]> => {
    const response = await api.get<
      ApiResponse<{ departments?: DepartmentItem[] }>
    >("/admin/departments/options");
    const rawItems = response.data?.data?.departments ?? [];
    const parsed = departmentItemSchema.array().safeParse(rawItems);
    return parsed.success ? parsed.data : [];
  },

  getDepartment: async (id: number | string): Promise<DepartmentItem> => {
    const response = await api.get<ApiResponse<DepartmentItem>>(
      `/admin/departments/${id}`,
    );
    const parsed = departmentItemSchema.safeParse(response.data.data);
    return parsed.success ? parsed.data : response.data.data;
  },

  createDepartment: async (
    payload: DepartmentPayload,
  ): Promise<DepartmentItem> => {
    const response = await api.post<ApiResponse<DepartmentItem>>(
      "/admin/departments",
      payload,
    );
    const parsed = departmentItemSchema.safeParse(response.data.data);
    return parsed.success ? parsed.data : response.data.data;
  },

  updateDepartment: async (
    id: number | string,
    payload: DepartmentPayload,
  ): Promise<DepartmentItem> => {
    const response = await api.put<ApiResponse<DepartmentItem>>(
      `/admin/departments/${id}`,
      payload,
    );
    const parsed = departmentItemSchema.safeParse(response.data.data);
    return parsed.success ? parsed.data : response.data.data;
  },

  toggleDepartmentActive: async (
    id: number | string,
  ): Promise<DepartmentItem> => {
    const response = await api.patch<ApiResponse<DepartmentItem>>(
      `/admin/departments/${id}/toggle-active`,
    );
    const parsed = departmentItemSchema.safeParse(response.data.data);
    return parsed.success ? parsed.data : response.data.data;
  },

  deleteDepartment: async (id: number | string): Promise<void> => {
    await api.delete<ApiResponse<null>>(`/admin/departments/${id}`);
  },

  isCancel: isApiCancel,
  extractErrorMessage: extractApiErrorMessage,
};
