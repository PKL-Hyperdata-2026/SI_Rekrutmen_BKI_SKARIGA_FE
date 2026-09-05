import { api } from "@/api/axios";
import type { ResetPasswordSchemaType } from "./reset-password.schema";

export interface ResetPasswordResponse {
  message?: string;
  success?: boolean;
}

export const resetPasswordApi = async (payload: ResetPasswordSchemaType) => {
  const response = await api.post<ResetPasswordResponse>("/reset-password", payload);
  return response.data;
};
