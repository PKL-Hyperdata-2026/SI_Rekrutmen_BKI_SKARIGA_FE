import { Building2 } from "lucide-react";
import { PageHeader } from "@/components/custom";
import { CardContent } from "@/components/ui/card";
import { useLowonganPage } from "./use-lowongan-page";
import { LowonganForm } from "./lowongan-form";
import { LowonganList } from "./lowongan-list";

export function LowonganPage() {
  const {
    statistics,
    options,
    isLoadingMeta,
    selectedVacancy,
    form,
    list,
  } = useLowonganPage();

  return (
    <CardContent className="w-full max-w-full min-w-0 flex flex-col gap-5 sm:gap-6 overflow-x-hidden p-0">
      <PageHeader
        variant="hrd"
        badge="Mitra Perusahaan BKK Skariga"
        badgeIcon={<Building2 className="h-3.5 w-3.5" />}
        title="Manajemen Posisi Rekrutmen"
        description="Buat & Kelola Lowongan Pekerjaan."
        className="p-4.5 sm:p-7 rounded-2xl sm:rounded-3xl max-w-full overflow-hidden"
      >
        <PageHeader.StatCard
          items={[
            { label: "Lowongan Aktif", value: statistics.active },
            { label: "Draft / Tutup", value: statistics.draft_closed },
          ]}
        />
      </PageHeader>

      {/* Responsive Grid: Left Form, Right Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        <div className="lg:col-span-5 xl:col-span-5">
          <LowonganForm
            formState={form}
            options={options}
            selectedVacancy={selectedVacancy}
            isLoadingOptions={isLoadingMeta}
          />
        </div>

        <div className="lg:col-span-7 xl:col-span-7">
          <LowonganList
            listState={list}
            selectedVacancyId={selectedVacancy?.id}
          />
        </div>
      </div>
    </CardContent>
  );
}

export default LowonganPage;
