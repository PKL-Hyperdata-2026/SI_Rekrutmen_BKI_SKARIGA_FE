import { useMemo } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
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
import { cn } from "@/lib/utils";
import {
  type AttendanceItem,
  cleanVacancyTitle,
} from "./validasi-presensi.schema";
import { ValidasiPresensiTableLogMobileCards } from "./validasi-presensi-table-log-mobile";
import {
  formatAttendanceParts,
  formatAttendanceTime,
  getInitials,
} from "./use-validasi-presensi-table-log";

export interface ValidasiPresensiTableLogProps {
  data: AttendanceItem[];
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
}

export interface UseValidasiPresensiTableLogColumnsParams {
  currentPage?: number;
  pageSize?: number;
}

function useValidasiPresensiTableLogColumns({
  currentPage = 1,
  pageSize = 10,
}: UseValidasiPresensiTableLogColumnsParams) {
  const columns = useMemo<DataTableColumn<AttendanceItem>[]>(
    () => [
      {
        header: "PELAMAR",
        className:
          "max-w-[125px] 2xl:max-w-none min-w-[105px] px-2.5 2xl:px-4 cursor-default",
        headerClassName: "min-w-[105px] px-2.5 2xl:px-4 select-none",
        cell: (row) => (
          <CardContent className="flex items-center p-0 min-w-0 cursor-default">
            <CardTitle
              className="font-bold text-slate-900 text-sm leading-tight font-sans truncate cursor-default"
              title={row.applicant.name || "-"}
            >
              {row.applicant.name || "-"}
            </CardTitle>
          </CardContent>
        ),
      },
      {
        header: "PERUSAHAAN",
        className:
          "max-w-[125px] 2xl:max-w-none min-w-[105px] px-2.5 2xl:px-4 cursor-default",
        headerClassName: "min-w-[105px] px-2.5 2xl:px-4 select-none",
        cell: (row) => (
          <CardContent className="flex items-center p-0 min-w-0 cursor-default">
            <CardDescription
              className="font-bold text-slate-900 text-sm leading-tight font-sans truncate cursor-default"
              title={
                row.vacancy.companyName ||
                cleanVacancyTitle(row.vacancy.title || "-")
              }
            >
              {row.vacancy.companyName ||
                cleanVacancyTitle(row.vacancy.title || "-")}
            </CardDescription>
          </CardContent>
        ),
      },
      {
        header: "WAKTU PRESENSI",
        className: "whitespace-nowrap px-2.5 2xl:px-4 cursor-default",
        headerClassName: "whitespace-nowrap px-2.5 2xl:px-4 select-none",
        cell: (row) => {
          const parts = formatAttendanceParts(
            row.validation.validatedAt || row.attendedAt,
          );
          return (
            <CardContent className="flex flex-col text-left p-0 min-w-0 cursor-default">
              <CardDescription className="font-bold text-slate-900 text-xs sm:text-sm leading-tight font-sans cursor-default">
                {parts.date}
              </CardDescription>
              {parts.time ? (
                <CardDescription className="text-[11px] font-medium text-slate-500 leading-tight cursor-default">
                  {parts.time}
                </CardDescription>
              ) : null}
            </CardContent>
          );
        },
      },
      {
        header: "KEPUTUSAN ADMIN",
        align: "center",
        headerClassName:
          "text-center whitespace-nowrap px-2 2xl:px-4 select-none",
        className: "text-center whitespace-nowrap px-2 2xl:px-4 cursor-default",
        cell: (row) => {
          const isVerified = row.validation.status === "verified";

          if (isVerified) {
            return (
              <CardContent className="flex justify-center p-0 cursor-default">
                <Badge
                  variant="outline"
                  className="bg-emerald-50/80 text-emerald-600 border border-emerald-300 rounded-full px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold inline-flex items-center gap-1.5 shadow-none whitespace-nowrap cursor-default"
                >
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  Hadir
                </Badge>
              </CardContent>
            );
          }

          return (
            <CardContent className="flex justify-center p-0 cursor-default">
              <Badge
                variant="outline"
                className="bg-rose-50/80 text-rose-600 border border-rose-300 rounded-full px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold inline-flex items-center gap-1.5 shadow-none whitespace-nowrap cursor-default"
              >
                <XCircle className="size-3.5 shrink-0" />
                Tidak Hadir
              </Badge>
            </CardContent>
          );
        },
      },
      {
        header: "TINDAK LANJUT SISTEM",
        align: "left",
        headerClassName:
          "text-left whitespace-nowrap min-w-[140px] px-2.5 2xl:px-4 select-none",
        className:
          "text-left min-w-0 max-w-[180px] 2xl:max-w-none px-2.5 2xl:px-4 cursor-default",
        cell: (row) => {
          const isVerified = row.validation.status === "verified";
          const actionText = isVerified
            ? "Diteruskan ke HRD"
            : "Gugur / Tidak Hadir";

          return (
            <CardContent className="flex items-center p-0 min-w-0 cursor-default">
              <CardDescription
                className="font-medium text-slate-700 text-sm leading-tight font-sans truncate cursor-default"
                title={actionText}
              >
                {actionText}
              </CardDescription>
            </CardContent>
          );
        },
      },
    ],
    [],
  );

  const numberStartIndex = (currentPage - 1) * pageSize + 1;

  return {
    columns,
    numberStartIndex,
  };
}

export function ValidasiPresensiTableLog({
  data,
  loading = false,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  className,
}: ValidasiPresensiTableLogProps) {
  const { columns, numberStartIndex } = useValidasiPresensiTableLogColumns({
    currentPage,
    pageSize,
  });

  return (
    <CardContent
      className={cn(
        "theme-admin w-full max-w-full min-w-0 flex flex-col gap-3 p-0 overflow-hidden",
        className,
      )}
    >
      <CardContent className="flex flex-col gap-1 p-0 min-w-0 w-full max-w-full overflow-hidden">
        <CardTitle className="text-base sm:text-lg font-bold text-slate-900 font-sans tracking-tight wrap-break-word whitespace-normal leading-snug">
          Riwayat Hasil Validasi Presensi
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 font-medium font-sans wrap-break-word whitespace-normal leading-relaxed">
          Log keputusan verifikasi kehadiran yang dikirimkan ke HRD atau Sistem
          Automasi
        </CardDescription>
      </CardContent>

      <ValidasiPresensiTableLogMobileCards
        data={data}
        loading={loading}
        formatAttendanceTime={formatAttendanceTime}
        getInitials={getInitials}
      />

      <CardContent className="hidden md:block w-full overflow-x-auto min-w-0 cursor-default p-0">
        <Card className="w-full min-w-full bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-hidden flex flex-col p-0 gap-0 ring-0 cursor-default **:cursor-default">
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            showNumbering={true}
            numberStartIndex={numberStartIndex}
            rowClassName="cursor-default"
            className="rounded-none border-none shadow-none min-w-full cursor-default"
          />
        </Card>
      </CardContent>

      <Card className="bg-white rounded-lg border border-slate-200/90 shadow-xs overflow-hidden mb-6 md:mb-0 p-0 gap-0 ring-0 w-full max-w-full min-w-0">
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
    </CardContent>
  );
}
