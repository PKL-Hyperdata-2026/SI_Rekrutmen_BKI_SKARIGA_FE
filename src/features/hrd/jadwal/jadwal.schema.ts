import { z } from "zod";

export const tahapSeleksiEnum = z.enum([
  "administrasi",
  "psikotes",
  "interview",
  "mcu",
  "final",
]);
export type TahapSeleksi = z.infer<typeof tahapSeleksiEnum>;

export const statusSesiEnum = z.enum([
  "draft",
  "siap",
  "berjalan",
  "selesai",
  "dibatalkan",
]);
export type StatusSesiJadwal = z.infer<typeof statusSesiEnum>;

export const statusKehadiranEnum = z.enum([
  "hadir",
  "belum_presensi",
  "tidak_hadir",
  "izin",
]);
export type StatusKehadiranPeserta = z.infer<typeof statusKehadiranEnum>;

export const jadwalFormSchema = z.object({
  namaAgenda: z.string().min(1, "Nama agenda wajib diisi."),
  lowonganId: z.string().min(1, "Lowongan kerja wajib dipilih."),
  nilaiMinimum: z.string().min(1, "Nilai minimum diterima wajib diisi."),
  tanggalPelaksanaan: z.string().min(1, "Tanggal pelaksanaan wajib diisi."),
  waktuMulai: z.string().min(1, "Waktu mulai wajib diisi."),
  lokasi: z.string().min(1, "Lokasi atau tautan daring wajib diisi."),
  deskripsi: z.string().optional().or(z.literal("")),
  kirimNotifikasi: z.boolean(),
});

export type JadwalFormValues = z.infer<typeof jadwalFormSchema>;

export interface JadwalPayload {
  nama_agenda: string;
  job_vacancy_id: string | number;
  nilai_minimum: number;
  tanggal_pelaksanaan: string;
  waktu_mulai: string;
  lokasi: string;
  deskripsi?: string | null;
  kirim_notifikasi: boolean;
}

export interface JadwalItem {
  id: string | number;
  namaAgenda: string;
  totalPeserta: number;
  posisiLowongan: string;
  lowonganId: string | number;
  tahapSeleksi: TahapSeleksi;
  tahapSeleksiLabel: string;
  tanggalPelaksanaan: string;
  waktuMulai: string;
  lokasi: string;
  deskripsi?: string | null;
  nilaiMinimum?: number | null;
  statusSesi: StatusSesiJadwal;
  statusSesiLabel: string;
  hasHasil: boolean;
}

export interface PesertaJadwalItem {
  id: string | number;
  namaKandidat: string;
  nis: string;
  nisn: string;
  email: string;
  statusKehadiran: StatusKehadiranPeserta;
  statusKehadiranLabel: string;
  reminderSent?: boolean;
}

export interface LowonganOption {
  value: string;
  label: string;
}
