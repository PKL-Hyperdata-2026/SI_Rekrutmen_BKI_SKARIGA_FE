import { z } from "zod";

export const departmentFormSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Kode departemen wajib diisi")
    .max(20, "Kode departemen maksimal 20 karakter"),
  name: z
    .string()
    .trim()
    .min(1, "Nama departemen wajib diisi")
    .max(255, "Nama departemen maksimal 255 karakter"),
  description: z
    .string()
    .trim()
    .max(1000, "Deskripsi maksimal 1000 karakter")
    .optional()
    .or(z.literal("")),
  is_active: z.boolean(),
});

export type DepartmentFormSchemaType = z.infer<typeof departmentFormSchema>;

export const departmentPayloadSchema = z.object({
  code: z.string().trim().min(1).max(20),
  name: z.string().trim().min(1).max(255),
  description: z.string().max(1000).optional(),
  is_active: z.boolean(),
});

export type DepartmentPayload = z.infer<typeof departmentPayloadSchema>;

export const departmentQueryParamsSchema = z.object({
  search: z.string().optional(),
  is_active: z.union([z.string(), z.number()]).optional(),
  sort_by: z.string().optional(),
  sort_dir: z.enum(["asc", "desc"]).optional(),
  per_page: z.number().optional(),
  page: z.number().optional(),
});

export type DepartmentQueryParams = z.infer<typeof departmentQueryParamsSchema>;

export const departmentItemSchema = z.object({
  id: z.union([z.number(), z.string()]),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  isActive: z.boolean(),
  majorsCount: z.number().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export type DepartmentItem = z.infer<typeof departmentItemSchema>;
