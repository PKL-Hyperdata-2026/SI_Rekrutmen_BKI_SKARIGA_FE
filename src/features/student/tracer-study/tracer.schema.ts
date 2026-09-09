export type CareerStatus =
  | "bekerja"
  | "wirausaha"
  | "lanjut_studi"
  | "mencari_pekerjaan";

export interface TracerStudyData {
  id: number;
  studentAlumniId: number;
  careerStatus: CareerStatus;

  // Bekerja
  companyName?: string | null;
  jobTitle?: string | null;
  minimumSalary?: number | null;
  maximumSalary?: number | null;
  waitingPeriod?: string | null;
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

  createdAt?: string;
  updatedAt?: string;
}

export interface TracerStudyFormData {
  career_status: CareerStatus;

  // Bekerja
  company_name: string;
  job_title: string;
  minimum_salary: string;
  maximum_salary: string;
  waiting_period: string;
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
