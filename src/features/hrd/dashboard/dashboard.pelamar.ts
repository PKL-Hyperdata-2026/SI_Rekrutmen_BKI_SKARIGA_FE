import { useMemo } from "react";

export interface PelamarDashboardItem {
  id: string;
  name: string;
  major: string;
  position: string;
  appliedAt: string;
  portfolio: string;
}

export function useDashboardPelamar() {
  const applicants: PelamarDashboardItem[] = useMemo(
    () => [
      {
        id: "1",
        name: "Muhammad Rizky Pratama",
        major: "Teknik Mesin",
        position: "Junior Mechanic Operator",
        appliedAt: "20 Feb 2026",
        portfolio: "CV & 3 Sertifikat",
      },
      {
        id: "2",
        name: "Ahmad Dani Saputra",
        major: "Teknik Ketenagalistrikan",
        position: "Maintenance Technician Staff",
        appliedAt: "19 Feb 2026",
        portfolio: "CV & 2 Sertifikat",
      },
      {
        id: "3",
        name: "Bagas Satria Wibowo",
        major: "Teknik Pengelasan",
        position: "Quality Control Inspector",
        appliedAt: "18 Feb 2026",
        portfolio: "CV Lengkap",
      },
    ],
    [],
  );

  return { applicants };
}

