import type {
  StatusSesiJadwal,
  TahapSeleksi,
  StatusKehadiranPeserta,
} from "./jadwal.schema";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export function formatScheduleDateTime(
  dateStr?: string | null,
  timeStr?: string | null
): string {
  if (!dateStr) return "-";

  let formattedDate = dateStr;
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = Number.parseInt(parts[1], 10) - 1;
      const day = Number.parseInt(parts[2], 10);
      const monthName = MONTH_NAMES[monthIndex] || parts[1];
      formattedDate = `${day} ${monthName} ${year}`;
    }
  } catch {
    formattedDate = dateStr;
  }

  const formattedTime = timeStr ? `${timeStr} WIB` : "";
  if (!formattedTime) return formattedDate;

  return `${formattedDate} • ${formattedTime}`;
}

export function getStatusSesiBadgeClass(status: StatusSesiJadwal): string {
  switch (status) {
    case "siap":
      return "border-emerald-500 text-emerald-600 bg-white";
    case "selesai":
      return "border-amber-500 text-amber-600 bg-white";
    case "berjalan":
      return "border-blue-500 text-blue-600 bg-white";
    case "dibatalkan":
      return "border-rose-500 text-rose-600 bg-white";
    case "draft":
    default:
      return "border-slate-300 text-slate-600 bg-white";
  }
}

export function getTahapSeleksiBadgeClass(tahap: TahapSeleksi): string {
  switch (tahap) {
    case "psikotes":
      return "border-purple-300 text-purple-700 bg-purple-50/70";
    case "interview":
      return "border-indigo-300 text-indigo-700 bg-indigo-50/70";
    case "mcu":
      return "border-teal-300 text-teal-700 bg-teal-50/70";
    case "final":
      return "border-emerald-300 text-emerald-700 bg-emerald-50/70";
    case "administrasi":
    default:
      return "border-slate-300 text-slate-700 bg-slate-50/70";
  }
}

export function getStatusKehadiranBadgeClass(
  status: StatusKehadiranPeserta
): string {
  switch (status) {
    case "hadir":
      return "border-emerald-500 text-emerald-600 bg-white";
    case "belum_presensi":
      return "border-amber-500 text-amber-600 bg-white";
    case "tidak_hadir":
      return "border-rose-500 text-rose-600 bg-white";
    case "izin":
      return "border-sky-500 text-sky-600 bg-white";
    default:
      return "border-slate-300 text-slate-600 bg-white";
  }
}

export function getTahapLabel(tahap: TahapSeleksi): string {
  switch (tahap) {
    case "psikotes":
      return "Psikotes";
    case "interview":
      return "Interview";
    case "mcu":
      return "Medical Check Up";
    case "final":
      return "Tahap Akhir";
    case "administrasi":
    default:
      return "Administrasi";
  }
}
