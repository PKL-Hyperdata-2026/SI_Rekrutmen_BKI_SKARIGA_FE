import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email tidak boleh kosong" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string()
    .min(1, { message: "Password tidak boleh kosong" }),
  remember: z.boolean().optional(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
