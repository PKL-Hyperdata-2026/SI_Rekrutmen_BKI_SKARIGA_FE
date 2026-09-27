export interface DashboardMetrics {
  activeStudents: number;
  totalAlumni: number;
  activeVacancies: number;
  applicantsThisMonth: number;
  placedWorkers: number;
  absorptionRate: number;
}

export interface ChartPoint {
  month: string;
  melamar: number;
  diterima: number;
}

export interface DepartmentDistribution {
  name: string;
  code: string;
  count: number;
  percentage: number;
}

export interface AdminDashboardData {
  metrics: DashboardMetrics;
  recruitmentChart: ChartPoint[];
  departmentDistribution: DepartmentDistribution[];
}
