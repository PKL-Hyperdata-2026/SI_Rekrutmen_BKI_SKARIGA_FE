import { z } from "zod";

export const usersFormSchema = z.object({
  full_name: z.string().trim().min(1, "Nama lengkap wajib diisi"),
  email: z.string().trim().email("Format email tidak valid"),
  phone: z.string().trim().optional(),
  password: z.string().optional(),
  role: z.enum(["admin", "hrd", "siswa", "alumni"]),
  company_id: z.string().optional(),
});

export type UsersFormSchemaType = z.infer<typeof usersFormSchema>;

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Minimal 6 karakter kombinasi"),
});

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

export interface UserItem {
  id: number | string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  company?: {
    id: number | string;
    name: string;
  } | null;
}

