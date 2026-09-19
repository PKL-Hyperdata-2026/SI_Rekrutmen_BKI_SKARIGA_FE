import { AlertCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useValidasiPresensiReject } from "./use-validasi-presensi-reject";

export interface ValidasiPresensiRejectButtonProps {
  applicantName?: string | null;
  title?: string;
  description?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  align?: "end" | "center" | "start";
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  children?: React.ReactNode;
}

export function ValidasiPresensiRejectButton({
  applicantName,
  title,
  description,
  disabled = false,
  isLoading = false,
  onConfirm,
  align = "end",
  side = "left",
  className,
  children,
}: ValidasiPresensiRejectButtonProps) {
  const {
    open,
    busy,
    popoverTitle,
    popoverMessage,
    buttonTitle,
    confirmButtonText,
    handleOpenChange,
    handleCancel,
    handleConfirm,
  } = useValidasiPresensiReject({
    applicantName,
    title,
    description,
    isLoading,
    onConfirm,
  });

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={disabled || busy}
            className={cn(
              "h-8 w-8 rounded-lg border-rose-200 bg-rose-50/60 text-rose-600 hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300 cursor-pointer shadow-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
              className,
            )}
            title={buttonTitle}
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <X className="size-4" strokeWidth={2.5} />
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        sideOffset={8}
        collisionPadding={16}
        avoidCollisions
        className="w-72 max-w-[calc(100vw-2rem)] p-3.5 shadow-xl border border-slate-200/90 rounded-xl bg-white text-slate-800 z-50"
      >
        <CardContent className="flex flex-col gap-3 p-0">
          <CardContent className="flex items-start gap-2.5 p-0">
            <CardContent className="p-1.5 rounded-full bg-rose-50 text-rose-600 shrink-0 mt-0.5">
              <AlertCircle className="size-4" />
            </CardContent>
            <CardContent className="p-0">
              <CardTitle className="text-xs font-semibold text-slate-900 leading-tight font-sans">
                {popoverTitle}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1 leading-normal font-sans">
                {popoverMessage}
              </CardDescription>
            </CardContent>
          </CardContent>
          <CardContent className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 p-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={handleCancel}
              className="h-7 px-2.5 text-xs font-medium rounded-lg border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={busy}
              onClick={handleConfirm}
              className="h-7 px-2.5 text-xs font-medium rounded-lg bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
            >
              {confirmButtonText}
            </Button>
          </CardContent>
        </CardContent>
      </PopoverContent>
    </Popover>
  );
}
