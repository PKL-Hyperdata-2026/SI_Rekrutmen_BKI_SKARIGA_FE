import { z } from "zod";

export const alumniFormSchema = z.object({
  user_id: z.string().optional(),
  nis: z.string().trim().optional(),
  full_name: z.string().trim().min(1, "Nama lengkap alumni wajib diisi"),
  phone: z.string().trim().optional(),
  major_id: z.string().min(1, "Jurusan wajib dipilih"),
  class_id: z.string().optional(),
  graduation_year: z.string().min(1, "Tahun kelulusan wajib diisi"),
  employment_status_id: z.string().optional(),
  current_company_id: z.string().optional(),
  current_position: z.string().trim().optional(),
  starting_salary: z.string().optional(),
  waiting_time_months: z.string().optional(),
  is_active: z.boolean(),
});

export type AlumniFormSchemaType = z.infer<typeof alumniFormSchema>;

export interface AlumniOptionItem {
  id: number | string;
  code?: string;
  name: string;
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
  isActive: boolean;
  user?: {
    id: number | string;
    fullName: string;
    email: string;
    phone: string | null;
    role: string;
    isActive: boolean;
  } | null;
  major?: string | AlumniOptionItem | null;
  class?: string | AlumniOptionItem | null;
  employmentStatus?: string | AlumniOptionItem | null;
  currentCompany?: {
    id: number | string;
    name: string;
  } | null;
}

export interface AlumniOptionsData {
  companies: AlumniOptionItem[];
  majors: AlumniOptionItem[];
  classes: AlumniOptionItem[];
  employment_statuses: AlumniOptionItem[];
  graduation_years: number[];
}
