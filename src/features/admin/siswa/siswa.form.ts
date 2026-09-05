import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  siswaFormSchema,
  type SiswaFormSchemaType,
  type SiswaItem,
} from "./siswa.schema";

export function useSiswaForm(siswa?: SiswaItem | null) {
  return useForm<SiswaFormSchemaType>({
    resolver: zodResolver(siswaFormSchema),
    defaultValues: {
      nis: siswa?.nis || "",
      full_name: siswa?.fullName || "",
      email: siswa?.email || "",
      phone: siswa?.phone || "",
      major_id: siswa?.majorId ? String(siswa.majorId) : "",
      class_id: siswa?.classId ? String(siswa.classId) : "",
      password: "",
      is_active: siswa ? siswa.isActive : true,
    },
  });
}

export function toCreateSiswaPayload(data: SiswaFormSchemaType): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    nis: data.nis,
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    major_id: data.major_id,
    class_id: data.class_id,
    is_active: data.is_active,
  };

  if (data.password) {
    payload.password = data.password;
  }

  return payload;
}
