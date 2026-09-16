import { z } from "zod";

export const careerStatusEnum = z.enum([
  "bekerja",
  "wirausaha",
  "lanjut_studi",
  "mencari_pekerjaan",
]);

export type CareerStatus = z.infer<typeof careerStatusEnum>;

export const studentTracerStudySchema = z.object({
  career_status: careerStatusEnum,
  company_name: z.string(),
  job_title: z.string(),
  minimum_salary: z.string(),
  maximum_salary: z.string(),
  waiting_period: z.string(),
  start_date: z.string(),
  business_name: z.string(),
  business_address: z.string(),
  instagram_handle: z.string(),
  average_income: z.string(),
  business_field: z.string(),
  business_start_date: z.string(),
  university_name: z.string(),
  study_program: z.string(),
}).superRefine((data, ctx) => {
  if (data.career_status === "bekerja") {
    if (!data.company_name.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["company_name"],
        message: "Nama perusahaan/tempat kerja wajib diisi.",
      });
    }
    if (!data.job_title.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["job_title"],
        message: "Jabatan/posisi wajib diisi.",
      });
    }
  } else if (data.career_status === "wirausaha") {
    if (!data.business_name.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["business_name"],
        message: "Nama usaha/bisnis wajib diisi.",
      });
    }
    if (!data.business_field.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["business_field"],
        message: "Bidang usaha wajib dipilih.",
      });
    }
  } else if (data.career_status === "lanjut_studi") {
    if (!data.university_name.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["university_name"],
        message: "Nama perguruan tinggi/instansi wajib diisi.",
      });
    }
    if (!data.study_program.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["study_program"],
        message: "Program studi wajib diisi.",
      });
    }
  }
});

export type TracerStudyFormData = z.infer<typeof studentTracerStudySchema>;

export interface TracerStudyData {
  id: number;
  studentAlumniId: number;
  careerStatus: CareerStatus;
  companyName?: string | null;
  jobTitle?: string | null;
  minimumSalary?: number | null;
  maximumSalary?: number | null;
  waitingPeriod?: string | null;
  startDate?: string | null;
  businessName?: string | null;
  businessAddress?: string | null;
  instagramAccount?: string | null;
  averageRevenue?: string | null;
  businessField?: string | null;
  businessStartDate?: string | null;
  universityName?: string | null;
  studyProgram?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubmitTracerPayload {
  career_status: CareerStatus;
  company_name?: string | null;
  job_title?: string | null;
  minimum_salary?: number | null;
  maximum_salary?: number | null;
  waiting_period?: string | null;
  start_date?: string | null;
  business_name?: string | null;
  business_address?: string | null;
  instagram_handle?: string | null;
  average_income?: string | null;
  business_field?: string | null;
  business_start_date?: string | null;
  university_name?: string | null;
  study_program?: string | null;
}

export const WAITING_PERIOD_OPTIONS = [
  "< 1 Bulan",
  "1 - 3 Bulan",
  "3 - 6 Bulan",
  "> 6 Bulan",
] as const;

export const AVERAGE_INCOME_OPTIONS = [
  "< 1.500.000",
  "1.500.000 - 5.000.000",
  "5.000.000 - 10.000.000",
  "> 10.000.000",
] as const;

export const BUSINESS_FIELD_OPTIONS = [
  "Kuliner",
  "IT",
  "Wisata",
  "Lainnya",
] as const;
