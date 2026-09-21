import * as React from "react";
import { FileText, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DataTablePagination,
  type DataTablePaginationProps,
  type RoleType,
} from "./table/data-table-pagination";
import {
  DataTableDeleteButton,
  type DataTableDeleteButtonProps,
} from "./table/data-table-delete";

function getNestedValue(obj: unknown, path?: string): unknown {
  if (!path || !obj || typeof obj !== "object") return null;
  const record = obj as Record<string, unknown>;
  if (!path.includes(".")) return record[path] ?? null;
  return (
    path.split(".").reduce<unknown>((acc, part) => {
      if (acc && typeof acc === "object" && part in acc) {
        return (acc as Record<string, unknown>)[part];
      }
      return null;
    }, obj) ?? null
  );
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

export function DataTable<T>({
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

              {showNumbering && (
                <th
                  scope="col"
                  className="py-2.5 px-4 font-bold text-xs w-14 text-center select-none"
                >
                  NO
                </th>
              )}

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
                    <div className="mb-2.5 flex justify-center">
                      {emptyIcon}
                    </div>
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

                    {showNumbering && (
                      <td className="py-2.5 px-4 text-center font-bold text-xs text-slate-700 align-middle">
                        {numberStartIndex + rowIdx}
                      </td>
                    )}

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
                            ? (getNestedValue(
                                row,
                                col.accessorKey as string,
                              ) as React.ReactNode)
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

export {
  DataTablePagination,
  type DataTablePaginationProps,
  type RoleType,
  DataTableDeleteButton,
  type DataTableDeleteButtonProps,
};
