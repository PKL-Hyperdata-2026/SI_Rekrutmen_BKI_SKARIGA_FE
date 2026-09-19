import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  alumniFormSchema,
  alumniPortfolioUploadSchema,
  type AlumniFormSchemaType,
  type AlumniPortfolioUploadSchemaType,
  type AlumniItem,
  type AlumniReferenceItem,
} from "./alumni.schema";

export function findMatchingOptionId(
  options?: AlumniReferenceItem[],
  ref?: string | AlumniReferenceItem | null
): string;
export function findMatchingOptionId(
  ref: string | AlumniReferenceItem | null | undefined,
  options?: AlumniReferenceItem[]
): string;
export function findMatchingOptionId(
  arg1?: AlumniReferenceItem[] | string | AlumniReferenceItem | null,
  arg2?: string | AlumniReferenceItem | null | AlumniReferenceItem[]
): string {
  let list: AlumniReferenceItem[] = [];
  let target: string | AlumniReferenceItem | null | undefined = null;

  if (Array.isArray(arg1)) {
    list = arg1;
    target = arg2 as string | AlumniReferenceItem | null | undefined;
  } else if (Array.isArray(arg2)) {
    list = arg2;
    target = arg1 as string | AlumniReferenceItem | null | undefined;
  } else {
    return "";
  }

  if (!target || !list.length) return "";

  if (typeof target === "string") {
    const trimmed = target.trim().toLowerCase();
    if (!trimmed) return "";
    const match = list.find(
      (item) =>
        (item.code && item.code.toLowerCase() === trimmed) ||
        item.name.toLowerCase() === trimmed ||
        String(item.id) === target
    );
    return match ? String(match.id) : "";
  }

  const match = list.find(
    (item) =>
      (target.code && item.code && item.code.toLowerCase() === target.code.toLowerCase()) ||
      (target.name && item.name.toLowerCase() === target.name.toLowerCase()) ||
      (target.id && String(item.id) === String(target.id))
  );

  return match ? String(match.id) : "";
}

export function findMatchingClassId(
  classes?: AlumniReferenceItem[],
  classRef?: string | AlumniReferenceItem | null
): string;
export function findMatchingClassId(
  classRef: string | AlumniReferenceItem | null | undefined,
  classes?: AlumniReferenceItem[]
): string;
export function findMatchingClassId(
  arg1?: AlumniReferenceItem[] | string | AlumniReferenceItem | null,
  arg2?: string | AlumniReferenceItem | null | AlumniReferenceItem[]
): string {
  return findMatchingOptionId(arg1 as never, arg2 as never);
}

export function findMatchingMajorId(
  majors?: AlumniReferenceItem[],
  majorRef?: string | AlumniReferenceItem | null
): string;
export function findMatchingMajorId(
  majorRef: string | AlumniReferenceItem | null | undefined,
  majors?: AlumniReferenceItem[]
): string;
export function findMatchingMajorId(
  arg1?: AlumniReferenceItem[] | string | AlumniReferenceItem | null,
  arg2?: string | AlumniReferenceItem | null | AlumniReferenceItem[]
): string {
  return findMatchingOptionId(arg1 as never, arg2 as never);
}

export function resolveMajorByClass(
  classId: string,
  classes: AlumniReferenceItem[] = [],
  majors: AlumniReferenceItem[] = []
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

export function useAlumniForm(alumni?: AlumniItem | null) {
  const isEdit = Boolean(alumni);
  const mode: "graduate" | "manual" = alumni && !alumni.userId ? "manual" : "graduate";

  const resolvedClassId = alumni?.classId ? String(alumni.classId) : "";

  const resolvedMajorId = alumni?.majorId ? String(alumni.majorId) : "";

  const resolvedStatusId = alumni?.employmentStatusId
    ? String(alumni.employmentStatusId)
    : "";

  const resolvedCompanyId = alumni?.currentCompanyId
    ? String(alumni.currentCompanyId)
    : "";

  const profileUrl =
    typeof alumni?.socialMedia === "string"
      ? alumni.socialMedia
      : (alumni?.socialMedia?.profile_url as string) ||
        (alumni?.socialMedia?.linkedin as string) ||
        "";

  return useForm<AlumniFormSchemaType>({
    resolver: zodResolver(alumniFormSchema),
    defaultValues: {
      mode,
      user_id: alumni?.userId ? String(alumni.userId) : "",
      nis: alumni?.nis || "",
      full_name: alumni?.fullName || alumni?.user?.fullName || "",
      phone: alumni?.phone || alumni?.user?.phone || "",
      email: alumni?.email || alumni?.user?.email || "",
      major_id: resolvedMajorId,
      class_id: resolvedClassId,
      graduation_year: alumni?.graduationYear
        ? String(alumni.graduationYear)
        : String(new Date().getFullYear()),
      employment_status_id: resolvedStatusId,
      current_company_id: resolvedCompanyId,
      current_position: alumni?.currentPosition || "",
      profile_url: profileUrl,
      company_name_manual:
        alumni?.currentCompany?.name ||
        (alumni as { companyNameManual?: string })?.companyNameManual ||
        "",
      starting_salary: alumni?.startingSalary ? String(alumni.startingSalary) : "",
      waiting_time_months: alumni?.waitingTimeMonths
        ? String(alumni.waitingTimeMonths)
        : "",
      is_active: isEdit ? (alumni?.isActive ?? true) : true,
    },
  });
}

export function useAlumniPortfolioUploadForm(defaultCategoryId: string = "") {
  return useForm<AlumniPortfolioUploadSchemaType>({
    resolver: zodResolver(alumniPortfolioUploadSchema),
    defaultValues: {
      category_id: defaultCategoryId || "",
      title: "",
      description: "",
      file: undefined,
    },
  });
}

export function toCreateAlumniPayload(data: AlumniFormSchemaType): Record<string, unknown> {
  let cleanProfileUrl = data.profile_url?.trim() || null;
  if (cleanProfileUrl && !/^https?:\/\//i.test(cleanProfileUrl)) {
    cleanProfileUrl = `https://${cleanProfileUrl}`;
  }

  const payload: Record<string, unknown> = {
    full_name: data.full_name.trim(),
    nis: data.nis.trim(),
    major_id: data.major_id,
    graduation_year: parseInt(data.graduation_year, 10),
    user_id: data.user_id ? data.user_id : null,
    class_id: data.class_id ? data.class_id : null,
    phone: data.phone?.trim() || null,
    email: data.email?.trim() || null,
    employment_status_id: data.employment_status_id || null,
    current_company_id: data.current_company_id || null,
    company_name: data.company_name_manual?.trim() || null,
    current_position: data.current_position?.trim() || null,
    social_media: cleanProfileUrl
      ? {
          profile_url: cleanProfileUrl,
          linkedin: cleanProfileUrl,
        }
      : null,
    starting_salary: data.starting_salary ? parseFloat(data.starting_salary) : null,
    waiting_time_months: data.waiting_time_months
      ? parseInt(data.waiting_time_months, 10)
      : null,
    is_active: data.is_active,
  };

  return payload;
}

export const toUpdateAlumniPayload = toCreateAlumniPayload;
export const toAlumniPayload = toCreateAlumniPayload;
