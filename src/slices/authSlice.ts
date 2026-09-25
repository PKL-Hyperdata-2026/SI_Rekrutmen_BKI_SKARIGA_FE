import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserCompany {
  id?: number | string;
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
}

export interface User {
  id: number | string;
  rawId?: number;
  name?: string;
  full_name?: string;
  fullName?: string;
  email: string;
  phone: string;
  role: string;
  is_active?: boolean;
  isActive?: boolean;
  company?: UserCompany | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const VALID_ROLES = ["admin", "superadmin", "hrd", "siswa", "alumni"] as const;

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  const hasValidId =
    (typeof candidate.id === "string" && candidate.id.trim().length > 0) ||
    (typeof candidate.id === "number" && !Number.isNaN(candidate.id));
  const hasValidEmail =
    typeof candidate.email === "string" &&
    candidate.email.includes("@") &&
    candidate.email.length >= 3;
  const hasValidRole =
    typeof candidate.role === "string" &&
    VALID_ROLES.includes(candidate.role as (typeof VALID_ROLES)[number]);
  return hasValidId && hasValidEmail && hasValidRole;
}

function getInitialAuth(): AuthState {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const rawUser = typeof window !== "undefined" ? localStorage.getItem("auth_user") : null;
  if (!token || !rawUser) {
    return { user: null, isAuthenticated: false };
  }
  try {
    const parsed: unknown = JSON.parse(rawUser);
    if (isUser(parsed)) {
      return { user: parsed, isAuthenticated: true };
    }
    localStorage.removeItem("auth_user");
  } catch {
    localStorage.removeItem("auth_user");
    return { user: null, isAuthenticated: false };
  }
  return { user: null, isAuthenticated: false };
}

const initialState: AuthState = getInitialAuth();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("auth_user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("auth_user");
      localStorage.removeItem("access_token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
