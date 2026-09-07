import type { DataTableColumn } from "@/components/custom";
import { Building2, GraduationCap, Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { DepartmentItem } from "./departemen.schema";

export interface DepartmentTableActionHandlers {
  onToggleActive: (item: DepartmentItem) => void;
  onEdit: (item: DepartmentItem) => void;
  onDelete: (item: DepartmentItem) => void;
}

export function buildDepartmentColumns(
  handlers: DepartmentTableActionHandlers
): DataTableColumn<DepartmentItem>[] {
  return [
    {
      header: "KODE",
      align: "left",
      cell: (item) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 bg-slate-50 text-slate-700 shadow-2xs">
          <Building2 className="h-3.5 w-3.5 text-slate-500" />
          {item.code}
        </span>
      ),
    },
    {
      header: "NAMA DEPARTEMEN",
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
      header: "KONSENTRASI JURUSAN",
      align: "left",
      cell: (item) => (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-sky-700 shadow-2xs">
          <GraduationCap className="h-3.5 w-3.5 text-sky-600" />
          <span>{item.majorsCount ?? 0} Program Keahlian</span>
        </div>
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
            title="Edit Departemen"
            className="h-8 w-8 rounded-lg border border-blue-200/80 bg-blue-50/70 text-blue-600 hover:bg-blue-100 hover:text-blue-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handlers.onDelete(item)}
            title="Hapus Departemen"
            className="h-8 w-8 rounded-lg border border-rose-200/80 bg-rose-50/70 text-rose-600 hover:bg-rose-100 hover:text-rose-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];
}
