import { z } from "zod";

export const departmentFormSchema = z.object({
  code: z.string().trim().min(1, "Kode departemen wajib diisi"),
  name: z.string().trim().min(1, "Nama departemen wajib diisi"),
  description: z.string().optional(),
  is_active: z.boolean(),
});

export type DepartmentFormSchemaType = z.infer<typeof departmentFormSchema>;

export interface DepartmentItem {
  id: number | string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  majorsCount?: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}
