import api from "@/api/axios";
import type { AdminDashboardData } from "./dashboard.types";

export const dashboardApi = {
  getDashboard: async (): Promise<AdminDashboardData> => {
    const res = await api.get("/admin/dashboard");
    return res.data.data as AdminDashboardData;
  },
};
