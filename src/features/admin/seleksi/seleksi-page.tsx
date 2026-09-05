import { GenericDummyPage } from "@/components/custom";

export function SeleksiPage() {
  return (
    <GenericDummyPage
      title="Seleksi Rekrutmen"
      description="Pantau dan kelola tahapan seleksi rekrutmen peserta (Administrasi, Psikotes, Interview, dll)."
      variant="admin"
    />
  );
}

export const SeleksiRekrutmenPage = SeleksiPage;
