import { useMemo } from "react";
import {
  type AttendanceItem,
  type OpaqueId,
  cleanVacancyTitle,
} from "../types/validasi-presensi-schema";

export interface TableLogMobileItemViewModel {
  id: OpaqueId;
  cardKey: string | number;
  applicantName: string;
  initials: string;
  companyText: string;
  validatedAtText: string;
  isVerified: boolean;
  systemActionText: string;
}

export interface UseValidasiPresensiTableLogMobileParams {
  data: AttendanceItem[];
  loading?: boolean;
  formatAttendanceTime: (dateStr?: string | null) => string;
  getInitials: (name?: string | null) => string;
}

export interface SkeletonLogCard {
  key: number;
  titleWidthClass: string;
  subtitleWidthClass: string;
  badgeWidthClass: string;
  descWidthClass: string;
}

export interface UseValidasiPresensiTableLogMobileReturn {
  showLoading: boolean;
  showEmpty: boolean;
  skeletonCards: SkeletonLogCard[];
  cardItems: TableLogMobileItemViewModel[];
}

const DEFAULT_SKELETON_CARDS: SkeletonLogCard[] = [
  {
    key: 0,
    titleWidthClass: "w-3/4 max-w-[130px]",
    subtitleWidthClass: "w-1/2 max-w-[100px]",
    badgeWidthClass: "w-14",
    descWidthClass: "w-3/4 max-w-[180px]",
  },
  {
    key: 1,
    titleWidthClass: "w-4/5 max-w-[150px]",
    subtitleWidthClass: "w-3/5 max-w-[120px]",
    badgeWidthClass: "w-18",
    descWidthClass: "w-4/5 max-w-[210px]",
  },
  {
    key: 2,
    titleWidthClass: "w-2/3 max-w-[110px]",
    subtitleWidthClass: "w-2/5 max-w-[85px]",
    badgeWidthClass: "w-14",
    descWidthClass: "w-3/4 max-w-[180px]",
  },
];

export function useValidasiPresensiTableLogMobile({
  data,
  loading = false,
  formatAttendanceTime,
  getInitials,
}: UseValidasiPresensiTableLogMobileParams): UseValidasiPresensiTableLogMobileReturn {
  const cardItems = useMemo<TableLogMobileItemViewModel[]>(() => {
    return data.map((row, idx) => {
      const isVerified = row.validation.status === "verified";
      const companyText =
        row.vacancy.companyName || cleanVacancyTitle(row.vacancy.title || "-");
      const systemActionText = isVerified
        ? "Diteruskan ke HRD"
        : "Gugur / Tidak Hadir";

      return {
        id: row.id,
        cardKey: row.id ?? idx,
        applicantName: row.applicant.name || "-",
        initials: getInitials(row.applicant.name),
        companyText,
        validatedAtText: formatAttendanceTime(
          row.validation.validatedAt || row.attendedAt,
        ),
        isVerified,
        systemActionText,
      };
    });
  }, [data, formatAttendanceTime, getInitials]);

  const showLoading = loading;
  const showEmpty = !loading && data.length === 0;

  return {
    showLoading,
    showEmpty,
    skeletonCards: DEFAULT_SKELETON_CARDS,
    cardItems,
  };
}
