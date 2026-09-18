import { useState, useRef, useEffect, useCallback } from "react";
import type { Editor } from "@tiptap/react";

export type HeadingOption = "Normal" | "Heading 1" | "Heading 2" | "Heading 3";

export interface UseHeadingDropdownProps {
  editor: Editor | null;
  disabled?: boolean;
}

export function useHeadingDropdown({
  editor,
  disabled = false,
}: UseHeadingDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [, setTick] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      setTick((prev) => prev + 1);
    };

    editor.on("transaction", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);

    return () => {
      editor.off("transaction", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const currentLabel: HeadingOption = editor?.isActive("heading", { level: 1 })
    ? "Heading 1"
    : editor?.isActive("heading", { level: 2 })
      ? "Heading 2"
      : editor?.isActive("heading", { level: 3 })
        ? "Heading 3"
        : "Normal";

  const handleToggleOpen = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  }, [disabled]);

  const handleSelectNormal = useCallback(() => {
    if (!editor || disabled) return;
    editor.chain().focus().setParagraph().run();
    setIsOpen(false);
  }, [editor, disabled]);

  const handleSelectHeading = useCallback(
    (level: 1 | 2 | 3) => {
      if (!editor || disabled) return;
      editor.chain().focus().toggleHeading({ level }).run();
      setIsOpen(false);
    },
    [editor, disabled],
  );

  return {
    isOpen,
    containerRef,
    currentLabel,
    handleToggleOpen,
    handleSelectNormal,
    handleSelectHeading,
  };
}
