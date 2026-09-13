import React from "react";
import { Check, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

interface StageStepConfig {
  order: number;
  name: string;
}

const DEFAULT_STAGES: StageStepConfig[] = [
  { order: 1, name: "Pendaftaran" },
  { order: 2, name: "Admin Seleksi" },
  { order: 3, name: "Tes" },
  { order: 4, name: "Diterima" },
  { order: 5, name: "Penempatan" },
];

interface ApplicationDetailStepperProps {
  currentStageOrder: number;
  statusCode: string;
}

export const ApplicationDetailStepper: React.FC<ApplicationDetailStepperProps> = ({
  currentStageOrder,
  statusCode,
}) => {
  const isRejected = statusCode === "rejected";

  const getStepStatus = (order: number) => {
    if (isRejected) {
      if (order < currentStageOrder) return "completed";
      if (order === currentStageOrder) return "failed";
      return "upcoming";
    }

    if (currentStageOrder >= 5) {
      return "completed";
    }

    if (currentStageOrder === 4) {
      if (order <= 4) return "completed";
      return "upcoming";
    }

    if (order < currentStageOrder) return "completed";
    if (order === currentStageOrder) return "active";
    return "upcoming";
  };

  return (
    <div className="w-full overflow-x-auto pt-0.5 pb-0.5">
      <div className="min-w-[580px] px-1 flex items-center justify-between relative">
        {DEFAULT_STAGES.map((stage, idx) => {
          const status = getStepStatus(stage.order);
          const isLast = idx === DEFAULT_STAGES.length - 1;
          const nextStatus = !isLast ? getStepStatus(DEFAULT_STAGES[idx + 1].order) : "upcoming";
          const isLineActive =
            status === "completed" && (nextStatus === "completed" || nextStatus === "active" || nextStatus === "failed");

          let circleBg = "bg-slate-200 text-slate-400";
          let textColor = "text-slate-400";

          if (isRejected) {
            if (status === "completed") {
              circleBg = "bg-emerald-500 text-white shadow-xs";
              textColor = "text-emerald-700 font-semibold";
            } else if (status === "failed") {
              circleBg = "bg-rose-500 text-white shadow-xs font-bold ring-3 ring-rose-100";
              textColor = "text-rose-600 font-bold";
            }
          } else if (currentStageOrder >= 4) {
            if (status === "completed") {
              circleBg = "bg-[#0284C7] text-white shadow-xs";
              textColor = "text-[#0284C7] font-semibold";
            } else if (status === "active") {
              circleBg = "bg-[#0284C7] text-white shadow-xs font-bold ring-3 ring-sky-100";
              textColor = "text-[#0284C7] font-bold";
            }
          } else {
            if (status === "completed") {
              circleBg = "bg-[#4F46E5] text-white shadow-xs";
              textColor = "text-[#4F46E5] font-semibold";
            } else if (status === "active") {
              circleBg = "bg-amber-500 text-white shadow-xs font-bold ring-3 ring-amber-100";
              textColor = "text-amber-600 font-bold";
            }
          }

          return (
            <React.Fragment key={stage.order}>
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={cn(
                    "w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                    circleBg
                  )}
                >
                  {status === "completed" ? (
                    stage.order === 5 && currentStageOrder >= 5 ? (
                      <PartyPopper className="h-3.5 w-3.5" />
                    ) : (
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    )
                  ) : (
                    <span>{stage.order}</span>
                  )}
                </div>

                <span
                  className={cn(
                    "text-[10px] sm:text-[11px] mt-1 text-center whitespace-nowrap tracking-tight",
                    textColor
                  )}
                >
                  {stage.order}. {stage.name}
                </span>
              </div>

              {!isLast && (
                <div className="flex-1 h-[2px] mx-1 relative top-[-10px] bg-slate-200">
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      isLineActive
                        ? isRejected
                          ? "bg-emerald-500"
                          : currentStageOrder >= 4
                          ? "bg-[#0284C7]"
                          : "bg-[#4F46E5]"
                        : "bg-transparent"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
