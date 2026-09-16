import { z } from "zod";
import { type FilterSelectOption } from "@/components/custom/filter-select";

export interface Company {
  id: number | string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  logoPath?: string;
}

export interface StandardTypeItem {
  id: number | string;
  code: string;
  name: string;
  metadata?: Record<string, unknown>;
}

export interface MajorItem {
  id: number | string;
  code: string;
  name: string;
}

export interface MajorFilterOption extends FilterSelectOption {
  code?: string;
}

export interface JobVacancy {
  id: number | string;
  companyId: number | string;
  company?: Company;
  jobTypeId?: number | string;
  jobType?: StandardTypeItem;
  statusId?: number | string;
  status?: StandardTypeItem;
  targetApplicantId?: number | string;
  targetApplicant?: StandardTypeItem;
  title: string;
  slug: string;
  position: string;
  description?: string;
  qualification?: string;
  quota?: number;
  deadline?: string;
  workLocation?: string;
  majors?: MajorItem[];
  majorIds?: (number | string)[];
  minSalary?: number;
  maxSalary?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobVacancyOptionsData {
  companies: Company[];
  majors: MajorItem[];
  vacancyStatuses: StandardTypeItem[];
  targetApplicants: StandardTypeItem[];
  jobTypes: StandardTypeItem[];
}

export const jobVacancyFormSchema = z.object({
  companyId: z
    .string()
    .min(1, { message: "Nama perusahaan mitra wajib dipilih." }),
  position: z
    .string()
    .trim()
    .min(1, { message: "Posisi pekerjaan wajib diisi." })
    .max(255, { message: "Posisi pekerjaan maksimal 255 karakter." }),
  quota: z
    .string()
    .min(1, { message: "Kuota wajib diisi." })
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 1;
      },
      { message: "Kuota minimal 1 orang." },
    ),
  deadline: z
    .string()
    .min(1, { message: "Batas pendaftaran wajib diisi." })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Format tanggal pendaftaran tidak valid.",
    }),
  majorId: z.string().min(1, { message: "Jurusan wajib dipilih." }),
  targetId: z.string().min(1, { message: "Target pelamar wajib dipilih." }),
  workLocation: z
    .string()
    .trim()
    .min(1, { message: "Lokasi kerja wajib diisi." })
    .max(255, { message: "Lokasi kerja maksimal 255 karakter." }),
  qualification: z
    .string()
    .trim()
    .min(1, { message: "Kualifikasi / persyaratan wajib diisi." }),
  sendNotification: z.boolean(),
});

export type JobVacancyFormValues = z.infer<typeof jobVacancyFormSchema>;
