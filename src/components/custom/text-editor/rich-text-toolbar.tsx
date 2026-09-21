import type { Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { useRichTextToolbar } from "@/hooks/use-rich-text-toolbar";
import { HeadingDropdown } from "./heading-dropdown";

interface ToolbarButtonProps {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({
  active,
  disabled,
  onClick,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "inline-flex h-7 min-w-7 px-1.5 items-center justify-center rounded text-xs transition-all duration-150 select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        disabled
          ? "opacity-35 cursor-not-allowed pointer-events-none"
          : "cursor-pointer active:scale-95",
        active
          ? "bg-primary/15 text-primary font-bold hover:bg-primary/25 shadow-xs"
          : "text-slate-600 hover:bg-slate-200/80 hover:text-slate-900",
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="h-4 w-px bg-slate-300 mx-0.5 shrink-0 select-none" />;
}

export interface RichTextToolbarProps {
  editor: Editor;
  disabled?: boolean;
}

export function RichTextToolbar({ editor, disabled }: RichTextToolbarProps) {
  const {
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
  } = useRichTextToolbar({ editor, disabled });

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-wrap items-center gap-1 border-b border-slate-200/80 bg-slate-50/80 px-2.5 py-1.5 select-none cursor-default"
    >
      <ToolbarButton
        title="Undo (Ctrl+Z)"
        disabled={disabled || !canUndo}
        onClick={handleUndo}
      >
        <svg
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
        </svg>
      </ToolbarButton>

      <ToolbarButton
        title="Redo (Ctrl+Y)"
        disabled={disabled || !canRedo}
        onClick={handleRedo}
      >
        <svg
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 7v6h-6" />
          <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
        </svg>
      </ToolbarButton>

      <ToolbarDivider />

      <HeadingDropdown editor={editor} disabled={disabled} />

      <ToolbarDivider />

      <ToolbarButton
        title="Tebal (Ctrl+B)"
        active={isBold}
        disabled={disabled}
        onClick={handleToggleBold}
      >
        <span className="font-bold text-xs">B</span>
      </ToolbarButton>

      <ToolbarButton
        title="Miring (Ctrl+I)"
        active={isItalic}
        disabled={disabled}
        onClick={handleToggleItalic}
      >
        <span className="italic font-serif text-xs">I</span>
      </ToolbarButton>

      <ToolbarButton
        title="Garis Bawah (Ctrl+U)"
        active={isUnderline}
        disabled={disabled}
        onClick={handleToggleUnderline}
      >
        <span className="underline text-xs">U</span>
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Rata Kiri"
        active={isLeftActive}
        disabled={disabled}
        onClick={handleSetAlignLeft}
      >
        <svg
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="21" y1="6" x2="3" y2="6" />
          <line x1="15" y1="12" x2="3" y2="12" />
          <line x1="17" y1="18" x2="3" y2="18" />
        </svg>
      </ToolbarButton>

      <ToolbarButton
        title="Rata Tengah"
        active={isCenterActive}
        disabled={disabled}
        onClick={handleSetAlignCenter}
      >
        <svg
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="21" y1="6" x2="3" y2="6" />
          <line x1="17" y1="12" x2="7" y2="12" />
          <line x1="19" y1="18" x2="5" y2="18" />
        </svg>
      </ToolbarButton>

      <ToolbarButton
        title="Rata Kanan"
        active={isRightActive}
        disabled={disabled}
        onClick={handleSetAlignRight}
      >
        <svg
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="21" y1="6" x2="3" y2="6" />
          <line x1="21" y1="12" x2="9" y2="12" />
          <line x1="21" y1="18" x2="7" y2="18" />
        </svg>
      </ToolbarButton>

      <ToolbarButton
        title="Rata Kiri Kanan (Justify)"
        active={isJustifyActive}
        disabled={disabled}
        onClick={handleSetAlignJustify}
      >
        <svg
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Daftar Berbutir"
        active={isBulletList}
        disabled={disabled}
        onClick={handleToggleBulletList}
      >
        <svg
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </ToolbarButton>

      <ToolbarButton
        title="Daftar Bernomor"
        active={isOrderedList}
        disabled={disabled}
        onClick={handleToggleOrderedList}
      >
        <svg
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="10" y1="6" x2="21" y2="6" />
          <line x1="10" y1="12" x2="21" y2="12" />
          <line x1="10" y1="18" x2="21" y2="18" />
          <path d="M4 6h1v4" />
          <path d="M4 10h2" />
          <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
        </svg>
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Kurangi Inden"
        disabled={disabled}
        onClick={handleOutdent}
      >
        <svg
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="21" y1="6" x2="11" y2="6" />
          <line x1="21" y1="12" x2="11" y2="12" />
          <line x1="21" y1="18" x2="11" y2="18" />
          <polyline points="7 8 3 12 7 16" />
        </svg>
      </ToolbarButton>

      <ToolbarButton
        title="Tambahkan Inden"
        disabled={disabled}
        onClick={handleIndent}
      >
        <svg
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="21" y1="6" x2="11" y2="6" />
          <line x1="21" y1="12" x2="11" y2="12" />
          <line x1="21" y1="18" x2="11" y2="18" />
          <polyline points="3 8 7 12 3 16" />
        </svg>
      </ToolbarButton>
    </div>
  );
}
