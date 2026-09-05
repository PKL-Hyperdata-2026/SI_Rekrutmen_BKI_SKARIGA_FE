import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  dudiFormSchema,
  type DudiFormSchemaType,
  type DudiItem,
} from "./dudi.schema";

export function useDudiForm(company?: DudiItem | null) {
  return useForm<DudiFormSchemaType>({
    resolver: zodResolver(dudiFormSchema),
    defaultValues: {
      name: company?.name || "",
      industry_id: company?.industryId ? String(company.industryId) : "",
      address: company?.address || "",
      email: company?.email || "",
      phone: company?.phone || "",
      website: company?.website || "",
      pic_name: company?.picName || "",
      pic_contact: company?.picContact || "",
      is_active: company ? company.isActive : true,
    },
  });
}

export function toCreateDudiPayload(data: DudiFormSchemaType): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    name: data.name,
    is_active: data.is_active,
  };

  if (data.industry_id) {
    payload.industry_id = data.industry_id;
  }
  if (data.address) {
    payload.address = data.address;
  }
  if (data.email) {
    payload.email = data.email;
  }
  if (data.phone) {
    payload.phone = data.phone;
  }
  if (data.website) {
    payload.website = data.website;
  }
  if (data.pic_name) {
    payload.pic_name = data.pic_name;
  }
  if (data.pic_contact) {
    payload.pic_contact = data.pic_contact;
  }

  return payload;
}
