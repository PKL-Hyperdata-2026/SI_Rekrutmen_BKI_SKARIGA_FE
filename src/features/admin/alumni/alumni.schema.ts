import { z } from "zod";

export interface AlumniReferenceItem {
  id: number | string;
  code?: string;
  name: string;
}

export type AlumniOptionItem = AlumniReferenceItem;

export interface AlumniPortfolio {
  id: number | string;
  studentAlumniId: number | string;
  categoryId: number | string;
  category: AlumniReferenceItem | null;
  title: string;
  description: string | null;
  fileName?: string | null;
  originalFilename?: string | null;
  filePath: string;
  fileUrl: string | null;
  createdAt: string;
}

export interface EligibleStudentOption {
  id: number | string;
  userId: number | string;
  nis: string;
  fullName: string;
  email: string;
  phone: string | null;
  classId: number | string | null;
  className: string | null;
  majorId: number | string;
  majorName: string;
}

export interface AlumniItem {
  id: number | string;
  userId?: number | string | null;
  nis?: string | null;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  graduationYear: number;
  majorId?: number | string | null;
  classId?: number | string | null;
  employmentStatusId?: number | string | null;
  currentCompanyId?: number | string | null;
  currentPosition?: string | null;
  startingSalary?: number | string | null;
  waitingTimeMonths?: number | string | null;
  socialMedia?:
    | {
        linkedin?: string;
        github?: string;
        profile_url?: string;
        [key: string]: unknown;
      }
    | string
    | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  user?: {
    id: number | string;
    fullName: string;
    email: string;
    phone: string | null;
    role: string;
    isActive: boolean;
  } | null;
  major?: string | AlumniReferenceItem | null;
  class?: string | AlumniReferenceItem | null;
  employmentStatus?: string | AlumniReferenceItem | null;
  currentCompany?: {
    id: number | string;
    name: string;
  } | null;
  portfolios?: AlumniPortfolio[];
}

export interface AlumniOptionsData {
  companies: AlumniReferenceItem[];
  majors: AlumniReferenceItem[];
  classes: AlumniReferenceItem[];
  employment_statuses: AlumniReferenceItem[];
  graduation_years: number[];
  portfolio_types?: AlumniReferenceItem[];
  eligible_students?: EligibleStudentOption[];
}

export interface AlumniFilterParams {
  search?: string;
  graduation_year?: string | number;
  major_id?: string;
  employment_status_id?: string;
  current_company_id?: string;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface AlumniPaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface AlumniPaginatedResponse {
  data: AlumniItem[];
  meta?: AlumniPaginationMeta;
  links?: Record<string, unknown>;
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  from?: number | null;
  to?: number | null;
}

export const alumniFormSchema = z.object({
  mode: z.enum(["graduate", "manual"]),
  user_id: z.string().optional().or(z.literal("")),
  nis: z
    .string()
    .trim()
    .min(3, "NIS minimal 3 karakter")
    .max(20, "NIS maksimal 20 karakter"),
  full_name: z
    .string()
    .trim()
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(255, "Nama lengkap maksimal 255 karakter"),
  phone: z.string().trim().optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "Format email tidak valid",
    })
    .optional()
    .or(z.literal("")),
  major_id: z.string().min(1, "Jurusan wajib dipilih"),
  class_id: z.string().optional().or(z.literal("")),
  graduation_year: z.string().min(1, "Tahun kelulusan wajib diisi"),
  employment_status_id: z.string().optional().or(z.literal("")),
  current_company_id: z.string().optional().or(z.literal("")),
  current_position: z.string().trim().optional().or(z.literal("")),
  profile_url: z.string().trim().optional().or(z.literal("")),
  company_name_manual: z.string().trim().optional().or(z.literal("")),
  starting_salary: z.string().optional().or(z.literal("")),
  waiting_time_months: z.string().optional().or(z.literal("")),
  is_active: z.boolean(),
});

export type AlumniFormSchemaType = z.infer<typeof alumniFormSchema>;

export const alumniPortfolioUploadSchema = z.object({
  category_id: z.string().min(1, "Kategori berkas wajib dipilih"),
  title: z.string().trim().min(3, "Judul berkas minimal 3 karakter"),
  description: z.string().optional().or(z.literal("")),
  file: z
    .custom<File>((val) => val instanceof File, "File dokumen wajib dipilih")
    .refine((file) => file.size <= 10 * 1024 * 1024, "Ukuran berkas melebihi batas maksimal 10 MB")
    .refine(
      (file) => {
        const ext = "." + file.name.split(".").pop()?.toLowerCase();
        return [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"].includes(ext);
      },
      "Format file tidak didukung. Harap unggah PDF, JPG, PNG, atau DOC/DOCX"
    ),
});

export type AlumniPortfolioUploadSchemaType = z.infer<
  typeof alumniPortfolioUploadSchema
>;
