import type { Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { useHeadingDropdown } from "@/hooks/use-heading-dropdown";

export interface HeadingDropdownProps {
  editor: Editor;
  disabled?: boolean;
}

export function HeadingDropdown({ editor, disabled }: HeadingDropdownProps) {
  const {
    isOpen,
    containerRef,
    currentLabel,
    handleToggleOpen,
    handleSelectNormal,
    handleSelectHeading,
  } = useHeadingDropdown({ editor, disabled });

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleToggleOpen}
        className={cn(
          "inline-flex h-7 items-center justify-between gap-1.5 rounded px-2 text-xs font-medium transition-all duration-150 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          disabled
            ? "opacity-35 cursor-not-allowed pointer-events-none"
            : "cursor-pointer active:scale-95",
          currentLabel !== "Normal"
            ? "bg-primary/15 text-primary font-bold hover:bg-primary/25 shadow-xs"
            : "text-slate-700 hover:bg-slate-200/80 hover:text-slate-900",
        )}
        title="Pilihan Ukuran Teks"
      >
        <span>{currentLabel}</span>
        <svg
          className={cn(
            "size-3 transition-transform duration-150",
            isOpen && "rotate-180",
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="absolute left-0 top-full mt-1 z-50 min-w-36 rounded-md border border-slate-200 bg-white p-1 shadow-md ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
        >
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleSelectNormal}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-1.5 text-left text-xs rounded transition-colors cursor-pointer",
              currentLabel === "Normal"
                ? "bg-primary/10 text-primary font-semibold hover:bg-primary/20"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            <span>Normal</span>
            {currentLabel === "Normal" && (
              <svg
                className="size-3.5 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleSelectHeading(1)}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-1.5 text-left text-sm font-bold rounded transition-colors cursor-pointer",
              currentLabel === "Heading 1"
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "text-slate-900 hover:bg-slate-100",
            )}
          >
            <span>Heading 1</span>
            {currentLabel === "Heading 1" && (
              <svg
                className="size-3.5 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleSelectHeading(2)}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-1.5 text-left text-xs font-bold rounded transition-colors cursor-pointer",
              currentLabel === "Heading 2"
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "text-slate-800 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            <span>Heading 2</span>
            {currentLabel === "Heading 2" && (
              <svg
                className="size-3.5 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleSelectHeading(3)}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-1.5 text-left text-xs font-semibold rounded transition-colors cursor-pointer",
              currentLabel === "Heading 3"
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "text-slate-800 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            <span>Heading 3</span>
            {currentLabel === "Heading 3" && (
              <svg
                className="size-3.5 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
