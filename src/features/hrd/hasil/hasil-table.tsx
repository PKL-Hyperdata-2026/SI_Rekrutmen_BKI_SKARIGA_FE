import { useMemo } from "react";
import { Pencil } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/custom/data-table";
import { Badge } from "@/components/ui/badge";
import type { SelectionResultItem } from "./hasil.schema";
import { cn } from "@/lib/utils";

export interface HasilTableProps {
  data: SelectionResultItem[];
  loading?: boolean;
  onEdit: (item: SelectionResultItem) => void;
  className?: string;
}

function formatDecimalScore(score?: number | null): string {
  if (score === null || score === undefined || Number.isNaN(score)) {
    return "–";
  }
  return score.toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function HasilTable({
  data,
  loading = false,
  onEdit,
  className,
}: HasilTableProps) {
  const columns = useMemo<DataTableColumn<SelectionResultItem>[]>(
    () => [
      {
        header: "PELAMAR & NISN",
        className: "min-w-[180px] px-3.5 py-3",
        headerClassName: "px-3.5 select-none font-bold text-xs text-foreground tracking-wider",
        cell: (row) => (
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-900 text-sm leading-tight truncate">
              {row.applicant.name}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 truncate">
              NISN : {row.applicant.nis || "–"} – {row.applicant.school || "SMK PGRI 1 GIRI"}
            </span>
          </div>
        ),
      },
      {
        header: "SELEKSI ADMIN",
        align: "center",
        className: "text-center px-3 py-3",
        headerClassName: "text-center px-3 select-none font-bold text-xs text-foreground tracking-wider",
        cell: (row) => {
          const isLolos = row.adminSelectionStatus === "lolos";
          return (
            <Badge
              variant="outline"
              className={cn(
                "rounded-lg px-2.5 py-0.5 text-xs font-semibold shadow-none",
                isLolos
                  ? "border-emerald-500 text-emerald-600 bg-white"
                  : "border-rose-400 text-rose-600 bg-white"
              )}
            >
              {isLolos ? "Lolos" : "Tidak Lolos"}
            </Badge>
          );
        },
      },
      {
        header: "NILAI PSIKOTES",
        align: "center",
        className: "text-center px-3 py-3",
        headerClassName: "text-center px-3 select-none font-bold text-xs text-foreground tracking-wider",
        cell: (row) => (
          <span className="font-bold text-xs text-slate-900">
            {formatDecimalScore(row.psychotestScore)}
          </span>
        ),
      },
      {
        header: "NILAI INTERVIEW",
        align: "center",
        className: "text-center px-3 py-3",
        headerClassName: "text-center px-3 select-none font-bold text-xs text-foreground tracking-wider",
        cell: (row) => (
          <span className="font-bold text-xs text-slate-900">
            {formatDecimalScore(row.interviewScore)}
          </span>
        ),
      },
      {
        header: "NILAI MCU",
        align: "center",
        className: "text-center px-3 py-3",
        headerClassName: "text-center px-3 select-none font-bold text-xs text-foreground tracking-wider",
        cell: (row) => (
          <span className="font-bold text-xs text-slate-900">
            {formatDecimalScore(row.mcuScore)}
          </span>
        ),
      },
      {
        header: "NILAI AKHIR",
        align: "center",
        className: "text-center px-3 py-3",
        headerClassName: "text-center px-3 select-none font-bold text-xs text-foreground tracking-wider",
        cell: (row) => (
          <span className="font-bold text-xs text-emerald-600">
            {formatDecimalScore(row.finalScore)}
          </span>
        ),
      },
      {
        header: "KEPUTUSAN",
        align: "center",
        className: "text-center px-3 py-3",
        headerClassName: "text-center px-3 select-none font-bold text-xs text-foreground tracking-wider",
        cell: (row) => {
          const decision = row.decision || "pending";
          if (decision === "diterima") {
            return (
              <Badge
                variant="outline"
                className="border-emerald-500 text-emerald-600 font-semibold bg-emerald-50/50 rounded-full px-3 py-0.5 text-xs shadow-none whitespace-nowrap"
              >
                Diterima
              </Badge>
            );
          }
          if (decision === "tidak_diterima") {
            return (
              <Badge
                variant="outline"
                className="border-rose-400 text-rose-600 font-semibold bg-rose-50/50 rounded-full px-3 py-0.5 text-xs shadow-none whitespace-nowrap"
              >
                Tidak Diterima
              </Badge>
            );
          }
          if (decision === "cadangan") {
            return (
              <Badge
                variant="outline"
                className="border-purple-400 text-purple-700 font-semibold bg-purple-50/50 rounded-full px-3 py-0.5 text-xs shadow-none whitespace-nowrap"
              >
                Cadangan
              </Badge>
            );
          }
          return (
            <Badge
              variant="outline"
              className="border-slate-300 text-slate-600 font-medium bg-slate-50/50 rounded-full px-3 py-0.5 text-xs shadow-none whitespace-nowrap"
            >
              Pending
            </Badge>
          );
        },
      },
      {
        header: "AKSI",
        align: "center",
        className: "text-center px-3 py-3 w-20",
        headerClassName: "text-center px-3 select-none w-20 font-bold text-xs text-foreground tracking-wider",
        cell: (row) => (
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => onEdit(row)}
              title="Edit Hasil Evaluasi"
              className="h-8 w-8 rounded-lg border border-purple-200/80 bg-purple-50/70 text-purple-600 hover:bg-purple-100 hover:text-purple-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
      },
    ],
    [onEdit]
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage="Tidak ada data pelamar seleksi"
        emptyDescription="Silakan pilih lowongan kerja yang relevan pada filter di atas."
        className={className}
      />
    </div>
  );
}
