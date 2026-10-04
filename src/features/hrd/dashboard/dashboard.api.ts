import { api } from "@/api/axios";
import { unwrap, type ApiResponse } from "@/api/unwrap";

export interface HrdDashboardMetrics {
  active_vacancies: number;
  total_quota: number;
  total_applicants: number;
  pending_reviews: number;
  upcoming_schedules: number;
  accepted_candidates: number;
}

export interface HrdDashboardVacancy {
  id: string;
  title: string;
  department_major: string;
  deadline: string;
  applicant_count: number;
  quota: number;
}

export interface HrdDashboardApplicant {
  id: string;
  name: string;
  major: string;
  position: string;
  applied_at: string;
  portfolio: string;
}

export interface HrdDashboardSummaryBerkas {
  total_applicants: number;
  with_portfolio: number;
  without_portfolio: number;
}

export interface HrdDashboardData {
  metrics: HrdDashboardMetrics;
  active_vacancies: HrdDashboardVacancy[];
  recent_applicants: HrdDashboardApplicant[];
  document_summary: HrdDashboardSummaryBerkas;
}

export const hrdDashboardApi = {
  getDashboard: async (): Promise<HrdDashboardData> => {
    const res = await api.get<ApiResponse<HrdDashboardData>>("/hrd/dashboard");
    return unwrap(res);
  },
};
