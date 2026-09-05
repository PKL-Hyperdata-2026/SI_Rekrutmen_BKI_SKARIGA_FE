import { z } from "zod";

export const dudiFormSchema = z.object({
  name: z.string().trim().min(3, "Nama perusahaan minimal 3 karakter"),
  industry_id: z.string().optional(),
  address: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .email("Format email tidak valid")
    .or(z.literal(""))
    .optional(),
  phone: z.string().trim().optional(),
  website: z
    .string()
    .trim()
    .url("Format alamat website tidak valid (contoh: https://...)")
    .or(z.literal(""))
    .optional(),
  pic_name: z.string().trim().optional(),
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
