import type { DataTableColumn } from "@/components/custom";
import { BookOpen, Building2, Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { MajorItem } from "./jurusan.schema";

export interface MajorTableActionHandlers {
  onToggleActive: (item: MajorItem) => void;
  onEdit: (item: MajorItem) => void;
  onDelete: (item: MajorItem) => void;
}

export function buildMajorColumns(
  handlers: MajorTableActionHandlers
): DataTableColumn<MajorItem>[] {
  return [
    {
      header: "KODE",
      align: "left",
      cell: (item) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 bg-slate-50 text-slate-700 shadow-2xs">
          <BookOpen className="h-3.5 w-3.5 text-slate-500" />
          {item.code}
        </span>
      ),
    },
    {
      header: "NAMA PROGRAM KEAHLIAN",
      align: "left",
      cell: (item) => (
        <div className="min-w-0 py-1">
          <div className="font-bold text-slate-900 text-sm leading-snug truncate">
            {item.name}
          </div>
          {item.description && (
            <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
              {item.description}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "DEPARTEMEN INDUK",
      align: "left",
      cell: (item) =>
        item.department ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs">
            <Building2 className="h-3.5 w-3.5 text-slate-500" />
            <span>{item.department.name}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-xs font-medium">-</span>
        ),
    },
    {
      header: "STATUS",
      align: "center",
      cell: (item) => (
        <div className="flex items-center justify-center">
          <Switch
            checked={item.isActive}
            onCheckedChange={() => handlers.onToggleActive(item)}
          />
        </div>
      ),
    },
    {
      header: "AKSI",
      align: "right",
      cell: (item) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handlers.onEdit(item)}
            title="Edit Jurusan"
            className="h-8 w-8 rounded-lg border border-blue-200/80 bg-blue-50/70 text-blue-600 hover:bg-blue-100 hover:text-blue-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handlers.onDelete(item)}
            title="Hapus Jurusan"
            className="h-8 w-8 rounded-lg border border-rose-200/80 bg-rose-50/70 text-rose-600 hover:bg-rose-100 hover:text-rose-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];
}
