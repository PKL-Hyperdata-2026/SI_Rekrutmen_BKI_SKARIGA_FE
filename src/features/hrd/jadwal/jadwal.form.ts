import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  jadwalFormSchema,
  type JadwalFormValues,
  type JadwalPayload,
} from "./jadwal.schema";

export const DEFAULT_JADWAL_FORM_VALUES: JadwalFormValues = {
  namaAgenda: "",
  lowonganId: "",
  nilaiMinimum: "",
  tanggalPelaksanaan: "",
  waktuMulai: "",
  lokasi: "",
  deskripsi: "",
  kirimNotifikasi: true,
};

export function toJadwalPayload(values: JadwalFormValues): JadwalPayload {
  return {
    nama_agenda: values.namaAgenda.trim(),
    job_vacancy_id: values.lowonganId,
    nilai_minimum: Number.parseFloat(values.nilaiMinimum) || 0,
    tanggal_pelaksanaan: values.tanggalPelaksanaan,
    waktu_mulai: values.waktuMulai.trim(),
    lokasi: values.lokasi.trim(),
    deskripsi: values.deskripsi?.trim() || null,
    kirim_notifikasi: Boolean(values.kirimNotifikasi),
  };
}

export function useJadwalForm(initialValues?: Partial<JadwalFormValues>) {
  return useForm<JadwalFormValues>({
    resolver: zodResolver(jadwalFormSchema),
    defaultValues: {
      ...DEFAULT_JADWAL_FORM_VALUES,
      ...initialValues,
    },
    mode: "onBlur",
  });
}
