import { Trash2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useDataTableDelete } from "@/hooks/use-data-table-delete";

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
  const {
    open,
    isDeleting,
    popoverTitle,
    message,
    handleOpenChange,
    handleCancel,
    handleConfirm,
    handleCloseAutoFocus,
  } = useDataTableDelete({
    onConfirm,
    itemName,
    title,
    description,
  });

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={disabled || isDeleting}
          className={cn(
            "h-8 w-8 rounded-lg border-rose-200 bg-rose-50/40 text-rose-500 hover:bg-rose-100/70 hover:text-rose-600 hover:border-rose-300 cursor-pointer shadow-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
            "aria-expanded:bg-rose-100/70 aria-expanded:text-rose-600 aria-expanded:border-rose-300",
            "data-[state=open]:bg-rose-100/70 data-[state=open]:text-rose-600 data-[state=open]:border-rose-300",
            className,
            open && "bg-rose-100/70 text-rose-600 border-rose-300",
          )}
          title={buttonTitle}
        >
          {isDeleting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Trash2 className="size-3.5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        sideOffset={8}
        collisionPadding={16}
        avoidCollisions
        onCloseAutoFocus={handleCloseAutoFocus}
        className="w-72 max-w-[calc(100vw-2rem)] p-3.5 shadow-xl border border-slate-200/90 rounded-lg bg-white text-slate-800 z-50"
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
              onClick={handleCancel}
              className="h-7 px-2.5 text-xs font-medium rounded-md border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isDeleting}
              onClick={handleConfirm}
              className="h-7 px-2.5 text-xs font-medium rounded-md bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

