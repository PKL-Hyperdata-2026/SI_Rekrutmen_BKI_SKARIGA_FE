import { PageHeader } from "@/components/custom";
import { Store, Printer } from "lucide-react";

export const LowonganKerjaPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        variant="admin"
        title="Data Lowongan Kerja"
        description="Manajemen pembukaan lowongan kerja, kualifikasi, kuota pelamar, dan jadwal seleksi."
      >
        <PageHeader.Button
          variant="primary"
          icon={<Store className="h-4 w-4" />}
        >
          Tambah Lowongan Kerja
        </PageHeader.Button>
        <PageHeader.Button
          variant="glass"
          icon={<Printer className="h-4 w-4" />}
        >
          Import Excel
        </PageHeader.Button>
      </PageHeader>
    </div>
  );
};