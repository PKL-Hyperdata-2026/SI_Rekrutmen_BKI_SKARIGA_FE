import { useMemo } from "react";
import type { HrdDashboardApplicant } from "./dashboard.api";

export interface PelamarDashboardItem {
  id: string;
  name: string;
  major: string;
  position: string;
  appliedAt: string;
  portfolio: string;
}

export function useDashboardPelamar(applicantsList?: HrdDashboardApplicant[]) {
  const applicants: PelamarDashboardItem[] = useMemo(() => {
    if (!applicantsList) {
      return [];
    }

    return applicantsList.map((app) => ({
      id: app.id,
      name: app.name,
      major: app.major,
      position: app.position,
      appliedAt: app.applied_at,
      portfolio: app.portfolio,
    }));
  }, [applicantsList]);

  return { applicants };
}
