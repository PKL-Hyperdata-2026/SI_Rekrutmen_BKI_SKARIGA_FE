import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionCard, Box, Paragraph, Span } from "@/components/custom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDashboardStatusLowongan } from "./dashboard.status-lowongan";

export interface DashboardStatusLowonganProps {
  className?: string;
}

export function DashboardStatusLowongan({ className }: DashboardStatusLowonganProps) {
  const navigate = useNavigate();
  const { vacancies } = useDashboardStatusLowongan();

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
        {vacancies.map((item) => (
          <Box
            key={item.id}
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
                <Span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground leading-tight">Pelamar</Span>
                <Span className="text-xs sm:text-[13px] font-extrabold text-[#7E1E86] leading-tight">
                  {item.applicantCount} / {item.quota} Kuota
                </Span>
              </Box>
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/hrd/review");
                }}
                className="bg-[#C4C4C8] hover:bg-[#8D1D96] text-white font-semibold text-[11px] px-2.5 py-0.5 sm:px-3 sm:py-0.5 h-6 sm:h-6.5 rounded-md sm:rounded-lg transition-all shadow-2xs cursor-pointer"
              >
                Review
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </SectionCard>
  );
}
