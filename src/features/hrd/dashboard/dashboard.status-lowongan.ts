import { useMemo } from "react";
import type { HrdDashboardVacancy } from "./dashboard.api";

export interface StatusLowonganItem {
  id: string;
  title: string;
  departmentMajor: string;
  deadline: string;
  applicantCount: number;
  quota: number;
}

export function useDashboardStatusLowongan(
  vacanciesList?: HrdDashboardVacancy[],
) {
  const vacancies: StatusLowonganItem[] = useMemo(() => {
    if (!vacanciesList) {
      return [];
    }

    return vacanciesList.map((item) => ({
      id: item.id,
      title: item.title,
      departmentMajor: item.department_major,
      deadline: item.deadline,
      applicantCount: item.applicant_count,
      quota: item.quota,
    }));
  }, [vacanciesList]);

  return {
    vacancies,
  };
}
