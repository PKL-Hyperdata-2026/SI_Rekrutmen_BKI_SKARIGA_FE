import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  header: string;
  accessorKey?: keyof T | string;
  align?: "left" | "center" | "right";
  className?: string;
  headerClassName?: string;
  cell?: (row: T, index: number) => React.ReactNode;
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
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        "w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden",
        className
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
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn(
                    "py-4 px-6 font-bold text-xs text-slate-500 uppercase tracking-wider select-none",
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                    col.align === "left" && "text-left",
                    col.headerClassName
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
                  colSpan={columns.length + (showNumbering ? 1 : 0)}
                  className="py-16 text-center text-slate-500"
                >
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
                  <p className="text-sm font-semibold text-slate-700">Memuat data...</p>
                  <p className="text-xs text-slate-400 mt-0.5">Mohon tunggu beberapa saat</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showNumbering ? 1 : 0)}
                  className="py-16 text-center text-slate-500"
                >
                  {emptyIcon && <div className="mb-3 flex justify-center">{emptyIcon}</div>}
                  <p className="text-sm font-semibold text-slate-700">{emptyMessage}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{emptyDescription}</p>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={cn(
                    "hover:bg-slate-50/70 transition-colors group",
                    rowClassName
                  )}
                >
                  {showNumbering && (
                    <td className="py-4.5 px-6 text-center font-bold text-sm text-slate-800">
                      {numberStartIndex + rowIdx}
                    </td>
                  )}
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={cn(
                        "py-4.5 px-6 text-sm text-slate-700 align-middle",
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                        col.align === "left" && "text-left",
                        col.className
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
    </div>
  );
}
