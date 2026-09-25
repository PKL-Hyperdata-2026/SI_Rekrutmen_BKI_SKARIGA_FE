import { Network, Pencil, Shapes } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DataTableDeleteButton,
  Box,
  Span,
  Heading3,
  Paragraph,
} from "@/components/custom";
import type { MajorItem } from "./jurusan.schema";

export interface MajorCardProps {
  item: MajorItem;
  onToggleActive: (item: MajorItem) => void;
  onEdit: (item: MajorItem) => void;
  onDelete: (item: MajorItem) => void | Promise<void>;
}

export function MajorCard({
  item,
  onToggleActive,
  onEdit,
  onDelete,
}: MajorCardProps) {
  return (
    <Card className="rounded-xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs transition-shadow hover:shadow-sm w-full min-w-0">
      <CardContent className="p-0 space-y-3">
        <Box className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border-slate-200 bg-slate-50 text-slate-700 shadow-2xs shrink-0"
          >
            <Shapes className="h-3.5 w-3.5 text-slate-500" />
            <Span>{item.code}</Span>
          </Badge>

          <Box className="flex items-center gap-2 shrink-0">
            <Span className="text-xs font-medium text-slate-500">
              {item.isActive ? "Aktif" : "Nonaktif"}
            </Span>
            <Switch
              checked={item.isActive}
              onCheckedChange={() => onToggleActive(item)}
              aria-label={`Ubah status jurusan ${item.name}`}
            />
          </Box>
        </Box>

        <Box className="space-y-1 min-w-0">
          <Heading3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug wrap-break-word">
            {item.name}
          </Heading3>
          {item.description ? (
            <Paragraph className="text-xs text-slate-500 leading-relaxed line-clamp-2 wrap-break-word">
              {item.description}
            </Paragraph>
          ) : null}
        </Box>

        <Box className="pt-2.5 flex items-center justify-between gap-2 border-t border-slate-100">
          <Badge
            variant="outline"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border-primary/20 bg-primary/5 text-primary shadow-2xs shrink-0"
            title={item.department?.name || undefined}
          >
            <Network className="h-3.5 w-3.5 text-primary shrink-0" />
            <Span>{item.department?.code || "-"}</Span>
          </Badge>

          <Box className="flex items-center gap-1.5 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onEdit(item)}
              title="Edit Jurusan"
              aria-label={`Edit jurusan ${item.name}`}
              className="h-8 w-8 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary hover:border-primary/40 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <DataTableDeleteButton
              itemName={item.name}
              title="Hapus Jurusan ini?"
              description="Tindakan tidak dapat dibatalkan."
              buttonTitle="Hapus Jurusan"
              className="h-8 w-8 rounded-lg border-rose-200/80 bg-rose-50/70 text-rose-600 hover:bg-rose-100 hover:text-rose-700 shadow-2xs"
              onConfirm={() => onDelete(item)}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export function MajorCardSkeleton() {
  return (
    <Card className="rounded-xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs w-full min-w-0 animate-pulse">
      <CardContent className="p-0 space-y-3">
        <Box className="flex items-center justify-between gap-2">
          <Skeleton className="h-6 w-20 rounded-lg" />
          <Skeleton className="h-5 w-16 rounded-lg" />
        </Box>
        <Box className="space-y-1.5">
          <Skeleton className="h-5 w-3/4 rounded-lg" />
          <Skeleton className="h-3.5 w-full rounded-lg" />
        </Box>
        <Box className="pt-2.5 flex items-center justify-between gap-2 border-t border-slate-100">
          <Skeleton className="h-6 w-24 rounded-lg" />
          <Box className="flex items-center gap-1.5">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
