import React from "react";
import { Link } from "react-router-dom";
import { Clock, Video, ArrowRight, CalendarClock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardSchedule } from "./dashboard.schema";

export interface DashboardScheduleCardProps {
  schedule?: DashboardSchedule | null;
  isLoading?: boolean;
}

function formatScheduleTime(dateInput?: string | null): string {
  if (!dateInput) return "Waktu diinformasikan segera";

  // If already a friendly short string (like "Besok, 13.00"), return directly
  if (!dateInput.includes("T") && !dateInput.includes("-")) {
    return dateInput;
  }

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const timeStr = `${hours}.${minutes}`;

  if (isToday) {
    return `Hari ini, ${timeStr}`;
  }
  if (isTomorrow) {
    return `Besok, ${timeStr}`;
  }

  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const monthName = months[date.getMonth()];

  return `${dayName}, ${day} ${monthName}, ${timeStr}`;
}

export const DashboardScheduleCard: React.FC<DashboardScheduleCardProps> = ({
  schedule,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card className="rounded-2xl sm:rounded-3xl border border-slate-100 bg-white p-4 sm:p-5 shadow-2xs h-full flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
        <div className="p-4 rounded-xl border border-slate-100 space-y-2.5">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-3 w-28 rounded" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>
        <div className="flex-1" />
      </Card>
    );
  }

  const hasSchedule = Boolean(schedule && (schedule.stageName || schedule.companyName));

  return (
    <Card className="rounded-2xl sm:rounded-3xl border border-slate-100/90 bg-white p-4 sm:p-5 shadow-2xs h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Jadwal Rekrutmen
        </h2>
        <Link
          to="/student/lamaran"
          className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group"
        >
          <span>Selengkapnya</span>
          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Content: Active Schedule or Informative Empty State */}
      {hasSchedule ? (
        <div className="p-3.5 sm:p-4 rounded-xl border border-blue-100/80 bg-blue-50/20 shadow-2xs space-y-2">
          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-blue-100/60">
            {schedule?.stageName || "Tahap Seleksi"}
          </span>
          <h3 className="font-bold text-slate-900 text-sm tracking-tight leading-snug">
            {schedule?.companyName || "Perusahaan Mitra"}
          </h3>
          <div className="space-y-1 pt-0.5 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{formatScheduleTime(schedule?.scheduledAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{schedule?.location || "Via Google Meet / Lokasi Sekolah"}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center my-auto">
          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
            <CalendarClock className="h-4.5 w-4.5 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
            Belum Ada Jadwal Rekrutmen
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            Saat ini belum ada jadwal seleksi atau wawancara aktif. Pantau terus status lamaran Anda!
          </p>
          <Link
            to="/student/lowongan"
            className="mt-3 text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>Cari Lowongan Baru</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Empty space below without the circular calendar icon, as requested */}
      <div className="flex-1" />
    </Card>
  );
};
