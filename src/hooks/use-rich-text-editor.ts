import { useEffect } from "react";
import { useEditor, Extension, type Editor } from "@tiptap/react";
import type { CommandProps, RawCommands } from "@tiptap/core";
import { Selection, TextSelection } from "@tiptap/pm/state";
import { StarterKit } from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { cn } from "@/lib/utils";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
  }
}

const IndentExtension = Extension.create({
  name: "indent",
  addOptions() {
    return {
      types: ["paragraph", "heading", "blockquote"],
      minLevel: 0,
      maxLevel: 4,
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => {
              const paddingLeft = element.style.paddingLeft;
              if (paddingLeft) {
                const px = parseInt(paddingLeft, 10);
                return !isNaN(px) ? Math.min(Math.floor(px / 24), 4) : 0;
              }
              const dataIndent = element.getAttribute("data-indent");
              if (dataIndent) {
                const parsed = parseInt(dataIndent, 10);
                return !isNaN(parsed) ? Math.min(parsed, 4) : 0;
              }
              return 0;
            },
            renderHTML: (attributes) => {
              const level = (attributes.indent as number) || 0;
              if (!level) return {};
              return {
                "data-indent": level,
                style: `padding-left: ${level * 24}px;`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch }: CommandProps) => {
          const { selection } = state;
          const { from, to } = selection;
          let modified = false;
          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const currentIndent = (node.attrs.indent as number) || 0;
              if (currentIndent < this.options.maxLevel) {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  indent: currentIndent + 1,
                });
                modified = true;
              }
            }
          });
          if (modified && dispatch) {
            dispatch(tr);
            return true;
          }
          return modified;
        },
      outdent:
        () =>
        ({ tr, state, dispatch }: CommandProps) => {
          const { selection } = state;
          const { from, to } = selection;
          let modified = false;
          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const currentIndent = (node.attrs.indent as number) || 0;
              if (currentIndent > this.options.minLevel) {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  indent: currentIndent - 1,
                });
                modified = true;
              }
            }
          });
          if (modified && dispatch) {
            dispatch(tr);
            return true;
          }
          return modified;
        },
    } as unknown as Partial<RawCommands>;
  },
});

const ClearOnSelectAll = Extension.create({
  name: "clearOnSelectAll",
  addKeyboardShortcuts() {
    const handleClear = () => {
      const { state } = this.editor;
      const { selection, doc } = state;
      if (selection.empty) return false;

      const allFrom = Selection.atStart(doc).from;
      const allEnd = Selection.atEnd(doc).to;
      if (
        (selection.from === 0 && selection.to === doc.content.size) ||
        (selection.from <= allFrom && selection.to >= allEnd)
      ) {
        return this.editor.chain().focus().clearContent(true).run();
      }

      const { $from, $to } = selection;
      let fromItemDepth = -1;
      for (let depth = $from.depth; depth > 0; depth -= 1) {
        if ($from.node(depth).type.name === "listItem") {
          fromItemDepth = depth;
          break;
        }
      }

      let toItemDepth = -1;
      for (let depth = $to.depth; depth > 0; depth -= 1) {
        if ($to.node(depth).type.name === "listItem") {
          toItemDepth = depth;
          break;
        }
      }

      if (fromItemDepth > 0 && toItemDepth > 0) {
        const fromAtStart = $from.parentOffset === 0;
        const toAtEnd = $to.parentOffset === $to.parent.content.size;
        const listDepth = fromItemDepth - 1;

        if (listDepth >= 0 && $from.node(listDepth) === $to.node(listDepth)) {
          const listNode = $from.node(listDepth);
          const isFirstItem = $from.index(listDepth) === 0;
          const isLastItem = $to.index(listDepth) === listNode.childCount - 1;

          if (fromAtStart && toAtEnd && isFirstItem && isLastItem) {
            if (doc.childCount === 1) {
              return this.editor.chain().focus().clearContent(true).run();
            }
            return this.editor
              .chain()
              .focus()
              .deleteRange({
                from: $from.before(listDepth),
                to: $to.after(listDepth),
              })
              .run();
          }

          if (fromAtStart && toAtEnd) {
            return this.editor
              .chain()
              .focus()
              .deleteRange({
                from: $from.before(fromItemDepth),
                to: $to.after(toItemDepth),
              })
              .run();
          }
        }
      }

      return this.editor.commands.command(({ tr, dispatch }) => {
        tr.deleteSelection();
        if (tr.docChanged) {
          if (dispatch) dispatch(tr);
          return true;
        }
        return false;
      });
    };

    return {
      Backspace: handleClear,
      Delete: handleClear,
      "Mod-Backspace": handleClear,
      "Mod-Delete": handleClear,
      Tab: () => {
        if (
          this.editor.isActive("bulletList") ||
          this.editor.isActive("orderedList")
        ) {
          return this.editor.commands.sinkListItem("listItem");
        }
        return this.editor.commands.indent();
      },
      "Shift-Tab": () => {
        if (
          this.editor.isActive("bulletList") ||
          this.editor.isActive("orderedList")
        ) {
          return this.editor.commands.liftListItem("listItem");
        }
        return this.editor.commands.outdent();
      },
    };
  },
});

