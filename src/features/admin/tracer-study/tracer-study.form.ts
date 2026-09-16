import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  adminTracerStudySchema,
  type AdminTracerFormData,
  type AdminTracerItem,
  type SubmitAdminTracerPayload,
} from "./tracer-study.schema";

export const DEFAULT_ADMIN_TRACER_FORM_VALUES: AdminTracerFormData = {
  student_alumni_id: "",
  career_status: "bekerja",
  company_name: "",
  company_sector: "",
  job_title: "",
  job_location: "",
  minimum_salary: "",
  maximum_salary: "",
  waiting_period: "",
  accepted_date: "",
  start_date: "",
  business_name: "",
  business_address: "",
  instagram_handle: "",
  average_income: "",
  business_field: "",
  business_start_date: "",
  university_name: "",
  study_program: "",
};

export const formatCurrencyString = (val?: string | number | null): string => {
  if (!val && val !== 0) return "";
  const digits = String(val).replace(/\D/g, "");
  if (!digits) return "";
  return new Intl.NumberFormat("id-ID").format(Number(digits));
};

export const parseCurrencyNumber = (val?: string | null): number | null => {
  if (!val) return null;
  const digits = val.replace(/\D/g, "");
  if (!digits) return null;
  const num = parseInt(digits, 10);
  return isNaN(num) ? null : num;
};

export const toAdminTracerDefaultValues = (
  item?: AdminTracerItem | null
): AdminTracerFormData => {
  if (!item) return DEFAULT_ADMIN_TRACER_FORM_VALUES;

  return {
    student_alumni_id: item.studentAlumniId || item.studentAlumni?.id || "",
    career_status: item.careerStatus || "bekerja",
    company_name: item.companyName || "",
    company_sector: item.companySector || "",
    job_title: item.jobTitle || "",
    job_location: item.jobLocation || "",
    minimum_salary: formatCurrencyString(item.minimumSalary),
    maximum_salary: formatCurrencyString(item.maximumSalary),
    waiting_period: item.waitingPeriod || "",
    accepted_date: item.acceptedDate ? item.acceptedDate.substring(0, 10) : "",
    start_date: item.startDate ? item.startDate.substring(0, 10) : "",
    business_name: item.businessName || "",
    business_address: item.businessAddress || "",
    instagram_handle: item.instagramAccount || "",
    average_income: item.averageRevenue || "",
    business_field: item.businessField || "",
    business_start_date: item.businessStartDate
      ? item.businessStartDate.substring(0, 10)
      : "",
    university_name: item.universityName || "",
    study_program: item.studyProgram || "",
  };
};

export const toSubmitAdminTracerPayload = (
  values: AdminTracerFormData
): SubmitAdminTracerPayload => {
  const base: SubmitAdminTracerPayload = {
    student_alumni_id: values.student_alumni_id,
    career_status: values.career_status,
  };

  if (values.career_status === "bekerja") {
    base.company_name = values.company_name.trim();
    base.company_sector = values.company_sector.trim() || null;
    base.job_title = values.job_title.trim();
    base.job_location = values.job_location.trim() || null;
    base.minimum_salary = parseCurrencyNumber(values.minimum_salary);
    base.maximum_salary = parseCurrencyNumber(values.maximum_salary);
    base.waiting_period = values.waiting_period || null;
    base.accepted_date = values.accepted_date || null;
    base.start_date = values.start_date || null;
  } else if (values.career_status === "wirausaha") {
    base.business_name = values.business_name.trim();
    base.business_address = values.business_address.trim() || null;
    base.instagram_handle = values.instagram_handle.trim() || null;
    base.average_income = values.average_income || null;
    base.business_field = values.business_field || null;
    base.business_start_date = values.business_start_date || null;
  } else if (values.career_status === "lanjut_studi") {
    base.university_name = values.university_name.trim();
    base.study_program = values.study_program.trim();
  }

  return base;
};

export function useAdminTracerStudyForm(item?: AdminTracerItem | null) {
  return useForm<AdminTracerFormData>({
    resolver: zodResolver(adminTracerStudySchema),
    defaultValues: toAdminTracerDefaultValues(item),
    mode: "onBlur",
  });
}
