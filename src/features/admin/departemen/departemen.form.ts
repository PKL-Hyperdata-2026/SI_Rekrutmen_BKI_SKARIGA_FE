import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  departmentFormSchema,
  type DepartmentFormSchemaType,
  type DepartmentItem,
} from "./departemen.schema";

export function useDepartmentForm(department?: DepartmentItem | null) {
  return useForm<DepartmentFormSchemaType>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      code: department?.code || "",
      name: department?.name || "",
      description: department?.description || "",
      is_active: department ? department.isActive : true,
    },
  });
}

export function toCreateDepartmentPayload(data: DepartmentFormSchemaType): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    code: data.code.toUpperCase().trim(),
    name: data.name.trim(),
    is_active: data.is_active,
  };

  if (data.description !== undefined) {
    payload.description = data.description;
  }

  return payload;
}
