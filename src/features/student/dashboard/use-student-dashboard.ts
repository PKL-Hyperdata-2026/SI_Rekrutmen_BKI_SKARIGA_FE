import { useState, useEffect, useCallback, useMemo } from "react";
import { useAppSelector } from "@/hooks/use-app";
import { studentDashboardApi, type PaginatedResponse } from "./dashboard.api";
import type {
  DashboardApplication,
  DashboardVacancy,
  DashboardSchedule,
  DashboardActivity,
} from "./dashboard.schema";
import type { StudentJobVacancy } from "../lowongan-kerja/lowongan-kerja.card";
import type { StudentJobApplication } from "../lamaran/lamaran.schema";
import type { NotificationItem } from "@/api/notification.api";

function formatRelativeTime(dateInput: string | Date | undefined): string {
  if (!dateInput) return "Baru saja";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Baru saja";
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 5) return "Baru saja";
  if (diffHours < 1) return `${diffMin} menit lalu`;
  if (diffHours < 24 && now.getDate() === date.getDate()) return `${diffHours} jam lalu`;
  if (diffDays === 1 || (diffDays === 0 && now.getDate() !== date.getDate())) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks} minggu lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export function useStudentDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [vacancies, setVacancies] = useState<DashboardVacancy[]>([]);
  const [totalVacancies, setTotalVacancies] = useState<number>(0);

  const [applications, setApplications] = useState<DashboardApplication[]>([]);
  const [totalApplications, setTotalApplications] = useState<number>(0);

  const [schedules, setSchedules] = useState<DashboardSchedule[]>([]);
  const [activities, setActivities] = useState<DashboardActivity[]>([]);

  const userRole = (user?.role || "siswa").toLowerCase();
  const isAlumni = userRole === "alumni";

  const firstName = useMemo(() => {
    const raw = user?.fullName || user?.full_name || user?.name || "Siswa";
    return raw.trim().split(" ")[0];
  }, [user]);

  const greetingTime = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return "Selamat Pagi";
    if (hour >= 11 && hour < 15) return "Selamat Siang";
    if (hour >= 15 && hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [vacanciesRes, applicationsRes, notificationsRes] = await Promise.allSettled([
        studentDashboardApi.getVacancies(6),
        studentDashboardApi.getMyApplications(6),
        studentDashboardApi.getNotifications(10),
      ]);

      // 1. Process Vacancies
      if (vacanciesRes.status === "fulfilled" && vacanciesRes.value) {
        const raw = vacanciesRes.value;
        let list: StudentJobVacancy[] = [];
        let count = 0;

        if (Array.isArray(raw)) {
          list = raw;
          count = raw.length;
        } else if (typeof raw === "object" && "data" in raw) {
          const paginated = raw as PaginatedResponse<StudentJobVacancy>;
          list = paginated.data || [];
          count = paginated.meta?.total ?? list.length;
        }

        setTotalVacancies(count);
        setVacancies(
          list.slice(0, 3).map((v) => ({
            id: v.id,
            title: v.title || v.position || "Lowongan Pekerjaan",
            position: v.position,
            companyName: v.company?.name || "Perusahaan Mitra",
            companyLogo: v.company?.logoPath,
            workLocation: v.workLocation,
            deadline: v.deadline,
          }))
        );
      }

      // 2. Process Applications
      let rawApps: StudentJobApplication[] = [];
      if (applicationsRes.status === "fulfilled" && applicationsRes.value) {
        const raw = applicationsRes.value;
        let count = 0;

        if (Array.isArray(raw)) {
          rawApps = raw;
          count = raw.length;
        } else if (typeof raw === "object" && "data" in raw) {
          const paginated = raw as PaginatedResponse<StudentJobApplication>;
          rawApps = paginated.data || [];
          count = paginated.meta?.total ?? rawApps.length;
        }

        setTotalApplications(count);
        setApplications(
          rawApps.slice(0, 3).map((app) => ({
            id: app.id,
            jobVacancyId: app.jobVacancyId || app.vacancy?.id,
            title: app.vacancy?.title || "Lowongan",
            companyName: app.vacancy?.companyName || "Perusahaan",
            companyLogo: app.vacancy?.companyLogo,
            position: app.vacancy?.position || app.vacancy?.title,
            appliedAt: app.appliedAt || app.createdAt,
            statusName: app.status?.name || "Dalam Proses",
            statusCode: app.status?.code || "in_progress",
            currentStageName: app.currentStage?.name,
          }))
        );
      }

      // 3. Extract Schedules from Applications (currentStage with scheduledAt or upcoming dates)
      const extractedSchedules: DashboardSchedule[] = [];
      for (const app of rawApps) {
        const companyName = app.vacancy?.companyName || "Perusahaan Mitra";
        if (app.currentStage && app.currentStage.name) {
          extractedSchedules.push({
            id: `${app.id}-${app.currentStage.id || 1}`,
            stageName: app.currentStage.name,
            companyName,
            scheduledAt: app.currentStage.scheduledAt,
            location: app.currentStage.location || "Aula / Online",
            instructions: app.currentStage.instructions,
          });
        }
      }
      setSchedules(extractedSchedules.slice(0, 3));

      // 4. Build Activity Log
      const combinedActivities: DashboardActivity[] = [];

      // Add application events
      for (const app of rawApps) {
        const companyName = app.vacancy?.companyName || "Perusahaan Mitra";
        const dateStr = app.appliedAt || app.createdAt;
        if (dateStr) {
          combinedActivities.push({
            id: `app-${app.id}`,
            title: `Melamar ${companyName}`,
            description: "Berkas lamaran & portofolio berhasil dikirim",
            timestamp: new Date(dateStr),
            timeFormatted: formatRelativeTime(dateStr),
            dotColor: "blue",
          });
        }

        // Add stage histories
        if (app.stageHistories && Array.isArray(app.stageHistories)) {
          for (const history of app.stageHistories) {
            const histDate = history.createdAt;
            if (histDate) {
              const isAccepted = history.status?.code === "accepted" || history.status?.code === "passed";
              const isRejected = history.status?.code === "rejected" || history.status?.code === "failed";
              combinedActivities.push({
                id: `hist-${history.id}`,
                title: `${history.stage?.name || "Tahap Seleksi"} - ${companyName}`,
                description: history.notes || history.status?.name || "Hasil seleksi diperbarui",
                timestamp: new Date(histDate),
                timeFormatted: formatRelativeTime(histDate),
                dotColor: isAccepted ? "emerald" : isRejected ? "amber" : "blue",
              });
            }
          }
        }
      }

      // Add notification events if available
      if (notificationsRes.status === "fulfilled" && notificationsRes.value) {
        const rawNotifs = notificationsRes.value;
        const notifList: NotificationItem[] = Array.isArray(rawNotifs)
          ? rawNotifs
          : typeof rawNotifs === "object" && "data" in rawNotifs
            ? (rawNotifs as PaginatedResponse<NotificationItem>).data || []
            : [];

        for (const notif of notifList) {
          const notifDate = notif.created_at;
          combinedActivities.push({
            id: `notif-${notif.id}`,
            title: notif.title || "Pemberitahuan Sistem",
            description: notif.message || "",
            timestamp: notifDate ? new Date(notifDate) : new Date(),
            timeFormatted: formatRelativeTime(notifDate),
            dotColor: "violet",
          });
        }
      }

      // Sort activities descending by timestamp
      combinedActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      // If no activities yet, provide a welcoming activity
      if (combinedActivities.length === 0) {
        combinedActivities.push({
          id: "welcome-init",
          title: "Bergabung ke Portal BKI",
          description: "Akun siap digunakan untuk rekrutmen dan portofolio",
          timestamp: new Date(),
          timeFormatted: "Hari ini",
          dotColor: "emerald",
        });
      }

      setActivities(combinedActivities.slice(0, 5));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memuat data dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      if (!ignore) {
        await fetchDashboardData();
      }
    };
    void load();
    return () => {
      ignore = true;
    };
  }, [fetchDashboardData]);

  return {
    loading,
    error,
    refresh: fetchDashboardData,
    user,
    userRole,
    isAlumni,
    firstName,
    greetingTime,
    vacancies,
    totalVacancies,
    applications,
    totalApplications,
    schedules,
    activities,
  };
}
