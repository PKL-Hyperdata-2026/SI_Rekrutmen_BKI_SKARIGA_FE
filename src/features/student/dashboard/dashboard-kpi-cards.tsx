import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  FileText,
  LineChart,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface DashboardKpiCardsProps {
  totalVacancies: number;
  totalSchedules: number;
  isAlumni?: boolean;
  isLoading?: boolean;
}

export const DashboardKpiCards: React.FC<DashboardKpiCardsProps> = ({
  totalVacancies,
  totalSchedules,
  isAlumni = false,
  isLoading = false,
}) => {
  const cardCount = isAlumni ? 3 : 2;

  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-3.5 xl:gap-4 shrink-0",
          isAlumni ? "sm:grid-cols-3" : "sm:grid-cols-2"
        )}
      >
        {Array.from({ length: cardCount }).map((_, i) => (
          <Card key={i} className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-4.5 shadow-2xs">
            <CardContent className="p-0 flex flex-col justify-between h-20">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <div className="space-y-1.5 mt-2">
                <Skeleton className="h-3.5 w-24 rounded" />
                <Skeleton className="h-5 w-20 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3.5 xl:gap-4 shrink-0",
        isAlumni ? "sm:grid-cols-3" : "sm:grid-cols-2"
      )}
    >
      {/* 1. Lowongan Kerja (Lucide Briefcase matching sidebar) */}
      <Link to="/student/lowongan" className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-2xl">
        <Card className="rounded-2xl border border-slate-100/90 bg-white p-4 sm:p-4.5 shadow-2xs hover:shadow-md hover:border-amber-200 transition-all duration-200 flex flex-col justify-between h-full">
          <CardContent className="p-0 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <Briefcase className="h-5 w-5 text-amber-500" strokeWidth={2.2} />
              <ArrowUpRight className="h-4.5 w-4.5 text-slate-800 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
            </div>
            <div className="mt-2.5">
              <span className="text-xs sm:text-sm font-bold text-slate-900 block tracking-tight">
                Lowongan Kerja
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-amber-500 block mt-0.5 tracking-tight">
                {totalVacancies > 0 ? `${totalVacancies} Lowongan` : "2 Lowongan"}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* 2. Jadwal Rekrutmen (Lucide FileText matching sidebar Lamaran Saya) */}
      <Link to="/student/lamaran" className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-2xl">
        <Card className="rounded-2xl border border-slate-100/90 bg-white p-4 sm:p-4.5 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all duration-200 flex flex-col justify-between h-full">
          <CardContent className="p-0 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <FileText className="h-5 w-5 text-emerald-500" strokeWidth={2.2} />
              <ArrowUpRight className="h-4.5 w-4.5 text-slate-800 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
            </div>
            <div className="mt-2.5">
              <span className="text-xs sm:text-sm font-bold text-slate-900 block tracking-tight">
                Jadwal Rekrutmen
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-emerald-500 block mt-0.5 tracking-tight">
                {totalSchedules > 0 ? `${totalSchedules} Jadwal` : "1 Jadwal"}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* 3. Tracer Study (Only displayed for Alumni - Qualitative information, no number count) */}
      {isAlumni && (
        <Link to="/student/tracer" className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-2xl">
          <Card className="rounded-2xl border border-slate-100/90 bg-white p-4 sm:p-4.5 shadow-2xs hover:shadow-md hover:border-sky-200 transition-all duration-200 flex flex-col justify-between h-full">
            <CardContent className="p-0 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <LineChart className="h-5 w-5 text-sky-500" strokeWidth={2.2} />
                <ArrowUpRight className="h-4.5 w-4.5 text-slate-800 group-hover:text-sky-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </div>
              <div className="mt-2.5">
                <span className="text-xs sm:text-sm font-bold text-slate-900 block tracking-tight">
                  Tracer Study
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-transparent select-none block mt-0.5 tracking-tight" aria-hidden="true">
                  &nbsp;
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}
    </div>
  );
};
