import { SearchableSelect } from "@/components/custom/searchable-select";
import { usePaginatedOptions } from "@/hooks/use-paginated-options";
import type {
  AsyncSelectItem,
  FetchSelectPage,
} from "@/api/select-options";

export interface AsyncSearchableSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  onOptionSelect?: (item: AsyncSelectItem) => void;
  fetchPage: FetchSelectPage;
  perPage?: number;
  debounceMs?: number;
  fallbackLabel?: string;
  emptyOptionLabel?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  hasError?: boolean;
  disabled?: boolean;
  id?: string;
  variant?: "admin" | "student" | "alumni" | "hrd" | "auto";
}

export function AsyncSearchableSelect({
  value,
  onValueChange,
  onOptionSelect,
  fetchPage,
  perPage = 20,
  debounceMs,
  fallbackLabel,
  emptyOptionLabel,
  ...rest
}: AsyncSearchableSelectProps) {
  const {
    options,
    loading,
    loadingMore,
    hasMore,
    onSearchChange,
    onLoadMore,
    onOpen,
    resetSearch,
  } = usePaginatedOptions({ fetchPage, perPage, debounceMs });

  const displayOptions = emptyOptionLabel
    ? [{ value: "", label: emptyOptionLabel }, ...options]
    : options;

  const handleValueChange = (nextValue: string) => {
    onValueChange?.(nextValue);
    const selected = options.find((item) => item.value === nextValue);
    if (selected) onOptionSelect?.(selected);
  };

  return (
    <SearchableSelect
      {...rest}
      value={value}
      onValueChange={handleValueChange}
      options={displayOptions}
      searchable={true}
      serverDriven={true}
      isLoading={loading}
      externalLoadingMore={loadingMore}
      hasMore={hasMore}
      onSearchChange={onSearchChange}
      onLoadMore={onLoadMore}
      onOpen={onOpen}
      onClose={resetSearch}
      selectedFallbackLabel={fallbackLabel}
    />
  );
}
