import { z } from "zod";

export const majorFormSchema = z.object({
  department_id: z.string().min(1, "Departemen induk wajib dipilih"),
  code: z.string().trim().min(1, "Kode jurusan wajib diisi"),
  name: z.string().trim().min(1, "Nama program keahlian wajib diisi"),
  description: z.string().optional(),
  is_active: z.boolean(),
});

export type MajorFormSchemaType = z.infer<typeof majorFormSchema>;

export interface DepartmentOption {
  id: number | string;
  code: string;
  name: string;
}

export interface MajorItem {
  id: number | string;
  departmentId: number | string;
  department?: DepartmentOption | null;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface MajorOptionsData {
  departments: DepartmentOption[];
}
