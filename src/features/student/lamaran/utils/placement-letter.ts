import { toast } from "@/components/custom/sonner";
import type { StudentJobApplication } from "../lamaran.schema";

export function downloadPlacementLetter(
  application: StudentJobApplication
): void {
  const realUrl = application.selectionResult?.letterUrl;
  if (realUrl) {
    const companyName = application.vacancy?.companyName || "Perusahaan";
    const filePrefix = companyName.replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `Surat_Penempatan_${filePrefix}.pdf`;

    const link = document.createElement("a");
    link.href = realUrl;
    link.download = fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  toast.info(
    "Surat penempatan resmi sedang dalam proses penerbitan oleh HRD. Silakan hubungi panitia BKK atau cek secara berkala.",
    {
      description:
        "Dokumen penempatan akan otomatis dapat diunduh di sini setelah pihak HRD mengunggahnya pada rekap hasil seleksi.",
    }
  );
}
