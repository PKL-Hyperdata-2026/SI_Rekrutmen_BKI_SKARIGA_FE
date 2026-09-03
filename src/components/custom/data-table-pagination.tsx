import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type RoleType = "siswa" | "admin" | "hrd" | "default";

export interface DataTablePaginationProps {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  role?: RoleType;
  paginationColor?: string;
  activeClassName?: string;
  showItemInfo?: boolean;
  showPageSizeSelector?: boolean;
  className?: string;
}

const ROLE_COLOR_PRESETS: Record<
  string,
  { bg: string; text: string; hex: string }
> = {
  siswa: {
    bg: "bg-[#287DCE] hover:bg-[#287DCE]/90 text-white border-[#287DCE] shadow-sm shadow-[#287DCE]/25",
    text: "text-[#287DCE]",
    hex: "#287DCE",
  },
  admin: {
    bg: "bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white border-[#7C3AED] shadow-sm shadow-[#7C3AED]/25",
    text: "text-[#7C3AED]",
    hex: "#7C3AED",
  },
  hrd: {
    bg: "bg-[#D069D7] hover:bg-[#D069D7]/90 text-white border-[#D069D7] shadow-sm shadow-[#D069D7]/25",
    text: "text-[#D069D7]",
    hex: "#D069D7",
  },
  default: {
    bg: "bg-primary hover:bg-primary/90 text-primary-foreground border-primary shadow-sm shadow-primary/20",
    text: "text-primary",
    hex: "",
  },
};

function generatePaginationRange(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];
  const showLeftEllipsis = currentPage > 4;
  const showRightEllipsis = currentPage < totalPages - 3;

  pages.push(1);

  if (showLeftEllipsis) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }

  if (showRightEllipsis) {
    pages.push("ellipsis");
  }

  if (!pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
}

export function DataTablePagination({
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  role = "default",
  paginationColor,
  activeClassName,
  showItemInfo = true,
  showPageSizeSelector = true,
  className,
}: DataTablePaginationProps) {
  const isHexColor =
    paginationColor &&
    (paginationColor.startsWith("#") || paginationColor.startsWith("rgb"));
  const roleKey =
    paginationColor && ROLE_COLOR_PRESETS[paginationColor]
      ? paginationColor
      : role && ROLE_COLOR_PRESETS[role]
        ? role
        : "default";

  const rolePreset = ROLE_COLOR_PRESETS[roleKey] || ROLE_COLOR_PRESETS.default;

  const resolvedActiveClass = cn(
    rolePreset.bg,
    !isHexColor &&
      paginationColor &&
      !ROLE_COLOR_PRESETS[paginationColor] &&
      paginationColor,
    activeClassName,
  );

  const activeInlineStyle: React.CSSProperties = isHexColor
    ? {
        backgroundColor: paginationColor,
        borderColor: paginationColor,
        color: "#FFFFFF",
        boxShadow: `0 2px 8px ${paginationColor}40`,
      }
    : {};

  const startItem = totalItems
    ? Math.min((currentPage - 1) * pageSize + 1, totalItems)
    : (currentPage - 1) * pageSize + 1;
  const endItem = totalItems
    ? Math.min(currentPage * pageSize, totalItems)
    : currentPage * pageSize;

  const pages = generatePaginationRange(currentPage, totalPages);

  return (
    <div
      className={cn(
        "w-full border-t border-slate-100 bg-white px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 select-none",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
        {showItemInfo && (
          <p className="text-slate-600">
            Menampilkan{" "}
            <span className="font-bold text-slate-800">
              {totalItems === 0 ? 0 : startItem}
            </span>
            {" - "}
            <span className="font-bold text-slate-800">
              {totalItems === 0 ? 0 : endItem}
            </span>
            {" dari "}
            <span className="font-bold text-slate-800">
              {totalItems !== undefined ? totalItems : "-"}
            </span>
            {" data"}
          </p>
        )}

        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Tampilkan:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => onPageSizeChange(Number(val))}
            >
              <SelectTrigger className="h-8 w-18 rounded-md text-xs bg-slate-50/70 border-slate-200">
                <SelectValue placeholder={String(pageSize)} />
              </SelectTrigger>
              <SelectContent className="rounded-md text-xs">
                {pageSizeOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)} className="text-xs">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex items-center">
        <Pagination className="mx-0 w-auto">
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  currentPage > 1 && onPageChange?.(currentPage - 1)
                }
                disabled={currentPage <= 1}
                className={cn(
                  "rounded-md h-8 text-xs font-semibold px-2.5 transition-colors",
                  currentPage <= 1
                    ? "opacity-40 pointer-events-none cursor-not-allowed"
                    : "hover:bg-slate-100 text-slate-700",
                )}
              />
            </PaginationItem>

            {pages.map((p, idx) => {
              if (p === "ellipsis") {
                return (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis className="size-8" />
                  </PaginationItem>
                );
              }

              const isActive = p === currentPage;

              return (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={isActive}
                    onClick={() => onPageChange?.(p)}
                    style={isActive ? activeInlineStyle : undefined}
                    className={cn(
                      "size-8 rounded-md text-xs font-semibold transition-all",
                      isActive
                        ? resolvedActiveClass
                        : "text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200",
                    )}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  currentPage < totalPages && onPageChange?.(currentPage + 1)
                }
                disabled={currentPage >= totalPages}
                className={cn(
                  "rounded-md h-8 text-xs font-semibold px-2.5 transition-colors",
                  currentPage >= totalPages
                    ? "opacity-40 pointer-events-none cursor-not-allowed"
                    : "hover:bg-slate-100 text-slate-700",
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
