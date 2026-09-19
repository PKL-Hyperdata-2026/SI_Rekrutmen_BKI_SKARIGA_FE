import { useState, useCallback, useMemo, useEffect } from "react";
import {
  type AttendanceItem,
  cleanVacancyTitle,
} from "./validasi-presensi.schema";

const POPOVER_EVENT_NAME = "bki-presensi-popover-open";

export interface UseValidasiPresensiInfoOptions {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: string;
}

export interface ValidasiPresensiInfoViewModel {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  handleCloseAutoFocus: (e: Event) => void;
  buttonSize: "sm" | "icon";
  buttonTitle: string;
  applicantName: string;
  initials: string;
  companyName: string;
  vacancyTitle: string;
  stageName: string;
  phone: string;
  educationText: string;
}

function getInitials(name?: string | null): string {
  if (!name) return "P";
  const parts = name
    .trim()
    .split(" ")
    .filter((p) => p.length > 0);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

function formatEducation(
  majorCode?: string | null,
  graduationYear?: number | null,
): string {
  const code = majorCode?.trim() || "";

  if (code && graduationYear) {
    return `${code} • Lulusan ${graduationYear}`;
  }
  if (code) {
    return `${code} • Siswa Aktif`;
  }
  if (graduationYear) {
    return `Lulusan ${graduationYear}`;
  }
  return "-";
}

export function useValidasiPresensiInfo(
  item: AttendanceItem,
  options?: UseValidasiPresensiInfoOptions,
): ValidasiPresensiInfoViewModel {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isControlled = typeof options?.isOpen === "boolean";
  const isOpen = isControlled ? Boolean(options?.isOpen) : internalIsOpen;

  const setIsOpen = useCallback(
    (nextOpen: boolean) => {
      options?.onOpenChange?.(nextOpen);
      if (!isControlled) {
        setInternalIsOpen(nextOpen);
      }
    },
    [isControlled, options],
  );

  useEffect(() => {
    const handleCloseOthers = (e: Event) => {
      if (
        e instanceof CustomEvent &&
        typeof e.detail === "object" &&
        e.detail !== null &&
        "id" in e.detail
      ) {
        if (e.detail.id !== item.id) {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener(POPOVER_EVENT_NAME, handleCloseOthers);
    return () => {
      window.removeEventListener(POPOVER_EVENT_NAME, handleCloseOthers);
    };
  }, [item.id, setIsOpen]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setIsOpen(nextOpen);
      if (nextOpen) {
        window.dispatchEvent(
          new CustomEvent(POPOVER_EVENT_NAME, {
            detail: { id: item.id },
          }),
        );
      }
    },
    [item.id, setIsOpen],
  );

  const handleCloseAutoFocus = useCallback((e: Event) => {
    e.preventDefault();
  }, []);

  const buttonSize = options?.label ? "sm" : "icon";
  const buttonTitle = options?.label || "Detail Presensi";

  const viewModel = useMemo(() => {
    const applicantName = item.applicant.name || "-";

    return {
      applicantName,
      initials: getInitials(item.applicant.name),
      companyName: item.vacancy.companyName || "-",
      vacancyTitle: cleanVacancyTitle(item.vacancy.title || ""),
      stageName: item.stage.name || "-",
      phone: item.applicant.phone || "-",
      educationText: formatEducation(
        item.applicant.majorCode,
        item.applicant.graduationYear,
      ),
    };
  }, [item]);

  return {
    isOpen,
    handleOpenChange,
    handleCloseAutoFocus,
    buttonSize,
    buttonTitle,
    ...viewModel,
  };
}
