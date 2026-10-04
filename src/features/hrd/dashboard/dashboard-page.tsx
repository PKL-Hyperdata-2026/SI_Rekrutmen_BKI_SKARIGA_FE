import { useNavigate } from "react-router-dom";
import { AlertCircle, Building2, FilePlus, RefreshCw } from "lucide-react";
import { PageHeader, Box } from "@/components/custom";
import { Button } from "@/components/ui/button";
import { useHrdDashboard } from "./use-hrd-dashboard";
import { DashboardMetricCards } from "./dashboard-metric-cards";
import { DashboardStatusLowongan } from "./dashboard-status-lowongan";
import { DashboardBerkas } from "./dashboard-berkas";
import { DashboardPelamar } from "./dashboard-pelamar";

export function DashboardPage() {
  const navigate = useNavigate();
  const { data, loading, error, refresh } = useHrdDashboard();

  return (
    <Box className="w-full max-w-full min-w-0 flex flex-col gap-5 sm:gap-6 overflow-x-hidden">
      {error && (
        <div className="p-3 sm:p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-700 text-xs sm:text-sm shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={refresh}
            className="h-7 text-xs gap-1.5 border-rose-200 hover:bg-rose-100 text-rose-700 cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            Coba Lagi
          </Button>
        </div>
      )}

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

      <DashboardMetricCards metrics={data?.metrics} isLoading={loading} />

      <Box className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 w-full max-w-full min-w-0 items-stretch">
        <DashboardStatusLowongan
          vacanciesList={data?.active_vacancies}
          isLoading={loading}
          className="h-full lg:col-span-7"
        />
        <DashboardBerkas
          summary={data?.document_summary}
          isLoading={loading}
          className="h-full lg:col-span-5"
        />
      </Box>

      <DashboardPelamar
        applicantsList={data?.recent_applicants}
        isLoading={loading}
      />
    </Box>
  );
}

export const HRDDashboard = DashboardPage;
