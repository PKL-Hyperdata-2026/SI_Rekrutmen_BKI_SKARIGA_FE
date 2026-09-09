import { api } from "@/api/axios";
import type { DepartmentItem } from "./departemen.schema";

export const departemenApi = {
  getDepartments: (params?: {
    search?: string;
    is_active?: string | number;
    sort_by?: string;
    sort_dir?: string;
    per_page?: number;
    page?: number;
  }) =>
    api.get<{
      success: boolean;
      message?: string;
      data: {
        data: DepartmentItem[];
        current_page?: number;
        last_page?: number;
        total?: number;
      };
    }>("/admin/departments", { params }),

  getDepartmentOptions: () =>
    api.get<{
      success: boolean;
      message?: string;
      data: {
        departments?: DepartmentItem[];
      };
    }>("/admin/departments/options"),

  getDepartment: (id: number | string) =>
    api.get<{
      success: boolean;
      message?: string;
      data: DepartmentItem;
    }>(`/admin/departments/${id}`),

  createDepartment: (payload: Record<string, unknown>) =>
    api.post<{
      success: boolean;
      message?: string;
      data: DepartmentItem;
    }>("/admin/departments", payload),

  updateDepartment: (id: number | string, payload: Record<string, unknown>) =>
    api.put<{
      success: boolean;
      message?: string;
      data: DepartmentItem;
    }>(`/admin/departments/${id}`, payload),

  toggleDepartmentActive: (id: number | string) =>
    api.patch<{
      success: boolean;
      message?: string;
      data: DepartmentItem;
    }>(`/admin/departments/${id}/toggle-active`),

  deleteDepartment: (id: number | string) =>
    api.delete<{
      success: boolean;
      message?: string;
    }>(`/admin/departments/${id}`),
};
