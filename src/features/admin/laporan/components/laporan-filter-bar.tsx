import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/custom/date-picker";
import type { FilterOptionItem } from "../laporan.types";

interface LaporanFilterBarProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  selectLabel: string;
  selectPlaceholder?: string;
  selectedValue: string;
  onSelectChange: (val: string) => void;
  options: FilterOptionItem[];
  onApply: () => void;
  isLoading?: boolean;
}

export function LaporanFilterBar({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  selectLabel,
  selectPlaceholder,
  selectedValue,
  onSelectChange,
  options,
  onApply,
  isLoading = false,
}: LaporanFilterBarProps) {
  const allValue = "__all__";

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs print:hidden">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {/* Rentang Waktu */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Rentang Waktu
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 text-xs">
                <DatePicker
                  value={startDate}
                  onChange={onStartDateChange}
                  placeholder="dd/mm/yyyy"
                  variant="admin"
                />
              </div>
              <span className="text-xs text-slate-400 font-medium px-0.5">s/d</span>
              <div className="flex-1 text-xs">
                <DatePicker
                  value={endDate}
                  onChange={onEndDateChange}
                  placeholder="dd/mm/yyyy"
                  variant="admin"
                />
              </div>
            </div>
          </div>

          {/* Select Khusus Per Tab — gaya disamakan modul tracer/lowongan */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              {selectLabel}
            </label>
            <Select
              value={selectedValue === "" ? allValue : selectedValue}
              onValueChange={(val) => onSelectChange(val === allValue ? "" : val)}
            >
              <SelectTrigger className="w-full h-10 rounded-xl bg-white border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs">
                <SelectValue placeholder={selectPlaceholder ?? `Semua ${selectLabel}`} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200">
                <SelectItem value={allValue} className="text-xs font-medium">
                  {selectPlaceholder ?? `Semua ${selectLabel}`}
                </SelectItem>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs font-medium">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-end">
          <button
            onClick={onApply}
            type="button"
            disabled={isLoading}
            className="w-full sm:w-auto h-10 px-6 rounded-xl bg-gradient-to-r from-sidebar-strip to-sidebar-gradient-from hover:brightness-110 active:scale-95 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Filter className="h-3.5 w-3.5" />
            <span>{isLoading ? "Memuat..." : "Terapkan Filter"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
