export type CareerStatus =
  | "bekerja"
  | "wirausaha"
  | "lanjut_studi"
  | "mencari_pekerjaan";

export interface AdminTracerItem {
  id: string; // encrypted id
  studentAlumniId: string; // encrypted id
  careerStatus: CareerStatus;

  // Bekerja
  companyName?: string | null;
  companySector?: string | null;
  jobTitle?: string | null;
  jobLocation?: string | null;
  minimumSalary?: number | null;
  maximumSalary?: number | null;
  waitingPeriod?: string | null;
  acceptedDate?: string | null;
  startDate?: string | null;

  // Wirausaha
  businessName?: string | null;
  businessAddress?: string | null;
  instagramAccount?: string | null;
  averageRevenue?: string | null;
  businessField?: string | null;
  businessStartDate?: string | null;

  // Lanjut Studi
  universityName?: string | null;
  studyProgram?: string | null;

  // Status 12 Bulan (Evaluasi Karir/Penempatan)
  status12Bulan?: string | null;

  // Detail Relasi Alumni
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
  id: string; // encrypted id
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

export interface AdminTracerFormData {
  student_alumni_id: string;
  career_status: CareerStatus;

  // Bekerja
  company_name: string;
  company_sector: string;
  job_title: string;
  job_location: string;
  minimum_salary: string;
  maximum_salary: string;
  waiting_period: string;
  accepted_date: string;
  start_date: string;

  // Wirausaha
  business_name: string;
  business_address: string;
  instagram_handle: string;
  average_income: string;
  business_field: string;
  business_start_date: string;

  // Lanjut Studi
  university_name: string;
  study_program: string;
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
