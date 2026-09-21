import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import {
  DataTable,
  DataTablePagination,
  type DataTableColumn,
} from "@/components/custom/data-table";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type JobVacancy } from "./lowongan-kerja.schema";
import {
  formatDeadline,
  isVacancyClosed,
  useLowonganKerjaTable,
} from "./lowongan-kerja.table";
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
  onDelete?: (item: JobVacancy) => void | Promise<void>;
  className?: string;
}

export function LowonganKerjaTable({
  data,
  loading = false,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onView,
  onDelete,
  className,
}: LowonganKerjaTableProps) {
  const { numberStartIndex, handleEdit } = useLowonganKerjaTable({
    currentPage,
    pageSize,
  });

  const columns = useMemo<DataTableColumn<JobVacancy>[]>(
    () => [
      {
        header: "PERUSAHAAN & POSISI",
        cell: (row) => (
          <CardContent className="flex flex-col gap-0.5 p-0 cursor-default select-text">
            <CardTitle className="font-bold text-slate-900 text-sm leading-tight font-sans cursor-default select-text">
              {row.company?.name || row.title}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 font-medium leading-tight cursor-default select-text">
              Posisi: {row.position || row.title}
            </CardDescription>
          </CardContent>
        ),
      },
      {
        header: "JURUSAN & TARGET",
        cell: (row) => (
          <CardContent className="flex flex-col gap-0.5 p-0 cursor-default select-text">
            <CardTitle className="font-bold text-slate-900 text-sm leading-tight font-sans cursor-default select-text">
              {row.majors && row.majors.length > 0
                ? row.majors.map((m) => m.code).join(" & ")
                : "Semua Jurusan"}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 font-medium leading-tight cursor-default select-text">
              Target: {row.targetApplicant?.name || "Semua"}
            </CardDescription>
          </CardContent>
        ),
      },
      {
        header: "KUOTA",
        cell: (row) => (
          <CardContent className="flex flex-col gap-0.5 p-0 cursor-default select-text">
            <CardTitle className="font-bold text-slate-900 text-sm leading-tight font-sans cursor-default select-text">
              Kuota: {row.quota ?? 0} Orang
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 font-medium leading-tight cursor-default select-text">
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
          const isClosed = isVacancyClosed(row);

          return (
            <CardContent className="flex justify-center p-0 cursor-default select-text">
              {isClosed ? (
                <Badge
                  variant="outline"
                  className="bg-red-50/80 text-red-600 border border-red-300 hover:bg-red-50 rounded-full px-4 py-1 text-xs font-semibold shadow-none cursor-default select-text"
                >
                  Ditutup / Expired
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-emerald-50/80 text-emerald-600 border border-emerald-300 hover:bg-emerald-50 rounded-full px-4 py-1 text-xs font-semibold shadow-none cursor-default select-text"
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
            onEdit={handleEdit}
            onDelete={onDelete}
            deleteTitle="Hapus Lowongan Kerja ini?"
          />
        ),
      },
    ],
    [onView, onDelete, handleEdit],
  );

  return (
    <CardContent className={cn("theme-admin w-full flex flex-col gap-3 p-0", className)}>
      <CardContent className="flex flex-col gap-3 md:hidden p-0">
        {loading ? (
          <Card className="p-8 text-center bg-white border border-slate-200/90 rounded-lg shadow-xs ring-0">
            <Loader2 className="h-7 w-7 animate-spin mx-auto mb-2 text-primary" />
            <CardTitle className="text-sm font-semibold text-slate-700 font-sans">
              Memuat data...
            </CardTitle>
          </Card>
        ) : data.length === 0 ? (
          <Card className="p-8 text-center bg-white border border-slate-200/90 rounded-lg shadow-xs ring-0">
            <CardTitle className="text-sm font-semibold text-slate-700 font-sans">
              Tidak ada data yang ditemukan
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-1 font-sans">
              Belum ada lowongan kerja yang terdaftar.
            </CardDescription>
          </Card>
        ) : (
          data.map((row, idx) => {
            const isClosed = isVacancyClosed(row);

            return (
              <Card
                key={row.id ?? idx}
                className="p-3.5 bg-white border border-slate-200/90 rounded-lg shadow-xs flex flex-col gap-2.5 [--card-spacing:0px] py-3.5 ring-0 cursor-default select-text"
              >
                <CardContent className="flex items-start justify-between gap-2.5 p-0 cursor-default select-text">
                  <CardContent className="flex flex-col gap-0.5 min-w-0 p-0 cursor-default select-text">
                    <CardTitle className="font-bold text-slate-900 text-sm leading-tight font-sans truncate cursor-default select-text">
                      {row.company?.name || row.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 font-medium truncate font-sans leading-tight cursor-default select-text">
                      Posisi: {row.position || row.title}
                    </CardDescription>
                  </CardContent>
                  <CardContent className="shrink-0 p-0 cursor-default select-text">
                    {isClosed ? (
                      <Badge
                        variant="outline"
                        className="bg-red-50/80 text-red-600 border border-red-300 rounded-full px-2.5 py-0.5 text-[11px] font-semibold shadow-none cursor-default select-text"
                      >
                        Ditutup / Expired
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-emerald-50/80 text-emerald-600 border border-emerald-300 rounded-full px-2.5 py-0.5 text-[11px] font-semibold shadow-none cursor-default select-text"
                      >
                        {row.status?.name || "Aktif / Dibuka"}
                      </Badge>
                    )}
                  </CardContent>
                </CardContent>

                <CardContent className="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-slate-100 p-0 cursor-default select-text">
                  <CardContent className="flex flex-col gap-0.5 p-0 cursor-default select-text">
                    <CardDescription className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-sans leading-tight cursor-default select-text">
                      Jurusan & Target
                    </CardDescription>
                    <CardTitle className="font-medium text-slate-800 text-xs truncate leading-tight font-sans cursor-default select-text">
                      {row.majors && row.majors.length > 0
                        ? row.majors.map((m) => m.code).join(" & ")
                        : "Semua Jurusan"}
                    </CardTitle>
                    <CardDescription className="text-[11px] text-slate-500 truncate leading-tight font-sans cursor-default select-text">
                      Target: {row.targetApplicant?.name || "Semua"}
                    </CardDescription>
                  </CardContent>
                  <CardContent className="flex flex-col gap-0.5 p-0 cursor-default select-text">
                    <CardDescription className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-sans leading-tight cursor-default select-text">
                      Kuota & Batas
                    </CardDescription>
                    <CardTitle className="font-medium text-slate-800 text-xs leading-tight font-sans cursor-default select-text">
                      {row.quota ?? 0} Orang
                    </CardTitle>
                    <CardDescription className="text-[11px] text-slate-500 leading-tight font-sans cursor-default select-text">
                      Batas: {formatDeadline(row.deadline)}
                    </CardDescription>
                  </CardContent>
                </CardContent>

                <CardContent className="flex items-center justify-between pt-2.5 border-t border-slate-100 p-0 cursor-default select-text">
                  <Badge
                    variant="outline"
                    className="text-xs font-semibold text-slate-400 border-none bg-transparent p-0 shadow-none font-sans cursor-default select-text"
                  >
                    #{numberStartIndex + idx}
                  </Badge>
                  <DataTable.Actions
                    row={row}
                    onView={onView}
                    onEdit={handleEdit}
                    onDelete={onDelete}
                    deleteTitle="Hapus Lowongan Kerja ini?"
                  />
                </CardContent>
              </Card>
            );
          })
        )}
      </CardContent>

      <CardContent className="hidden md:block p-0">
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          numberStartIndex={numberStartIndex}
          emptyMessage="Belum ada lowongan kerja yang terdaftar."
          className="rounded-lg cursor-default select-text"
          rowClassName="cursor-default select-text"
        />
      </CardContent>

      <Card className="bg-white rounded-lg border border-slate-200/90 shadow-xs overflow-hidden p-0 gap-0 ring-0 w-full max-w-full min-w-0">
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[10, 25, 50, 100]}
          role="admin"
          className="border-none"
        />
      </Card>
    </CardContent>
  );
}
