import api from "@/api/axios";
import type { AdminDashboardData } from "./dashboard.types";

export const dashboardApi = {
  getDashboard: async (academicYear?: string): Promise<AdminDashboardData> => {
    const params = academicYear ? { academic_year: academicYear } : undefined;
    const res = await api.get("/admin/dashboard", { params });
    return res.data.data as AdminDashboardData;
  },
};
