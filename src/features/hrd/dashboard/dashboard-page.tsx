import { useNavigate } from "react-router-dom";
import { Building2, FilePlus } from "lucide-react";
import { PageHeader, Box } from "@/components/custom";
import { DashboardMetricCards } from "./dashboard-metric-cards";
import { DashboardStatusLowongan } from "./dashboard-status-lowongan";
import { DashboardBerkas } from "./dashboard-berkas";
import { DashboardPelamar } from "./dashboard-pelamar";

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <Box className="w-full max-w-full min-w-0 flex flex-col gap-5 sm:gap-6 overflow-x-hidden">
      <PageHeader
        variant="hrd"
        badgeIcon={<Building2 className="h-3.5 w-3.5" />}
        title="Overview Rekrutmen & Pelamar"
        description="Kelola seluruh proses rekrutmen mulai dari publikasi lowongan hingga penempatan kandidat."
        className="p-4.5 sm:p-7 rounded-2xl sm:rounded-3xl max-w-full overflow-hidden"
      >
        <PageHeader.Button
          variant="primary"
          icon={<FilePlus className="h-4 w-4" />}
          onClick={() => navigate("/hrd/lowongan")}
          className="w-full sm:w-auto justify-center"
        >
          Buat Lowongan
        </PageHeader.Button>
      </PageHeader>

      <DashboardMetricCards />

      <Box className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 w-full max-w-full min-w-0 items-stretch">
        <DashboardStatusLowongan className="h-full lg:col-span-7" />
        <DashboardBerkas className="h-full lg:col-span-5" />
      </Box>

      <DashboardPelamar />
    </Box>
  );
}

export const HRDDashboard = DashboardPage;
