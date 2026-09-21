import { useMemo } from "react";
import { Check, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/custom/data-table";
import { DataTablePagination } from "@/components/custom/table/data-table-pagination";
import { cn } from "@/lib/utils";
import { ReviewDecisionActions } from "./review-decision-actions";
import {
  ReviewApplicantCard,
  ReviewApplicantCardSkeleton,
  ReviewApplicantEmpty,
} from "./review-applicant-card";
import type { ReviewApplicant, ReviewDecision } from "./review.schema";
import {
  getReviewBadgeClasses,
  getReviewRowDetails,
  isSelectableRow,
} from "./review.status";

export interface ReviewTableProps {
  data: ReviewApplicant[];
  loading?: boolean;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  selectedIds: Array<string | number>;
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string | number, checked: boolean) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onDecide: (applicant: ReviewApplicant, decision: ReviewDecision) => void;
  className?: string;
}

function renderReviewStatus(status: ReviewApplicant["reviewStatus"], label: string) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-3.5 py-1 text-xs font-semibold whitespace-nowrap shadow-none select-none",
        getReviewBadgeClasses(status),
      )}
    >
      {label}
    </Badge>
  );
}

export function ReviewTable({
  data,
  loading = false,
  currentPage,
  pageSize,
  totalPages,
  totalItems,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onPageChange,
  onPageSizeChange,
  onDecide,
  className,
}: ReviewTableProps) {
  const numberStartIndex = (currentPage - 1) * pageSize + 1;

  const columns = useMemo<DataTableColumn<ReviewApplicant>[]>(
    () => [
      {
        header: "Pelamar & Kontak",
        cell: (row) => {
          const details = getReviewRowDetails(row);
          return (
            <CardContent className="flex flex-col gap-0.5 p-0">
              <CardTitle className="font-sans text-sm leading-tight font-bold text-slate-900">
                {details.applicantName}
              </CardTitle>
              <CardDescription className="font-sans text-xs leading-tight font-medium text-slate-500">
                {details.contactLine}
              </CardDescription>
            </CardContent>
          );
        },
      },
      {
        header: "Jurusan & Lulus",
        cell: (row) => {
          const details = getReviewRowDetails(row);
          return (
            <CardContent className="flex flex-col gap-0.5 p-0">
              <CardTitle className="font-sans text-sm leading-tight font-bold text-slate-900">
                {details.classLine}
              </CardTitle>
              <CardDescription className="font-sans text-xs leading-tight font-medium text-slate-500">
                {details.graduationLine}
              </CardDescription>
            </CardContent>
          );
        },
      },
      {
        header: "Posisi Dilamar",
        cell: (row) => {
          const details = getReviewRowDetails(row);
          return (
            <CardContent className="flex flex-col gap-0.5 p-0">
              <CardTitle className="font-sans text-sm leading-tight font-bold text-slate-900">
                {details.position}
              </CardTitle>
              <CardDescription className="font-sans text-xs leading-tight font-medium text-slate-500">
                Dilamar {details.appliedDateLabel}
              </CardDescription>
            </CardContent>
          );
        },
      },
      {
        header: "Dokumen Berkas",
        cell: (row) => {
          const details = getReviewRowDetails(row);
          if (!details.hasVerifiedDocument) {
            return <span className="text-xs font-semibold text-slate-400">-</span>;
          }
          const content = (
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-800">
              <span className="max-w-36 truncate">{details.documentName}{details.documentCount > 1 ? ` +${details.documentCount - 1}` : ""}</span>
              <Check className="size-4 shrink-0 stroke-3" />
            </span>
          );
          if (details.documentUrl) {
            return (
              <a
                href={details.documentUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="hover:underline"
              >
                {content}
              </a>
            );
          }
          return content;
        },
      },
      {
        header: "Status Saat Ini",
        align: "center",
        headerClassName: "text-center",
        cell: (row) => {
          const details = getReviewRowDetails(row);
          return (
            <CardContent className="flex justify-center p-0">
              {renderReviewStatus(details.status, details.statusLabel)}
            </CardContent>
          );
        },
      },
      {
        header: "Keputusan (Aksi HRD)",
        align: "center",
        headerClassName: "text-center",
        cell: (row) => {
          const details = getReviewRowDetails(row);
          return (
            <CardContent className="flex justify-center p-0">
              <ReviewDecisionActions applicant={row} status={details.status} onDecide={onDecide} />
            </CardContent>
          );
        },
      },
    ],
    [onDecide],
  );

  return (
    <div className={cn("theme-hrd flex w-full min-w-0 max-w-full flex-col gap-3", className)}>
      <div className="flex w-full min-w-0 max-w-full flex-col gap-3 p-0 md:hidden">
        {loading ? (
          <>
            <ReviewApplicantCardSkeleton />
            <ReviewApplicantCardSkeleton />
            <ReviewApplicantCardSkeleton />
          </>
        ) : data.length === 0 ? (
          <ReviewApplicantEmpty />
        ) : (
          data.map((row, idx) => (
            <ReviewApplicantCard
              key={row.id}
              row={row}
              numberLabel={numberStartIndex + idx}
              selected={selectedIds.includes(row.id)}
              onSelect={(id, checked) => onSelectRow(id, checked)}
              onDecide={onDecide}
            />
          ))
        )}
      </div>

      <Card className="hidden w-full max-w-full gap-0 overflow-hidden rounded-xl border border-slate-200/90 bg-white py-0 shadow-sm ring-0 md:block">
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          showNumbering={false}
          selectable
          selectedIds={selectedIds}
          onSelectAll={onSelectAll}
          onSelectRow={onSelectRow}
          getRowId={(row) => row.id}
          isRowSelectable={(row) => isSelectableRow(row)}
          variant="pill"
          role="hrd"
          className="rounded-none border-none shadow-none"
          emptyMessage="Tidak ada pelamar ditemukan"
          emptyDescription="Sesuaikan filter posisi atau status review."
          emptyIcon={<FileText className="h-8 w-8 text-slate-300" />}
        />
      </Card>

      <Card className="mb-6 gap-0 overflow-hidden rounded-xl border border-slate-200/90 bg-white py-0 shadow-xs ring-0 md:mb-0">
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
    </div>
  );
}
