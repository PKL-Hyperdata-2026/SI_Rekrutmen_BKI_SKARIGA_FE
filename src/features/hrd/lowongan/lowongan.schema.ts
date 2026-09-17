import { z } from "zod";

export interface HrdMajorOption {
  id: string | number;
  code: string;
  name: string;
}

export interface HrdTargetApplicantOption {
  id: string | number;
  code: string;
  name: string;
  metadata?: {
    badge_color?: string;
  } | null;
}

export interface HrdJobTypeOption {
  id: string | number;
  code: string;
  name: string;
  metadata?: {
    badge_color?: string;
  } | null;
}

export interface HrdVacancyStatusOption {
  id: string | number;
  code: string;
  name: string;
  metadata?: {
    badge_color?: string;
    icon?: string;
  } | null;
}

export interface HrdJobVacancyOptions {
  majors: HrdMajorOption[];
  targetApplicants: HrdTargetApplicantOption[];
  jobTypes: HrdJobTypeOption[];
  vacancyStatuses: HrdVacancyStatusOption[];
}

export interface HrdJobVacancyStatistics {
  active: number;
  draft_closed: number;
}

export interface HrdJobVacancyItem {
  id: string;
  companyId?: string | null;
  company?: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    logoPath?: string | null;
  } | null;
  jobTypeId?: string | null;
  jobType?: {
    id: string;
    code: string;
    name: string;
  } | null;
  statusId?: string | null;
  status?: {
    id: string;
    code: string;
    name: string;
  } | null;
  targetApplicantId?: string | null;
  targetApplicant?: {
    id: string | number;
    code: string;
    name: string;
  } | null;
  title?: string | null;
  slug?: string;
  position: string;
  description?: string | null;
  qualification: string;
  quota: number;
  deadline: string | null;
  workLocation: string;
  majors?: Array<{
    id: string | number;
    code: string;
    name: string;
  }>;
  majorIds?: Array<string | number>;
  minSalary?: number | null;
  maxSalary?: number | null;
  isFeatured?: boolean;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  applicantsCount?: number;
}

export interface HrdJobVacancyPagination {
  data: HrdJobVacancyItem[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export const lowonganFormSchema = z.object({
  title: z
    .string()
    .trim()
    .max(255, { message: "Judul lowongan maksimal 255 karakter." })
    .optional()
    .nullable(),
  position: z
    .string()
    .trim()
    .min(1, { message: "Posisi pekerjaan wajib diisi." })
    .max(255, { message: "Posisi pekerjaan maksimal 255 karakter." }),
  major_ids: z
    .array(z.string())
    .min(1, { message: "Pilih minimal satu jurusan." }),
  target_applicant_id: z
    .string()
    .min(1, { message: "Target pelamar wajib dipilih." }),
  job_type_id: z.string().optional().nullable(),
  quota: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && !Number.isNaN(Number(val)), {
      message: "Kuota wajib diisi berupa angka.",
    })
    .refine((val) => Number(val) >= 1, {
      message: "Kuota minimal 1 orang.",
    }),
  deadline: z
    .string()
    .min(1, { message: "Batas pendaftaran wajib diisi." }),
  work_location: z
    .string()
    .trim()
    .min(1, { message: "Lokasi kerja wajib diisi." })
    .max(255, { message: "Lokasi kerja maksimal 255 karakter." }),
  qualification: z
    .string()
    .trim()
    .min(1, { message: "Kualifikasi/persyaratan wajib diisi." }),
  description: z.string().optional().nullable(),
  send_notification: z.boolean(),
});

export type LowonganFormValues = z.infer<typeof lowonganFormSchema>;

export interface LowonganPayload {
  title?: string | null;
  position: string;
  quota: number;
  deadline: string;
  major_ids: Array<string | number>;
  target_applicant_id: string | number;
  job_type_id?: string | number | null;
  work_location: string;
  qualification: string;
  description?: string | null;
  send_notification?: boolean;
  is_active?: boolean;
}
