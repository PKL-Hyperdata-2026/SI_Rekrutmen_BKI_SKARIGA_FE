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

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("access_token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
