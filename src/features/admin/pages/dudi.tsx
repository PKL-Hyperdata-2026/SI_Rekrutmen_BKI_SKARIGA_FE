import { PageHeader } from "@/components/custom";
import { Store, Printer } from "lucide-react";

export const PerusahaanDudiPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        variant="admin"
        title="Data Industri Mitra"
        description="Kelola direktori mitra industri (DUDI), MoU kerjasama, kuota magang, dan kontak HRD."
      >
        <PageHeader.Button
          variant="primary"
          icon={<Store className="h-4 w-4" />}
        >
          Tambah Industri Mitra
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

export const MitraDUDIPage = PerusahaanDudiPage;