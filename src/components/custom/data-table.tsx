import * as React from "react";
import { Loader2, Trash2, AlertCircle, FileText, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

export interface DataTableColumn<T> {
  header: string;
  accessorKey?: keyof T | string;
  align?: "left" | "center" | "right";
  className?: string;
  headerClassName?: string;
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

  const handleConfirm = async () => {
    if (!onConfirm) {
      setOpen(false);
      return;
    }
    setIsDeleting(true);
    try {
      await onConfirm();
      setOpen(false);
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
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={disabled}
          className={cn(
            "h-8.5 w-8.5 rounded-md border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 cursor-pointer shadow-none transition-colors",
            className,
          )}
          title={buttonTitle}
        >
          <Trash2 className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
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
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
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
              onClick={() => setOpen(false)}
              className="h-7 px-2.5 text-xs font-medium rounded-lg border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isDeleting}
              onClick={handleConfirm}
              className="h-7 px-3 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                "Hapus"
              )}
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
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {extraActions}
      {showView && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onView?.(row)}
          className="h-8.5 w-8.5 rounded-md border-blue-200 text-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 cursor-pointer shadow-none transition-colors"
          title="Lihat Detail"
        >
          <FileText className="size-4" />
        </Button>
      )}
      {showEdit && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onEdit?.(row)}
          className="h-8.5 w-8.5 rounded-md border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 cursor-pointer shadow-none transition-colors"
          title="Edit"
        >
          <Pencil className="size-4" />
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
  pagination?: DataTablePaginationProps;
  /** Automatically attaches action column with DeleteButton Popover confirmation */
  actions?: DataTableActionConfig<T>;
}

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
  pagination,
  actions,
}: DataTableProps<T>) {
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
  return (
    <div
      className={cn(
        "w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden",
        className,
      )}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F6F7FB] border-b border-slate-200/90">
              {showNumbering && (
                <th className="py-4 px-6 font-bold text-xs text-slate-500 uppercase tracking-wider w-16 text-center select-none">
                  No
                </th>
              )}
              {effectiveColumns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn(
                    "py-4 px-6 font-bold text-xs text-slate-500 uppercase tracking-wider select-none",
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
              <tr>
                <td
                  colSpan={effectiveColumns.length + (showNumbering ? 1 : 0)}
                  className="py-16 text-center text-slate-500"
                >
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
                  <p className="text-sm font-semibold text-slate-700">
                    Memuat data...
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Mohon tunggu beberapa saat
                  </p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={effectiveColumns.length + (showNumbering ? 1 : 0)}
                  className="py-16 text-center text-slate-500"
                >
                  {emptyIcon && (
                    <div className="mb-3 flex justify-center">{emptyIcon}</div>
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
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={cn(
                    "hover:bg-slate-50/70 transition-colors group",
                    rowClassName,
                  )}
                >
                  {showNumbering && (
                    <td className="py-4.5 px-6 text-center font-bold text-sm text-slate-800">
                      {numberStartIndex + rowIdx}
                    </td>
                  )}
                  {effectiveColumns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={cn(
                        "py-4.5 px-6 text-sm text-slate-700 align-middle",
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                        col.align === "left" && "text-left",
                        col.className,
                      )}
                    >
                      {col.cell
                        ? col.cell(row, rowIdx)
                        : col.accessorKey
                          ? row[col.accessorKey as string]
                          : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && <DataTablePagination {...pagination} />}
    </div>
  );
}

DataTable.DeleteButton = DataTableDeleteButton;
DataTable.Actions = DataTableActions;

export { DataTablePagination, type DataTablePaginationProps, type RoleType };
