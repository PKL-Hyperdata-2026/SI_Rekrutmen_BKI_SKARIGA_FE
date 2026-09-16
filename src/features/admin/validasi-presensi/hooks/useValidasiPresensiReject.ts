import { useState, useCallback, useMemo } from "react";
import type { MouseEvent } from "react";

export interface UseValidasiPresensiRejectParams {
  applicantName?: string | null;
  title?: string;
  description?: string;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
}

export interface UseValidasiPresensiRejectReturn {
  open: boolean;
  busy: boolean;
  popoverTitle: string;
  popoverMessage: string;
  buttonTitle: string;
  confirmButtonText: string;
  handleOpenChange: (nextOpen: boolean) => void;
  handleCancel: (e: MouseEvent) => void;
  handleConfirm: (e?: MouseEvent) => Promise<void>;
}

export function useValidasiPresensiReject({
  applicantName,
  title,
  description,
  isLoading = false,
  onConfirm,
}: UseValidasiPresensiRejectParams): UseValidasiPresensiRejectReturn {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
  }, []);

  const handleCancel = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      handleOpenChange(false);
    },
    [handleOpenChange],
  );

  const handleConfirm = useCallback(
    async (e?: MouseEvent) => {
      e?.stopPropagation();
      setIsSubmitting(true);
      try {
        await onConfirm();
        setOpen(false);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onConfirm],
  );

  const busy = isLoading || isSubmitting;

  const popoverTitle = useMemo(() => {
    if (title) return title;
    return applicantName
      ? `Tolak Presensi ${applicantName}?`
      : "Tolak Presensi?";
  }, [title, applicantName]);

  const popoverMessage = useMemo(() => {
    return description ?? "Pelamar akan ditandai gugur / tidak hadir.";
  }, [description]);

  const buttonTitle = "Tolak (Tidak Hadir)";
  const confirmButtonText = busy ? "Menolak..." : "Tolak";

  return {
    open,
    busy,
    popoverTitle,
    popoverMessage,
    buttonTitle,
    confirmButtonText,
    handleOpenChange,
    handleCancel,
    handleConfirm,
  };
}
