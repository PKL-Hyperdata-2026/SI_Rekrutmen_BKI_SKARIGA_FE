import { api } from "@/api/axios";
import type {
  UserItem,
  UsersOptionsData,
  ResetPasswordSchemaType,
} from "./users.schema";

export const usersApi = {
  getUsers: (params?: {
    search?: string;
    role?: string;
    is_active?: string;
    sort_by?: string;
    sort_dir?: string;
  }) =>
    api.get<{
      success: boolean;
      message?: string;
      data: {
        data: UserItem[];
        current_page?: number;
        last_page?: number;
        total?: number;
      };
    }>("/admin/users", { params }),

  getUserOptions: () =>
    api.get<{
      success: boolean;
      message?: string;
      data: UsersOptionsData;
    }>("/admin/users/options"),

  createUser: (payload: Record<string, unknown>) =>
    api.post<{
      success: boolean;
      message?: string;
      data: UserItem;
    }>("/admin/users", payload),

  updateUser: (id: number | string, payload: Record<string, unknown>) =>
    api.put<{
      success: boolean;
      message?: string;
      data: UserItem;
    }>(`/admin/users/${id}`, payload),

  toggleUserActive: (id: number | string) =>
    api.patch<{
      success: boolean;
      message?: string;
      data: UserItem;
    }>(`/admin/users/${id}/toggle-active`),

  resetUserPassword: (id: number | string, payload: ResetPasswordSchemaType) =>
    api.post<{
      success: boolean;
      message?: string;
    }>(`/admin/users/${id}/reset-password`, payload),

  deleteUser: (id: number | string) =>
    api.delete<{
      success: boolean;
      message?: string;
    }>(`/admin/users/${id}`),
};
