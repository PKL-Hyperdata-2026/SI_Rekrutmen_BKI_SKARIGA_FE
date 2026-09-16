import { z } from "zod";

export const socialMediaItemSchema = z.object({
  platform: z.string(),
  username: z.string(),
  url: z.string().optional(),
});

export const studentProfileSchema = z.object({
  fullName: z.string().optional(),
  nis: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().min(1, "Nomor WhatsApp aktif wajib diisi"),
  majorId: z.number().optional(),
  classId: z.number().optional(),
  graduationYear: z.number().nullable().optional(),
  socialMedia: z.array(socialMediaItemSchema).optional(),
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

export interface SocialMediaItem {
  platform: string;
  username: string;
  url?: string;
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
  socialMedia:
    | SocialMediaItem[]
    | {
        linkedin?: string;
        github?: string;
        instagram?: string;
        tiktok?: string;
      };
  isActive: boolean;
  class: StudentOptionItem | null;
  major: StudentOptionItem | null;
  department?: StudentOptionItem | null;
  portfolios: PortfolioItem[];
}
