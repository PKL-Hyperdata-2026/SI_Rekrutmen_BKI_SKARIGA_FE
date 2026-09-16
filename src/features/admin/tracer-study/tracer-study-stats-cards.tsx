import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TracerMetrics } from "./tracer-study.schema";

interface TracerStatsCardsProps {
  metrics: TracerMetrics | null;
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

export function TracerStatsCards({
  metrics,
  activeStatus,
  onStatusChange,
}: TracerStatsCardsProps) {
  const cards = [
    {
      id: "all",
      subLabel: "STATUS ALUMNI",
      label: "Total Alumni",
      value: `${metrics?.total_alumni ?? 0} Alumni`,
      iconColor: "text-purple-600",
      subLabelColor: "text-purple-600",
      valueColor: "text-purple-700",
      activeBg: "bg-purple-50 border-purple-300 ring-2 ring-purple-400/30",
      defaultBg: "bg-purple-50 border-purple-200/80 hover:border-purple-300",
    },
    {
      id: "bekerja",
      subLabel: "STATUS ALUMNI",
      label: "Bekerja",
      value: `${metrics?.bekerja ?? 0} Alumni`,
      iconColor: "text-amber-500",
      subLabelColor: "text-amber-600",
      valueColor: "text-amber-600",
      activeBg: "bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/30",
      defaultBg: "bg-white border-slate-200/80 hover:border-amber-200",
    },
    {
      id: "lanjut_studi",
      subLabel: "STATUS ALUMNI",
      label: "Kuliah",
      value: `${metrics?.kuliah ?? 0} Alumni`,
      iconColor: "text-emerald-600",
      subLabelColor: "text-emerald-600",
      valueColor: "text-emerald-600",
      activeBg: "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-400/30",
      defaultBg: "bg-white border-slate-200/80 hover:border-emerald-200",
    },
    {
      id: "wirausaha",
      subLabel: "STATUS ALUMNI",
      label: "Wirausaha",
      value: `${metrics?.wirausaha ?? 0} Alumni`,
      iconColor: "text-blue-600",
      subLabelColor: "text-blue-600",
      valueColor: "text-blue-600",
      activeBg: "bg-blue-50/70 border-blue-300 ring-2 ring-blue-400/30",
      defaultBg: "bg-white border-slate-200/80 hover:border-blue-200",
    },
    {
      id: "mencari_pekerjaan",
      subLabel: "STATUS ALUMNI",
      label: "Mencari Kerja",
      value: `${metrics?.mencari_kerja ?? 0} Alumni`,
      iconColor: "text-rose-600",
      subLabelColor: "text-rose-600",
      valueColor: "text-rose-600",
      activeBg: "bg-rose-50/70 border-rose-300 ring-2 ring-rose-400/30",
      defaultBg: "bg-white border-slate-200/80 hover:border-rose-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {cards.map((card) => {
        const isActive = activeStatus === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onStatusChange(card.id)}
            className={cn(
              "text-left p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 relative group cursor-pointer shadow-xs",
              isActive ? card.activeBg : card.defaultBg
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className={cn(
                  "text-[10px] sm:text-[11px] font-bold uppercase tracking-wider",
                  card.subLabelColor
                )}
              >
                {card.subLabel}
              </span>
              <FileText
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                  card.iconColor
                )}
              />
            </div>

            <div className="mt-2.5 space-y-0.5">
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                {card.label}
              </p>
              <p
                className={cn(
                  "text-base sm:text-lg font-bold leading-tight",
                  card.valueColor
                )}
              >
                {card.value}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
