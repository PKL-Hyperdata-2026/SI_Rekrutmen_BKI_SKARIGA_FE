import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  usersFormSchema,
  resetPasswordSchema,
  type UsersFormSchemaType,
  type ResetPasswordSchemaType,
  type UserItem,
} from "./users.schema";

export function useUsersForm(user?: UserItem | null) {
  return useForm<UsersFormSchemaType>({
    resolver: zodResolver(usersFormSchema),
    defaultValues: {
      full_name: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      password: "",
      role: (user?.role as UsersFormSchemaType["role"]) || "admin",
      company_id: user?.company?.id ? String(user.company.id) : "",
    },
  });
}

export function useUsersResetPasswordForm() {
  return useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
}

export function toCreateUserPayload(data: UsersFormSchemaType): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    full_name: data.full_name,
    email: data.email,
    phone: data.phone || null,
    role: data.role,
  };

  if (data.password) {
    payload.password = data.password;
  }

  if (data.role === "hrd") {
    payload.company_id = data.company_id || null;
  }

  return payload;
}
