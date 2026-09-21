import { EditorContent } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { useRichTextEditor } from "@/hooks/use-rich-text-editor";
import { RichTextToolbar } from "./text-editor/rich-text-toolbar";
import {
  type RichTextRole,
  roleThemeClasses,
} from "./text-editor/rich-text-theme";

export interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
  minHeight?: string;
  role?: RichTextRole;
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder,
  hasError = false,
  disabled = false,
  className,
  minHeight = "min-h-[150px]",
  role = "admin",
}: RichTextEditorProps) {
  const editor = useRichTextEditor({
    value,
    onChange,
    placeholder,
    disabled,
    minHeight,
  });

  return (
    <div
      onClick={() => {
        if (editor && !editor.isFocused) {
          editor.commands.focus("end");
        }
      }}
      className={cn(
        "w-full min-w-0 max-w-full rounded-lg border bg-[#F8F9FD] text-slate-800 transition-all overflow-hidden focus-within:bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 cursor-text",
        roleThemeClasses[role],
        hasError ? "border-red-500 bg-red-50/20" : "border-slate-200",
        disabled && "opacity-60 pointer-events-none",
        className,
      )}
    >
      {editor && <RichTextToolbar editor={editor} disabled={disabled} />}

      <EditorContent
        editor={editor}
        className={cn(
          "w-full min-w-0 max-w-full text-sm text-slate-800 leading-relaxed",
          "[&_.ProseMirror]:outline-none [&_.ProseMirror]:p-3.5 [&_.ProseMirror]:min-w-0 [&_.ProseMirror]:max-w-full",
          "[&_.ProseMirror]:min-h-[inherit] [&_.ProseMirror]:caret-slate-900",
          "[&_.ProseMirror]:wrap-break-word [&_.ProseMirror]:[word-break:break-word]",
          "[&_.ProseMirror_p]:wrap-anywhere [&_.ProseMirror_p]:[word-break:break-word] [&_.ProseMirror_p]:max-w-full",
          "[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:my-2 [&_.ProseMirror_ul]:wrap-anywhere",
          "[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:my-2 [&_.ProseMirror_ol]:wrap-anywhere",
          "[&_.ProseMirror_li]:my-1 [&_.ProseMirror_li]:pl-0 [&_.ProseMirror_li]:wrap-anywhere",
          "[&_.ProseMirror_li>p]:my-0",
          "[&_.ProseMirror_h1]:text-lg [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:text-slate-900 [&_.ProseMirror_h1]:my-2 [&_.ProseMirror_h1]:wrap-anywhere",
          "[&_.ProseMirror_h2]:text-base [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:text-slate-900 [&_.ProseMirror_h2]:my-1.5 [&_.ProseMirror_h2]:wrap-anywhere",
          "[&_.ProseMirror_h3]:text-sm [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_h3]:text-slate-900 [&_.ProseMirror_h3]:my-1 [&_.ProseMirror_h3]:wrap-anywhere",
          "[&_.ProseMirror_u]:underline",
          minHeight,
        )}
      />
    </div>
  );
}

export interface RichTextContentProps {
  content?: string | null;
  className?: string;
  role?: RichTextRole;
}

export function RichTextContent({
  content,
  className,
  role = "admin",
}: RichTextContentProps) {
  if (!content || !content.trim()) {
    return <span className="text-slate-400 text-xs">-</span>;
  }

  const isHtml = content.includes("<") && content.includes(">");

  if (isHtml) {
    return (
      <div
        className={cn(
          "prose prose-sm max-w-none text-slate-700 text-sm leading-relaxed min-w-0 wrap-anywhere [word-break:break-word]",
          roleThemeClasses[role],
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2",
          "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2",
          "[&_li]:my-1 [&_li]:pl-0 [&_li]:wrap-break-word",
          "[&_li>p]:my-0",
          "[&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_p]:wrap-break-word",
          "[&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:my-2 [&_h1]:wrap-break-word",
          "[&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:my-1.5 [&_h2]:wrap-break-word",
          "[&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:my-1 [&_h3]:wrap-break-word",
          "[&_u]:underline",
          "[&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-slate-600",
          "[&_a]:text-primary [&_a]:underline [&_a]:font-medium",
          "[&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:break-all",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div
      className={cn(
        "text-sm text-slate-700 whitespace-pre-line leading-relaxed min-w-0 max-w-full wrap-anywhere [word-break:break-word]",
        roleThemeClasses[role],
        className,
      )}
    >
      {content}
    </div>
  );
}

RichTextEditor.Content = RichTextContent;

export { type RichTextRole, roleThemeClasses };
