import { useMemo, useCallback } from "react";

export interface StudentJobVacancy {
  id: string;
  title?: string;
  position: string;
  slug?: string;
  description?: string | null;
  qualification?: string | null;
  quota?: number | null;
  deadline?: string | null;
  workLocation?: string | null;
  company?: {
    id?: string;
    name: string;
    logoPath?: string | null;
  } | null;
  targetApplicant?: {
    id?: string;
    code?: string;
    name: string;
  } | null;
  majors?: {
    id: string;
    code: string;
    name: string;
  }[];
  jobType?: {
    id?: string;
    name: string;
    code?: string;
  } | null;
  hasApplied?: boolean;
  applicantsCount?: number;
}

export const AVATAR_BG_CLASS =
  "bg-linear-to-br from-[var(--sidebar-gradient-to)] via-[var(--sidebar-strip)] to-[var(--sidebar-gradient-from)] text-primary-foreground shadow-xs";

export function getTargetBadgeStyle(
  targetCode?: string | null,
  targetName?: string | null,
): string {
  const code = targetCode ?? "";
  const name = (targetName ?? "").toLowerCase();

  const isAlumniOnly =
    code === "alumni_only" ||
    (name.includes("alumni") &&
      !name.includes("siswa") &&
      !name.includes("12"));

  const isClass12Only =
    code === "class_12_only" ||
    ((name.includes("siswa") || name.includes("12")) &&
      !name.includes("alumni"));

  const isBoth =
    code === "class_12_and_alumni" ||
    (name.includes("alumni") &&
      (name.includes("siswa") || name.includes("12")));

  if (isAlumniOnly) {
    return "bg-[var(--sidebar-gradient-to)]/10 text-[var(--sidebar-gradient-to)] border-[var(--sidebar-gradient-to)]/25 hover:bg-[var(--sidebar-gradient-to)]/15";
  }

  if (isClass12Only) {
    return "bg-primary/10 text-primary border-primary/25 hover:bg-primary/15";
  }

  if (isBoth) {
    return "bg-linear-to-r from-[var(--sidebar-gradient-to)]/10 to-primary/10 text-[var(--sidebar-strip)] border-[var(--sidebar-strip)]/30 hover:from-[var(--sidebar-gradient-to)]/15 hover:to-primary/15";
  }

  return "bg-primary/10 text-primary border-primary/25 hover:bg-primary/15";
}

export function getCompanyInitials(name?: string): string {
  if (!name) {
    return "PT";
  }
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return "PT";
  }
  const tokens = trimmed.split(" ").filter((item) => item.length > 0);
  const ignoredPrefixes = [
    "PT",
    "PT.",
    "CV",
    "CV.",
    "TBK",
    "TBK.",
    "UD",
    "UD.",
    "PERSERO",
  ];
  const filtered = tokens.filter(
    (token) => !ignoredPrefixes.includes(token.toUpperCase()),
  );
  const source = filtered.length > 0 ? filtered : tokens;
  if (source.length === 1) {
    const single = source[0];
    return single ? single.slice(0, 2).toUpperCase() : "PT";
  }
  return source
    .slice(0, 3)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

export function formatMajorsLabel(
  majors?: { code?: string; name?: string }[],
): string {
  if (!majors || majors.length === 0) {
    return "Semua Jurusan";
  }
  const labels = majors
    .map((item) => item.code || item.name || "")
    .filter((str) => str.length > 0);
  if (labels.length === 0) {
    return "Semua Jurusan";
  }
  if (labels.length <= 2) {
    return labels.join(" & ");
  }
  const firstTwo = labels.slice(0, 2).join(" & ");
  const remainder = labels.length - 2;
  return `${firstTwo} +${remainder}`;
}

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

export function formatDeadlineDate(dateStr?: string | null): string {
  if (!dateStr) {
    return "-";
  }
  const dateOnly = dateStr.split("T")[0] ?? "";
  const parts = dateOnly.split("-");
  if (parts.length < 3) {
    return dateStr;
  }
  const year = parts[0] ?? "";
  const monthStr = parts[1] ?? "";
  const dayStr = parts[2] ?? "";
  const monthNumber = Number.parseInt(monthStr, 10);
  const day = Number.parseInt(dayStr, 10);
  if (Number.isNaN(monthNumber) || Number.isNaN(day)) {
    return dateStr;
  }
  const monthName = MONTH_NAMES[monthNumber - 1] ?? monthStr;
  return `${day} ${monthName} ${year}`;
}

export function stripHtmlTags(html?: string | null): string {
  if (!html) {
    return "";
  }
  if (typeof window === "undefined") {
    return html;
  }
  const parser = new DOMParser();
  const parsed = parser.parseFromString(html, "text/html");
  return parsed.body.textContent || "";
}

export function useLowonganKerjaCard(
  vacancy: StudentJobVacancy,
  onApply?: (vacancy: StudentJobVacancy) => void,
) {
  const targetBadgeStyle = useMemo(
    () =>
      getTargetBadgeStyle(
        vacancy.targetApplicant?.code,
        vacancy.targetApplicant?.name,
      ),
    [vacancy.targetApplicant?.code, vacancy.targetApplicant?.name],
  );

  const initials = useMemo(
    () => getCompanyInitials(vacancy.company?.name),
    [vacancy.company?.name],
  );

  const majorsLabel = useMemo(
    () => formatMajorsLabel(vacancy.majors),
    [vacancy.majors],
  );

  const formattedDeadline = useMemo(
    () => formatDeadlineDate(vacancy.deadline),
    [vacancy.deadline],
  );

  const cleanDescription = useMemo(
    () => stripHtmlTags(vacancy.description),
    [vacancy.description],
  );

  const handleApplyClick = useCallback(() => {
    if (onApply) {
      onApply(vacancy);
    }
  }, [onApply, vacancy]);

  return {
    targetBadgeStyle,
    initials,
    majorsLabel,
    formattedDeadline,
    cleanDescription,
    handleApplyClick,
  };
}
