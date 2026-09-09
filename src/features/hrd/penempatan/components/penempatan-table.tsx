import { useMemo } from "react";
import { Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/custom/data-table";
import { DataTablePagination } from "@/components/custom/data-table-pagination";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { usePenempatanTable } from "../hooks/usePenempatanTable";
import { type JobPlacement } from "../types/penempatan-schema";
import { cn } from "@/lib/utils";

export interface PenempatanTableProps {
  data?: JobPlacement[];
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onUpdateStatus?: (item: JobPlacement) => void;
  onView?: (item: JobPlacement) => void;
  onEdit?: (item: JobPlacement) => void;
  onDelete?: (item: JobPlacement) => void | Promise<void>;
  companyId?: string;
  year?: string | number;
  search?: string;
  refreshKey?: number;
  className?: string;
}

function renderStatusBadge(status?: string) {
  if (!status) return null;
  if (status === "-" || status === "—") {
    return (
      <Badge
        variant="outline"
        className="border-0 bg-transparent p-0 text-slate-400 font-bold text-base select-none leading-none shadow-none hover:bg-transparent rounded-none"
      >
        -
      </Badge>
    );
  }
  const s = status.toLowerCase();

  let colorClasses =
    "border-slate-400 text-slate-600 bg-white hover:bg-slate-50/50";

  if (s.includes("masih") || (s.includes("aktif") && !s.includes("non"))) {
    colorClasses =
      "border-emerald-500 text-emerald-600 bg-white hover:bg-emerald-50/50";
  } else if (s.includes("pindah")) {
    colorClasses = "border-blue-500 text-blue-600 bg-white hover:bg-blue-50/50";
  } else if (s.includes("belum") || s.includes("pending")) {
    colorClasses =
      "border-amber-400 text-amber-500 bg-white hover:bg-amber-50/50";
  } else if (
    s.includes("habis") ||
    s.includes("kontrak") ||
    s.includes("selesai") ||
    s.includes("resign")
  ) {
    colorClasses = "border-rose-400 text-rose-500 bg-white hover:bg-rose-50/50";
  } else if (
    s.includes("non-aktif") ||
    s.includes("non aktif") ||
    s.includes("keluar")
  ) {
    colorClasses =
      "border-slate-400 text-slate-600 bg-white hover:bg-slate-50/50";
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-3.5 py-1 text-xs font-semibold shadow-none select-none tracking-normal whitespace-nowrap",
        colorClasses,
      )}
    >
      {status}
    </Badge>
  );
}

function PenempatanMobileCardSkeleton() {
  return (
    <Card className="p-3.5 py-3.5 sm:p-4 sm:py-4 bg-white border border-slate-200/90 rounded-xl shadow-xs flex flex-col gap-3 w-full min-w-0 max-w-full overflow-hidden ring-0">
      <CardHeader className="flex flex-row items-start justify-between gap-2.5 p-0 border-none space-y-0">
        <CardContent className="flex flex-col gap-1.5 min-w-0 flex-1 p-0">
          <CardContent className="flex items-center gap-2 p-0">
            <Skeleton className="h-4 w-36 sm:w-44" />
            <Skeleton className="h-4 w-7 rounded" />
          </CardContent>
          <Skeleton className="h-3 w-28 sm:w-32" />
        </CardContent>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100 p-0">
        <CardContent className="flex flex-col gap-1.5 min-w-0 p-0">
          <Skeleton className="h-2.5 w-10" />
          <Skeleton className="h-3.5 w-24 sm:w-28" />
        </CardContent>
        <CardContent className="flex flex-col gap-1.5 min-w-0 p-0">
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-2.5 w-20" />
        </CardContent>
      </CardContent>

      <CardContent className="flex flex-col gap-1.5 pt-2.5 border-t border-slate-100 p-0">
        <Skeleton className="h-2.5 w-28" />
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 p-0">
          <CardContent className="flex items-center justify-between sm:flex-col sm:items-center p-2 rounded-lg bg-slate-50/70 border border-slate-100 min-w-0 gap-1.5">
            <Skeleton className="h-2.5 w-10" />
            <Skeleton className="h-5 w-28 sm:w-20 rounded-full" />
          </CardContent>
          <CardContent className="flex items-center justify-between sm:flex-col sm:items-center p-2 rounded-lg bg-slate-50/70 border border-slate-100 min-w-0 gap-1.5">
            <Skeleton className="h-2.5 w-10" />
            <Skeleton className="h-5 w-28 sm:w-20 rounded-full" />
          </CardContent>
          <CardContent className="flex items-center justify-between sm:flex-col sm:items-center p-2 rounded-lg bg-slate-50/70 border border-slate-100 min-w-0 gap-1.5">
            <Skeleton className="h-2.5 w-10" />
            <Skeleton className="h-5 w-28 sm:w-20 rounded-full" />
          </CardContent>
        </CardContent>
      </CardContent>

      <CardFooter className="p-0 pt-3 pb-4 sm:pb-4.5 px-0 border-t border-slate-100 bg-transparent border-x-0 border-b-0 rounded-none">
        <Skeleton className="h-8.5 w-full rounded-lg" />
      </CardFooter>
    </Card>
  );
}

