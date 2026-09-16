import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ValidasiPresensiInfoButton } from "./validasi-presensi-info";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  useValidasiPresensiMobileCards,
  type UseValidasiPresensiMobileCardsParams,
} from "../hooks/useValidasiPresensiMobileCards";

export type ValidasiPresensiMobileCardsProps =
  UseValidasiPresensiMobileCardsParams;

export function ValidasiPresensiMobileCards(
  props: ValidasiPresensiMobileCardsProps,
) {
  const {
    showLoading,
    showEmpty,
    showSelectAll,
    isAllSelected,
    isSomeSelected,
    selectedCount,
    selectAllChecked,
    skeletonItems,
    cardItems,
    handleSelectAllChange,
  } = useValidasiPresensiMobileCards(props);

  return (
    <CardContent className="theme-admin flex flex-col gap-3 md:hidden w-full max-w-full min-w-0 overflow-hidden p-0">
      {showLoading ? (
        <>
          <Card className="w-full max-w-full rounded-lg p-3.5 min-[380px]:p-4 sm:p-5 shadow-xs flex flex-row items-center justify-between gap-3 min-w-0 bg-white border border-slate-200/90 ring-0">
            <CardContent className="flex items-center gap-2.5 sm:gap-3 min-w-0 p-0">
              <CardContent className="flex items-center justify-center p-1.5 -m-1.5 shrink-0">
                <Skeleton className="size-5 rounded-[5px]" />
              </CardContent>
              <Skeleton className="h-4 w-20 rounded-md shrink-0" />
            </CardContent>
          </Card>

          {skeletonItems.map((key, idx) => (
            <Card
              key={key}
              className="p-3.5 min-[380px]:p-4 sm:p-5 bg-white border border-slate-200/90 rounded-lg shadow-xs flex flex-col gap-3 ring-0 w-full max-w-full min-w-0 overflow-hidden"
            >
              <CardContent className="flex items-start gap-2.5 sm:gap-3 min-w-0 w-full p-0">
                <CardContent className="flex items-center gap-2.5 sm:gap-3 shrink-0 p-0">
                  <CardContent className="flex items-center justify-center p-1.5 -m-1.5 shrink-0">
                    <Skeleton className="size-5 rounded-[5px]" />
                  </CardContent>
                  <Skeleton className="size-10 sm:size-11 rounded-xl shrink-0" />
                </CardContent>
                <CardContent className="flex flex-col gap-1.5 min-w-0 flex-1 pt-0.5 p-0">
                  <Skeleton
                    className={cn(
                      "h-4 rounded-md",
                      idx === 0
                        ? "w-3/4 max-w-35"
                        : idx === 1
                          ? "w-4/5 max-w-40"
                          : "w-2/3 max-w-32.5",
                    )}
                  />
                  <Skeleton
                    className={cn(
                      "h-3.5 rounded-md",
                      idx === 0
                        ? "w-1/2 max-w-27.5"
                        : idx === 1
                          ? "w-3/5 max-w-32.5"
                          : "w-2/5 max-w-22.5",
                    )}
                  />
                  <Skeleton className="h-3 w-1/3 max-w-20 rounded-md" />
                </CardContent>
              </CardContent>

              <CardContent className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 min-w-0 w-full p-0">
                <Skeleton className="h-3.5 w-7 rounded shrink-0" />
                <Skeleton className="size-8 rounded-lg shrink-0" />
              </CardContent>
            </Card>
          ))}
        </>
      ) : showEmpty ? (
        <Card className="p-8 text-center bg-white border border-slate-200/90 rounded-lg shadow-xs ring-0 w-full max-w-full min-w-0">
          <CardTitle className="text-sm font-semibold text-slate-700 font-sans">
            Tidak ada data yang ditemukan
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 mt-1 font-sans wrap-break-word">
            Belum ada antrean presensi yang perlu divalidasi.
          </CardDescription>
        </Card>
      ) : (
        <>
          {showSelectAll ? (
            <Card
              className={cn(
                "w-full rounded-lg p-3.5 min-[380px]:p-4 sm:p-5 shadow-xs flex flex-row items-center justify-between gap-3 min-w-0 select-none transition-colors border ring-0",
                isAllSelected
                  ? "bg-purple-50/25 border-purple-300 ring-1 ring-purple-300/40"
                  : "bg-white border-slate-200/90",
              )}
            >
              <Label
                htmlFor="mobile-select-all"
                className="flex items-center gap-2.5 sm:gap-3 cursor-pointer min-w-0"
              >
                <CardContent className="flex items-center justify-center p-1.5 -m-1.5 rounded-lg cursor-pointer hover:bg-slate-100/70 active:bg-slate-200/50 transition-colors shrink-0">
                  <Checkbox
                    id="mobile-select-all"
                    checked={selectAllChecked}
                    onCheckedChange={handleSelectAllChange}
                    aria-label="Pilih semua pelamar"
                    className={cn(
                      "size-5 rounded-[5px] border-slate-300 transition-all cursor-pointer",
                      "data-[state=checked]:bg-[#7C3AED]! data-[state=checked]:border-[#7C3AED]! data-[state=checked]:text-white",
                      "data-[state=indeterminate]:bg-[#7C3AED]! data-[state=indeterminate]:border-[#7C3AED]! data-[state=indeterminate]:text-white",
                      "focus-visible:ring-2 focus-visible:ring-purple-500/20",
                      isAllSelected || isSomeSelected
                        ? "border-[#7C3AED]"
                        : "border-slate-300",
                    )}
                  />
                </CardContent>
                <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 font-sans">
                  Pilih Semua
                </CardTitle>
              </Label>

              {selectedCount > 0 ? (
                <Badge
                  variant="outline"
                  className="text-xs font-bold text-purple-700 bg-purple-50 border-purple-200 px-2.5 py-1 rounded-lg shadow-none font-sans shrink-0"
                >
                  {selectedCount} Terpilih
                </Badge>
              ) : null}
            </Card>
          ) : null}

          {cardItems.map((card) => (
            <Card
              key={card.cardKey}
              className={cn(
                "p-3.5 min-[380px]:p-4 sm:p-5 rounded-lg shadow-xs flex flex-col gap-3 ring-0 w-full max-w-full min-w-0 overflow-hidden transition-colors select-text",
                card.isSelected
                  ? "bg-purple-50/30 border-purple-300 ring-1 ring-purple-300/50"
                  : "bg-white border-slate-200/90",
              )}
            >
              <CardContent className="flex items-start gap-3 min-w-0 w-full p-0">
                <CardContent className="flex items-center gap-2.5 sm:gap-3 shrink-0 p-0">
                  <Label
                    htmlFor={`mobile-check-${card.id}`}
                    onClick={card.handleStopPropagation}
                    className="flex items-center justify-center p-1.5 -m-1.5 rounded-lg cursor-pointer hover:bg-slate-100/70 active:bg-slate-200/50 transition-colors"
                  >
                    <Checkbox
                      id={`mobile-check-${card.id}`}
                      checked={card.isSelected}
                      onCheckedChange={card.handleToggle}
                      aria-label={`Pilih ${card.applicantName}`}
                      className={cn(
                        "size-5 rounded-[5px] border-slate-300 transition-all cursor-pointer",
                        "data-[state=checked]:bg-[#7C3AED]! data-[state=checked]:border-[#7C3AED]! data-[state=checked]:text-white",
                        "focus-visible:ring-2 focus-visible:ring-purple-500/20",
                        card.isSelected
                          ? "border-[#7C3AED]"
                          : "border-slate-300",
                      )}
                    />
                  </Label>

                  <Avatar className="size-10 sm:size-11 rounded-xl border-none shadow-none after:hidden shrink-0">
                    <AvatarFallback className="rounded-xl bg-purple-100 text-purple-700 font-bold text-xs sm:text-sm font-sans">
                      {card.initials}
                    </AvatarFallback>
                  </Avatar>
                </CardContent>

                <CardContent className="flex flex-col gap-1 min-w-0 flex-1 pt-0.5 p-0">
                  <CardTitle className="font-bold text-slate-900 text-[13px] sm:text-sm leading-snug font-sans wrap-break-word line-clamp-2">
                    {card.applicantName}
                  </CardTitle>
                  <CardDescription className="text-[11px] sm:text-xs text-slate-600 font-medium font-sans leading-relaxed wrap-break-word min-w-0">
                    {card.companyName}
                  </CardDescription>
                  <CardDescription className="text-[10px] sm:text-[11px] text-slate-400 font-medium font-sans leading-relaxed wrap-break-word">
                    {card.testScheduleText}
                  </CardDescription>
                </CardContent>
              </CardContent>

              <CardContent className="flex items-center justify-between gap-2 flex-wrap pt-3 border-t border-slate-100 min-w-0 w-full p-0">
                <Badge
                  variant="outline"
                  className="text-xs font-semibold text-slate-400 border-none bg-transparent p-0 shadow-none font-sans shrink-0"
                >
                  #{card.itemNumber}
                </Badge>

                <CardContent className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-wrap justify-end p-0">
                  <ValidasiPresensiInfoButton
                    item={card.item}
                    align="center"
                    side="top"
                  />
                </CardContent>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </CardContent>
  );
}
