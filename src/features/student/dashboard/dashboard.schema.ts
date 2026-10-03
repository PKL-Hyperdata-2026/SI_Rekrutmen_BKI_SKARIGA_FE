export interface DashboardApplication {
  id: string | number;
  jobVacancyId?: string | number;
  title: string;
  companyName: string;
  companyLogo?: string | null;
  position?: string | null;
  appliedAt?: string | null;
  statusName: string;
  statusCode: string;
  currentStageName?: string | null;
}

export interface DashboardVacancy {
  id: string | number;
  title: string;
  position?: string | null;
  companyName: string;
  companyLogo?: string | null;
  workLocation?: string | null;
  deadline?: string | null;
}

export interface DashboardSchedule {
  id: string | number;
  stageName: string;
  companyName: string;
  scheduledAt?: string | null;
  location?: string | null;
  instructions?: string | null;
}

export interface DashboardActivity {
  id: string;
  title: string;
  description: string;
  timeFormatted: string;
  timestamp: Date;
  dotColor: "emerald" | "blue" | "amber" | "violet" | "slate";
}
