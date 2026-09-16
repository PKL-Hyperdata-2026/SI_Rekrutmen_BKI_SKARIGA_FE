import { useMemo, useCallback } from "react";
import { Loader2, Check, X } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type AttendanceItem,
  cleanVacancyTitle,
} from "../types/validasi-presensi-schema";
import { ValidasiPresensiMobileCards } from "./validasi-presensi-mobile-cards";
import { ValidasiPresensiRejectButton } from "./validasi-presensi-reject";
import { ValidasiPresensiInfoButton } from "./validasi-presensi-info";
import {
  formatTestSchedule,
  formatTestScheduleParts,
  getInitials,
} from "../hooks/useValidasiPresensiTable";

const DEFAULT_SELECTED_IDS: (string | number)[] = [];

export interface ValidasiPresensiTableProps {
  data: AttendanceItem[];
  loading?: boolean;
  selectedIds?: (string | number)[];
  isBulking?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSelectRow?: (id: string | number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  onBulkValidate?: (status: "verified" | "rejected") => void | Promise<void>;
  className?: string;
}

export interface UseValidasiPresensiTableColumnsParams {
  currentPage?: number;
  pageSize?: number;
  selectedIds?: (string | number)[];
  onBulkValidate?: (status: "verified" | "rejected") => void | Promise<void>;
}

function useValidasiPresensiTableColumns({
  currentPage = 1,
  pageSize = 10,
  selectedIds = DEFAULT_SELECTED_IDS,
  onBulkValidate,
}: UseValidasiPresensiTableColumnsParams) {
  const columns = useMemo<DataTableColumn<AttendanceItem>[]>(
    () => [
      {
        header: "PELAMAR",
        className:
          "max-w-[125px] 2xl:max-w-none min-w-[105px] px-2.5 2xl:px-4 cursor-pointer",
        headerClassName: "min-w-[105px] px-2.5 2xl:px-4 select-none",
        cell: (row) => (
          <CardContent className="flex items-center p-0 min-w-0 cursor-pointer">
            <CardTitle
              className="font-bold text-slate-900 text-sm leading-tight font-sans truncate cursor-pointer"
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
          "max-w-[125px] 2xl:max-w-none min-w-[105px] px-2.5 2xl:px-4 cursor-pointer",
        headerClassName: "min-w-[105px] px-2.5 2xl:px-4 select-none",
        cell: (row) => (
          <CardContent className="flex items-center p-0 min-w-0 cursor-pointer">
            <CardDescription
              className="font-bold text-slate-900 text-sm leading-tight font-sans truncate cursor-pointer"
              title={row.vacancy.companyName || "-"}
            >
              {row.vacancy.companyName || "-"}
            </CardDescription>
          </CardContent>
        ),
      },
      {
        header: "LOWONGAN",
        className:
          "max-w-[140px] 2xl:max-w-none min-w-[115px] px-2.5 2xl:px-4 cursor-pointer",
        headerClassName: "min-w-[115px] px-2.5 2xl:px-4 select-none",
        cell: (row) => (
          <CardContent className="flex items-center p-0 min-w-0 cursor-pointer">
            <CardDescription
              className="font-bold text-slate-900 text-sm leading-tight font-sans truncate cursor-pointer"
              title={cleanVacancyTitle(row.vacancy.title || "-")}
            >
              {cleanVacancyTitle(row.vacancy.title || "-")}
            </CardDescription>
          </CardContent>
        ),
      },
      {
        header: "JADWAL TES",
        className: "whitespace-nowrap px-2.5 2xl:px-4 cursor-pointer",
        headerClassName: "whitespace-nowrap px-2.5 2xl:px-4 select-none",
        cell: (row) => {
          const parts = formatTestScheduleParts(
            row.stage.scheduledAt || row.attendedAt,
          );
          return (
            <CardContent className="flex flex-col text-left p-0 min-w-0 cursor-pointer">
              <CardDescription className="font-bold text-slate-900 text-xs sm:text-sm leading-tight font-sans cursor-pointer">
                {parts.date}
              </CardDescription>
              {parts.time ? (
                <CardDescription className="text-[11px] font-medium text-slate-500 leading-tight cursor-pointer">
                  {parts.time}
                </CardDescription>
              ) : null}
            </CardContent>
          );
        },
      },
      {
        header: "AKSI",
        align: "center",
        headerClassName:
          "text-center whitespace-nowrap min-w-[125px] px-2.5 2xl:px-4 select-none",
        className: "text-center whitespace-nowrap px-2.5 2xl:px-4",
        cell: (row) => (
          <CardContent className="flex items-center justify-center p-0 whitespace-nowrap">
            <ValidasiPresensiInfoButton item={row} label="Detail Pelamar" />
          </CardContent>
        ),
      },
    ],
    [],
  );

  const numberStartIndex = (currentPage - 1) * pageSize + 1;
  const hasSelection = selectedIds.length > 0;
  const selectedCount = selectedIds.length;

  const handleBulkVerify = useCallback(() => {
    onBulkValidate?.("verified");
  }, [onBulkValidate]);

  const handleBulkReject = useCallback(() => {
    onBulkValidate?.("rejected");
  }, [onBulkValidate]);

  const rejectTitle = `Tolak Presensi (${selectedCount} Pelamar)?`;
  const rejectDescription =
    "Semua pelamar yang dipilih akan ditandai gugur / tidak hadir.";

  const getRowId = useCallback((row: AttendanceItem) => row.id, []);

  return {
    columns,
    numberStartIndex,
    hasSelection,
    selectedCount,
    handleBulkVerify,
    handleBulkReject,
    rejectTitle,
    rejectDescription,
    getRowId,
  };
}

export function ValidasiPresensiTable(props: ValidasiPresensiTableProps) {
  const {
    data,
    loading = false,
    selectedIds = DEFAULT_SELECTED_IDS,
    isBulking = false,
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    pageSize = 10,
    onPageChange,
    onPageSizeChange,
    onSelectRow,
    onSelectAll,
    onBulkValidate,
    className,
  } = props;

  const {
    columns,
    numberStartIndex,
    hasSelection,
    selectedCount,
    handleBulkVerify,
    handleBulkReject,
    rejectTitle,
    rejectDescription,
    getRowId,
  } = useValidasiPresensiTableColumns({
    currentPage,
    pageSize,
    selectedIds,
    onBulkValidate,
  });

  return (
    <CardContent
      className={cn(
        "theme-admin w-full max-w-full min-w-0 flex flex-col gap-3 p-0 overflow-hidden scheme-light",
        className,
      )}
    >
      <CardContent className="flex flex-col gap-1 p-0 min-w-0 w-full max-w-full overflow-hidden">
        <CardTitle className="text-base sm:text-lg font-bold text-slate-900 font-sans tracking-tight wrap-break-word whitespace-normal leading-snug">
          Kehadiran Pelamar Kerja
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 font-medium font-sans wrap-break-word whitespace-normal leading-relaxed">
          Daftar antrean presensi kehadiran pelamar kerja yang memerlukan
          validasi admin
        </CardDescription>
      </CardContent>

      {hasSelection ? (
        <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-purple-50/80 border border-purple-200/90 rounded-lg shadow-xs ring-0">
          <CardContent className="flex items-center gap-2 p-0">
            <Badge
              variant="outline"
              className="bg-white text-purple-700 border-purple-200 rounded-md px-2.5 py-1 text-xs font-bold shadow-xs"
            >
              {selectedCount}
            </Badge>
            <CardDescription className="text-xs sm:text-sm font-semibold text-purple-900 font-sans">
              Pelamar kerja dipilih
            </CardDescription>
          </CardContent>
          <CardContent className="flex items-center gap-2 flex-wrap p-0">
            <Button
              type="button"
              size="sm"
              disabled={isBulking}
              onClick={handleBulkVerify}
              className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 shadow-none cursor-pointer"
            >
              {isBulking ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Check className="size-3.5" strokeWidth={2.5} />
              )}
              Validasi Hadir
            </Button>

            <ValidasiPresensiRejectButton
              title={rejectTitle}
              description={rejectDescription}
              disabled={isBulking}
              isLoading={isBulking}
              onConfirm={handleBulkReject}
              align="end"
              side="bottom"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isBulking}
                className="h-8 rounded-lg border-rose-200 bg-rose-50/60 text-rose-600 hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300 font-semibold text-xs gap-1.5 shadow-none cursor-pointer"
              >
                {isBulking ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <X className="size-3.5" strokeWidth={2.5} />
                )}
                Tolak
              </Button>
            </ValidasiPresensiRejectButton>
          </CardContent>
        </Card>
      ) : null}

