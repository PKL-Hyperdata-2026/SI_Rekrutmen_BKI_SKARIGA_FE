import { api } from "@/api/axios";
import { unwrap } from "@/api/unwrap";
import type { ApiResponse, PaginatedData } from "@/api/unwrap";
import type { UserItem, ResetPasswordSchemaType } from "./users.schema";

export const usersApi = {
  getUsers: async (params?: {
    search?: string;
    role?: string;
    is_active?: string;
    sort_by?: string;
    sort_dir?: string;
  }): Promise<PaginatedData<UserItem>> => {
    const res = await api.get<ApiResponse<PaginatedData<UserItem>>>(
      "/admin/users",
      { params },
    );
    return unwrap(res);
  },

  createUser: async (payload: Record<string, unknown>): Promise<UserItem> => {
    const res = await api.post<ApiResponse<UserItem>>("/admin/users", payload);
    return unwrap(res);
  },

  updateUser: async (
    id: number | string,
    payload: Record<string, unknown>,
  ): Promise<UserItem> => {
    const res = await api.put<ApiResponse<UserItem>>(
      `/admin/users/${id}`,
      payload,
    );
    return unwrap(res);
  },

  toggleUserActive: async (id: number | string): Promise<UserItem> => {
    const res = await api.patch<ApiResponse<UserItem>>(
      `/admin/users/${id}/toggle-active`,
    );
    return unwrap(res);
  },

  resetUserPassword: async (
    id: number | string,
    payload: ResetPasswordSchemaType,
  ): Promise<void> => {
    await api.post(`/admin/users/${id}/reset-password`, payload);
  },

  deleteUser: async (id: number | string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },
};
