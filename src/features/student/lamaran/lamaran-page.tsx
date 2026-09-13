import { Link } from "react-router-dom";
import { PageHeader, DateRangePicker } from "@/components/custom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApplicationCard } from "./components/application-card";
import { ApplicationScheduleModal } from "./components/application-schedule-modal";
import { useLamaranPage } from "./hooks/useLamaranPage";

export const LamaranSaya = () => {
  const {
    applications,
    filteredApplications,
    loading,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    instructionModalOpen,
    setInstructionModalOpen,
    selectedApplicationForInstruction,
    handleOpenInstruction,
    stats,
    headerConfig,
  } = useLamaranPage();

  return (
    <div className="space-y-5">
      <PageHeader
        variant="student"
        badge={
          <span className="text-cyan-200 font-semibold tracking-wide">
            {headerConfig.badge}
          </span>
        }
        badgeIcon={<Briefcase className="h-3.5 w-3.5 text-cyan-200" />}
        title={headerConfig.title}
        description={headerConfig.description}
      >
        <div className="flex flex-col items-end gap-2.5 w-full sm:w-auto">
          <PageHeader.StatCard
            items={[
              {
                label: "Total Lamaran",
                value: stats.total,
              },
              {
                label: "Diterima",
                value: stats.diterima,
              },
              {
                label: "Gagal",
                value: stats.gagal,
                valueColor: "text-amber-300 font-extrabold",
              },
            ]}
          />

          <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              triggerVariant="glass-pill"
              variant="student"
              title="Filter Periode"
            />

            <div className="relative w-fit">
              <Select
                value={statusFilter}
                onValueChange={(val) => setStatusFilter(val)}
              >
                <SelectTrigger className="w-auto min-w-[140px] max-w-fit !text-white !bg-white/15 hover:!bg-white/25 !border !border-white/35 !backdrop-blur-[6px] !rounded-full !px-3.5 !py-1 !h-7.5 !text-xs font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all cursor-pointer !gap-2.5 [&_svg]:!text-white [&_svg]:!opacity-95 [&_svg]:!size-3.5 justify-between">
                  <SelectValue placeholder="Status Seleksi">
                    {statusFilter === "all"
                      ? "Status Seleksi"
                      : statusFilter === "accepted"
                      ? "Diterima / Lolos"
                      : statusFilter === "in_progress"
                      ? "Sedang Diproses"
                      : "Tidak Lolos"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent
                  align="end"
                  className="w-auto min-w-[var(--radix-select-trigger-width)] !bg-white/50 !backdrop-blur-2xl !border !border-white/60 !shadow-[0_12px_32px_rgba(0,0,0,0.22)] !rounded-2xl p-1.5 space-y-1"
                >
                  <SelectItem
                    value="all"
                    className={cn(
                      "text-xs font-bold rounded-xl cursor-pointer [&>span:first-child]:hidden !pr-3 !pl-3 !py-1.5 transition-all justify-start whitespace-nowrap",
                      statusFilter === "all"
                        ? "!bg-sky-600 !text-white shadow-xs focus:!bg-sky-600 focus:!text-white"
                        : "!text-sky-600 hover:!bg-sky-500/15 focus:!bg-sky-500/15 focus:!text-sky-600"
                    )}
                  >
                    Status Seleksi
                  </SelectItem>
                  <SelectItem
                    value="accepted"
                    className={cn(
                      "text-xs font-bold rounded-xl cursor-pointer [&>span:first-child]:hidden !pr-3 !pl-3 !py-1.5 transition-all justify-start whitespace-nowrap",
                      statusFilter === "accepted"
                        ? "!bg-sky-600 !text-white shadow-xs focus:!bg-sky-600 focus:!text-white"
                        : "!text-sky-600 hover:!bg-sky-500/15 focus:!bg-sky-500/15 focus:!text-sky-600"
                    )}
                  >
                    Diterima / Lolos
                  </SelectItem>
                  <SelectItem
                    value="in_progress"
                    className={cn(
                      "text-xs font-bold rounded-xl cursor-pointer [&>span:first-child]:hidden !pr-3 !pl-3 !py-1.5 transition-all justify-start whitespace-nowrap",
                      statusFilter === "in_progress"
                        ? "!bg-sky-600 !text-white shadow-xs focus:!bg-sky-600 focus:!text-white"
                        : "!text-sky-600 hover:!bg-sky-500/15 focus:!bg-sky-500/15 focus:!text-sky-600"
                    )}
                  >
                    Sedang Diproses
                  </SelectItem>
                  <SelectItem
                    value="rejected"
                    className={cn(
                      "text-xs font-bold rounded-xl cursor-pointer [&>span:first-child]:hidden !pr-3 !pl-3 !py-1.5 transition-all justify-start whitespace-nowrap",
                      statusFilter === "rejected"
                        ? "!bg-sky-600 !text-white shadow-xs focus:!bg-sky-600 focus:!text-white"
                        : "!text-sky-600 hover:!bg-sky-500/15 focus:!bg-sky-500/15 focus:!text-sky-600"
                    )}
                  >
                    Tidak Lolos
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PageHeader>

      <div className="space-y-3.5">
        {loading ? (
          // Loading Skeletons
          <div className="space-y-3.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48 rounded" />
                      <Skeleton className="h-3 w-36 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-44 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredApplications.length === 0 ? (
          applications.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                Belum Ada Lamaran Terkirim
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Kamu belum mengajukan lamaran pekerjaan apapun. Temukan peluang karier menarik dari perusahaan mitra BKK dan mulai melamar sekarang.
              </p>
              <div className="pt-1">
                <Link
                  to="/student/lowongan"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  Jelajahi Lowongan Kerja
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <FileQuestion className="h-6 w-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                Tidak Ada Lamaran Ditemukan
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tidak ada lamaran yang sesuai dengan status filter saat ini.
              </p>
            </div>
          )
        ) : (
          filteredApplications.map((app, index) => (
            <ApplicationCard
              key={`${app.id}-${index}`}
              application={app}
              onOpenInstruction={handleOpenInstruction}
            />
          ))
        )}
      </div>

      <ApplicationScheduleModal
        open={instructionModalOpen}
        onOpenChange={setInstructionModalOpen}
        application={selectedApplicationForInstruction}
      />
    </div>
  );
};

export const LamaranPage = LamaranSaya;
export default LamaranSaya;
