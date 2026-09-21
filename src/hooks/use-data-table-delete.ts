import { useState, useCallback, useMemo, useEffect, useId } from "react";
import type { MouseEvent } from "react";

const DATA_TABLE_DELETE_EVENT = "bki-data-table-delete-popover-open";

export interface UseDataTableDeleteOptions {
  onConfirm?: () => void | Promise<void>;
  title?: string;
  itemName?: string;
  description?: string;
}

export interface UseDataTableDeleteReturn {
  open: boolean;
  isDeleting: boolean;
  popoverTitle: string;
  message: string;
  handleOpenChange: (nextOpen: boolean) => void;
  handleCancel: (e: MouseEvent) => void;
  handleConfirm: (e?: MouseEvent) => Promise<void>;
  handleCloseAutoFocus: (e: Event) => void;
}

function formatPopoverTitle(title?: string, itemName?: string): string {
  if (title && title.trim().length > 0) {
    const trimmed = title.trim();
    if (trimmed.endsWith("?")) {
      return trimmed;
    }
    if (trimmed.endsWith(" ini")) {
      return `${trimmed}?`;
    }
    if (trimmed.startsWith("Hapus ")) {
      return `${trimmed} ini?`;
    }
    return `Hapus ${trimmed} ini?`;
  }

  if (itemName && itemName.trim().length > 0) {
    const trimmed = itemName.trim();
    if (trimmed.endsWith("?")) {
      return trimmed;
    }
    if (trimmed.endsWith(" ini")) {
      return `${trimmed}?`;
    }
    if (trimmed.startsWith("Hapus ")) {
      return `${trimmed} ini?`;
    }
    return `Hapus ${trimmed} ini?`;
  }

  return "Hapus data ini?";
}

export function useDataTableDelete(
  options: UseDataTableDeleteOptions = {},
): UseDataTableDeleteReturn {
  const { onConfirm, title, itemName, description } = options;
  const id = useId();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleCloseOthers = (e: Event) => {
      if (
        e instanceof CustomEvent &&
        typeof e.detail === "object" &&
        e.detail !== null &&
        "id" in e.detail
      ) {
        if (e.detail.id !== id) {
          setOpen(false);
        }
      }
    };

    window.addEventListener(DATA_TABLE_DELETE_EVENT, handleCloseOthers);
    return () => {
      window.removeEventListener(DATA_TABLE_DELETE_EVENT, handleCloseOthers);
    };
  }, [id]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (nextOpen) {
        window.dispatchEvent(
          new CustomEvent(DATA_TABLE_DELETE_EVENT, {
            detail: { id },
          }),
        );
      }
    },
    [id],
  );

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
      if (!onConfirm) {
        handleOpenChange(false);
        return;
      }
      setIsDeleting(true);
      try {
        await onConfirm();
        handleOpenChange(false);
      } catch (err) {
        console.error("Delete confirmation failed:", err);
      } finally {
        setIsDeleting(false);
      }
    },
    [onConfirm, handleOpenChange],
  );

  const handleCloseAutoFocus = useCallback((e: Event) => {
    e.preventDefault();
  }, []);

  const popoverTitle = useMemo(() => {
    return formatPopoverTitle(title, itemName);
  }, [title, itemName]);

  const message = useMemo(() => {
    return description ?? "Tindakan ini tidak dapat dibatalkan.";
  }, [description]);

  return {
    open,
    isDeleting,
    popoverTitle,
    message,
    handleOpenChange,
    handleCancel,
    handleConfirm,
    handleCloseAutoFocus,
  };
}

