import { api } from "@/api/axios";

export const validasiPresensiApi = {
  getVacancies: () =>
    api.get("/admin/attendances/vacancies"),
  getQueue: (params?: Record<string, string | number>) =>
    api.get("/admin/attendances/queue", { params }),
  getHistory: (params?: Record<string, string | number>) =>
    api.get("/admin/attendances/history", { params }),
  bulkValidate: (data: {
    attendance_ids: Array<string | number>;
    validation_status: "verified" | "rejected";
    system_action: string;
  }) => api.patch("/admin/attendances/bulk-validate", data),
  validateSingle: (
    id: string | number,
    data: {
      validation_status: "verified" | "rejected";
      system_action: string;
    }
  ) =>
    api.patch(`/admin/attendances/${encodeURIComponent(String(id))}/validate`, data),
};
