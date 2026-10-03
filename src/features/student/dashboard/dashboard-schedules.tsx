import React from "react";
import { CalendarClock, Clock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { DashboardSchedule } from "./dashboard.schema";

export interface DashboardSchedulesProps {
  schedules: DashboardSchedule[];
  loading?: boolean;
  className?: string;
}

export const DashboardSchedules: React.FC<DashboardSchedulesProps> = ({
  schedules,
  loading = false,
  className,
}) => {
  const formatScheduleTime = (dateStr?: string | null) => {
    if (!dateStr) return "Waktu akan diumumkan";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card
      className={cn(
        "rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Jadwal Rekrutmen
        </h2>
        <span className="text-xs font-semibold text-slate-400">
          {schedules.length} Agenda
        </span>
      </div>

      {/* Content */}
      <div className="space-y-3 pt-3.5 flex-1 flex flex-col justify-start">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2"
              >
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
            ))}
          </div>
        ) : schedules.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 my-auto">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-2">
              <CalendarClock className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Tidak ada jadwal aktif</p>
            <p className="text-xs text-slate-500 mt-0.5 max-w-xs mx-auto">
              Jadwal tes atau wawancara rekrutmen akan muncul di sini saat diumumkan oleh HRD.
            </p>
          </div>
        ) : (
          schedules.map((sch) => (
            <div
              key={sch.id}
              className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-xs transition-all duration-200 space-y-2.5"
            >
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {sch.stageName}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {sch.companyName}
                </h3>
              </div>

              <div className="flex flex-col gap-1 text-xs text-slate-500 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{formatScheduleTime(sch.scheduledAt)}</span>
                </div>

                {sch.location && (
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{sch.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
