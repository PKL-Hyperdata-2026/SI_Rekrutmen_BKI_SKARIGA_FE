import type {
  JadwalItem,
  PesertaJadwalItem,
  JadwalFormValues,
} from "../jadwal.schema";

let sequenceId = 1;

export function buildJadwalItem(
  overrides: Partial<JadwalItem> = {}
): JadwalItem {
  const id = overrides.id ?? sequenceId++;
  return {
    id,
    namaAgenda: `Psikotes & Akademik - Batch ${id}`,
    totalPeserta: 25,
    posisiLowongan: "Junior Mechanic Operator",
    lowonganId: "vac-1",
    tahapSeleksi: "psikotes",
    tahapSeleksiLabel: "Psikotes",
    tanggalPelaksanaan: "2026-02-25",
    waktuMulai: "08:00",
    lokasi: "Aula SKARIGA lt2",
    statusSesi: "siap",
    statusSesiLabel: "Siap Dilaksanakan",
    hasHasil: false,
    ...overrides,
  };
}

export function buildPesertaJadwalItem(
  overrides: Partial<PesertaJadwalItem> = {}
): PesertaJadwalItem {
  const id = overrides.id ?? sequenceId++;
  const numericId = typeof id === "number" ? id : Number.parseInt(String(id), 10) || 1;
  return {
    id,
    namaKandidat: `Kandidat Uji ${id}`,
    nis: "25083",
    nisn: `0881303621${numericId % 10}`,
    email: `kandidat${id}@example.com`,
    statusKehadiran: "hadir",
    statusKehadiranLabel: "Hadir",
    reminderSent: false,
    ...overrides,
  };
}

export function buildJadwalFormValues(
  overrides: Partial<JadwalFormValues> = {}
): JadwalFormValues {
  return {
    namaAgenda: "Tes Praktik Mesin - Gelombang 2",
    lowonganId: "1",
    nilaiMinimum: "450",
    tanggalPelaksanaan: "2026-03-01",
    waktuMulai: "09:00",
    lokasi: "Bengkel Otomotif Pusat",
    deskripsi: "Membawa perlengkapan safety shoes dan wearpack.",
    kirimNotifikasi: true,
    ...overrides,
  };
}
