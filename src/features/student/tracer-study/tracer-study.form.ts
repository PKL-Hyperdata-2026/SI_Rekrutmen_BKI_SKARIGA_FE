import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  studentTracerStudySchema,
  type TracerStudyFormData,
  type TracerStudyData,
  type SubmitTracerPayload,
} from "./tracer-study.schema";

export const DEFAULT_TRACER_FORM_VALUES: TracerStudyFormData = {
  career_status: "bekerja",
  company_name: "",
  job_title: "",
  minimum_salary: "",
  maximum_salary: "",
  waiting_period: "",
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

export const parseCurrencyNumber = (val?: string | null): number | null => {
  if (!val) return null;
  const digits = val.replace(/\D/g, "");
  if (!digits) return null;
  const num = parseInt(digits, 10);
  return isNaN(num) ? null : num;
};

export const formatCurrencyString = (val?: string | number | null): string => {
  if (!val && val !== 0) return "";
  const digits = String(val).replace(/\D/g, "");
  if (!digits) return "";
  return new Intl.NumberFormat("id-ID").format(Number(digits));
};

export const toTracerStudyDefaultValues = (
  initialData?: TracerStudyData | null
): TracerStudyFormData => {
  if (!initialData) return DEFAULT_TRACER_FORM_VALUES;

  return {
    career_status: initialData.careerStatus || "bekerja",
    company_name: initialData.companyName || "",
    job_title: initialData.jobTitle || "",
    minimum_salary: formatCurrencyString(initialData.minimumSalary),
    maximum_salary: formatCurrencyString(initialData.maximumSalary),
    waiting_period: initialData.waitingPeriod || "",
    start_date: initialData.startDate ? initialData.startDate.substring(0, 10) : "",
    business_name: initialData.businessName || "",
    business_address: initialData.businessAddress || "",
    instagram_handle: initialData.instagramAccount || "",
    average_income: initialData.averageRevenue || "",
    business_field: initialData.businessField || "",
    business_start_date: initialData.businessStartDate
      ? initialData.businessStartDate.substring(0, 10)
      : "",
    university_name: initialData.universityName || "",
    study_program: initialData.studyProgram || "",
  };
};

export const toSubmitTracerPayload = (
  values: TracerStudyFormData
): SubmitTracerPayload => {
  const base: SubmitTracerPayload = {
    career_status: values.career_status,
  };

  if (values.career_status === "bekerja") {
    base.company_name = values.company_name.trim();
    base.job_title = values.job_title.trim();
    base.minimum_salary = parseCurrencyNumber(values.minimum_salary);
    base.maximum_salary = parseCurrencyNumber(values.maximum_salary);
    base.waiting_period = values.waiting_period || null;
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

export function useStudentTracerStudyForm(initialData?: TracerStudyData | null) {
  return useForm<TracerStudyFormData>({
    resolver: zodResolver(studentTracerStudySchema),
    defaultValues: toTracerStudyDefaultValues(initialData),
    mode: "onBlur",
  });
}
