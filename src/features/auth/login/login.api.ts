import { api } from "@/api/axios";
import type { LoginSchemaType } from "./login.schema";
import type { User } from "@/slices/authSlice";

export interface LoginResponse {
  user: User;
  access_token: string;
  token_type?: string;
  message?: string;
}

export const loginApi = async (payload: LoginSchemaType) => {
  const response = await api.post<LoginResponse>("/login", payload);
  return response.data;
};
