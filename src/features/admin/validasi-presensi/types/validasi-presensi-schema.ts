import { z } from "zod";

export const opaqueIdSchema = z.union([z.string(), z.number()]);

export type OpaqueId = z.infer<typeof opaqueIdSchema>;

export const vacancyOptionSchema = z.object({
  id: opaqueIdSchema,
  title: z.string(),
  company_name: z.string().nullable().optional(),
  label: z.string(),
});

export const vacancyOptionsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(vacancyOptionSchema),
});

export type VacancyOption = z.infer<typeof vacancyOptionSchema>;

export const attendanceApplicantSchema = z.object({
  id: opaqueIdSchema.nullable().optional(),
  name: z.string().nullable().optional(),
  nis: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  majorCode: z.string().nullable().optional(),
  majorName: z.string().nullable().optional(),
  graduationYear: z.number().nullable().optional(),
});

export const attendanceVacancySchema = z.object({
  id: opaqueIdSchema.nullable().optional(),
  title: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(),
});

export const attendanceStageSchema = z.object({
  id: opaqueIdSchema.nullable().optional(),
  name: z.string().nullable().optional(),
  sequenceOrder: z.number().nullable().optional(),
  scheduledAt: z.string().nullable().optional(),
});

export const attendanceValidationSchema = z.object({
  status: z.string(),
  validatedAt: z.string().nullable().optional(),
  validatedByName: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  systemAction: z.string().nullable().optional(),
});

export const attendanceItemSchema = z.object({
  id: opaqueIdSchema,
  applicant: attendanceApplicantSchema,
  vacancy: attendanceVacancySchema,
  stage: attendanceStageSchema,
  attendedAt: z.string().nullable().optional(),
  validation: attendanceValidationSchema,
  createdAt: z.string().nullable().optional(),
});

export type AttendanceItem = z.infer<typeof attendanceItemSchema>;

export const attendancePaginationMetaSchema = z.object({
  current_page: z.number(),
  from: z.number().nullable().optional(),
  last_page: z.number(),
  per_page: z.number(),
  to: z.number().nullable().optional(),
  total: z.number(),
});

export const attendanceQueueDataSchema = z.union([
  z.object({
    data: z.array(attendanceItemSchema),
    meta: attendancePaginationMetaSchema.optional(),
  }),
  z.array(attendanceItemSchema),
]);

export const attendanceQueueResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: attendanceQueueDataSchema,
});

export function cleanVacancyTitle(title: string): string {
  const trimmed = title.trim();
  const lower = trimmed.toLowerCase();

  if (lower.startsWith("lowongan kerja ")) {
    return trimmed.slice(15).trim();
  }
  if (lower.startsWith("lowongan ")) {
    return trimmed.slice(9).trim();
  }
  if (lower.startsWith("lowongan - ")) {
    return trimmed.slice(11).trim();
  }
  if (lower.startsWith("lowongan-")) {
    return trimmed.slice(9).trim();
  }
  return trimmed;
}
