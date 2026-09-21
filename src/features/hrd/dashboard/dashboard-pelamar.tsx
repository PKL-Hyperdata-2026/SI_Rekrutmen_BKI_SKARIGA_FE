import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";
import { SectionCard, Box, Paragraph, Span } from "@/components/custom";
import { DataTable, type DataTableColumn } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDashboardPelamar, type PelamarDashboardItem } from "./dashboard.pelamar";

export interface DashboardPelamarProps {
  className?: string;
}

export function DashboardPelamar({ className }: DashboardPelamarProps) {
  const navigate = useNavigate();
  const { applicants } = useDashboardPelamar();

  const columns: DataTableColumn<PelamarDashboardItem>[] = useMemo(
    () => [
      {
        header: "PELAMAR & JURUSAN",
        align: "left",
        headerClassName: "text-[10px] sm:text-[11px] py-2 px-3",
        className: "py-1.5 sm:py-2 px-3",
        cell: (row) => (
          <Box className="flex flex-col gap-0.5 min-w-0">
            <Span className="font-bold text-xs sm:text-[13px] text-foreground leading-tight">
              {row.name}
            </Span>
            <Span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium leading-tight">
              {row.major}
            </Span>
          </Box>
        ),
      },
      {
        header: "POSISI DILAMAR",
        accessorKey: "position",
        align: "left",
        headerClassName: "text-[10px] sm:text-[11px] py-2 px-3",
        className: "py-1.5 sm:py-2 px-3",
        cell: (row) => (
          <Span className="text-xs sm:text-[13px] font-bold text-foreground">
            {row.position}
          </Span>
        ),
      },
      {
        header: "TANGGAL MELAMAR",
        accessorKey: "appliedAt",
        align: "left",
        headerClassName: "text-[10px] sm:text-[11px] py-2 px-3",
        className: "py-1.5 sm:py-2 px-3",
        cell: (row) => (
          <Span className="text-[11px] sm:text-xs font-semibold text-muted-foreground">
            {row.appliedAt}
          </Span>
        ),
      },
      {
        header: "PORTOFOLIO",
        align: "center",
        headerClassName: "text-[10px] sm:text-[11px] py-2 px-3 text-center",
        className: "py-1.5 sm:py-2 px-3 text-center",
        cell: (row) => (
          <Badge
            variant="outline"
            className="border-purple-200 text-[#8D1D96] bg-[#FAF5FF] text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
          >
            <FileText className="size-2.5 sm:size-3 shrink-0" />
            {row.portfolio}
          </Badge>
        ),
      },
      {
        header: "AKSI",
        align: "center",
        headerClassName: "text-[10px] sm:text-[11px] py-2 px-3 text-center",
        className: "py-1.5 sm:py-2 px-3 text-center",
        cell: () => (
          <Button
            size="sm"
            onClick={() => navigate("/hrd/review")}
            className="bg-[#8D1D96] text-white border border-[#8D1D96] hover:bg-white hover:text-[#8D1D96] font-semibold text-[11px] h-6 sm:h-6.5 px-3 rounded-full cursor-pointer transition-all active:scale-95 shadow-2xs"
          >
            Review
          </Button>
        ),
      },
    ],
    [navigate],
  );

  return (
    <SectionCard
      headerClassName="mb-2 sm:mb-2.5"
      title={
        <Span className="text-xs sm:text-sm font-bold text-[#3D0040]">
          Pelamar terbaru Menunggu Review ( Kandidat Masuk)
        </Span>
      }
      subtitle={
        <Paragraph className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">
          Penyaluran data tersinkronisasi langsung dari akun Siswa/Alumni dan Modul Penempatan
        </Paragraph>
      }
      action={
        <Button
          variant="ghost"
          onClick={() => navigate("/hrd/review")}
          className="group text-[#8D1D96] hover:text-[#5A0C62] hover:bg-transparent text-[11px] sm:text-xs font-semibold p-0 h-auto gap-1 cursor-pointer no-underline hover:no-underline"
        >
          Lihat Semua
          <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-1" />
        </Button>
      }
      className={cn(
        "rounded-xl border-none bg-card shadow-xs p-3 sm:p-3.5 flex flex-col gap-2.5 cursor-default",
        className,
      )}
    >
      <DataTable
        columns={columns}
        data={applicants}
        showNumbering={true}
        role="hrd"
        className="border border-slate-100 rounded-lg text-xs"
      />
    </SectionCard>
  );
}

