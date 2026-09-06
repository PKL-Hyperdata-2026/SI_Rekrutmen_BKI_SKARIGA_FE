import { z } from "zod";

export interface SiswaOptionItem {
  id: number | string;
  code?: string;
  name: string;
}

export interface SiswaPortfolio {
  id: number | string;
  studentAlumniId: number | string;
  categoryId: number | string;
  category: SiswaOptionItem | null;
  title: string;
  description: string | null;
  filePath: string;
  fileUrl: string | null;
  createdAt: string;
}

export interface SiswaItem {
  id: number | string;
  userId?: number | string | null;
  nis: string;
  fullName: string;
  email: string;
  phone: string | null;
  classId?: number | string | null;
  majorId?: number | string | null;
  employmentStatusId?: number | string | null;
  currentCompanyId?: number | string | null;
  graduationYear?: number | null;
  socialMedia?: { profile_url?: string; [key: string]: unknown } | string | null;
  currentPosition?: string | null;
  startingSalary?: number | null;
  waitingTimeMonths?: number | null;
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
  class?: SiswaOptionItem | null;
  major?: SiswaOptionItem | null;
  employmentStatus?: SiswaOptionItem | null;
  currentCompany?: {
    id: number | string;
    name: string;
  } | null;
  portfolios?: SiswaPortfolio[];
}

export interface SiswaOptionsData {
  majors: SiswaOptionItem[];
  classes: SiswaOptionItem[];
  employment_statuses?: SiswaOptionItem[];
  companies?: SiswaOptionItem[];
  portfolio_types?: SiswaOptionItem[];
  graduation_years?: number[];
}

export interface SiswaFilterParams {
  search?: string;
  major_id?: string;
  class_id?: string;
  employment_status_id?: string;
  graduation_year?: string | number;
  is_active?: string | boolean;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface SiswaPaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface SiswaPaginatedResponse {
  data: SiswaItem[];
  meta?: SiswaPaginationMeta;
  links?: Record<string, unknown>;
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  from?: number | null;
  to?: number | null;
}

export const siswaFormSchema = z.object({
  nis: z
    .string()
    .trim()
    .min(3, "NIS minimal 3 karakter")
    .max(30, "NIS maksimal 30 karakter"),
  full_name: z
    .string()
    .trim()
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(150, "Nama lengkap maksimal 150 karakter"),
  email: z.string().trim().email("Format alamat email tidak valid"),
  phone: z.string().trim().optional().or(z.literal("")),
  password: z.string().optional().or(z.literal("")),
  class_id: z.string().min(1, "Kelas wajib dipilih"),
  major_id: z.string().min(1, "Jurusan wajib dipilih"),
  graduation_year: z.string().optional().or(z.literal("")),
  employment_status_id: z.string().optional().or(z.literal("")),
  current_company_id: z.string().optional().or(z.literal("")),
  current_position: z.string().optional().or(z.literal("")),
  social_media: z.string().optional().or(z.literal("")),
  is_active: z.boolean(),
});

export type SiswaFormSchemaType = z.infer<typeof siswaFormSchema>;

export const portfolioUploadSchema = z.object({
  category_id: z.string().min(1, "Kategori berkas wajib dipilih"),
  title: z.string().trim().min(3, "Judul berkas minimal 3 karakter"),
  description: z.string().optional().or(z.literal("")),
});

export type PortfolioUploadSchemaType = z.infer<typeof portfolioUploadSchema>;
