import { useMemo } from "react";

export interface BerkasFeatureItem {
  id: string;
  title: string;
  description: string;
}

export function useDashboardBerkas() {
  const features: BerkasFeatureItem[] = useMemo(
    () => [
      {
        id: "email_auto",
        title: "Email Lowongan Auto",
        description: "Notifikasi otomatis terkirim ke email pelamar",
      },
      {
        id: "sync_gps",
        title: "Sync Kehadiran GPS",
        description: "Hasil absensi peserta terintregasi dari BKK",
      },
      {
        id: "monitoring_penempatan",
        title: "Monitoring Penempatan",
        description: "Siswa diterima otomatis dikirimkan ke Tracer Study",
      },
    ],
    [],
  );

  return { features };
}

