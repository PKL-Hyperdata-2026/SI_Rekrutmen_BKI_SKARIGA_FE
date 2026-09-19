import { PageHeader } from "@/components/custom";

export function ReviewPage() {
  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <PageHeader
        variant="hrd"
        title="Review Pelamar & Verifikasi Berkas"
        description="Tinjau kelengkapan berkas dan tentukan kelulusan seleksi administrasi setiap pelamar."
      />
    </div>
  );
}
