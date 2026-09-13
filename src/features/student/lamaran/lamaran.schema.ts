import { z } from "zod";

export const jobVacancyInfoSchema = z.object({
  id: z.number(),
  title: z.string(),
  position: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(),
  companyLogo: z.string().nullable().optional(),
  workLocation: z.string().nullable().optional(),
  deadline: z.string().nullable().optional(),
});
export type JobVacancyInfo = z.infer<typeof jobVacancyInfoSchema>;

export const standardStatusSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
});
export type StandardStatus = z.infer<typeof standardStatusSchema>;

export const stageInfoSchema = z.object({
  id: z.number(),
  name: z.string(),
  order: z.number().optional(),
  agendaName: z.string().nullable().optional(),
  scheduledAt: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  instructions: z.string().nullable().optional(),
});
export type StageInfo = z.infer<typeof stageInfoSchema>;

export const stageHistorySchema = z.object({
  id: z.number(),
  stage: stageInfoSchema.nullable().optional(),
  status: standardStatusSchema.nullable().optional(),
  assessorName: z.string().nullable().optional(),
  score: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
});
export type StageHistory = z.infer<typeof stageHistorySchema>;

export const placementInfoSchema = z.object({
  id: z.number().optional(),
  acceptedDate: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});
export type PlacementInfo = z.infer<typeof placementInfoSchema>;

export const selectionResultInfoSchema = z.object({
  id: z.number().optional(),
  decision: z.string().nullable().optional(),
  letterUrl: z.string().nullable().optional(),
});
export type SelectionResultInfo = z.infer<typeof selectionResultInfoSchema>;

export const studentJobApplicationSchema = z.object({
  id: z.number(),
  jobVacancyId: z.number().optional(),
  vacancy: jobVacancyInfoSchema.optional(),
  status: standardStatusSchema.optional(),
  currentStage: stageInfoSchema.nullable().optional(),
  appliedAt: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  stageHistories: z.array(stageHistorySchema).optional(),
  placement: placementInfoSchema.nullable().optional(),
  selectionResult: selectionResultInfoSchema.nullable().optional(),
  createdAt: z.string().nullable().optional(),
});
export type StudentJobApplication = z.infer<typeof studentJobApplicationSchema>;

export interface StudentJobApplicationFilters {
  status_id?: number;
  page?: number;
  per_page?: number;
}

export interface PaginationMeta {
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  from?: number | null;
  to?: number | null;
}

export interface StudentJobApplicationListResponse {
  success: boolean;
  message: string;
  data:
    | {
        data: StudentJobApplication[];
        meta?: PaginationMeta;
        links?: Record<string, string | null>;
        current_page?: number;
        last_page?: number;
        total?: number;
      }
    | StudentJobApplication[];
}

export interface StudentJobApplicationDetailResponse {
  success: boolean;
  message: string;
  data: StudentJobApplication;
}
