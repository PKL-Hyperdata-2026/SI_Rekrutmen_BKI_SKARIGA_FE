import { Check } from "lucide-react";
import { SectionCard, Box, Paragraph, Span } from "@/components/custom";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDashboardBerkas } from "./dashboard.berkas";
import type { HrdDashboardSummaryBerkas } from "./dashboard.api";

export interface DashboardBerkasProps {
  className?: string;
  summary?: HrdDashboardSummaryBerkas;
  isLoading?: boolean;
}

export function DashboardBerkas({
  className,
  summary,
  isLoading,
}: DashboardBerkasProps) {
  const { features } = useDashboardBerkas(summary);

  return (
    <SectionCard
      headerClassName="mb-2 sm:mb-2.5"
      title={
        <Span className="text-xs sm:text-sm font-bold text-[#3D0040]">
          Kelola Berkas
        </Span>
      }
      className={cn(
        "rounded-xl border-none bg-card shadow-xs p-3 sm:p-3.5 flex flex-col justify-between cursor-default",
        className,
      )}
    >
      <Box className="flex flex-col gap-1.5 sm:gap-2">
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="py-2.5 px-3 rounded-lg border border-slate-100 flex items-center justify-between"
              >
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36 rounded" />
                  <Skeleton className="h-3 w-48 rounded" />
                </div>
                <Skeleton className="size-5 rounded-full" />
              </div>
            ))
          : features.map((item) => (
              <Box
                key={item.id}
                className="flex items-center justify-between py-2 px-2.5 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-[#8D1D96]/40 bg-[#FAF5FF]/30 hover:bg-[#FAF5FF]/60 hover:border-[#8D1D96]/60 transition-all duration-200 gap-2.5"
              >
                <Box className="flex flex-col gap-0.5 min-w-0">
                  <Span className="text-xs sm:text-[13px] font-bold text-[#2D0A31] leading-tight">
                    {item.title}
                  </Span>
                  <Paragraph className="text-[10px] sm:text-[11px] font-medium text-[#7E3D85] leading-normal">
                    {item.description}
                  </Paragraph>
                </Box>

                <Span className="size-5 sm:size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Check className="size-3 sm:size-3.5 stroke-3" />
                </Span>
              </Box>
            ))}
      </Box>
    </SectionCard>
  );
}
