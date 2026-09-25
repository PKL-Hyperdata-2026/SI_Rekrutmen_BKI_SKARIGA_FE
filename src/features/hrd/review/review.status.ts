import type { ReviewApplicant, ReviewStatusCode } from "./review.schema";

export function normalizeReviewStatus(value: unknown): ReviewStatusCode {
  if (value === "lolos_berkas") return "lolos_berkas";
  if (value === "ditolak") return "ditolak";
  return "perlu_review";
}

export function isSelectableRow(row: Pick<ReviewApplicant, "reviewStatus">): boolean {
  return normalizeReviewStatus(row.reviewStatus) === "perlu_review";
}

export function filterSelectableIds(ids: string[], eligible: Set<string>): string[] {
  return ids.filter((id) => eligible.has(id));
}

export function getReviewStatusLabel(status: ReviewStatusCode): string {
  if (status === "lolos_berkas") return "Lolos Berkas";
  if (status === "ditolak") return "Ditolak";
  return "Perlu Review";
}

export function getReviewBadgeClasses(status: ReviewStatusCode): string {
  if (status === "lolos_berkas") {
    return "border-emerald-700 text-emerald-800 bg-white hover:bg-emerald-50/50";
  }
  if (status === "ditolak") {
    return "border-rose-500 text-rose-700 bg-white hover:bg-rose-50/50";
  }
  return "border-amber-500 text-amber-800 bg-white hover:bg-amber-50/50";
}

export function formatGraduationLine(
  graduationYear: string | number | null | undefined,
): string {
  if (graduationYear === null || graduationYear === undefined) return "-";
  const year = String(graduationYear).trim();
  if (year === "") return "-";
  return `Lulus T.A ${year}`;
}

export function formatContactLine(applicant: ReviewApplicant["applicant"]): string {
  if (!applicant) return "-";
  const nis = (applicant.nis ?? "").trim() === "" ? "-" : applicant.nis;
  const phone = (applicant.phone ?? "").trim();
  return phone === "" ? `NISN : ${nis}` : `NISN : ${nis} - ${phone}`;
}

export function formatAppliedDateLabel(value: string | null | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export interface ReviewRowDetails {
  applicantName: string;
  contactLine: string;
  classLine: string;
  graduationLine: string;
  position: string;
  documentName: string;
  documentUrl: string | null;
  documentCount: number;
  appliedDateLabel: string;
  hasVerifiedDocument: boolean;
  status: ReviewStatusCode;
  statusLabel: string;
}

export function getReviewRowDetails(row: ReviewApplicant): ReviewRowDetails {
  const applicantName =
    row.applicant?.name?.trim() !== "" ? String(row.applicant?.name) : "-";
  const classLine =
    row.education?.className?.trim() !== "" && row.education?.className
      ? String(row.education.className)
      : (row.education?.majorName ?? "-");
  const graduationLine = formatGraduationLine(row.education?.graduationYear);
  const position =
    row.vacancy?.position?.trim() !== "" ? String(row.vacancy?.position) : "-";
  const firstDoc = row.documents?.[0];
  const documentName = firstDoc
    ? firstDoc.originalFilename?.trim() !== ""
      ? firstDoc.originalFilename
      : firstDoc.title
    : "-";
  const status = normalizeReviewStatus(row.reviewStatus);

  return {
    applicantName,
    contactLine: formatContactLine(row.applicant),
    classLine,
    graduationLine,
    position,
    documentName,
    documentUrl: firstDoc?.fileUrl ?? null,
    documentCount: Array.isArray(row.documents) ? row.documents.length : 0,
    appliedDateLabel: formatAppliedDateLabel(row.appliedAt),
    hasVerifiedDocument: Boolean(firstDoc),
    status,
    statusLabel: getReviewStatusLabel(status),
  };
}
