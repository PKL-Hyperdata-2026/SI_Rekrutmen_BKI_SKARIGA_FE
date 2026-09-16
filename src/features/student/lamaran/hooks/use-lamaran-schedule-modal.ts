import { useMemo, useCallback } from "react";
import type { StudentJobApplication } from "../lamaran.schema";

export interface UseLamaranScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: StudentJobApplication | null;
}

export type UseApplicationScheduleModalProps = UseLamaranScheduleModalProps;

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function formatTime(dateStr?: string | null): string | null {
  if (!dateStr) return null;
  try {
    const formatted = new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
    return `${formatted} WIB`;
  } catch {
    return null;
  }
}

export function useLamaranScheduleModal({
  onOpenChange,
  application,
}: UseLamaranScheduleModalProps) {
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      onOpenChange(nextOpen);
    },
    [onOpenChange]
  );

  const detail = useMemo(() => {
    if (!application) {
      return {
        jobTitle: "-",
        companyName: "-",
        agendaName: "-",
        location: "-",
        scheduledDateFormatted: "-",
        scheduledTimeFormatted: null,
        optionalDescription: null,
        isLink: false,
      };
    }

    const jobTitle = application.vacancy?.title || "-";
    const companyName = application.vacancy?.companyName || "-";
    const agendaName =
      application.currentStage?.name ||
      application.currentStage?.agendaName ||
      "-";
    const location = application.currentStage?.location || "-";

    const scheduledAt = application.currentStage?.scheduledAt;
    const scheduledDateFormatted = formatDate(scheduledAt);
    const scheduledTimeFormatted = formatTime(scheduledAt);

    const optionalDescription =
      application.currentStage?.instructions?.trim() ||
      application.notes?.trim() ||
      null;

    const isLink = Boolean(
      location &&
        location !== "-" &&
        (location.startsWith("http://") || location.startsWith("https://"))
    );

    return {
      jobTitle,
      companyName,
      agendaName,
      location,
      scheduledDateFormatted,
      scheduledTimeFormatted,
      optionalDescription,
      isLink,
    };
  }, [application]);

  return {
    handleOpenChange,
    jobTitle: detail.jobTitle,
    companyName: detail.companyName,
    agendaName: detail.agendaName,
    location: detail.location,
    scheduledDateFormatted: detail.scheduledDateFormatted,
    scheduledTimeFormatted: detail.scheduledTimeFormatted,
    optionalDescription: detail.optionalDescription,
    isLink: detail.isLink,
  };
}

export const useApplicationScheduleModal = useLamaranScheduleModal;
