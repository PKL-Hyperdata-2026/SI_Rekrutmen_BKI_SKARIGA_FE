import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, FolderOpen, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardQuickActionsProps {
  isAlumni: boolean;
}

export const DashboardQuickActions: React.FC<DashboardQuickActionsProps> = ({ isAlumni }) => {
  const actions = [
    {
      title: "Cari Lowongan",
      href: "/student/lowongan",
      icon: Briefcase,
      colorClass: "bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white",
    },
    {
      title: "Lihat Portofolio",
      href: "/student/portofolio",
      icon: FolderOpen,
      colorClass: "bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white",
    },
    ...(isAlumni
      ? [
          {
            title: "Cek Tracer Study",
            href: "/student/tracer",
            icon: LineChart,
            colorClass: "bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white",
          },
        ]
      : []),
  ];

  return (
    <div
      className={cn(
        "grid gap-3.5 sm:gap-4",
        isAlumni ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"
      )}
    >
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <Link
            key={act.title}
            to={act.href}
            className="group flex items-center gap-3.5 px-4 sm:px-5 py-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-md transition-all duration-200"
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200",
                act.colorClass
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate block">
                {act.title}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
