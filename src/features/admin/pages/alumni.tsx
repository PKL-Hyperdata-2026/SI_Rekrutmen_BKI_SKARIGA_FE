import { PageHeader } from "@/components/custom";
import { UserPlus, Printer } from "lucide-react";

export const DataAlumniPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        variant="admin"
        title="Data Alumni Skariga"
        description="Database riwayat lulusan, status keterserapan kerja, wirausaha, dan lanjut studi."
      >
        <PageHeader.Button
          variant="primary"
          icon={<UserPlus className="h-4 w-4" />}
        >
          Tambah Alumni
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