      <ValidasiPresensiMobileCards
        data={data}
        loading={loading}
        selectedIds={selectedIds}
        numberStartIndex={numberStartIndex}
        formatTestSchedule={formatTestSchedule}
        getInitials={getInitials}
        onSelectRow={onSelectRow}
        onSelectAll={onSelectAll}
      />

      <CardContent className="hidden md:block w-full overflow-x-auto min-w-0 scheme-light cursor-pointer p-0">
        <Card className="w-full min-w-full bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-hidden flex flex-col p-0 gap-0 ring-0 scheme-light [&_input[type=checkbox]]:scheme-light [&_input[type=checkbox]]:accent-[#7C3AED] [&_input[type=checkbox]]:size-4.5 [&_input[type=checkbox]]:rounded-md [&_input[type=checkbox]]:border-slate-300 [&_input[type=checkbox]]:cursor-pointer [&_input[type=checkbox]]:transition-transform [&_input[type=checkbox]:hover]:scale-110 cursor-pointer">
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            showNumbering={true}
            numberStartIndex={numberStartIndex}
            selectable={true}
            selectedIds={selectedIds}
            onSelectRow={onSelectRow}
            onSelectAll={onSelectAll}
            rowClassName="cursor-pointer [&_*]:cursor-pointer"
            getRowId={getRowId}
            className="rounded-none border-none shadow-none min-w-full scheme-light [&_input[type=checkbox]]:scheme-light [&_input[type=checkbox]]:accent-[#7C3AED] [&_input[type=checkbox]]:size-4.5 [&_input[type=checkbox]]:rounded-md [&_input[type=checkbox]]:border-slate-300 [&_input[type=checkbox]]:cursor-pointer [&_input[type=checkbox]]:transition-transform [&_input[type=checkbox]:hover]:scale-110 cursor-pointer"
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
