import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type AttendanceItem } from "./validasi-presensi.schema";
import { useValidasiPresensiInfo } from "./use-validasi-presensi-info";

export interface ValidasiPresensiInfoButtonProps {
  item: AttendanceItem;
  align?: "end" | "center" | "start";
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  label?: string;
  children?: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ValidasiPresensiInfoButton({
  item,
  align = "end",
  side = "left",
  className,
  label,
  children,
  isOpen: propsIsOpen,
  onOpenChange: propsOnOpenChange,
}: ValidasiPresensiInfoButtonProps) {
  const {
    isOpen,
    handleOpenChange,
    handleCloseAutoFocus,
    buttonSize,
    buttonTitle,
    initials,
    applicantName,
    companyName,
    vacancyTitle,
    stageName,
    phone,
    educationText,
  } = useValidasiPresensiInfo(item, {
    isOpen: propsIsOpen,
    onOpenChange: propsOnOpenChange,
    label,
  });

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            type="button"
            variant="outline"
            size={buttonSize}
            className={cn(
              label
                ? "h-8 px-2.5 rounded-lg border-blue-200 bg-blue-50/60 text-blue-600 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300 cursor-pointer shadow-none transition-colors font-semibold text-xs gap-1.5"
                : "h-8 w-8 rounded-lg border-blue-200 bg-blue-50/60 text-blue-600 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300 cursor-pointer shadow-none transition-colors",
              className,
            )}
            title={buttonTitle}
          >
            <Info className={label ? "size-3.5" : "size-4"} />
            {label ? (
              <Badge
                variant="outline"
                className="border-none bg-transparent p-0 text-inherit font-inherit text-xs font-semibold shadow-none rounded-none inline"
              >
                {label}
              </Badge>
            ) : null}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        sideOffset={8}
        collisionPadding={16}
        avoidCollisions
        onCloseAutoFocus={handleCloseAutoFocus}
        className="theme-admin w-[calc(100vw-2rem)] sm:w-104 max-w-md p-4 sm:p-5 shadow-xl border border-slate-200/90 rounded-lg bg-white text-slate-800 z-50 flex flex-col gap-3.5"
      >
        <CardContent className="flex items-start gap-3 p-0 min-w-0">
          <Avatar className="size-12 sm:size-14 rounded-lg border border-slate-200/80 shadow-xs after:hidden shrink-0 overflow-hidden select-none">
            <AvatarFallback className="rounded-lg bg-purple-100 text-purple-700 font-bold text-sm font-sans">
              {initials}
            </AvatarFallback>
          </Avatar>
          <CardContent className="flex flex-col justify-center gap-1 min-w-0 flex-1 p-0">
            <CardTitle className="font-bold text-slate-900 text-sm sm:text-base leading-snug font-sans wrap-break-word min-w-0">
              {applicantName}
            </CardTitle>
            <CardDescription className="text-xs text-slate-600 font-medium flex flex-wrap items-center gap-x-1.5 gap-y-0.5 leading-relaxed font-sans min-w-0">
              <Badge
                variant="outline"
                className="border-none bg-transparent p-0 text-slate-800 font-semibold wrap-break-word text-xs shadow-none rounded-none inline"
              >
                {companyName}
              </Badge>
              {vacancyTitle ? (
                <CardContent className="inline-flex items-center gap-1.5 min-w-0 p-0">
                  <Badge
                    variant="outline"
                    className="border-none bg-transparent p-0 text-slate-300 shrink-0 shadow-none rounded-none text-xs inline"
                  >
                    •
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-none bg-transparent p-0 text-slate-600 font-medium wrap-break-word text-xs shadow-none rounded-none inline"
                  >
                    {vacancyTitle}
                  </Badge>
                </CardContent>
              ) : null}
            </CardDescription>
          </CardContent>
        </CardContent>

        <CardContent className="flex flex-col gap-2 pt-3 border-t border-slate-100 text-xs font-sans p-0">
          <CardContent className="flex items-center justify-between gap-2 p-2 bg-slate-50/80 rounded-md border border-slate-100 min-w-0">
            <CardDescription className="text-slate-500 font-medium text-[11px] shrink-0">
              Nama Tes
            </CardDescription>
            <Badge
              variant="outline"
              className="bg-white text-purple-700 border-purple-200 font-semibold text-xs px-2 py-0.5 rounded-md shadow-none truncate"
            >
              {stageName}
            </Badge>
          </CardContent>

          <CardContent className="flex items-center justify-between gap-2 p-2 bg-slate-50/80 rounded-md border border-slate-100 min-w-0">
            <CardDescription className="text-slate-500 font-medium text-[11px] shrink-0">
              Jurusan & Kelulusan
            </CardDescription>
            <CardDescription
              className="text-slate-800 font-semibold text-xs text-right wrap-break-word leading-tight"
              title={educationText}
            >
              {educationText}
            </CardDescription>
          </CardContent>

          <CardContent className="flex items-center justify-between gap-2 p-2 bg-slate-50/80 rounded-md border border-slate-100 min-w-0">
            <CardDescription className="text-slate-500 font-medium text-[11px] shrink-0">
              Kontak (No. HP)
            </CardDescription>
            <CardDescription className="text-slate-800 font-semibold text-xs text-right font-mono tracking-tight select-all">
              {phone}
            </CardDescription>
          </CardContent>
        </CardContent>
      </PopoverContent>
    </Popover>
  );
}
