import type React from "react";
import { useCallback, useMemo } from "react";
import {
  type AttendanceItem,
  type OpaqueId,
} from "./validasi-presensi.schema";

export interface MobileCardItemViewModel {
  item: AttendanceItem;
  id: OpaqueId;
  cardKey: string | number;
  itemNumber: number;
  isSelected: boolean;
  applicantName: string;
  initials: string;
  companyName: string;
  testScheduleText: string;
  handleToggle: (checked: boolean | "indeterminate") => void;
  handleStopPropagation: (e: React.MouseEvent) => void;
}

export interface UseValidasiPresensiMobileCardsParams {
  data: AttendanceItem[];
  loading?: boolean;
  selectedIds?: (string | number)[];
  numberStartIndex?: number;
  formatTestSchedule: (dateStr?: string | null) => string;
  getInitials: (name?: string | null) => string;
  onSelectRow?: (id: string | number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
}

export interface UseValidasiPresensiMobileCardsReturn {
  showLoading: boolean;
  showEmpty: boolean;
  showSelectAll: boolean;
  isAllSelected: boolean;
  isSomeSelected: boolean;
  selectedCount: number;
  selectAllChecked: boolean | "indeterminate";
  skeletonItems: number[];
  cardItems: MobileCardItemViewModel[];
  handleSelectAllChange: (checked: boolean | "indeterminate") => void;
}

const DEFAULT_SKELETON_ITEMS = [0, 1, 2];
const DEFAULT_SELECTED_IDS: (string | number)[] = [];

export function useValidasiPresensiMobileCards({
  data,
  loading = false,
  selectedIds = DEFAULT_SELECTED_IDS,
  numberStartIndex = 1,
  formatTestSchedule,
  getInitials,
  onSelectRow,
  onSelectAll,
}: UseValidasiPresensiMobileCardsParams): UseValidasiPresensiMobileCardsReturn {
  const handleSelectAllChange = useCallback(
    (checked: boolean | "indeterminate") => {
      onSelectAll?.(Boolean(checked));
    },
    [onSelectAll],
  );

  const selectedCount = useMemo(() => {
    return data.filter((item) => selectedIds.includes(item.id)).length;
  }, [data, selectedIds]);

  const isAllSelected = data.length > 0 && selectedCount === data.length;
  const isSomeSelected = selectedCount > 0 && !isAllSelected;
  const selectAllChecked = isAllSelected
    ? true
    : isSomeSelected
      ? "indeterminate"
      : false;

  const showSelectAll =
    !loading && data.length > 0 && typeof onSelectAll === "function";

  const handleStopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const cardItems = useMemo<MobileCardItemViewModel[]>(() => {
    return data.map((row, idx) => {
      return {
        item: row,
        id: row.id,
        cardKey: row.id ?? idx,
        itemNumber: numberStartIndex + idx,
        isSelected: selectedIds.includes(row.id),
        applicantName: row.applicant.name || "-",
        initials: getInitials(row.applicant.name),
        companyName: row.vacancy.companyName || "-",
        testScheduleText: formatTestSchedule(
          row.stage.scheduledAt || row.attendedAt,
        ),
        handleToggle: (checked: boolean | "indeterminate") =>
          onSelectRow?.(row.id, Boolean(checked)),
        handleStopPropagation,
      };
    });
  }, [
    data,
    selectedIds,
    numberStartIndex,
    formatTestSchedule,
    getInitials,
    onSelectRow,
    handleStopPropagation,
  ]);

  const showLoading = loading;
  const showEmpty = !loading && data.length === 0;

  return {
    showLoading,
    showEmpty,
    showSelectAll,
    isAllSelected,
    isSomeSelected,
    selectedCount,
    selectAllChecked,
    skeletonItems: DEFAULT_SKELETON_ITEMS,
    cardItems,
    handleSelectAllChange,
  };
}
