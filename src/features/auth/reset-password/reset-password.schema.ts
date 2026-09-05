import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    email: z.string().email({ message: "Format email tidak valid" }),
    password: z.string().min(8, { message: "Password minimal 8 karakter" }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi password tidak cocok dengan password baru",
    path: ["password_confirmation"],
  });

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
