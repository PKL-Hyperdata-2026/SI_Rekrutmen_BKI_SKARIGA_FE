import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReviewApplicant, ReviewDecision } from "./review.schema";
import type { ReviewStatusCode } from "./review.schema";

export interface ReviewDecisionActionsProps {
  applicant: ReviewApplicant;
  status: ReviewStatusCode;
  disabled?: boolean;
  layout?: "row" | "stack";
  onDecide: (applicant: ReviewApplicant, decision: ReviewDecision) => void;
  className?: string;
}

const baseAction =
  "h-8 cursor-pointer rounded-full px-3.5 text-xs font-semibold shadow-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-700 tabular-nums";

export function ReviewDecisionActions({
  applicant,
  status,
  disabled = false,
  layout = "row",
  onDecide,
  className,
}: ReviewDecisionActionsProps) {
  const navigate = useNavigate();

  if (status === "lolos_berkas") {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => {
          const vacancyId = applicant.vacancy?.id ?? "";
          navigate(
            `/hrd/jadwal?vacancy_id=${encodeURIComponent(vacancyId)}&applicant_id=${encodeURIComponent(applicant.id)}`,
          );
        }}
        className={cn(
          baseAction,
          "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
          layout === "stack" && "w-full justify-center rounded-lg",
          className,
        )}
      >
        Atur Jadwal Tes
        <ArrowRight className="size-3.5" />
      </Button>
    );
  }

  if (status === "ditolak") {
    return (
      <span className={cn("py-2 text-center text-xs font-semibold text-slate-400", layout === "stack" && "w-full", className)}>
        Keputusan tersimpan
      </span>
    );
  }

  return (
    <div className={cn(layout === "stack" ? "flex w-full gap-2" : "flex items-center justify-center gap-2", className)}>
      <Button
        type="button"
        size="sm"
        disabled={disabled}
        onClick={() => onDecide(applicant, "lolos")}
        className={cn(
          baseAction,
          "border-0 bg-gradient-to-r from-fuchsia-900 to-fuchsia-500 text-white shadow-sm hover:opacity-90",
          layout === "stack" && "flex-1 justify-center rounded-lg",
        )}
      >
        Loloskan
        <Check className="size-3.5 stroke-3" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => onDecide(applicant, "tidak_lolos")}
        className={cn(
          baseAction,
          "border-rose-300 bg-white text-rose-600 hover:bg-rose-50",
          layout === "stack" && "flex-1 justify-center rounded-lg",
        )}
      >
        Tolak
        <X className="size-3.5 stroke-3" />
      </Button>
    </div>
  );
}
