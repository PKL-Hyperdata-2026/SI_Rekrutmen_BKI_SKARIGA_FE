import {
  DataTableDeleteButton,
  Box,
  Span,
  type DataTableColumn,
} from "@/components/custom";
import { Building2, GraduationCap, Pencil } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { DepartmentItem } from "./departemen.schema";

export interface DepartmentTableActionHandlers {
  onToggleActive: (item: DepartmentItem) => void;
  onEdit: (item: DepartmentItem) => void;
  onDelete: (item: DepartmentItem) => void | Promise<void>;
}

export function buildDepartmentColumns(
  handlers: DepartmentTableActionHandlers,
): DataTableColumn<DepartmentItem>[] {
  return [
    {
      header: "KODE",
      align: "left",
      cell: (item) => (
        <Span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border border-slate-200 bg-slate-50 text-slate-700 shadow-2xs">
          <Building2 className="h-3.5 w-3.5 text-slate-500" />
          {item.code}
        </Span>
      ),
    },
    {
      header: "NAMA DEPARTEMEN",
      align: "left",
      cell: (item) => (
        <Box className="min-w-0 max-w-xs md:max-w-sm py-1">
          <Box
            className="font-bold text-slate-900 text-sm leading-snug truncate"
            title={item.name}
          >
            {item.name}
          </Box>
          {item.description && (
            <Box
              className="text-xs text-slate-500 mt-0.5 truncate"
              title={item.description}
            >
              {item.description}
            </Box>
          )}
        </Box>
      ),
    },
    {
      header: "KONSENTRASI JURUSAN",
      align: "center",
      cell: (item) => (
        <Box className="flex items-center justify-center">
          <Box className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-50 border border-sky-200 text-xs font-semibold text-sky-700 shadow-2xs">
            <GraduationCap className="h-3.5 w-3.5 text-sky-600" />
            <Span>{item.majorsCount ?? 0} Program Keahlian</Span>
          </Box>
        </Box>
      ),
    },
    {
      header: "STATUS",
      align: "center",
      cell: (item) => (
        <Box className="flex items-center justify-center">
          <Switch
            checked={item.isActive}
            onCheckedChange={() => handlers.onToggleActive(item)}
          />
        </Box>
      ),
    },
    {
      header: "AKSI",
      align: "center",
      cell: (item) => (
        <Box className="flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handlers.onEdit(item)}
            title="Edit Departemen"
            className="h-8 w-8 rounded-lg border border-purple-200/80 bg-purple-50/70 text-purple-600 hover:bg-purple-100 hover:text-purple-700 hover:border-purple-300 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <DataTableDeleteButton
            itemName={item.name}
            title="Hapus Departemen ini?"
            description="Tindakan tidak dapat dibatalkan jika departemen memiliki jurusan terkait."
            buttonTitle="Hapus Departemen"
            className="border-rose-200/80 bg-rose-50/70 text-rose-600 hover:bg-rose-100 hover:text-rose-700 shadow-2xs"
            onConfirm={() => handlers.onDelete(item)}
          />
        </Box>
      ),
    },
  ];
}
