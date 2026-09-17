import { format, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { HrdJobVacancyItem } from "./lowongan.schema";

export type LowonganEffectiveStatus =
  | "active"
  | "quota_full"
  | "expired"
  | "closed";

export function isPastDeadline(
  deadlineStr: string | null | undefined
): boolean {
  if (!deadlineStr) return false;
  try {
    const cleanStr = deadlineStr.split("T")[0];
    const todayStr = new Date().toLocaleDateString("en-CA");
    return cleanStr < todayStr;
  } catch {
    return false;
  }
}

export function isQuotaFullItem(item: HrdJobVacancyItem): boolean {
  const applicants = item.applicantsCount ?? 0;
  return item.quota > 0 && applicants >= item.quota;
}

export function isEffectivelyActive(item: HrdJobVacancyItem): boolean {
  return (
    item.isActive && !isPastDeadline(item.deadline) && !isQuotaFullItem(item)
  );
}

export function isExpiringSoon(
  deadlineStr: string | null | undefined,
  withinDays = 7
): boolean {
  if (!deadlineStr) return false;
  if (isPastDeadline(deadlineStr)) return false;
  try {
    const cleanStr = deadlineStr.split("T")[0];
    const todayStr = new Date().toLocaleDateString("en-CA");
    const deadlineMs = new Date(`${cleanStr}T00:00:00`).getTime();
    const todayMs = new Date(`${todayStr}T00:00:00`).getTime();
    if (Number.isNaN(deadlineMs) || Number.isNaN(todayMs)) return false;
    const diffDays = Math.round((deadlineMs - todayMs) / 86400000);
    return diffDays >= 0 && diffDays <= withinDays;
  } catch {
    return false;
  }
}

export function getEffectiveStatus(
  item: HrdJobVacancyItem
): LowonganEffectiveStatus {
  if (isQuotaFullItem(item)) return "quota_full";
  if (isPastDeadline(item.deadline)) return "expired";
  if (item.isActive) return "active";
  return "closed";
}

export function formatVacancyDeadline(
  dateStr: string | null | undefined
): string {
  if (!dateStr) return "-";
  try {
    const cleanStr = dateStr.split("T")[0];
    return format(parseISO(cleanStr), "d MMM yyyy", { locale: idLocale });
  } catch {
    return dateStr;
  }
}

export function quotaFillRatio(item: HrdJobVacancyItem): number {
  if (item.quota <= 0) return 0;
  return Math.min((item.applicantsCount ?? 0) / item.quota, 1);
}

export function quotaFillClass(ratio: number): string {
  if (ratio >= 1) return "bg-rose-500";
  if (ratio >= 0.75) return "bg-amber-500";
  return "bg-[#8D1D96]";
}
