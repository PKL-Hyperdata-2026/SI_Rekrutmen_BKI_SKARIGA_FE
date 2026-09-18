import { cn } from "@/lib/utils";
import {
  getEffectiveStatus,
  type LowonganEffectiveStatus,
} from "./lowongan-status";
import type { HrdJobVacancyItem as VacancyItem } from "./lowongan.schema";

const STATUS_STYLES: Record<LowonganEffectiveStatus, string> = {
  active:
    "bg-emerald-50 text-emerald-700 border-emerald-200/70",
  quota_full: "bg-rose-50 text-rose-700 border-rose-200/70",
  expired: "bg-amber-50 text-amber-800 border-amber-200/70",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
};

const STATUS_LABELS: Record<LowonganEffectiveStatus, string> = {
  active: "Aktif",
  quota_full: "Ditutup (Kuota Penuh)",
  expired: "Ditutup (Batas Lewat)",
  closed: "Ditutup",
};

export interface LowonganStatusBadgeProps {
  item: VacancyItem;
  className?: string;
}

export function LowonganStatusBadge({
  item,
  className,
}: LowonganStatusBadgeProps) {
  const status = getEffectiveStatus(item);
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border",
        STATUS_STYLES[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export default LowonganStatusBadge;
