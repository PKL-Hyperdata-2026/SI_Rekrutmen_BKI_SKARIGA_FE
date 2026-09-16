export type ReportTabType = 'rekrutmen' | 'absensi' | 'keterserapan' | 'tracer-study';

export interface ReportFilterState {
  startDate: string;
  endDate: string;
  applicantType: string;
  companyId: string;
  majorId: string;
  graduationYear: string;
}

export interface FilterOptionItem {
  value: string;
  label: string;
}

export interface LaporanOptions {
  companies: FilterOptionItem[];
  majors: FilterOptionItem[];
  graduation_years: FilterOptionItem[];
}

export interface RecruitmentMetrics {
  total_applicants?: number;
  total_accepted?: number;
  pass_rate?: number;
  active_companies?: number;
}

export interface AttendanceMetrics {
  sosialisasi_rate?: number;
  psikotes_rate?: number;
  interview_rate?: number;
}

export interface AbsorptionMetrics {
  class_12_rate?: number;
  alumni_rate?: number;
  working_dudi_rate?: number;
  study_entrepreneur_rate?: number;
}

export interface TracerStudyMetrics {
  avg_waiting_time?: string;
  industries_count?: number;
  sectors_count?: number;
  regions_count?: number;
}

export interface RecruitmentRow {
  no: number;
  company_name: string;
  job_title: string;
  total_applicants: number;
  passed_admin: number;
  passed_interview: number;
  accepted: number;
  pass_rate_percentage: number;
}

export interface AttendanceRow {
  no: number;
  agenda_name: string;
  event_date: string;
  target_participants: number;
  present_valid: number;
  absent: number;
  attendance_rate: number;
}

export interface AbsorptionRow {
  no: number;
  major_name: string;
  total_graduates: number;
  working_dudi: number;
  higher_education: number;
  entrepreneur: number;
  unemployed: number;
  absorption_rate: number;
}

export interface TracerStudyRow {
  no: number;
  graduation_year: string;
  waiting_time_avg: string;
  retention_3_months: string;
  retention_6_months: string;
  retention_12_months: string;
  dominant_region: string;
}