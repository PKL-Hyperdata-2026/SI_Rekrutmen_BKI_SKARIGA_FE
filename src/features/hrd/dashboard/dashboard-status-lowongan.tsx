import { useNavigate } from "react-router-dom";
import { ArrowRight, Briefcase } from "lucide-react";
import { SectionCard, Box, Paragraph, Span } from "@/components/custom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDashboardStatusLowongan } from "./dashboard.status-lowongan";
import type { HrdDashboardVacancy } from "./dashboard.api";

export interface DashboardStatusLowonganProps {
  className?: string;
  vacanciesList?: HrdDashboardVacancy[];
  isLoading?: boolean;
}

export function DashboardStatusLowongan({
  className,
  vacanciesList,
  isLoading,
}: DashboardStatusLowonganProps) {
  const navigate = useNavigate();
  const { vacancies } = useDashboardStatusLowongan(vacanciesList);

  return (
    <SectionCard
      headerClassName="mb-2 sm:mb-2.5"
      title={
        <Span className="text-xs sm:text-sm font-bold text-[#3D0040]">
          Status Lowongan Kerja Dipublish
        </Span>
      }
      action={
        <Button
          variant="ghost"
          onClick={() => navigate("/hrd/lowongan")}
          className="group text-[#8D1D96] hover:text-[#5A0C62] hover:bg-transparent text-[11px] sm:text-xs font-semibold p-0 h-auto gap-1 cursor-pointer no-underline hover:no-underline"
        >
          Kelola Lowongan
          <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-1" />
        </Button>
      }
      className={cn(
        "rounded-xl border-none bg-card shadow-xs p-3 sm:p-3.5",
        className,
      )}
    >
      <Box className="flex flex-col gap-1.5 sm:gap-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="py-2.5 px-3 rounded-lg border border-slate-100 flex items-center justify-between"
            >
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-3 w-56 rounded" />
              </div>
              <Skeleton className="h-6 w-16 rounded" />
            </div>
          ))
        ) : vacancies.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground flex flex-col items-center gap-1.5">
            <Briefcase className="size-8 text-muted-foreground/40" />
            <p className="text-xs font-medium">Belum ada lowongan aktif.</p>
          </div>
        ) : (
          vacancies.map((item) => (
            <Box
              key={item.id}
              onClick={() => navigate("/hrd/lowongan")}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-2 px-2.5 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-transparent hover:border-[#8D1D96]/50 hover:bg-[#FAF5FF]/70 hover:shadow-2xs transition-all duration-200 cursor-pointer gap-2 sm:gap-3 select-none"
            >
              <Box className="flex flex-col gap-0.5 min-w-0">
                <Box className="flex items-center gap-1.5">
                  <Span className="text-xs sm:text-[13px] font-bold text-[#2D0A31] leading-tight">
                    {item.title}
                  </Span>
                  <Span className="size-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                </Box>
                <Paragraph className="text-[10px] sm:text-[11px] font-medium text-[#7E3D85] leading-normal">
                  {item.departmentMajor} • Batas : {item.deadline}
                </Paragraph>
              </Box>

              <Box className="flex items-center gap-2.5 sm:gap-4 shrink-0 justify-between sm:justify-end">
                <Box className="flex flex-col items-end text-right">
                  <Span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground leading-tight">
                    Pelamar
                  </Span>
                  <Span className="text-xs sm:text-[13px] font-extrabold text-[#7E1E86] leading-tight">
                    {item.applicantCount}
                  </Span>
                </Box>
                <Box className="flex flex-col items-end text-right">
                  <Span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground leading-tight">
                    Kuota
                  </Span>
                  <Span className="text-xs sm:text-[13px] font-extrabold text-foreground leading-tight">
                    {item.quota}
                  </Span>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </SectionCard>
  );
}
