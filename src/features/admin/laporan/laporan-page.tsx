import { GenericDummyPage } from "@/components/custom";

export function LaporanPage() {
  return (
    <GenericDummyPage
      title="Laporan & Cetak"
      description="Cetak dan ekspor rekapitulasi data rekrutmen, statistik kelulusan, dan laporan DUDI."
      variant="admin"
    />
  );
}

export const LaporanCetakPage = LaporanPage;
