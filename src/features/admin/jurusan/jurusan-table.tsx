import type { DataTableColumn } from "@/components/custom";
import { DataTableDeleteButton } from "@/components/custom/data-table";
import { Box, Span, Heading3, Paragraph } from "@/components/custom/primitives";
import { Network, Pencil, Shapes } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { MajorItem } from "./jurusan.schema";

export interface MajorTableActionHandlers {
  onToggleActive: (item: MajorItem) => void;
  onEdit: (item: MajorItem) => void;
  onDelete: (item: MajorItem) => void | Promise<void>;
}

export function buildMajorColumns(
  handlers: MajorTableActionHandlers,
): DataTableColumn<MajorItem>[] {
  return [
    {
      header: "KODE",
      align: "left",
      headerClassName: "w-24 text-left",
      className: "whitespace-nowrap w-24",
      cell: (item) => (
        <Span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border border-slate-200 bg-slate-50 text-slate-700 shadow-2xs">
          <Shapes className="h-3.5 w-3.5 text-slate-500" />
          {item.code}
        </Span>
      ),
    },
    {
      header: "NAMA PROGRAM KEAHLIAN",
      align: "left",
      className: "min-w-0 max-w-md lg:max-w-xl xl:max-w-2xl",
      cell: (item) => (
        <Box className="min-w-0 py-1">
          <Heading3 className="font-bold text-slate-900 text-sm leading-snug truncate">
            {item.name}
          </Heading3>
          {item.description && (
            <Paragraph className="text-xs text-slate-500 mt-0.5 line-clamp-1">
              {item.description}
            </Paragraph>
          )}
        </Box>
      ),
    },
    {
      header: "DEPARTEMEN INDUK",
      align: "left",
      headerClassName: "w-56 text-left",
      className: "whitespace-nowrap w-56 text-left",
      cell: (item) => (
        <Box className="flex items-center justify-start">
          {item.department ? (
            <Span
              title={item.department.name}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
            >
              <Network className="h-3.5 w-3.5 text-slate-500" />
              <Span>{item.department.code}</Span>
            </Span>
          ) : (
            <Span className="text-slate-400 text-xs font-medium">-</Span>
          )}
        </Box>
      ),
    },
    {
      header: "STATUS",
      align: "center",
      headerClassName: "w-24 text-center",
      className: "whitespace-nowrap w-24",
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
      headerClassName: "w-28 text-center",
      className: "whitespace-nowrap w-28",
      cell: (item) => (
        <Box className="flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handlers.onEdit(item)}
            title="Edit Jurusan"
            className="h-8 w-8 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary hover:border-primary/40 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <DataTableDeleteButton
            itemName={item.name}
            title="Hapus Jurusan ini?"
            description="Tindakan tidak dapat dibatalkan."
            buttonTitle="Hapus Jurusan"
            className="border-rose-200/80 bg-rose-50/70 text-rose-600 hover:bg-rose-100 hover:text-rose-700 shadow-2xs"
            onConfirm={() => handlers.onDelete(item)}
          />
        </Box>
      ),
    },
  ];
}
