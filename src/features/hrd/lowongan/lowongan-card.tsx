import { Users, Pencil, Lock, RefreshCw, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { HrdJobVacancyItem } from "./lowongan.schema";
import {
  isEffectivelyActive,
  isPastDeadline,
  isQuotaFullItem,
  formatVacancyDeadline,
  quotaFillRatio,
  quotaFillClass,
} from "./lowongan-status";
import { LowonganStatusBadge } from "./lowongan-status-badge";

export interface LowonganCardProps {
  item: HrdJobVacancyItem;
  isProcessing: boolean;
  isCurrentlyEdited: boolean;
  onViewApplicants: (item: HrdJobVacancyItem) => void;
  onEdit: (item: HrdJobVacancyItem) => void;
  onClose: (item: HrdJobVacancyItem) => void;
  onReopen: (item: HrdJobVacancyItem) => void;
  onDelete: (item: HrdJobVacancyItem) => void;
}

function applicantUnit(item: HrdJobVacancyItem): string {
  const name = item.targetApplicant?.name ?? "";
  const hasAlumni = name.toLowerCase().includes("alumni");
  const hasSiswa = name.toLowerCase().includes("siswa");
  if (hasAlumni && !hasSiswa) return "Alumni";
  if (hasSiswa) return "Siswa";
  return "Pelamar";
}

function jobTypeBadgeClass(item: HrdJobVacancyItem): string {
  const haystack =
    `${item.jobType?.code ?? ""} ${item.jobType?.name ?? ""}`.toLowerCase();
  if (
    haystack.includes("magang") ||
    haystack.includes("pkl") ||
    haystack.includes("intern")
  ) {
    return "bg-slate-100 text-slate-600 border-slate-200";
  }
  return "bg-purple-50 text-[#7A1384] border-purple-200/70";
}

export function LowonganCard({
  item,
  isProcessing,
  isCurrentlyEdited,
  onViewApplicants,
  onEdit,
  onClose,
  onReopen,
  onDelete,
}: LowonganCardProps) {
  const applicants = item.applicantsCount ?? 0;
  const quotaRatio = quotaFillRatio(item);
  const effectiveActive = isEffectivelyActive(item);
  const isExpired = isPastDeadline(item.deadline);
  const isQuotaFull = isQuotaFullItem(item);
  const isStaleData = isExpired || isQuotaFull;
  const formattedDate = formatVacancyDeadline(item.deadline);
  const showPosition =
    Boolean(item.title) &&
    Boolean(item.position) &&
    item.title !== item.position;

  return (
    <div
      className={cn(
        "p-5 rounded-2xl border bg-white transition-all shadow-xs flex flex-col gap-3",
        isCurrentlyEdited
          ? "border-[#8D1D96] ring-2 ring-[#8D1D96]/20"
          : "border-slate-200/70 hover:border-slate-300 hover:shadow-sm"
      )}
    >
      {/* Top row: status + job type */}
      <div className="flex items-center justify-between gap-2">
        <LowonganStatusBadge item={item} />
        {item.jobType?.name && (
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border",
              jobTypeBadgeClass(item)
            )}
          >
            {item.jobType.name}
          </span>
        )}
      </div>

      {/* Title + company */}
      <div className="min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words">
          {item.title || item.position}
        </h3>
        <p className="text-xs text-slate-500 mt-1 truncate">
          {item.company?.name ? `${item.company.name} • ` : ""}
          {item.workLocation}
        </p>
        {showPosition && (
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            Posisi: {item.position}
          </p>
        )}
      </div>

      {/* Target + majors */}
      {((item.majors && item.majors.length > 0) ||
        item.targetApplicant?.name) && (
        <div className="flex flex-wrap items-center gap-1.5">
          {item.targetApplicant?.name && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-[#7A1384] border border-purple-200/70">
              {item.targetApplicant.name}
            </span>
          )}
          {item.majors?.map((m) => (
            <span
              key={String(m.id || m.code)}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60"
              title={m.name}
            >
              {m.code}
            </span>
          ))}
        </div>
      )}

      {/* Quota progress */}
      <div className="rounded-xl bg-slate-50/70 px-3.5 py-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-500">
            Pelamar / Kuota
          </span>
          <span className="text-sm font-bold text-slate-900 tabular-nums">
            {applicants}/{item.quota} {applicantUnit(item)}
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Kapasitas kuota pelamar"
          aria-valuenow={applicants}
          aria-valuemin={0}
          aria-valuemax={item.quota}
          className="w-full h-1.5 bg-slate-200/70 rounded-full overflow-hidden"
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              quotaFillClass(quotaRatio)
            )}
            style={{ width: `${quotaRatio * 100}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500">
          Batas Pendaftaran:{" "}
          <span className="font-semibold text-slate-700">
            {formattedDate}
          </span>
        </p>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onViewApplicants(item)}
          aria-label={`Lihat pelamar posisi ${item.position}`}
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold bg-[#F8EAF8] text-[#7A1384] hover:bg-[#F3DCF3] focus-visible:ring-2 focus-visible:ring-[#8D1D96]/40 focus-visible:outline-none transition-colors border border-[#7A1384]/20 cursor-pointer"
        >
          <Users className="h-3.5 w-3.5" />
          <span>Lihat Pelamar ({applicants})</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEdit(item)}
            disabled={isProcessing}
            aria-label={`Edit lowongan ${item.position}`}
            className={cn(
              "rounded-lg h-8 px-3 text-xs font-medium cursor-pointer transition-colors",
              isCurrentlyEdited
                ? "bg-[#8D1D96] text-white border-[#8D1D96] hover:bg-[#7A1384] hover:text-white"
                : isStaleData
                  ? "text-amber-700 border-amber-300 bg-amber-50/60 hover:bg-amber-100/70"
                  : "text-slate-700 border-slate-200 hover:bg-slate-50"
            )}
          >
            <Pencil
              className={cn(
                "h-3 w-3 mr-1",
                isStaleData && !isCurrentlyEdited && "text-amber-600"
              )}
            />
            {isCurrentlyEdited
              ? "Sedang Diedit"
              : isStaleData
                ? "Perbarui Batas"
                : "Edit"}
          </Button>

          {effectiveActive ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isProcessing}
              onClick={() => onClose(item)}
              aria-label={`Tutup lowongan ${item.position}`}
              className="rounded-lg h-8 px-3 text-xs font-medium text-rose-600 border-rose-200 bg-rose-50/40 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
            >
              {isProcessing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <Lock className="h-3 w-3 mr-1 text-rose-500" />
                  Tutup
                </>
              )}
            </Button>
          ) : (
            !isStaleData && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isProcessing}
                onClick={() => onReopen(item)}
                aria-label={`Buka kembali lowongan ${item.position}`}
                className="rounded-lg h-8 px-3 text-xs font-medium text-emerald-600 border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
              >
                {isProcessing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1 text-emerald-500" />
                    Buka Kembali
                  </>
                )}
              </Button>
            )
          )}

          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={isProcessing}
            onClick={() => onDelete(item)}
            aria-label={`Hapus lowongan ${item.position}`}
            className="rounded-lg h-8 w-8 text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 cursor-pointer"
          >
            {isProcessing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5 text-rose-500" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LowonganCard;
