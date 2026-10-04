import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudentDashboard } from "./use-student-dashboard";
import { DashboardHero } from "./dashboard-hero";
import { DashboardKpiCards } from "./dashboard-kpi-cards";
import { DashboardChart } from "./dashboard-chart";
import { DashboardScheduleCard } from "./dashboard-schedule-card";

export function StudentDashboard() {
  const {
    loading,
    error,
    refresh,
    firstName,
    greetingTime,
    totalVacancies,
    schedules,
    isAlumni,
    trendData,
  } = useStudentDashboard();

  return (
    <div className="flex flex-col justify-between gap-3 sm:gap-3.5 xl:gap-4 lg:h-[calc(100vh-7.8rem)] w-full min-w-0 overflow-visible pt-1 sm:pt-2">
      {/* Error Banner if API fails */}
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

      {/* Row 1: Hero Banner */}
      <DashboardHero
        greetingTime={greetingTime}
        firstName={firstName}
        totalVacancies={totalVacancies}
      />

      {/* Row 2: KPI Cards (2 cards for student, 3 cards for alumni) */}
      <DashboardKpiCards
        totalVacancies={totalVacancies}
        totalSchedules={schedules.length}
        isAlumni={isAlumni}
        isLoading={loading}
      />

      {/* Row 3: Bottom Analytics & Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 xl:gap-4 flex-1 min-h-0">
        {/* Left: 6-Month Vacancy & Application Trend Chart */}
        <div className="lg:col-span-8 flex flex-col h-full min-h-0">
          <DashboardChart
            data={trendData.length > 0 ? trendData : undefined}
            isLoading={loading}
          />
        </div>

        {/* Right: Upcoming Recruitment Schedule */}
        <div className="lg:col-span-4 flex flex-col h-full min-h-0">
          <DashboardScheduleCard
            schedule={schedules[0] || null}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
}
