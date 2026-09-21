import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ReviewDecisionActions } from "./review-decision-actions";
import type { ReviewApplicant, ReviewDecision } from "./review.schema";
import { getReviewBadgeClasses, getReviewRowDetails } from "./review.status";

export interface ReviewApplicantCardProps {
  row: ReviewApplicant;
  numberLabel: number;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onDecide: (applicant: ReviewApplicant, decision: ReviewDecision) => void;
  className?: string;
}

export function ReviewApplicantCard({
  row,
  numberLabel,
  selected,
  onSelect,
  onDecide,
  className,
}: ReviewApplicantCardProps) {
  const details = getReviewRowDetails(row);

  return (
    <Card className={cn("flex w-full min-w-0 max-w-full flex-col gap-3 overflow-hidden rounded-xl border border-slate-300 bg-white p-3.5 shadow-xs ring-0", className)}>
      <div className="flex items-start justify-between gap-2">
        <CardContent className="flex min-w-0 flex-1 flex-col gap-0.5 p-0">
          <CardTitle className="truncate font-sans text-sm leading-tight font-bold text-slate-900">
            #{numberLabel} {details.applicantName}
          </CardTitle>
          <CardDescription className="truncate font-sans text-xs text-slate-500">
            {details.contactLine}
          </CardDescription>
        </CardContent>
        {details.status === "perlu_review" ? (
          <input
            type="checkbox"
            aria-label={`Pilih ${details.applicantName}`}
            checked={selected}
            onChange={(event) => onSelect(row.id, event.target.checked)}
            className="mt-1 size-4 shrink-0 cursor-pointer rounded border-slate-300 accent-[#8D1D96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D1D96]"
          />
        ) : null}
      </div>
      <CardContent className="grid grid-cols-2 gap-2 border-t border-slate-100 p-0 pt-2.5 text-xs">
        <CardContent className="flex min-w-0 flex-col gap-0.5 p-0">
          <span className="font-sans text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
            Jurusan dan Lulus
          </span>
          <span className="font-sans text-xs font-bold text-slate-800">{details.classLine}</span>
          <span className="font-sans text-[11px] text-slate-500">{details.graduationLine}</span>
        </CardContent>
        <CardContent className="flex min-w-0 flex-col gap-0.5 p-0">
          <span className="font-sans text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
            Posisi
          </span>
          <span className="font-sans text-xs font-bold text-slate-800">{details.position}</span>
          <span className="font-sans text-[11px] text-slate-500">Dilamar {details.appliedDateLabel}</span>
        </CardContent>
      </CardContent>
      <CardContent className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 p-0 pt-2.5">
        <Badge
          variant="outline"
          className={cn("rounded-full px-3.5 py-1 text-xs font-semibold whitespace-nowrap shadow-none select-none", getReviewBadgeClasses(details.status))}
        >
          {details.statusLabel}
        </Badge>
        {details.hasVerifiedDocument ? (
          details.documentUrl ? (
            <a
              href={details.documentUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              title={details.documentName}
              className="max-w-44 truncate text-xs font-bold text-blue-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-700"
            >
              {details.documentName}{details.documentCount > 1 ? ` +${details.documentCount - 1}` : ""}
            </a>
          ) : (
            <span title={details.documentName} className="max-w-44 truncate text-xs font-bold text-slate-600">
              {details.documentName}{details.documentCount > 1 ? ` +${details.documentCount - 1}` : ""}
            </span>
          )
        ) : (
          <span className="text-xs font-semibold text-slate-400">Tanpa berkas</span>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 border-t border-slate-100 bg-transparent p-0 pt-3">
        <ReviewDecisionActions applicant={row} status={details.status} layout="stack" onDecide={onDecide} />
      </CardFooter>
    </Card>
  );
}

export function ReviewApplicantCardSkeleton() {
  return (
    <Card className="flex w-full flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="size-6 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2.5">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <Skeleton className="h-8 w-full rounded-lg" />
    </Card>
  );
}

export function ReviewApplicantEmpty() {
  return (
    <Card className="border border-slate-200 bg-white p-8 text-center shadow-xs ring-0">
      <FileText className="mx-auto mb-2 h-8 w-8 text-slate-400" />
      <CardTitle className="font-sans text-sm font-semibold text-slate-700">
        Tidak ada pelamar ditemukan
      </CardTitle>
      <CardDescription className="mt-1 font-sans text-xs text-slate-500">
        Sesuaikan filter posisi atau status review.
      </CardDescription>
    </Card>
  );
}
