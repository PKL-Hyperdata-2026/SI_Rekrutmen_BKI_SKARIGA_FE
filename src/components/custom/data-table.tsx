import * as React from "react";
import { Trash2, AlertCircle, FileText, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  DataTablePagination,
  type DataTablePaginationProps,
  type RoleType,
} from "./data-table-pagination";

function getNestedValue(obj: any, path?: string): any {
  if (!path || !obj) return null;
  if (!path.includes(".")) return obj[path] ?? null;
  return path.split(".").reduce((acc, part) => acc?.[part], obj) ?? null;
}

export interface DataTableColumn<T> {
  header: string;
  accessorKey?: keyof T | (string & {});
  align?: "left" | "center" | "right";
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
  sortKey?: string;
  cell?: (row: T, index: number) => React.ReactNode;
}

export interface DataTableDeleteButtonProps {
  onConfirm?: () => void | Promise<void>;
  itemName?: string;
  title?: string;
  description?: string;
  buttonTitle?: string;
  className?: string;
  align?: "end" | "center" | "start";
  side?: "top" | "right" | "bottom" | "left";
  disabled?: boolean;
}

export function DataTableDeleteButton({
  onConfirm,
  itemName,
  title,
  description,
  buttonTitle = "Hapus",
  className,
  align = "end",
  side = "left",
  disabled = false,
}: DataTableDeleteButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!onConfirm) {
      setOpen(false);
      return;
    }
    setIsDeleting(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (err) {
      console.error("Delete confirmation failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const popoverTitle =
    title ?? (itemName ? `Hapus Data ${itemName}` : "Hapus Data");

  const message =
    description ??
    "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={disabled}
          className={cn(
            "h-8 w-8 rounded-lg border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 cursor-pointer shadow-none transition-colors",
            className,
          )}
          title={buttonTitle}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        onClick={(e) => e.stopPropagation()}
        className="w-72 p-3.5 shadow-xl border border-slate-200/90 rounded-xl bg-white text-slate-800 z-50"
      >
        <div className="flex flex-col gap-2.5">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-full bg-rose-50 text-rose-600 shrink-0 mt-0.5">
              <AlertCircle className="size-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-900 leading-tight">
                {popoverTitle}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="h-7 px-2.5 text-xs font-medium rounded-lg border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isDeleting}
              onClick={handleConfirm}
              className="h-7 px-2.5 text-xs font-medium rounded-lg bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export interface DataTableActionsProps<T> {
  row: T;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void | Promise<void>;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  deleteItemName?: string | ((row: T) => string);
  deleteTitle?: string;
  deleteDescription?: string;
  className?: string;
  extraActions?: React.ReactNode;
}

export function DataTableActions<T>({
  row,
  onView,
  onEdit,
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true,
  deleteItemName,
  deleteTitle,
  deleteDescription,
  className,
  extraActions,
}: DataTableActionsProps<T>) {
  const itemName =
    typeof deleteItemName === "function" ? deleteItemName(row) : deleteItemName;

  return (
    <div
      className={cn("flex items-center justify-center gap-1.5", className)}
      onClick={(e) => e.stopPropagation()}
    >
      {extraActions}
      {showView && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onView?.(row);
          }}
          className="h-8 w-8 rounded-lg border-blue-200 text-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 cursor-pointer shadow-none transition-colors"
          title="Lihat Detail"
        >
          <FileText className="size-3.5" />
        </Button>
      )}
      {showEdit && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(row);
          }}
          className="h-8 w-8 rounded-lg border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 cursor-pointer shadow-none transition-colors"
          title="Edit"
        >
          <Pencil className="size-3.5" />
        </Button>
      )}
      {showDelete && (
        <DataTableDeleteButton
          itemName={itemName}
          title={deleteTitle}
          description={deleteDescription}
          onConfirm={() => onDelete?.(row)}
        />
      )}
    </div>
  );
}

export interface DataTableActionConfig<T> {
  header?: string;
  headerClassName?: string;
  className?: string;
  align?: "left" | "center" | "right";
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void | Promise<void>;
  deleteItemName?: string | ((row: T) => string);
  deleteTitle?: string;
  deleteDescription?: string;
  renderExtra?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  showNumbering?: boolean;
  numberStartIndex?: number;
  className?: string;
  rowClassName?: string;
  variant?: "default" | "pill";
  role?: RoleType;
  pagination?: DataTablePaginationProps;
  actions?: DataTableActionConfig<T>;
  selectable?: boolean;
  selectedIds?: (string | number)[];
  onSelectAll?: (checked: boolean) => void;
  onSelectRow?: (id: string | number, checked: boolean) => void;
  onRowClick?: (row: T, index: number) => void;
  getRowId?: (row: T, index: number) => string | number;
}