const ListEnterExtension = Extension.create({
  name: "listEnter",
  priority: 150,
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { state, view } = this.editor;
        const { selection } = state;
        const { $from } = selection;

        let listItemDepth = -1;
        for (let depth = $from.depth; depth > 0; depth -= 1) {
          if ($from.node(depth).type.name === "listItem") {
            listItemDepth = depth;
            break;
          }
        }

        if (listItemDepth === -1) {
          return false;
        }

        const listItemNode = $from.node(listItemDepth);
        const isEmptyItem = listItemNode.textContent.trim().length === 0;

        if (!isEmptyItem) {
          return this.editor.commands.splitListItem("listItem");
        }

        const listDepth = listItemDepth - 1;
        const listNode = listDepth >= 0 ? $from.node(listDepth) : null;
        const itemIndex = listDepth >= 0 ? $from.index(listDepth) : 0;

        if (itemIndex > 0 && listNode) {
          const prevItem = listNode.child(itemIndex - 1);
          const prevHasText = prevItem.textContent.trim().length > 0;
          if (prevHasText) {
            return this.editor.commands.liftListItem("listItem");
          }
        }

        const listItemType = state.schema.nodes.listItem;
        if (!listItemType) return false;

        const newListItem = listItemType.createAndFill();
        if (!newListItem) return false;

        const insertPos = $from.after(listItemDepth);
        const tr = state.tr.insert(insertPos, newListItem);
        const nextSelection = TextSelection.near(tr.doc.resolve(insertPos + 1));
        tr.setSelection(nextSelection);
        tr.scrollIntoView();
        view.dispatch(tr);
        return true;
      },
    };
  },
});

export interface UseRichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
}

export function useRichTextEditor({
  value = "",
  onChange,
  placeholder,
  disabled = false,
  minHeight = "min-h-[150px]",
}: UseRichTextEditorProps): Editor | null {
  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: cn("caret-slate-900", minHeight),
      },
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      Placeholder.configure({
        showOnlyCurrent: false,
        placeholder: ({ editor, pos }) => {
          if (
            pos !== 0 ||
            editor.state.doc.childCount > 1 ||
            editor.isActive("bulletList") ||
            editor.isActive("orderedList")
          ) {
            return "";
          }
          return placeholder || "Tulis isi di sini...";
        },
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] [&[data-placeholder='']::before]:content-none before:float-left before:text-slate-400 before:h-0 before:pointer-events-none",
      }),
      IndentExtension,
      ClearOnSelectAll,
      ListEnterExtension,
    ],
    content: value,
    onUpdate: ({ editor: currentEditor }) => {
      const isDocEmpty = currentEditor.isEmpty;
      const html = currentEditor.getHTML();
      onChange?.(isDocEmpty || html === "<p></p>" ? "" : html);
    },
  });

  useEffect(() => {
    if (!editor || editor.isFocused) return;
    const currentHTML = editor.getHTML();
    if (value !== currentHTML) {
      if (!value && (currentHTML === "<p></p>" || editor.isEmpty)) return;
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  return editor;
}
