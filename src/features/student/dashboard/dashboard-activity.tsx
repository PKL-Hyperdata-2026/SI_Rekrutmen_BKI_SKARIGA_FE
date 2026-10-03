import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardActivity as DashboardActivityItem } from "./dashboard.schema";

export interface DashboardActivityProps {
  activities: DashboardActivityItem[];
  loading?: boolean;
}

export const DashboardActivityLog: React.FC<DashboardActivityProps> = ({
  activities,
  loading = false,
}) => {
  const getDotColorClass = (color: DashboardActivityItem["dotColor"]) => {
    switch (color) {
      case "emerald":
        return "bg-emerald-500 ring-4 ring-emerald-50";
      case "blue":
        return "bg-blue-500 ring-4 ring-blue-50";
      case "amber":
        return "bg-amber-500 ring-4 ring-amber-50";
      case "violet":
        return "bg-violet-500 ring-4 ring-violet-50";
      default:
        return "bg-slate-400 ring-4 ring-slate-50";
    }
  };

  return (
    <Card className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Riwayat Keaktifan
        </h2>
        <Link
          to="/student/lamaran"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 transition-colors"
        >
          Log Lengkap
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Content */}
      <div className="space-y-4 pt-3.5">
        {loading ? (
          <div className="space-y-3.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-3 w-3 rounded-full mt-1" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-2.5 w-48" />
                  </div>
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs">
            Belum ada aktivitas tercatat.
          </div>
        ) : (
          activities.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 group"
            >
              {/* Dot & Title */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-1.5 shrink-0">
                  <span
                    className={`block h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-125 ${getDotColorClass(
                      item.dotColor
                    )}`}
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-1 shrink-0 text-xs text-slate-400 font-medium whitespace-nowrap pt-0.5">
                <Clock className="h-3 w-3 text-slate-300" />
                <span>{item.timeFormatted}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
