import { CheckCircle2, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useValidasiPresensiTableLogMobile,
  type UseValidasiPresensiTableLogMobileParams,
} from "../hooks/useValidasiPresensiTableLogMobile";

export type ValidasiPresensiTableLogMobileCardsProps =
  UseValidasiPresensiTableLogMobileParams;

export function ValidasiPresensiTableLogMobileCards(
  props: ValidasiPresensiTableLogMobileCardsProps,
) {
  const { showLoading, showEmpty, skeletonCards, cardItems } =
    useValidasiPresensiTableLogMobile(props);

  return (
    <CardContent className="theme-admin flex flex-col gap-3 md:hidden w-full max-w-full min-w-0 overflow-hidden cursor-default **:cursor-default p-0">
      {showLoading ? (
        skeletonCards.map((skeleton) => (
          <Card
            key={skeleton.key}
            className="p-3.5 min-[380px]:p-4 sm:p-5 bg-white border border-slate-200/90 rounded-lg shadow-xs flex flex-col gap-3 ring-0 w-full max-w-full min-w-0 overflow-hidden"
          >
            <CardContent className="flex items-start gap-2.5 min-w-0 w-full p-0">
              <CardContent className="flex items-start gap-2.5 min-w-0 flex-1 p-0">
                <Skeleton className="size-10 sm:size-11 rounded-xl shrink-0" />
                <CardContent className="flex flex-col gap-1 min-w-0 flex-1 pt-0.5 p-0">
                  <Skeleton
                    className={cn(
                      "h-3.5 sm:h-4 rounded-md",
                      skeleton.titleWidthClass,
                    )}
                  />
                  <Skeleton
                    className={cn(
                      "h-3 sm:h-3.5 rounded-md",
                      skeleton.subtitleWidthClass,
                    )}
                  />
                  <Skeleton className="h-2.5 sm:h-3 w-1/3 max-w-18.75 rounded-md" />
                </CardContent>
              </CardContent>
              <CardContent className="shrink-0 pt-0.5 max-w-[35%] flex justify-end p-0">
                <Skeleton
                  className={cn(
                    "h-6 rounded-full shrink-0",
                    skeleton.badgeWidthClass,
                  )}
                />
              </CardContent>
            </CardContent>

            <CardContent className="w-full flex flex-col gap-1.5 px-3 py-2 rounded-lg border bg-slate-50/80 border-slate-200/90 min-w-0 overflow-hidden">
              <Skeleton className="h-2.5 w-24 max-w-[50%] rounded" />
              <Skeleton
                className={cn("h-3.5 rounded", skeleton.descWidthClass)}
              />
            </CardContent>
          </Card>
        ))
      ) : showEmpty ? (
        <Card className="p-8 text-center bg-white border border-slate-200/90 rounded-lg shadow-xs ring-0 w-full max-w-full min-w-0">
          <CardTitle className="text-sm font-semibold text-slate-700 font-sans">
            Tidak ada riwayat
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 mt-1 font-sans wrap-break-word">
            Belum ada data riwayat validasi presensi.
          </CardDescription>
        </Card>
      ) : (
        cardItems.map((card) => (
          <Card
            key={card.cardKey}
            className="p-3.5 min-[380px]:p-4 sm:p-5 bg-white border border-slate-200/90 rounded-lg shadow-xs flex flex-col gap-3 ring-0 w-full max-w-full min-w-0 overflow-hidden"
          >
            <CardContent className="flex items-start gap-2.5 min-w-0 w-full p-0">
              <CardContent className="flex items-start gap-2.5 min-w-0 flex-1 p-0">
                <Avatar className="size-10 sm:size-11 rounded-xl border-none shadow-none after:hidden shrink-0">
                  <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-xs sm:text-sm font-sans">
                    {card.initials}
                  </AvatarFallback>
                </Avatar>
                <CardContent className="flex flex-col gap-1 min-w-0 flex-1 p-0">
                  <CardTitle className="font-bold text-slate-900 text-[13px] sm:text-sm leading-snug font-sans wrap-break-word line-clamp-2">
                    {card.applicantName}
                  </CardTitle>
                  <CardDescription className="text-[11px] sm:text-xs text-slate-600 font-medium font-sans leading-relaxed wrap-break-word min-w-0">
                    {card.companyText}
                  </CardDescription>
                  <CardDescription className="text-[10px] sm:text-[11px] text-slate-400 font-medium font-sans leading-relaxed wrap-break-word">
                    {card.validatedAtText}
                  </CardDescription>
                </CardContent>
              </CardContent>

              <CardContent className="shrink-0 pt-0.5 max-w-[38%] flex justify-end p-0">
                {card.isVerified ? (
                  <Badge
                    variant="outline"
                    className="bg-emerald-50/80 text-emerald-600 border border-emerald-300 rounded-full px-2 py-1 text-[10px] sm:text-[11px] font-semibold inline-flex items-center gap-1 shadow-none select-none shrink-0 whitespace-nowrap max-w-full"
                  >
                    <CheckCircle2 className="size-3 shrink-0" />
                    Hadir
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-rose-50/80 text-rose-600 border border-rose-300 rounded-full px-2 py-1 text-[10px] sm:text-[11px] font-semibold inline-flex items-center gap-1 shadow-none select-none shrink-0 whitespace-nowrap max-w-full"
                  >
                    <XCircle className="size-3 shrink-0" />
                    Tidak Hadir
                  </Badge>
                )}
              </CardContent>
            </CardContent>

            <CardContent className="w-full flex flex-col gap-1 px-3 py-2 rounded-lg border bg-slate-50/80 border-slate-200/90 min-w-0 overflow-hidden">
              <CardDescription className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-sans">
                Tindak Lanjut Sistem
              </CardDescription>
              <CardDescription className="text-xs text-slate-700 font-semibold leading-relaxed font-sans wrap-break-word whitespace-normal">
                {card.systemActionText}
              </CardDescription>
            </CardContent>
          </Card>
        ))
      )}
    </CardContent>
  );
}
