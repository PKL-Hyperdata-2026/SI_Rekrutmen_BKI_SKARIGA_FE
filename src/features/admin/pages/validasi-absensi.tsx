import { PageHeader } from "@/components/custom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCw } from "lucide-react";

export const ValidasiAbsensiPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        variant="admin"
        title="Validasi Absensi Pelamar"
        description="Verifikasi dan validasi kehadiran peserta seleksi rekrutmen di lokasi tes secara realtime."
      >
        <PageHeader.Button
          variant="primary"
          icon={<RotateCw className="h-4 w-4" />}
        >
          Refresh Data
        </PageHeader.Button>
        <Select defaultValue="astra">
          <SelectTrigger className="!w-[240px] !bg-white/15 hover:!bg-white/25 !text-white !border !border-white/25 !rounded-xl px-3.5 h-10 text-xs sm:text-sm font-medium backdrop-blur-xs shadow-2xs transition-all duration-200 cursor-pointer gap-2 [&_svg]:!text-white [&_svg]:!opacity-100">
            <SelectValue placeholder="Filter Berdasarkan Lowongan" />
          </SelectTrigger>
          <SelectContent align="end" className="w-[280px]">
            <SelectItem value="all" className="text-xs">
              Semua Lowongan
            </SelectItem>
            <SelectItem value="astra" className="text-xs">
              PT Astra Honda Motor - Technician
            </SelectItem>
            <SelectItem value="es-kul-kul" className="text-xs">
              PT Es Kul Kul - Baker
            </SelectItem>
          </SelectContent>
        </Select>
      </PageHeader>
    </div>
  );
};