import { PageHeader } from "@/components/custom";
import { UserPlus, Printer } from "lucide-react";

export const DataSiswaPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        variant="admin"
        title="Data Siswa Kelas 12 Aktif"
        description="Kelola data siswa aktif, NISN, jurusan, kelas, dan berkas portofolio siswa."
      >
        <PageHeader.Button
          variant="primary"
          icon={<UserPlus className="h-4 w-4" />}
        >
          Tambah Siswa
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