import React from "react";
import { Link } from "react-router-dom";
import { Building2, ChevronRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardApplication } from "./dashboard.schema";

export interface DashboardApplicationsProps {
  applications: DashboardApplication[];
  totalCount: number;
  loading?: boolean;
}

export const DashboardApplications: React.FC<DashboardApplicationsProps> = ({
  applications,
  totalCount,
  loading = false,
}) => {
  const getStatusBadgeVariant = (code: string) => {
    const c = code.toLowerCase();
    if (c === "accepted" || c === "diterima" || c === "passed" || c.includes("lolos")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium";
    }
    if (c === "rejected" || c === "ditolak" || c === "failed") {
      return "bg-rose-50 text-rose-700 border-rose-200 font-medium";
    }
    return "bg-blue-50 text-blue-700 border-blue-200 font-medium";
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Lamaran Saya
          </h2>
        </div>
        <Link
          to="/student/lamaran"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 transition-colors"
        >
          Lihat Semua ({totalCount})
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Content */}
      <div className="space-y-3 pt-1">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50"
              >
                <div className="flex items-center gap-3.5">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                </div>
                <Skeleton className="h-8 w-28 rounded-lg" />
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-2.5">
              <FileText className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Belum ada lamaran diajukan</p>
            <p className="text-xs text-slate-500 mt-0.5 max-w-sm mx-auto">
              Kamu belum melamar posisi pekerjaan apapun. Lihat daftar lowongan yang sesuai dengan keahlianmu.
            </p>
            <Link
              to="/student/lowongan"
              className="inline-flex mt-3.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors"
            >
              Cari Lowongan Sekarang
            </Link>
          </div>
        ) : (
          applications.map((app) => (
            <Link
              key={app.id}
              to="/student/lamaran"
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-xs transition-all duration-200"
            >
              {/* Left Info */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-100/70 text-blue-600 overflow-hidden">
                  {app.companyLogo ? (
                    <img
                      src={app.companyLogo}
                      alt={app.companyName}
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <Building2 className="h-5 w-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {app.companyName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    Posisi : <span className="text-slate-700 font-medium">{app.position || app.title}</span> • Dilamar {formatDate(app.appliedAt)}
                  </p>
                </div>
              </div>

              {/* Right Stage & Status */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block font-medium">Tahapan Saat Ini</span>
                  <span className="text-xs font-bold text-slate-800">
                    {app.currentStageName || "Menunggu Review"}
                  </span>
                </div>

                <Badge
                  variant="outline"
                  className={`rounded-lg px-2.5 py-1 text-xs shrink-0 ${getStatusBadgeVariant(
                    app.statusCode
                  )}`}
                >
                  {app.statusName}
                </Badge>
              </div>
            </Link>
          ))
        )}
      </div>
    </Card>
  );
};
