import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  alumniFormSchema,
  type AlumniFormSchemaType,
  type AlumniItem,
} from "./alumni.schema";

export function useAlumniForm(alumni?: AlumniItem | null) {
  return useForm<AlumniFormSchemaType>({
    resolver: zodResolver(alumniFormSchema),
    defaultValues: {
      user_id: alumni?.userId ? String(alumni.userId) : "",
      nis: alumni?.nis || "",
      full_name: alumni?.fullName || alumni?.user?.fullName || "",
      phone: alumni?.phone || alumni?.user?.phone || "",
      major_id: alumni?.majorId ? String(alumni.majorId) : "",
      class_id: alumni?.classId ? String(alumni.classId) : "",
      graduation_year: alumni?.graduationYear
        ? String(alumni.graduationYear)
        : String(new Date().getFullYear()),
      employment_status_id: alumni?.employmentStatusId
        ? String(alumni.employmentStatusId)
        : "",
      current_company_id: alumni?.currentCompanyId
        ? String(alumni.currentCompanyId)
        : "",
      current_position: alumni?.currentPosition || "",
      starting_salary: alumni?.startingSalary ? String(alumni.startingSalary) : "",
      waiting_time_months: alumni?.waitingTimeMonths
        ? String(alumni.waitingTimeMonths)
        : "",
      is_active: alumni ? alumni.isActive : true,
    },
  });
}

export function toCreateAlumniPayload(data: AlumniFormSchemaType): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    full_name: data.full_name,
    major_id: data.major_id,
    graduation_year: parseInt(data.graduation_year, 10),
  };

  if (data.user_id) {
    payload.user_id = data.user_id;
  }
  if (data.nis) {
    payload.nis = data.nis;
  }
  if (data.phone) {
    payload.phone = data.phone;
  }
  if (data.class_id) {
    payload.class_id = data.class_id;
  }
  if (data.employment_status_id) {
    payload.employment_status_id = data.employment_status_id;
  }
  if (data.current_company_id) {
    payload.current_company_id = data.current_company_id;
  }
  if (data.current_position) {
    payload.current_position = data.current_position;
  }
  if (data.starting_salary) {
    payload.starting_salary = parseFloat(data.starting_salary);
  }
  if (data.waiting_time_months) {
    payload.waiting_time_months = parseInt(data.waiting_time_months, 10);
  }

  return payload;
}
