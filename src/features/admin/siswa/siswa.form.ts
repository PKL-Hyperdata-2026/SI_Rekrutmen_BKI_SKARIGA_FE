import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  siswaFormSchema,
  portfolioUploadSchema,
  type SiswaFormSchemaType,
  type PortfolioUploadSchemaType,
  type SiswaItem,
  type SiswaOptionItem,
} from "./siswa.schema";

export function findMatchingClassId(
  selectedClass: SiswaOptionItem | null | undefined,
  classes: SiswaOptionItem[]
): string {
  if (!selectedClass) return "";
  const match = classes.find(
    (c) =>
      (c.code && selectedClass.code && c.code.toLowerCase() === selectedClass.code.toLowerCase()) ||
      c.name.toLowerCase() === selectedClass.name.toLowerCase()
  );
  return match ? String(match.id) : "";
}

export function findMatchingMajorId(
  selectedMajor: SiswaOptionItem | null | undefined,
  majors: SiswaOptionItem[]
): string {
  if (!selectedMajor) return "";
  const match = majors.find(
    (m) =>
      (m.code && selectedMajor.code && m.code.toLowerCase() === selectedMajor.code.toLowerCase()) ||
      m.name.toLowerCase() === selectedMajor.name.toLowerCase()
  );
  return match ? String(match.id) : "";
}

export function findMatchingOptionId(
  selectedOption: SiswaOptionItem | null | undefined,
  options: SiswaOptionItem[]
): string {
  if (!selectedOption) return "";
  const match = options.find(
    (o) =>
      (o.code && selectedOption.code && o.code.toLowerCase() === selectedOption.code.toLowerCase()) ||
      o.name.toLowerCase() === selectedOption.name.toLowerCase()
  );
  return match ? String(match.id) : "";
}

export function resolveMajorByClass(
  classId: string,
  classes: SiswaOptionItem[],
  majors: SiswaOptionItem[]
): string {
  if (!classId) return "";
  const selectedClass = classes.find((c) => String(c.id) === String(classId));
  if (!selectedClass) return "";

  const textToScan = `${selectedClass.name} ${selectedClass.code || ""}`.toUpperCase();

  for (const major of majors) {
    if (major.code && textToScan.includes(major.code.toUpperCase())) {
      return String(major.id);
    }
  }

  for (const major of majors) {
    if (textToScan.includes(major.name.toUpperCase())) {
      return String(major.id);
    }
  }

  return "";
}

export function useSiswaForm(siswa?: SiswaItem | null) {
  const resolvedClassId = siswa?.classId ? String(siswa.classId) : "";

  const resolvedMajorId = siswa?.majorId ? String(siswa.majorId) : "";

  const resolvedStatusId = siswa?.employmentStatusId
    ? String(siswa.employmentStatusId)
    : "";

  const resolvedCompanyId = siswa?.currentCompanyId
    ? String(siswa.currentCompanyId)
    : "";

  const socialMediaValue =
    typeof siswa?.socialMedia === "string"
      ? siswa.socialMedia
      : (siswa?.socialMedia?.profile_url as string) || "";

  return useForm<SiswaFormSchemaType>({
    resolver: zodResolver(siswaFormSchema),
    defaultValues: {
      nis: siswa?.nis || "",
      full_name: siswa?.fullName || siswa?.user?.fullName || "",
      email: siswa?.email || siswa?.user?.email || "",
      phone: siswa?.phone || siswa?.user?.phone || "",
      major_id: resolvedMajorId,
      class_id: resolvedClassId,
      password: "",
      graduation_year: siswa?.graduationYear ? String(siswa.graduationYear) : "",
      employment_status_id: resolvedStatusId,
      current_company_id: resolvedCompanyId,
      current_position: siswa?.currentPosition || "",
      social_media: socialMediaValue,
      is_active: siswa ? siswa.isActive : true,
    },
  });
}

export function toSiswaPayload(data: SiswaFormSchemaType): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    nis: data.nis.trim(),
    full_name: data.full_name.trim(),
    email: data.email.trim(),
    class_id: data.class_id,
    major_id: data.major_id,
    is_active: data.is_active,
  };

  if (data.phone && data.phone.trim()) {
    payload.phone = data.phone.trim();
  }

  if (data.password && data.password.trim()) {
    payload.password = data.password.trim();
  }

  if (data.graduation_year) {
    payload.graduation_year = Number(data.graduation_year);
  }

  if (data.employment_status_id) {
    payload.employment_status_id = data.employment_status_id;
  }

  if (data.current_company_id) {
    payload.current_company_id = data.current_company_id;
  }

  if (data.current_position && data.current_position.trim()) {
    payload.current_position = data.current_position.trim();
  }

  if (data.social_media && data.social_media.trim()) {
    payload.social_media = data.social_media.trim();
  }

  return payload;
}

export const toCreateSiswaPayload = toSiswaPayload;

export function usePortfolioUploadForm(defaultCategoryId: string = "") {
  return useForm<PortfolioUploadSchemaType>({
    resolver: zodResolver(portfolioUploadSchema),
    defaultValues: {
      category_id: defaultCategoryId,
      title: "",
      description: "",
      file: undefined,
    },
  });
}
