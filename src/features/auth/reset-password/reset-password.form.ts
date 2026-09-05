import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordSchemaType } from "./reset-password.schema";

export function useResetPasswordForm(token: string, email: string) {
  return useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      email,
      password: "",
      password_confirmation: "",
    },
  });
}
