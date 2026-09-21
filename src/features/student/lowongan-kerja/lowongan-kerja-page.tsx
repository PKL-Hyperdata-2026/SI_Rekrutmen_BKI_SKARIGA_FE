import { PageHeader } from "@/components/custom/page-header";
import { Sparkles, BellRing, Briefcase, RotateCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/custom/table/data-table-pagination";
import { LowonganKerjaFilter } from "./lowongan-kerja-filter";
import { useLowonganKerjaPage } from "./lowongan-kerja.page";
import {
  LowonganKerjaCard,
  LowonganKerjaCardSkeleton,
} from "./lowongan-kerja-card";
import { LowonganKerjaForm } from "./lowongan-kerja-form";

export function LowonganKerjaPage() {
  const {
    filter,
    vacancies,
    hasVacancies,
    isLoadingVacancies,
    emptyTitle,
    emptyDescription,
    currentPage,
    lastPage,
    totalItems,
    selectedVacancy,
    isFormOpen,
    onFormOpenChange,
    onPageChange,
    reloadVacancies,
    handleApply,
  } = useLowonganKerjaPage();

  return (
    <CardContent className="theme-siswa space-y-6 p-0">
      <PageHeader
        variant="student"
        badgeIcon={<Sparkles className="h-3.5 w-3.5" />}
        title="Katalog Lowongan Kerja"
        description="Temukan peluang karir terbaik dari industri mitra resmi SKARIGA."
      >
        <PageHeader.NotificationCard
          icon={<BellRing className="size-5 text-white" fill="currentColor" />}
          title="Email Notification Above"
          description="Info panggilan tes otomatis via Email"
        />
      </PageHeader>

      <LowonganKerjaFilter
        departmentOptions={filter.departmentOptions}
        majorOptions={filter.majorOptions}
        targetOptions={filter.targetOptions}
        locationOptions={filter.locationOptions}
        selectedDepartment={filter.selectedDepartment}
        selectedMajor={filter.selectedMajor}
        selectedTarget={filter.selectedTarget}
        selectedLocation={filter.selectedLocation}
        onDepartmentChange={filter.onDepartmentChange}
        onMajorChange={filter.onMajorChange}
        onTargetChange={filter.onTargetChange}
        onLocationChange={filter.onLocationChange}
        isLoading={filter.isLoading}
      />

      <CardContent className="space-y-6 p-0">
        {isLoadingVacancies ? (
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 p-0">
            {Array.from({ length: 9 }).map((_, idx) => (
              <LowonganKerjaCardSkeleton key={idx} />
            ))}
          </CardContent>
        ) : !hasVacancies ? (
          <Card className="rounded-xl border border-dashed border-slate-200/90 p-10 sm:p-14 text-center flex flex-col items-center justify-center gap-3.5 bg-white shadow-2xs">
            <CardContent className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 p-0">
              <Briefcase className="size-6 text-slate-400" />
            </CardContent>
            <CardContent className="space-y-1.5 p-0">
              <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-sans">
                {emptyTitle}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-slate-500 max-w-sm sm:max-w-md mx-auto leading-relaxed font-sans">
                {emptyDescription}
              </CardDescription>
            </CardContent>
            {filter.isFiltered && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={filter.resetFilters}
                className="mt-1 h-9 px-4 rounded-lg border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition-all gap-2 cursor-pointer"
              >
                <RotateCcw className="size-3.5 text-slate-500" />
                <Badge
                  variant="outline"
                  className="border-none bg-transparent p-0 text-xs font-semibold text-slate-700 hover:text-slate-900 shadow-none"
                >
                  Atur Ulang Filter
                </Badge>
              </Button>
            )}
          </Card>
        ) : (
          <CardContent className="space-y-6 p-0">
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 p-0">
              {vacancies.map((vacancy) => (
                <LowonganKerjaCard
                  key={vacancy.id}
                  vacancy={vacancy}
                  onApply={handleApply}
                />
              ))}
            </CardContent>

            {totalItems > 0 && (
              <Card className="rounded-lg border border-slate-200/80 bg-white shadow-xs overflow-hidden p-0 gap-0 ring-0">
                <DataTablePagination
                  currentPage={currentPage}
                  totalPages={lastPage}
                  totalItems={totalItems}
                  pageSize={9}
                  onPageChange={onPageChange}
                  role="siswa"
                  showPageSizeSelector={false}
                  className="border-t-0 bg-transparent"
                />
              </Card>
            )}
          </CardContent>
        )}
      </CardContent>

      <LowonganKerjaForm
        open={isFormOpen}
        onOpenChange={onFormOpenChange}
        vacancy={selectedVacancy}
        onApplySuccess={reloadVacancies}
      />
    </CardContent>
  );
}
