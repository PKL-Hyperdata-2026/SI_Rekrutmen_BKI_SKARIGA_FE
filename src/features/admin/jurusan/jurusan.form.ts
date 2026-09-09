import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  majorFormSchema,
  type MajorFormSchemaType,
  type MajorItem,
} from "./jurusan.schema";

export function useMajorForm(major?: MajorItem | null) {
  return useForm<MajorFormSchemaType>({
    resolver: zodResolver(majorFormSchema),
    defaultValues: {
      department_id: major?.departmentId ? String(major.departmentId) : "",
      code: major?.code || "",
      name: major?.name || "",
      description: major?.description || "",
      is_active: major ? major.isActive : true,
    },
  });
}

export function toCreateMajorPayload(data: MajorFormSchemaType): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    department_id: data.department_id,
    code: data.code.toUpperCase().trim(),
    name: data.name.trim(),
    is_active: data.is_active,
  };

  if (data.description !== undefined) {
    payload.description = data.description;
  }

  return payload;
}
