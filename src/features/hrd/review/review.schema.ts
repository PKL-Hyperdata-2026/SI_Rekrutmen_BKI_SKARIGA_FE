import { z } from "zod";

export type ReviewStatusCode = "perlu_review" | "lolos_berkas" | "ditolak";

export type ReviewDecision = "lolos" | "tidak_lolos";

export interface ReviewApplicantDocument {
  id: string;
  title: string;
  originalFilename: string;
  categoryName?: string | null;
  fileUrl?: string | null;
  uploadedAt?: string | null;
}

export interface ReviewApplicantInfo {
  id: string;
  name: string;
  nis: string;
  email?: string | null;
  phone?: string | null;
}

export interface ReviewEducation {
  majorName?: string | null;
  majorCode?: string | null;
  className?: string | null;
  graduationYear?: string | number | null;
}

export interface ReviewVacancy {
  id: string;
  position: string;
  title: string;
  deadline?: string | null;
}

export interface ReviewSelectionResult {
  adminSelectionStatus?: string | null;
  notes?: string | null;
  updatedAt?: string | null;
}

export interface ReviewApplicant {
  id: string;
  appliedAt?: string | null;
  applicant: ReviewApplicantInfo | null;
  education: ReviewEducation | null;
  vacancy: ReviewVacancy | null;
  documents: ReviewApplicantDocument[];
  reviewStatus: ReviewStatusCode;
  reviewStatusLabel: string;
  selectionResult?: ReviewSelectionResult | null;
  status?: { code?: string | null; name?: string | null } | null;
  canScheduleTest: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ReviewSummary {
  total: number;
  perlu_review: number;
  lolos_berkas: number;
  ditolak: number;
}

export interface ReviewFilterOption {
  value: string;
  label: string;
  extra?: Record<string, string>;
}

export interface ReviewFilterOptions {
  vacancies: ReviewFilterOption[];
  review_statuses: ReviewFilterOption[];
}

export type ReviewStatusFilter = "semua" | ReviewStatusCode;

export interface GetReviewsParams {
  job_vacancy_id?: string;
  review_status?: ReviewStatusFilter;
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: "applied_at" | "name" | "position";
  sort_dir?: "asc" | "desc";
}

export interface ReviewPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ReviewListResult {
  rows: ReviewApplicant[];
  meta: ReviewPaginationMeta;
  summary: ReviewSummary;
  filterOptions: ReviewFilterOptions | null;
}

export const reviewDecisionSchema = z
  .object({
    decision: z.enum(["lolos", "tidak_lolos"], {
      message: "Keputusan review wajib dipilih.",
    }),
    notes: z
      .string()
      .max(1000, { message: "Catatan maksimal 1000 karakter." })
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (val) => {
      if (val.decision === "tidak_lolos") {
        return val.notes !== undefined && val.notes.trim().length > 0;
      }
      return true;
    },
    {
      message: "Alasan penolakan wajib diisi.",
      path: ["notes"],
    },
  );

export type ReviewDecisionValues = z.infer<typeof reviewDecisionSchema>;

export interface ReviewPayload {
  decision: ReviewDecision;
  notes?: string | null;
}

export function toReviewPayload(values: ReviewDecisionValues): ReviewPayload {
  const notes = (values.notes ?? "").trim();
  if (values.decision === "tidak_lolos") {
    return { decision: values.decision, notes };
  }
  return { decision: values.decision, notes: notes === "" ? null : notes };
}

export interface BulkReviewPayload extends ReviewPayload {
  application_ids: string[];
}

export function toBulkReviewPayload(
  ids: string[],
  values: ReviewDecisionValues,
): BulkReviewPayload {
  const base = toReviewPayload(values);
  return { application_ids: ids, decision: base.decision, notes: base.notes };
}

export interface ReviewDecisionFormDefaults {
  decision: ReviewDecision;
  notes: string;
}

export const defaultReviewDecisionValues: ReviewDecisionFormDefaults = {
  decision: "lolos",
  notes: "",
};