const roleThemeHeader: Record<RoleType, string> = {
  admin: "border-purple-200/80 bg-purple-50/60 text-purple-900",
  siswa: "border-sky-200/80 bg-sky-50/60 text-sky-900",
  hrd: "border-fuchsia-200/80 bg-fuchsia-50/60 text-fuchsia-900",
  default: "border-purple-200/80 bg-purple-50/60 text-purple-900",
};

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = "Tidak ada data yang ditemukan",
  emptyDescription = "Belum ada catatan yang tersimpan saat ini.",
  emptyIcon,
  showNumbering = true,
  numberStartIndex = 1,
  className,
  rowClassName,
  variant = "default",
  role = "admin",
  pagination,
  actions,
  selectable = false,
  selectedIds = [],
  onSelectAll,
  onSelectRow,
  onRowClick,
  getRowId = (_, idx) => idx,
}: DataTableProps<T>) {
  const isPill = variant === "pill";

  const effectiveColumns = React.useMemo<DataTableColumn<T>[]>(() => {
    if (!actions) return columns;

    return [
      ...columns,
      {
        header: actions.header ?? "AKSI",
        align: actions.align ?? "center",
        headerClassName: actions.headerClassName ?? "text-center w-28",
        className: actions.className ?? "text-center",
        cell: (row: T) => (
          <DataTableActions
            row={row}
            onView={actions.onView}
            onEdit={actions.onEdit}
            onDelete={actions.onDelete}
            deleteItemName={actions.deleteItemName}
            deleteTitle={actions.deleteTitle}
            deleteDescription={actions.deleteDescription}
            extraActions={actions.renderExtra?.(row)}
          />
        ),
      },
    ];
  }, [columns, actions]);

  const allSelected =
    data.length > 0 &&
    data.every((row, idx) => selectedIds.includes(getRowId(row, idx)));
  const someSelected =
    data.some((row, idx) => selectedIds.includes(getRowId(row, idx))) &&
    !allSelected;

  const totalCols = Math.max(
    1,
    effectiveColumns.length + (showNumbering ? 1 : 0) + (selectable ? 1 : 0),
  );

  return (
    <div
      className={cn(
        "w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden",
        className,
      )}
    >
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className={cn(
                "border-b border-slate-200/80 select-none",
                isPill
                  ? cn(
                      "text-xs font-bold uppercase tracking-wider",
                      roleThemeHeader[role] ?? roleThemeHeader.default,
                    )
                  : "bg-[#F6F7FB] text-slate-500 font-bold text-xs uppercase tracking-wider",
              )}
            >
              {/* Selectable Checkbox Header */}
              {selectable && (
                <th scope="col" className="py-2.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    aria-label="Pilih semua baris"
                    aria-checked={someSelected ? "mixed" : allSelected}
                    checked={allSelected}
                    disabled={loading || data.length === 0}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                </th>
              )}

              {/* Numbering Header */}
              {showNumbering && (
                <th
                  scope="col"
                  className="py-2.5 px-4 font-bold text-xs w-14 text-center select-none"
                >
                  NO
                </th>
              )}

              {/* Dynamic Columns Header */}
              {effectiveColumns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={cn(
                    "py-2.5 px-4 font-bold text-xs uppercase tracking-wider select-none",
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                    col.align === "left" && "text-left",
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {selectable && (
                    <td className="py-3 px-3 text-center">
                      <Skeleton className="h-3.5 w-3.5 rounded mx-auto" />
                    </td>
                  )}
                  {showNumbering && (
                    <td className="py-3 px-4 text-center">
                      <Skeleton className="h-3.5 w-5 rounded mx-auto" />
                    </td>
                  )}
                  {effectiveColumns.map((col, cIdx) => (
                    <td
                      key={cIdx}
                      className={cn(
                        "py-3 px-4",
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                        col.align === "left" && "text-left",
                        col.className,
                      )}
                    >
                      <div
                        className={cn(
                          "space-y-1.5",
                          col.align === "center" && "mx-auto",
                        )}
                      >
                        <Skeleton
                          className={cn(
                            "h-3.5 w-3/4",
                            col.align === "center" && "mx-auto",
                          )}
                        />
                        <Skeleton
                          className={cn(
                            "h-2.5 w-1/2",
                            col.align === "center" && "mx-auto",
                          )}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={totalCols}
                  className="py-12 text-center text-slate-500"
                >
                  {emptyIcon && (
                    <div className="mb-2.5 flex justify-center">{emptyIcon}</div>
                  )}
                  <p className="text-sm font-semibold text-slate-700">
                    {emptyMessage}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {emptyDescription}
                  </p>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => {
                const rowId = getRowId(row, rowIdx) ?? rowIdx;
                const isSelected = selectedIds.includes(rowId);

                return (
                  <tr
                    key={rowId}
                    onClick={() => onRowClick?.(row, rowIdx)}
                    className={cn(
                      "hover:bg-slate-50/70 transition-colors group",
                      isSelected && "bg-purple-50/30",
                      onRowClick && "cursor-pointer",
                      rowClassName,
                    )}
                  >
                    {/* Selectable Checkbox */}
                    {selectable && (
                      <td
                        className="py-2.5 px-3 text-center align-middle"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          aria-label={`Pilih baris ${numberStartIndex + rowIdx}`}
                          checked={isSelected}
                          onChange={(e) =>
                            onSelectRow?.(rowId, e.target.checked)
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                        />
                      </td>
                    )}

                    {/* Numbering Cell */}
                    {showNumbering && (
                      <td className="py-2.5 px-4 text-center font-bold text-xs text-slate-700 align-middle">
                        {numberStartIndex + rowIdx}
                      </td>
                    )}

                    {/* Data Cells */}
                    {effectiveColumns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className={cn(
                          "py-2.5 px-4 text-xs sm:text-sm text-slate-700 align-middle",
                          col.align === "center" && "text-center",
                          col.align === "right" && "text-right",
                          col.align === "left" && "text-left",
                          col.className,
                        )}
                      >
                        {col.cell
                          ? col.cell(row, rowIdx)
                          : col.accessorKey
                            ? getNestedValue(row, col.accessorKey as string)
                            : null}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && <DataTablePagination role={role} {...pagination} />}
    </div>
  );
}

DataTable.DeleteButton = DataTableDeleteButton;
DataTable.Actions = DataTableActions;

export { DataTablePagination, type DataTablePaginationProps, type RoleType };
