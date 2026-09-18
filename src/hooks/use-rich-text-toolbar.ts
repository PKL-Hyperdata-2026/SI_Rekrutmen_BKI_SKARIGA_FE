import { useState, useEffect, useCallback } from "react";
import type { Editor } from "@tiptap/react";

export interface UseRichTextToolbarProps {
  editor: Editor | null;
  disabled?: boolean;
}

export function useRichTextToolbar({
  editor,
  disabled = false,
}: UseRichTextToolbarProps) {
  const [, setTick] = useState(0);

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

  const isCenterActive = editor?.isActive({ textAlign: "center" }) ?? false;
  const isRightActive = editor?.isActive({ textAlign: "right" }) ?? false;
  const isJustifyActive = editor?.isActive({ textAlign: "justify" }) ?? false;
  const isLeftActive =
    (editor?.isActive({ textAlign: "left" }) ?? false) ||
    (!isCenterActive && !isRightActive && !isJustifyActive);

  const canUndo = Boolean(editor?.can().undo());
  const canRedo = Boolean(editor?.can().redo());
  const isBold = Boolean(editor?.isActive("bold"));
  const isItalic = Boolean(editor?.isActive("italic"));
  const isUnderline = Boolean(editor?.isActive("underline"));
  const isBulletList = Boolean(editor?.isActive("bulletList"));
  const isOrderedList = Boolean(editor?.isActive("orderedList"));

  const handleUndo = useCallback(() => {
    if (!editor || disabled) return;
    editor.chain().focus().undo().run();
  }, [editor, disabled]);

  const handleRedo = useCallback(() => {
    if (!editor || disabled) return;
    editor.chain().focus().redo().run();
  }, [editor, disabled]);

  const handleToggleBold = useCallback(() => {
    if (!editor || disabled) return;
    editor.chain().focus().toggleBold().run();
  }, [editor, disabled]);

  const handleToggleItalic = useCallback(() => {
    if (!editor || disabled) return;
    editor.chain().focus().toggleItalic().run();
  }, [editor, disabled]);

  const handleToggleUnderline = useCallback(() => {
    if (!editor || disabled) return;
    editor.chain().focus().toggleUnderline().run();
  }, [editor, disabled]);

  const handleSetAlignLeft = useCallback(() => {
    if (!editor || disabled) return;
    editor.chain().focus().setTextAlign("left").run();
  }, [editor, disabled]);

  const handleSetAlignCenter = useCallback(() => {
    if (!editor || disabled) return;
    editor.chain().focus().setTextAlign("center").run();
  }, [editor, disabled]);

  const handleSetAlignRight = useCallback(() => {
    if (!editor || disabled) return;
    editor.chain().focus().setTextAlign("right").run();
  }, [editor, disabled]);

  const handleSetAlignJustify = useCallback(() => {
    if (!editor || disabled) return;
    editor.chain().focus().setTextAlign("justify").run();
  }, [editor, disabled]);

  const handleToggleBulletList = useCallback(() => {
    if (!editor || disabled) return;
    editor.chain().focus().toggleBulletList().run();
  }, [editor, disabled]);

  const handleToggleOrderedList = useCallback(() => {
    if (!editor || disabled) return;
    editor.chain().focus().toggleOrderedList().run();
  }, [editor, disabled]);

  const handleIndent = useCallback(() => {
    if (!editor || disabled) return;
    if (editor.isActive("bulletList") || editor.isActive("orderedList")) {
      editor.chain().focus().sinkListItem("listItem").run();
    } else {
      editor.chain().focus().indent().run();
    }
  }, [editor, disabled]);

  const handleOutdent = useCallback(() => {
    if (!editor || disabled) return;
    if (editor.isActive("bulletList") || editor.isActive("orderedList")) {
      editor.chain().focus().liftListItem("listItem").run();
    } else {
      editor.chain().focus().outdent().run();
    }
  }, [editor, disabled]);

  return {
    canUndo,
    canRedo,
    isBold,
    isItalic,
    isUnderline,
    isLeftActive,
    isCenterActive,
    isRightActive,
    isJustifyActive,
    isBulletList,
    isOrderedList,
    handleUndo,
    handleRedo,
    handleToggleBold,
    handleToggleItalic,
    handleToggleUnderline,
    handleSetAlignLeft,
    handleSetAlignCenter,
    handleSetAlignRight,
    handleSetAlignJustify,
    handleToggleBulletList,
    handleToggleOrderedList,
    handleIndent,
    handleOutdent,
  };
}
