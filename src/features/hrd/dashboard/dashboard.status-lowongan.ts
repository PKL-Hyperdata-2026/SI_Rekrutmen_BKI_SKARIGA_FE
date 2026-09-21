import { useMemo } from "react";

export interface StatusLowonganItem {
  id: string;
  title: string;
  departmentMajor: string;
  deadline: string;
  applicantCount: number;
  quota: number;
}

export function useDashboardStatusLowongan() {
  const vacancies: StatusLowonganItem[] = useMemo(
    () => [
      {
        id: "1",
        title: "Junior Mechanic Operator",
        departmentMajor: "Teknik Mesin/Otomotif",
        deadline: "28 Feb 2026",
        applicantCount: 85,
        quota: 25,
      },
      {
        id: "2",
        title: "Maintenance Technician Staff",
        departmentMajor: "Teknik Mesin/Kelistrikan",
        deadline: "28 Feb 2026",
        applicantCount: 43,
        quota: 20,
      },
      {
        id: "3",
        title: "Quality Control Inspector",
        departmentMajor: "Teknik Pengelasan",
        deadline: "05 Mar 2026",
        applicantCount: 62,
        quota: 15,
      },
    ],
    [],
  );

  return {
    vacancies,
  };
}

