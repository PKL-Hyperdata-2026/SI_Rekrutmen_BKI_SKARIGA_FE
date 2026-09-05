import { z } from "zod";

export const siswaFormSchema = z.object({
  nis: z.string().trim().min(1, "NIS wajib diisi"),
  full_name: z.string().trim().min(1, "Nama lengkap siswa wajib diisi"),
  email: z.string().trim().email("Format alamat email tidak valid"),
  phone: z.string().trim().min(1, "Nomor handphone wajib diisi"),
  major_id: z.string().min(1, "Jurusan wajib dipilih"),
  class_id: z.string().min(1, "Kelas wajib dipilih"),
  password: z.string().optional(),
  is_active: z.boolean(),
});

export type SiswaFormSchemaType = z.infer<typeof siswaFormSchema>;

export interface SiswaOptionItem {
  id: number | string;
  code?: string;
  name: string;
}

export interface SiswaItem {
  id: number | string;
  userId?: number | string | null;
  nis: string;
  fullName: string;
  email: string;
  phone: string | null;
  classId?: number | string | null;
  majorId?: number | string | null;
  isActive: boolean;
  createdAt?: string | null;
  class?: SiswaOptionItem | null;
  major?: SiswaOptionItem | null;
}

export interface SiswaOptionsData {
  majors: SiswaOptionItem[];
  classes: SiswaOptionItem[];
  employment_statuses?: SiswaOptionItem[];
  companies?: SiswaOptionItem[];
  graduation_years?: number[];
}
