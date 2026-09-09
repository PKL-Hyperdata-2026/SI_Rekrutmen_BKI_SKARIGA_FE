import { PageHeader } from "@/components/custom";

export function LowonganPage() {
  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <PageHeader
        variant="hrd"
        title="Manajemen Posisi Rekrutmen"
        description="Buat & Kelola Lowongan Pekerjaan."
      />
    </div>
  );
}
