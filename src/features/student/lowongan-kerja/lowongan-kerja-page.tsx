import { PageHeader } from "@/components/custom/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, BellRing } from "lucide-react";

export function LowonganKerjaPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        variant="student"
        badge="Bursa Kerja Khusus (BKK) Skariga"
        badgeIcon={<Sparkles className="h-3.5 w-3.5" />}
        title="Katalog Lowongan Kerja"
        description="Temukan peluang karir terbaik dari industri mitra resmi SKARIGA."
      >
        <PageHeader.NotificationCard
          icon={<BellRing className="h-6 w-6 text-white" fill="currentColor" />}
          title="Email Notification Above"
          description="Info panggilan tes otomatis via Email"
        />
      </PageHeader>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">
            Daftar Lowongan Tersedia
          </CardTitle>
          <CardDescription>
            Pilih lowongan yang sesuai dengan keahlian dan jurusan kamu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-10 w-[250px] rounded-lg" />
              <Skeleton className="h-10 w-[120px] rounded-lg" />
            </div>
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <div className="flex justify-between mt-4">
              <Skeleton className="h-8 w-[100px] rounded" />
              <Skeleton className="h-8 w-[200px] rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
