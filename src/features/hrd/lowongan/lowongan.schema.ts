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
    metadata?: {
      badge_color?: string;
      icon?: string;
    } | null;
  } | null;
  statusId?: string | null;
  status?: {
    id: string;
    code: string;
    name: string;
    metadata?: {
      badge_color?: string;
      icon?: string;
    } | null;
  } | null;
  targetApplicantId?: string | null;
  targetApplicant?: {
    id: string | number;
    code: string;
    name: string;
    metadata?: {
      badge_color?: string;
      icon?: string;
    } | null;
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

export type VacancyEffectiveStatusFilter =
  | ""
  | "active"
  | "closed"
  | "quota_full"
  | "expiring";

export type VacancySortOption = "newest" | "deadline" | "quota";

export interface GetVacanciesParams {
  major_id?: string | number;
  major_ids?: Array<string | number>;
  target_applicant_id?: string | number;
  job_type_id?: string | number;
  is_active?: boolean;
  effective_status?: VacancyEffectiveStatusFilter;
  sort?: VacancySortOption;
  status_id?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export const lowonganFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Judul publikasi wajib diisi." })
    .max(255, { message: "Judul lowongan maksimal 255 karakter." }),
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
    .refine(
      (val) => {
        const str = String(val).trim();
        return str !== "" && !Number.isNaN(Number(str));
      },
      {
        message: "Kuota wajib diisi berupa angka.",
      }
    )
    .refine((val) => Number.isInteger(Number(val)), {
      message: "Kuota harus berupa bilangan bulat.",
    })
    .refine((val) => Number(val) >= 1, {
      message: "Kuota minimal 1 orang.",
    })
    .refine((val) => Number(val) <= 1000, {
      message: "Kuota maksimal 1000 orang.",
    }),
  deadline: z
    .string()
    .min(1, { message: "Batas pendaftaran wajib diisi." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Format batas pendaftaran harus YYYY-MM-DD.",
    }),
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
