import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchemaType } from "./login.schema";

export function useLoginForm() {
  const savedEmail = typeof window !== "undefined" ? localStorage.getItem("remembered_email") || "" : "";

  return useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: savedEmail,
      password: "",
      remember: Boolean(savedEmail),
    },
  });
}
