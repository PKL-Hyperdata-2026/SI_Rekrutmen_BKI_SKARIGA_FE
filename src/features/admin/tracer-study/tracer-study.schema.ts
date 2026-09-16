import { z } from "zod";

export const careerStatusEnum = z.enum([
  "bekerja",
  "wirausaha",
  "lanjut_studi",
  "mencari_pekerjaan",
]);

export type CareerStatus = z.infer<typeof careerStatusEnum>;

export const adminTracerStudySchema = z.object({
  student_alumni_id: z.string().min(1, "Alumni wajib dipilih"),
  career_status: careerStatusEnum,
  company_name: z.string(),
  company_sector: z.string(),
  job_title: z.string(),
  job_location: z.string(),
  minimum_salary: z.string(),
  maximum_salary: z.string(),
  waiting_period: z.string(),
  accepted_date: z.string(),
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
        message: "Nama perusahaan wajib diisi",
      });
    }
    if (!data.job_title.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["job_title"],
        message: "Posisi/jabatan wajib diisi",
      });
    }
  } else if (data.career_status === "wirausaha") {
    if (!data.business_name.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["business_name"],
        message: "Nama usaha wajib diisi",
      });
    }
    if (!data.business_field.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["business_field"],
        message: "Bidang usaha wajib dipilih",
      });
    }
  } else if (data.career_status === "lanjut_studi") {
    if (!data.university_name.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["university_name"],
        message: "Nama universitas/instansi wajib diisi",
      });
    }
    if (!data.study_program.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["study_program"],
        message: "Program studi wajib diisi",
      });
    }
  }
});

export type AdminTracerFormData = z.infer<typeof adminTracerStudySchema>;

export interface AdminTracerItem {
  id: string;
  studentAlumniId: string;
  careerStatus: CareerStatus;
  companyName?: string | null;
  companySector?: string | null;
  jobTitle?: string | null;
  jobLocation?: string | null;
  minimumSalary?: number | null;
  maximumSalary?: number | null;
  waitingPeriod?: string | null;
  acceptedDate?: string | null;
  startDate?: string | null;
  businessName?: string | null;
  businessAddress?: string | null;
  instagramAccount?: string | null;
  averageRevenue?: string | null;
  businessField?: string | null;
  businessStartDate?: string | null;
  universityName?: string | null;
  studyProgram?: string | null;
  status12Bulan?: string | null;
  studentAlumni?: {
    id: string;
    nis?: string | null;
    graduationYear?: number | null;
    fullName?: string | null;
    email?: string | null;
    phone?: string | null;
    major?: {
      id: string;
      name: string;
      code: string;
    } | null;
    class?: {
      id: string;
      name: string;
      code: string;
    } | null;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TracerMetrics {
  total_alumni: number;
  bekerja: number;
  kuliah: number;
  wirausaha: number;
  mencari_kerja: number;
}

export interface AvailableAlumniItem {
  id: string;
  nis: string;
  fullName: string;
  major: string;
  class: string;
  year?: number | null;
  label: string;
}

export interface TracerFilterOptions {
  majors: { id: string | number; name: string; code: string }[];
  graduation_years: number[];
  career_statuses: { value: string; label: string }[];
  available_alumni?: AvailableAlumniItem[];
}

export interface TracerPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface TracerListResponse {
  data: AdminTracerItem[];
  meta?: TracerPaginationMeta;
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}

export interface SubmitAdminTracerPayload {
  student_alumni_id?: string | number;
  career_status: CareerStatus;
  company_name?: string | null;
  company_sector?: string | null;
  job_title?: string | null;
  job_location?: string | null;
  minimum_salary?: number | null;
  maximum_salary?: number | null;
  waiting_period?: string | null;
  accepted_date?: string | null;
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
  "1 Bulan",
  "2 Bulan",
  "1 - 3 Bulan",
  "3 - 6 Bulan",
  "> 6 Bulan",
] as const;

export const AVERAGE_INCOME_OPTIONS = [
  "< 1.500.000",
  "1.500.000 - 3.000.000",
  "3.000.000 - 5.000.000",
  "5.000.000 - 10.000.000",
  "> 10.000.000",
] as const;

export const BUSINESS_FIELD_OPTIONS = [
  "Kuliner",
  "IT & Digital",
  "Wisata & Perhotelan",
  "Manufaktur & Otomotif",
  "Jasa & Perdagangan",
  "Lainnya",
] as const;
