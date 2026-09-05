import { api } from "@/api/axios";
import type { ForgotPasswordSchemaType } from "./forgot-password.schema";

export interface ForgotPasswordResponse {
  message?: string;
  success?: boolean;
}

export const forgotPasswordApi = async (payload: ForgotPasswordSchemaType) => {
  const response = await api.post<ForgotPasswordResponse>("/forgot-password", payload);
  return response.data;
};
