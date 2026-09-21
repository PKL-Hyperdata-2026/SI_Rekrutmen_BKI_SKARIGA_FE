import { z } from "zod";

export const selectionResultItemSchema = z.object({
  id: z.string(),
  applicationId: z.string(),
  applicant: z.object({
    id: z.string().nullable().optional(),
    name: z.string(),
    nis: z.string(),
    school: z.string().optional(),
    majorName: z.string().nullable().optional(),
    graduationYear: z.number().nullable().optional(),
  }),
  vacancy: z.object({
    id: z.string().nullable().optional(),
    title: z.string(),
    position: z.string(),
  }),
  adminSelectionStatus: z.string(),
  psychotestScore: z.number().nullable().optional(),
  interviewScore: z.number().nullable().optional(),
  mcuScore: z.number().nullable().optional(),
  finalScore: z.number().nullable().optional(),
  decision: z.enum(["diterima", "tidak_diterima", "cadangan", "pending"]),
  status: z.enum(["draft", "published"]),
  notes: z.string().nullable().optional(),
  letterPath: z.string().nullable().optional(),
  letterUrl: z.string().nullable().optional(),
  appliedAt: z.string().nullable().optional(),
});

export type SelectionResultItem = z.infer<typeof selectionResultItemSchema>;

export const selectionResultSummarySchema = z.object({
  total: z.number(),
  lolos: z.number(),
  gagal: z.number(),
  cadangan: z.number(),
});

export type SelectionResultSummary = z.infer<typeof selectionResultSummarySchema>;

export const evaluationModalSchema = z.object({
  application_id: z.string(),
  admin_selection_status: z.enum(["lolos", "tidak_lolos"]),
  psychotest_score: z.string().optional(),
  interview_score: z.string().optional(),
  mcu_score: z.string().optional(),
  decision: z.enum(["diterima", "tidak_diterima", "cadangan", "pending"]),
  notes: z.string().max(1000).optional(),
});

export type EvaluationModalFormValues = z.infer<typeof evaluationModalSchema>;

export interface SelectionResultFilterParams {
  job_vacancy_id?: string;
  decision?: string;
  search?: string;
  per_page?: number;
  page?: number;
}
