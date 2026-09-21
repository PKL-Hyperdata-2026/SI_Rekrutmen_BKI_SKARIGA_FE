import { z } from "zod";

export const dudiFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nama perusahaan minimal 3 karakter")
    .max(255, "Nama perusahaan maksimal 255 karakter"),
  industry_id: z.string().optional(),
  address: z
    .string()
    .trim()
    .max(500, "Alamat maksimal 500 karakter")
    .optional(),
  email: z
    .string()
    .trim()
    .email("Format email tidak valid")
    .max(255, "Email maksimal 255 karakter")
    .or(z.literal(""))
    .optional(),
  phone: z.string().trim().optional(),
  website: z
    .string()
    .trim()
    .url("Format alamat website tidak valid (contoh: https://...)")
    .max(255, "Website maksimal 255 karakter")
    .or(z.literal(""))
    .optional(),
  pic_name: z
    .string()
    .trim()
    .max(255, "Nama PIC maksimal 255 karakter")
    .optional(),
  pic_contact: z.string().trim().optional(),
  is_active: z.boolean(),
});

export type DudiFormSchemaType = z.infer<typeof dudiFormSchema>;

export interface IndustryOption {
  id: number | string;
  code?: string;
  name: string;
}

export interface DudiItem {
  id: number | string;
  userId?: number | string | null;
  industryId?: number | string | null;
  name: string;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  picName?: string | null;
  picContact?: string | null;
  logoPath?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  industry?: IndustryOption | null;
}

export interface DudiOptionsData {
  industries: IndustryOption[];
}
