export interface SelectionJobVacancyOption {
  value: string;
  label: string;
  position?: string;
  companyName?: string;
}

export interface SelectionStageOption {
  value: string;
  label: string;
  sequenceOrder?: number;
}

export interface SelectionFilterParams {
  job_vacancy_id?: string;
  stage_id?: string;
  attendance_status?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface SelectionSummaryStats {
  totalPelamar: number;
  administrasiLolos: number;
  finalDiterima: number;
}

export interface SelectionAttendanceStatus {
  id: string | number;
  code: string;
  name: string;
}

export interface SelectionAttendance {
  id: string | number;
  attendanceStatusId?: string | number | null;
  attendanceStatus?: SelectionAttendanceStatus | null;
  attendanceLabel?: string | null;
  attendedAt?: string | null;
  qrCodeToken?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  photoSelfiePath?: string | null;
}

export interface SelectionStageInfo {
  id: string | number;
  name: string;
  sequenceOrder?: number | null;
  scheduledAt?: string | null;
  location?: string | null;
}

export interface SelectionStatusInfo {
  id: string | number;
  code?: string | null;
  name?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface SelectionResultInfo {
  id: string | number;
  adminSelectionStatus?: string | null;
  decision?: string | null;
  status?: string | null;
  psychotestScore?: number | null;
  interviewScore?: number | null;
  mcuScore?: number | null;
  finalScore?: number | null;
  notes?: string | null;
}

export interface SelectionStageHistory {
  id: string | number;
  selectionStage?: SelectionStageInfo | null;
  status?: SelectionStatusInfo | null;
  score?: number | null;
  notes?: string | null;
  assessor?: {
    id: string | number;
    fullName: string;
  } | null;
  attendance?: SelectionAttendance | null;
  createdAt?: string | null;
}

export interface SelectionJobVacancy {
  id: string | number;
  title: string;
  position?: string | null;
  companyName?: string | null;
}

export interface SelectionStudentUser {
  id: string | number;
  fullName: string;
  email?: string | null;
  phone?: string | null;
}

export interface SelectionMajor {
  id: string | number;
  name: string;
  code?: string | null;
}

export interface SelectionStudentAlumni {
  id: string | number;
  nis?: string | null;
  graduationYear?: string | number | null;
  user?: SelectionStudentUser | null;
  major?: SelectionMajor | null;
}

export interface SelectionStudentBrief {
  id: string | number;
  name?: string | null;
  nis?: string | null;
  majorName?: string | null;
  email?: string | null;
}

export interface RecruitmentSelectionItem {
  id: string | number;
  jobVacancyId?: string | number | null;
  jobVacancy?: SelectionJobVacancy | null;
  studentAlumni?: SelectionStudentAlumni | null;
  student?: SelectionStudentBrief | null;
  currentStage?: SelectionStageInfo | null;
  status?: SelectionStatusInfo | null;
  selectionResult?: SelectionResultInfo | null;
  stageHistories?: SelectionStageHistory[] | null;
  appliedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface SelectionPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number | null;
  to?: number | null;
}

export interface SelectionListEnvelope {
  success: boolean;
  message?: string;
  data: {
    data: RecruitmentSelectionItem[];
    meta?: SelectionPaginationMeta;
    current_page?: number;
    last_page?: number;
    total?: number;
    per_page?: number;
    from?: number | null;
    to?: number | null;
  } | RecruitmentSelectionItem[];
  meta?: SelectionPaginationMeta;
}
