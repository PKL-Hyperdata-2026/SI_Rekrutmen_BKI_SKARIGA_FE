import { z } from "zod";

export const majorFormSchema = z.object({
  department_id: z.string().min(1, "Departemen induk wajib dipilih"),
  code: z
    .string()
    .trim()
    .min(1, "Kode jurusan wajib diisi")
    .max(20, "Kode jurusan maksimal 20 karakter"),
  name: z
    .string()
    .trim()
    .min(1, "Nama program keahlian wajib diisi")
    .max(255, "Nama program keahlian maksimal 255 karakter"),
  description: z
    .string()
    .trim()
    .max(1000, "Deskripsi maksimal 1000 karakter")
    .optional()
    .or(z.literal("")),
  is_active: z.boolean(),
});

export type MajorFormSchemaType = z.infer<typeof majorFormSchema>;

export const majorPayloadSchema = z.object({
  department_id: z.string().min(1),
  code: z.string().trim().min(1).max(20),
  name: z.string().trim().min(1).max(255),
  description: z.string().max(1000).optional(),
  is_active: z.boolean(),
});

export type MajorPayload = z.infer<typeof majorPayloadSchema>;

export const majorQueryParamsSchema = z.object({
  search: z.string().optional(),
  department_id: z.union([z.string(), z.number()]).optional(),
  is_active: z.union([z.string(), z.number()]).optional(),
  sort_by: z.string().optional(),
  sort_dir: z.enum(["asc", "desc"]).optional(),
  per_page: z.number().optional(),
  page: z.number().optional(),
});

export type MajorQueryParams = z.infer<typeof majorQueryParamsSchema>;

export const departmentOptionSchema = z.object({
  id: z.union([z.number(), z.string()]),
  code: z.string(),
  name: z.string(),
});

export type DepartmentOption = z.infer<typeof departmentOptionSchema>;

export const majorItemSchema = z.object({
  id: z.union([z.number(), z.string()]),
  departmentId: z.union([z.number(), z.string()]),
  department: departmentOptionSchema.nullable().optional(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  isActive: z.boolean(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export type MajorItem = z.infer<typeof majorItemSchema>;

export const majorOptionsDataSchema = z.object({
  departments: departmentOptionSchema.array(),
});

export type MajorOptionsData = z.infer<typeof majorOptionsDataSchema>;

export const majorPaginatedResponseSchema = z.object({
  data: majorItemSchema.array(),
  current_page: z.number().optional(),
  last_page: z.number().optional(),
  total: z.number().optional(),
  meta: z
    .object({
      current_page: z.number().optional(),
      from: z.number().nullable().optional(),
      last_page: z.number().optional(),
      per_page: z.number().optional(),
      to: z.number().nullable().optional(),
      total: z.number().optional(),
    })
    .optional(),
});

export type MajorPaginatedResponse = z.infer<
  typeof majorPaginatedResponseSchema
>;
