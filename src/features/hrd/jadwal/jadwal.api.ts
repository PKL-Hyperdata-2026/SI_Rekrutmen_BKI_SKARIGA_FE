import { api } from "@/api/axios";
import type {
  JadwalItem,
  JadwalPayload,
  PesertaJadwalItem,
  LowonganOption,
} from "./jadwal.schema";

export const jadwalApi = {
  getJadwalList: async (): Promise<JadwalItem[]> => {
    const response = await api.get<{
      success: boolean;
      data: JadwalItem[];
    }>("/hrd/schedules");
    return response.data.data;
  },

  getLowonganOptions: async (): Promise<LowonganOption[]> => {
    const response = await api.get<{
      success: boolean;
      data: LowonganOption[];
    }>("/hrd/schedules/vacancies");
    return response.data.data;
  },

  createJadwal: async (payload: JadwalPayload): Promise<JadwalItem> => {
    const response = await api.post<{
      success: boolean;
      data: JadwalItem[];
    }>("/hrd/schedules", payload);
    return response.data.data as unknown as JadwalItem;
  },

  getPesertaList: async (scheduleId: string | number): Promise<PesertaJadwalItem[]> => {
    const safeId = encodeURIComponent(String(scheduleId));
    const response = await api.get<{
      success: boolean;
      data: PesertaJadwalItem[];
    }>(`/hrd/schedules/${safeId}/participants`);
    return response.data.data;
  },

  sendReminder: async (
    scheduleId: string | number,
    participantId: string | number
  ): Promise<{ success: boolean; message: string }> => {
    const safeScheduleId = encodeURIComponent(String(scheduleId));
    const safeParticipantId = encodeURIComponent(String(participantId));
    const response = await api.post<{
      success: boolean;
      message: string;
      data: { success: boolean };
    }>(`/hrd/schedules/${safeScheduleId}/participants/${safeParticipantId}/reminder`);
    return {
      success: response.data.success,
      message: response.data.message || "Pengingat berhasil dikirim.",
    };
  },
};
