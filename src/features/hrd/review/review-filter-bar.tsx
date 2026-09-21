import { RotateCcw, Search, X } from "lucide-react";
import { SearchableSelect } from "@/components/custom/searchable-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ReviewFilterOptions, ReviewStatusFilter } from "./review.schema";

export interface ReviewFilterBarProps {
  options: ReviewFilterOptions;
  vacancyFilter: string;
  statusFilter: ReviewStatusFilter;
  searchInput: string;
  activeFilterCount: number;
  totalItems: number;
  isLoadingOptions?: boolean;
  onVacancyChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onReset: () => void;
  className?: string;
}

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "semua", label: "Semua Status" },
  { value: "perlu_review", label: "Menunggu Review" },
  { value: "lolos_berkas", label: "Lolos Berkas" },
  { value: "ditolak", label: "Ditolak" },
];

export function ReviewFilterBar({
  options,
  vacancyFilter,
  statusFilter,
  searchInput,
  activeFilterCount,
  totalItems,
  isLoadingOptions = false,
  onVacancyChange,
  onStatusChange,
  onSearchChange,
  onClearSearch,
  onReset,
  className,
}: ReviewFilterBarProps) {
  const vacancyOptions = [
    { value: "", label: "Semua Posisi" },
    ...options.vacancies.map((item) => ({ value: item.value, label: item.label })),
  ];

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-slate-200/90 bg-white p-3 shadow-sm sm:p-4",
        className,
      )}
    >
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="review-search" className="text-xs font-semibold text-slate-700">
            Cari pelamar
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="review-search"
              value={searchInput}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Nama atau NIS pelamar"
              autoComplete="off"
              className="h-10 rounded-xl border-slate-200 bg-[#F8F9FD] pl-9.5 pr-9 text-xs sm:text-sm placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-[#8D1D96] focus-visible:ring-[#8D1D96]/20 transition-all"
            />
            {searchInput !== "" ? (
              <button
                type="button"
                onClick={onClearSearch}
                aria-label="Hapus pencarian"
                className="absolute right-2.5 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition-colors"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="review-vacancy" className="text-xs font-semibold text-slate-700">
            Posisi
          </Label>
          <SearchableSelect
            id="review-vacancy"
            value={vacancyFilter}
            onValueChange={onVacancyChange}
            options={vacancyOptions}
            placeholder="Semua Posisi"
            searchPlaceholder="Cari posisi..."
            emptyMessage="Posisi tidak ditemukan"
            searchable
            isLoading={isLoadingOptions}
            variant="hrd"
            className="h-10 rounded-xl border-slate-200 bg-[#F8F9FD] px-3.5 text-xs sm:text-sm font-normal text-slate-700 hover:bg-white focus-visible:border-[#8D1D96] focus-visible:ring-[#8D1D96]/20 transition-all shadow-2xs"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="review-status" className="text-xs font-semibold text-slate-700">
            Status
          </Label>
          <SearchableSelect
            id="review-status"
            value={statusFilter}
            onValueChange={onStatusChange}
            options={STATUS_OPTIONS}
            placeholder="Menunggu Review"
            variant="hrd"
            className="h-10 rounded-xl border-slate-200 bg-[#F8F9FD] px-3.5 text-xs sm:text-sm font-normal text-slate-700 hover:bg-white focus-visible:border-[#8D1D96] focus-visible:ring-[#8D1D96]/20 transition-all shadow-2xs"
          />
        </div>

        <div className="flex items-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            disabled={activeFilterCount === 0}
            className="h-10 cursor-pointer rounded-xl border-slate-200 bg-[#F8F9FD] px-3.5 text-xs font-semibold text-slate-700 hover:bg-white hover:text-[#8D1D96] hover:border-slate-300 transition-all disabled:opacity-50"
          >
            <RotateCcw className="size-3.5" />
            Reset
            {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </Button>
        </div>
      </div>

      <p className="mt-3 border-t border-slate-100 pt-2.5 text-xs text-slate-500 sm:text-sm" aria-live="polite">
        Menampilkan <span className="font-bold text-[#8D1D96]">{totalItems} pelamar</span>
        {activeFilterCount > 0 ? ` dengan ${activeFilterCount} filter aktif` : ""}
      </p>
    </div>
  );
}
