import { Search, Building2, Layers, CalendarCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type {
  SelectionJobVacancyOption,
  SelectionStageOption,
} from "../types";

export interface SeleksiFilterProps {
  vacancyOptions: SelectionJobVacancyOption[];
  stageOptions: SelectionStageOption[];
  selectedVacancyId: string;
  selectedStageId: string;
  selectedAttendance: string;
  search: string;
  onVacancyChange: (val: string) => void;
  onStageChange: (val: string) => void;
  onAttendanceChange: (val: string) => void;
  onSearchChange: (val: string) => void;
  isLoadingOptions?: boolean;
}

const ATTENDANCE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "all", label: "Semua Kehadiran" },
  { value: "hadir", label: "Hadir" },
  { value: "tidak_hadir", label: "Tidak Hadir" },
  { value: "belum_absensi", label: "Belum Absensi" },
];

function getTahapanLabel(selectedId: string, options: SelectionStageOption[]): string {
  if (selectedId === "all") return "Tahapan Seleksi: Semua";
  const found = options.find((o) => o.value === selectedId);
  return `Tahapan Seleksi: ${found?.label ?? selectedId}`;
}

function getKehadiranLabel(selectedValue: string): string {
  if (selectedValue === "all") return "Kehadiran Tes: Semua";
  const found = ATTENDANCE_OPTIONS.find((o) => o.value === selectedValue);
  return `Kehadiran Tes: ${found?.label ?? selectedValue}`;
}

export function SeleksiFilter({
  vacancyOptions,
  stageOptions,
  selectedVacancyId,
  selectedStageId,
  selectedAttendance,
  search,
  onVacancyChange,
  onStageChange,
  onAttendanceChange,
  onSearchChange,
  isLoadingOptions = false,
}: SeleksiFilterProps) {
  const selectedVacancyLabel =
    selectedVacancyId === "all"
      ? "Semua Lowongan"
      : (vacancyOptions.find((o) => o.value === selectedVacancyId)?.label ?? "Semua Lowongan");

  const tahapanLabel = getTahapanLabel(selectedStageId, stageOptions);
  const kehadiranLabel = getKehadiranLabel(selectedAttendance);

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="relative w-full lg:flex-1 lg:max-w-sm min-w-0">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Cari nama, NIS, email pelamar..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9.5 pr-4 bg-slate-50/60 border-slate-200 rounded-xl h-10 text-xs placeholder:text-slate-400 shadow-none focus-visible:bg-white"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        {/* Filter 1: Lowongan/Perusahaan */}
        <Select value={selectedVacancyId} onValueChange={onVacancyChange}>
          <SelectTrigger
            isLoading={isLoadingOptions}
            className="w-[220px] sm:w-[240px] h-10 rounded-xl bg-white border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50/80 transition-colors shadow-none cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Building2 className="h-4 w-4 text-[#7B4DFF] shrink-0" />
              <span className="truncate text-xs font-semibold text-slate-700" title={selectedVacancyLabel}>
                {selectedVacancyLabel}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 shadow-md max-h-72">
            {vacancyOptions.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="text-xs font-medium"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter 2: Tahapan */}
        <Select value={selectedStageId} onValueChange={onStageChange}>
          <SelectTrigger
            isLoading={isLoadingOptions}
            className="w-[210px] sm:w-[230px] h-10 rounded-xl bg-white border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50/80 transition-colors shadow-none cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Layers className="h-4 w-4 text-[#7B4DFF] shrink-0" />
              <span className="truncate text-xs font-semibold text-slate-700" title={tahapanLabel}>
                {tahapanLabel}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 shadow-md max-h-72">
            {stageOptions.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="text-xs font-medium"
              >
                {opt.label === "Semua Tahapan" ? "Semua" : opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter 3: Kehadiran */}
        <Select value={selectedAttendance} onValueChange={onAttendanceChange}>
          <SelectTrigger className="w-[200px] sm:w-[220px] h-10 rounded-xl bg-white border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50/80 transition-colors shadow-none cursor-pointer">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <CalendarCheck className="h-4 w-4 text-[#7B4DFF] shrink-0" />
              <span className="truncate text-xs font-semibold text-slate-700" title={kehadiranLabel}>
                {kehadiranLabel}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 shadow-md">
            {ATTENDANCE_OPTIONS.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="text-xs font-medium"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