export function PenempatanTable(props: PenempatanTableProps) {
  const { className } = props;
  const {
    data,
    loading,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    numberStartIndex,
    onPageChange,
    onPageSizeChange,
    handleAction,
    getPlacementRowDetails,
  } = usePenempatanTable(props);

  const columns = useMemo<DataTableColumn<JobPlacement>[]>(
    () => [
      {
        header: "PELAMAR KERJA",
        cell: (row) => {
          const { alumniName, subtitle } = getPlacementRowDetails(row);

          return (
            <CardContent className="flex flex-col gap-0.5 p-0">
              <CardTitle className="font-bold text-slate-900 text-sm leading-tight font-sans">
                {alumniName}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 font-medium leading-tight font-sans">
                {subtitle}
              </CardDescription>
            </CardContent>
          );
        },
      },
      {
        header: "POSISI",
        cell: (row) => {
          const { position } = getPlacementRowDetails(row);

          return (
            <CardContent className="flex flex-col gap-0.5 p-0">
              <CardTitle className="font-bold text-slate-900 text-sm leading-tight font-sans">
                {position}
              </CardTitle>
            </CardContent>
          );
        },
      },
      {
        header: "TGL DITERIMA & MASUK",
        cell: (row) => {
          const { acceptedText, startText } = getPlacementRowDetails(row);

          return (
            <CardContent className="flex flex-col gap-0.5 p-0">
              <CardTitle className="font-bold text-slate-900 text-sm leading-tight font-sans">
                Diterima : {acceptedText}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 font-medium leading-tight font-sans">
                Masuk : {startText}
              </CardDescription>
            </CardContent>
          );
        },
      },
      {
        header: "STATUS 3 BULAN",
        align: "center",
        headerClassName: "text-center",
        cell: (row) => {
          const { s3 } = getPlacementRowDetails(row);
          return (
            <CardContent className="flex justify-center p-0">
              {renderStatusBadge(s3)}
            </CardContent>
          );
        },
      },
      {
        header: "STATUS 6 BULAN",
        align: "center",
        headerClassName: "text-center",
        cell: (row) => {
          const { val6 } = getPlacementRowDetails(row);
          return (
            <CardContent className="flex justify-center p-0">
              {renderStatusBadge(val6)}
            </CardContent>
          );
        },
      },
      {
        header: "STATUS 12 BULAN",
        align: "center",
        headerClassName: "text-center",
        cell: (row) => {
          const { val12 } = getPlacementRowDetails(row);
          return (
            <CardContent className="flex justify-center p-0">
              {renderStatusBadge(val12)}
            </CardContent>
          );
        },
      },
      {
        header: "AKSI",
        align: "center",
        headerClassName: "text-center",
        cell: (row) => (
          <CardContent className="flex justify-center p-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAction?.(row)}
              className="h-8.5 rounded-lg border-[#D069D7]/40 bg-[#D069D7]/10 text-[#8D1D96] hover:bg-[#8D1D96] hover:border-[#8D1D96] hover:text-white gap-1.5 px-3.5 text-xs font-semibold shadow-none transition-colors select-none cursor-pointer"
            >
              <Pencil className="size-3.5" />
              Update Status
            </Button>
          </CardContent>
        ),
      },
    ],
    [handleAction, getPlacementRowDetails],
  );

  return (
    <CardContent
      className={cn(
        "theme-hrd w-full max-w-full min-w-0 flex flex-col gap-3 p-0",
        className,
      )}
    >
      <CardContent className="flex flex-col gap-3 md:hidden w-full max-w-full min-w-0 p-0">
        {loading ? (
          <>
            <PenempatanMobileCardSkeleton />
            <PenempatanMobileCardSkeleton />
            <PenempatanMobileCardSkeleton />
          </>
        ) : data.length === 0 ? (
          <Card className="p-8 py-8 text-center bg-white border border-slate-200/90 rounded-xl shadow-xs ring-0 gap-1">
            <CardTitle className="text-sm font-semibold text-slate-700 font-sans">
              Tidak ada data yang ditemukan
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-1 font-sans">
              Belum ada data penempatan kerja yang terdaftar.
            </CardDescription>
          </Card>
        ) : (
          data.map((row, idx) => {
            const {
              alumniName,
              major,
              yearVal,
              position,
              acceptedText,
              startText,
              s3,
              val6,
              val12,
            } = getPlacementRowDetails(row);

            return (
              <Card
                key={row.id ?? idx}
                className="p-3.5 py-3.5 sm:p-4 sm:py-4 bg-white border border-slate-200/90 rounded-xl shadow-xs flex flex-col gap-3 w-full min-w-0 max-w-full overflow-hidden ring-0"
              >
                <CardHeader className="flex flex-row items-start justify-between gap-2.5 p-0 border-none space-y-0">
                  <CardContent className="flex flex-col gap-0.5 min-w-0 flex-1 p-0">
                    <CardContent className="flex items-center gap-2 p-0">
                      <CardTitle className="font-bold text-slate-900 text-sm leading-tight font-sans truncate">
                        {alumniName}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="border-0 text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0 h-auto font-sans shadow-none"
                      >
                        #{numberStartIndex + idx}
                      </Badge>
                    </CardContent>
                    <CardDescription className="text-xs text-slate-500 font-medium truncate font-sans leading-tight">
                      {major} {yearVal ? `(${yearVal})` : ""}
                    </CardDescription>
                  </CardContent>
                </CardHeader>

                <CardContent className="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-slate-100 p-0">
                  <CardContent className="flex flex-col gap-0.5 min-w-0 p-0">
                    <Label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-sans leading-tight">
                      Posisi
                    </Label>
                    <CardTitle className="font-medium text-slate-800 text-xs truncate leading-tight font-sans">
                      {position}
                    </CardTitle>
                  </CardContent>
                  <CardContent className="flex flex-col gap-0.5 min-w-0 p-0">
                    <Label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-sans leading-tight">
                      TGL Diterima & Masuk
                    </Label>
                    <CardTitle className="font-medium text-slate-800 text-xs leading-tight font-sans truncate">
                      Diterima : {acceptedText}
                    </CardTitle>
                    <CardDescription className="text-[11px] text-slate-500 leading-tight font-sans truncate">
                      Masuk : {startText}
                    </CardDescription>
                  </CardContent>
                </CardContent>

                <CardContent className="flex flex-col gap-1.5 pt-2.5 border-t border-slate-100 p-0">
                  <Label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-sans">
                    Evaluasi Monitoring
                  </Label>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 p-0">
                    <CardContent className="flex items-center justify-between sm:flex-col sm:items-center sm:text-center p-2 rounded-lg bg-slate-50/70 border border-slate-100 min-w-0 gap-1">
                      <Label className="text-[10px] font-semibold text-slate-500 uppercase font-sans">
                        3 Bulan
                      </Label>
                      {renderStatusBadge(s3)}
                    </CardContent>
                    <CardContent className="flex items-center justify-between sm:flex-col sm:items-center sm:text-center p-2 rounded-lg bg-slate-50/70 border border-slate-100 min-w-0 gap-1">
                      <Label className="text-[10px] font-semibold text-slate-500 uppercase font-sans">
                        6 Bulan
                      </Label>
                      {renderStatusBadge(val6)}
                    </CardContent>
                    <CardContent className="flex items-center justify-between sm:flex-col sm:items-center sm:text-center p-2 rounded-lg bg-slate-50/70 border border-slate-100 min-w-0 gap-1">
                      <Label className="text-[10px] font-semibold text-slate-500 uppercase font-sans">
                        12 Bulan
                      </Label>
                      {renderStatusBadge(val12)}
                    </CardContent>
                  </CardContent>
                </CardContent>

                <CardFooter className="p-0 pt-3 pb-4 sm:pb-4.5 px-0 border-t border-slate-100 bg-transparent border-x-0 border-b-0 rounded-none">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction?.(row)}
                    className="w-full h-8.5 rounded-lg border-[#D069D7]/40 bg-[#D069D7]/10 text-[#8D1D96] hover:bg-[#8D1D96] hover:border-[#8D1D96] hover:text-white gap-1.5 text-xs font-semibold cursor-pointer transition-colors justify-center select-none"
                  >
                    <Pencil className="size-3.5" />
                    Update Status
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </CardContent>

      <Card className="hidden md:block w-full max-w-full overflow-hidden bg-white rounded-lg border border-slate-200/90 shadow-sm ring-0 py-0 gap-0">
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          showNumbering={true}
          numberStartIndex={numberStartIndex}
          className="rounded-none border-none shadow-none"
        />
      </Card>

      <Card className="bg-white rounded-lg border border-slate-200/90 shadow-xs overflow-hidden mb-6 md:mb-0 ring-0 py-0 gap-0">
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[10, 25, 50, 100]}
          role="hrd"
        />
      </Card>
    </CardContent>
  );
}
