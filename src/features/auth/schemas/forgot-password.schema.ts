import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email tidak boleh kosong" })
    .email({ message: "Format email tidak valid" }),
});

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
