import * as React from "react";
import { ChevronDown, Search, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/hooks/useApp";

export type SearchableSelectVariant = "admin" | "student" | "alumni" | "hrd" | "auto";

export interface SearchableSelectOption {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  hasError?: boolean;
  disabled?: boolean;
  id?: string;
  variant?: SearchableSelectVariant;
  isLoading?: boolean;
  searchable?: boolean;
  pageSize?: number;
  serverDriven?: boolean;
  onSearchChange?: (value: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  externalLoadingMore?: boolean;
  selectedFallbackLabel?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

const roleThemeClasses: Record<string, string> = {
  admin: "theme-admin",
  superadmin: "theme-admin",
  siswa: "theme-siswa",
  student: "theme-siswa",
  alumni: "theme-siswa",
  hrd: "theme-hrd",
};

export function SearchableSelect({
  value,
  onValueChange,
  options = [],
  placeholder = "Pilih...",
  searchPlaceholder = "Cari...",
  emptyMessage = "Tidak ada hasil ditemukan",
  className,
  hasError = false,
  disabled = false,
  id,
  variant = "auto",
  isLoading = false,
  searchable = false,
  pageSize = 20,
  serverDriven = false,
  onSearchChange,
  onLoadMore,
  hasMore = false,
  externalLoadingMore = false,
  selectedFallbackLabel,
  onOpen,
  onClose,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [visibleCount, setVisibleCount] = React.useState(pageSize);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const { user } = useAppSelector((state) => state.auth);
  const resolvedRole = variant !== "auto" ? variant : user?.role || "admin";
  const themeClass = roleThemeClasses[resolvedRole] || "theme-admin";

  const selectedOption = React.useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  const filteredOptions = React.useMemo(() => {
    if (serverDriven) return options;
    if (!searchable || !search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, search, searchable, serverDriven]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    setVisibleCount(pageSize);
    setIsLoadingMore(false);
    if (nextOpen) {
      onOpen?.();
      if (searchable) {
        setSearch("");
        onSearchChange?.("");
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    } else {
      onClose?.();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearchChange?.(e.target.value);
    setVisibleCount(pageSize);
    setIsLoadingMore(false);
  };

  const handleClearSearch = () => {
    setSearch("");
    onSearchChange?.("");
    setVisibleCount(pageSize);
    setIsLoadingMore(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (serverDriven) {
      if (externalLoadingMore || isLoading || !hasMore) return;
      const target = e.currentTarget;
      const reachedBottom = target.scrollHeight - target.scrollTop - target.clientHeight <= 30;
      if (reachedBottom) {
        onLoadMore?.();
      }
      return;
    }
    if (isLoadingMore || isLoading) return;
    const target = e.currentTarget;
    const reachedBottom = target.scrollHeight - target.scrollTop - target.clientHeight <= 30;
    if (reachedBottom && visibleCount < filteredOptions.length) {
      setIsLoadingMore(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setVisibleCount((prev) => prev + pageSize);
        setIsLoadingMore(false);
      }, 1000);
    }
  };

  const visibleOptions = React.useMemo(() => {
    if (serverDriven) return filteredOptions;
    return filteredOptions.slice(0, visibleCount);
  }, [filteredOptions, visibleCount, serverDriven]);

  const showLoadingMore = serverDriven ? externalLoadingMore : isLoadingMore;
  const triggerLabel = selectedOption
    ? selectedOption.label
    : value && selectedFallbackLabel
      ? selectedFallbackLabel
      : placeholder;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || isLoading}
          className={cn(
            "h-10 w-full justify-between px-3.5 text-left font-normal rounded-lg border bg-[#F8F9FD] hover:bg-white transition-all shadow-xs cursor-pointer",
            !selectedOption && "text-slate-700",
            selectedOption && "text-slate-800 font-normal",
            open && "border-primary ring-2 ring-primary/20 bg-white",
            hasError
              ? "border-red-500 bg-red-50/20 focus-visible:ring-red-500/20"
              : "border-slate-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
            className
          )}
        >
          <span className="truncate">
            {isLoading ? "Memuat data..." : triggerLabel}
          </span>
          {isLoading ? (
            <Loader2 className="size-4 animate-spin text-slate-500 shrink-0" />
          ) : (
            <ChevronDown
              className={cn(
                "size-4 text-slate-500 shrink-0 transition-transform duration-200",
                open && "rotate-180 text-primary"
              )}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-(--radix-popover-trigger-width) min-w-55 p-0 gap-0 rounded-lg shadow-xl border border-slate-200 bg-white overflow-hidden",
          themeClass
        )}
        align="start"
        onWheel={(e) => e.stopPropagation()}
      >
        {searchable && (
          <div className="p-1.5 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white border border-slate-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <Search className="size-3.5 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          </div>
        )}
        <div
          className="max-h-60 overflow-y-auto overscroll-contain p-1 custom-scrollbar pr-1.5"
          onWheel={(e) => e.stopPropagation()}
          onScroll={handleScroll}
        >
          {isLoading ? (
            serverDriven ? (
              <div className="flex flex-col gap-1 p-1" aria-label="Memuat data...">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-full rounded-md" />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-6 gap-2 text-xs text-slate-500">
                <Loader2 className="size-3.5 animate-spin text-primary" />
                <span>Memuat data...</span>
              </div>
            )
          ) : filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              {emptyMessage}
            </div>
          ) : (
            <>
              {visibleOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onValueChange?.(opt.value);
                      handleOpenChange(false);
                    }}
                    className={cn(
                      "relative flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-2 text-xs text-slate-700 transition-colors outline-hidden select-none text-left",
                      "hover:bg-accent hover:text-accent-foreground",
                      isSelected && "bg-accent text-accent-foreground font-normal"
                    )}
                  >
                    <span className="truncate pr-2">{opt.label}</span>
                    {isSelected && <Check className="size-3.5 shrink-0 ml-2" />}
                  </button>
                );
              })}
              {showLoadingMore && (
                <div className="flex items-center justify-center py-2.5 gap-2 text-xs text-slate-500">
                  <Loader2 className="size-3.5 animate-spin text-primary shrink-0" />
                  <span>Memuat data..</span>
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
