import { useMemo } from "react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/custom/data-table";
import { DataTablePagination } from "@/components/custom/data-table-pagination";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type JobVacancy } from "../types";
import { cn } from "@/lib/utils";

export interface LowonganKerjaTableProps {
  data: JobVacancy[];
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onView?: (item: JobVacancy) => void;
  onEdit?: (item: JobVacancy) => void;
  onDelete?: (item: JobVacancy) => void | Promise<void>;
  className?: string;
}

function formatDeadline(dateStr?: string): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function LowonganKerjaTable({
  data,
  loading = false,
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onView,
  onEdit,
  onDelete,
  className,
}: LowonganKerjaTableProps) {
  const columns = useMemo<DataTableColumn<JobVacancy>[]>(
    () => [
      {
        header: "PERUSAHAAN & POSISI",
        cell: (row) => (
          <CardContent className="flex flex-col gap-0.5 p-0">
            <CardTitle className="font-bold text-slate-900 text-sm leading-tight font-sans">
              {row.company?.name || row.title}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 font-medium leading-tight">
              Posisi: {row.position || row.title}
            </CardDescription>
          </CardContent>
        ),
      },
      {
        header: "JURUSAN & TARGET",
        cell: (row) => (
          <CardContent className="flex flex-col gap-0.5 p-0">
            <CardTitle className="font-bold text-slate-900 text-sm leading-tight font-sans">
              {row.majors && row.majors.length > 0
                ? row.majors.map((m) => m.code).join(" & ")
                : "Semua Jurusan"}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 font-medium leading-tight">
              Target: {row.targetApplicant?.name || "Semua"}
            </CardDescription>
          </CardContent>
        ),
      },
      {
        header: "KUOTA",
        cell: (row) => (
          <CardContent className="flex flex-col gap-0.5 p-0">
            <CardTitle className="font-bold text-slate-900 text-sm leading-tight font-sans">
              Kuota: {row.quota ?? 0} Orang
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 font-medium leading-tight">
              Batas: {formatDeadline(row.deadline)}
            </CardDescription>
          </CardContent>
        ),
      },
      {
        header: "STATUS LOWONGAN",
        align: "center",
        headerClassName: "text-center",
        cell: (row) => {
          const isClosed =
            row.status?.code === "closed" ||
            row.status?.name?.toLowerCase().includes("tutup") ||
            row.status?.name?.toLowerCase().includes("expired");

          return (
            <CardContent className="flex justify-center p-0">
              {isClosed ? (
                <Badge
                  variant="outline"
                  className="bg-red-50/80 text-red-600 border border-red-300 hover:bg-red-50 rounded-full px-4 py-1 text-xs font-semibold shadow-none select-none"
                >
                  {row.status?.name || "Ditutup / Expired"}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-emerald-50/80 text-emerald-600 border border-emerald-300 hover:bg-emerald-50 rounded-full px-4 py-1 text-xs font-semibold shadow-none select-none"
                >
                  {row.status?.name || "Aktif / Dibuka"}
                </Badge>
              )}
            </CardContent>
          );
        },
      },
      {
        header: "AKSI",
        align: "center",
        headerClassName: "text-center",
        cell: (row) => (
          <DataTable.Actions
            row={row}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            deleteItemName={(r) => r.position || r.title || "Lowongan Kerja"}
          />
        ),
      },
    ],
    [onView, onEdit, onDelete],
  );

  return (
    <Card
      className={cn(
        "theme-admin w-full bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-hidden flex flex-col p-0 gap-0 ring-0",
        className,
      )}
    >
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        showNumbering={true}
        numberStartIndex={(currentPage - 1) * pageSize + 1}
        className="rounded-none border-none shadow-none"
      />
      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={[10, 25, 50, 100]}
        role="admin"
      />
    </Card>
  );
}
