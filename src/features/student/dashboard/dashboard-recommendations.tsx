import React from "react";
import { Link } from "react-router-dom";
import { Building2, ChevronRight, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardVacancy } from "./dashboard.schema";

export interface DashboardRecommendationsProps {
  vacancies: DashboardVacancy[];
  loading?: boolean;
}

export const DashboardRecommendations: React.FC<DashboardRecommendationsProps> = ({
  vacancies,
  loading = false,
}) => {
  return (
    <Card className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Lowongan Rekomendasi Jurusan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Disesuaikan dengan kualifikasi profil kamu
          </p>
        </div>
        <Link
          to="/student/lowongan"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 transition-colors"
        >
          Lihat Semua
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
                  <Skeleton className="h-11 w-11 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-44" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            ))}
          </div>
        ) : vacancies.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-2.5">
              <Briefcase className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Belum ada lowongan rekomendasi
            </p>
            <p className="text-xs text-slate-500 mt-0.5 max-w-sm mx-auto">
              Saat ini belum tersedia lowongan yang ditargetkan khusus untuk jurusanmu. Cek kembali secara berkala.
            </p>
          </div>
        ) : (
          vacancies.map((vac) => (
            <Link
              key={vac.id}
              to="/student/lowongan"
              className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-xs transition-all duration-200"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-100/70 text-blue-600 overflow-hidden">
                  {vac.companyLogo ? (
                    <img
                      src={vac.companyLogo}
                      alt={vac.companyName}
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <Building2 className="h-5 w-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {vac.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {vac.companyName}
                    {vac.workLocation && (
                      <>
                        {" "}• <span className="text-slate-600">{vac.workLocation}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>
          ))
        )}
      </div>
    </Card>
  );
};
