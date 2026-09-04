import { z } from "zod";

export const studentProfileSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap wajib diisi"),
  nis: z.string().min(1, "NIS/NISN wajib diisi"),
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  phone: z.string().min(1, "Nomor WhatsApp aktif wajib diisi"),
  majorId: z.number().min(1, "Jurusan wajib dipilih"),
  classId: z.number().min(1, "Kelas wajib dipilih"),
  graduationYear: z.number().nullable().optional(),
  socialMedia: z.object({
    linkedin: z.string(),
    github: z.string(),
    instagram: z.string(),
    tiktok: z.string(),
  }),
});

export type StudentProfileSchemaType = z.infer<typeof studentProfileSchema>;

export const uploadDocumentSchema = z.object({
  categoryId: z.number().min(1, "Kategori dokumen wajib dipilih"),
  title: z.string().optional(),
});

export type UploadDocumentSchemaType = z.infer<typeof uploadDocumentSchema>;

export interface PortfolioCategory {
  id: number;
  code: string;
  name: string;
  sortOrder?: number;
}

export interface PortfolioItem {
  id: number;
  studentAlumniId: number;
  categoryId: number;
  category: PortfolioCategory | null;
  title: string;
  description?: string | null;
  fileName: string | null;
  fileSize: string | null;
  filePath: string;
  fileUrl: string | null;
  createdAt: string;
}

export interface StudentOptionItem {
  id: number;
  code?: string;
  name: string;
}

export interface PortfolioFormOptions {
  majors: StudentOptionItem[];
  classes: StudentOptionItem[];
  portfolio_types: PortfolioCategory[];
  graduation_years: number[];
}

export interface StudentProfileData {
  id: number;
  userId: number;
  nis: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  classId: number | null;
  majorId: number | null;
  employmentStatusId: number | null;
  graduationYear: number | null;
  socialMedia: {
    linkedin: string;
    github: string;
    instagram: string;
    tiktok: string;
  };
  isActive: boolean;
  class: StudentOptionItem | null;
  major: StudentOptionItem | null;
  portfolios: PortfolioItem[];
}
