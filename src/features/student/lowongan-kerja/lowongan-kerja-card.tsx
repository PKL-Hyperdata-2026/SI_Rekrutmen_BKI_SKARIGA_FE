import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, MapPin, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type StudentJobVacancy,
  AVATAR_BG_CLASS,
  useLowonganKerjaCard,
} from "./lowongan-kerja.card";

interface LowonganKerjaCardProps {
  vacancy: StudentJobVacancy;
  index?: number;
  onApply?: (vacancy: StudentJobVacancy) => void;
}

export function LowonganKerjaCard({
  vacancy,
  onApply,
}: LowonganKerjaCardProps) {
  const {
    targetBadgeStyle,
    initials,
    majorsLabel,
    formattedDeadline,
    cleanDescription,
    handleApplyClick,
  } = useLowonganKerjaCard(vacancy, onApply);

  return (
    <Card className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 group cursor-default select-none">
      <CardContent className="flex items-start justify-between gap-3 p-0">
        <Avatar className="size-14 rounded-md! shrink-0 overflow-hidden shadow-xs after:hidden">
          <AvatarImage
            src={vacancy.company?.logoPath ?? undefined}
            alt={vacancy.company?.name ?? ""}
            className="rounded-md! object-contain p-1.5"
          />
          <AvatarFallback
            className={cn(
              "rounded-md! font-bold text-base select-none tracking-wider",
              AVATAR_BG_CLASS,
            )}
          >
            {initials}
          </AvatarFallback>
        </Avatar>

        <CardContent className="flex flex-col items-end gap-1.5 shrink-0 p-0">
          <Badge
            variant="outline"
            className={cn(
              "rounded-md text-[11px] font-bold px-2.5 py-0.5 shadow-none transition-colors border",
              targetBadgeStyle,
            )}
          >
            {vacancy.targetApplicant?.name ?? "Semua Target"}
          </Badge>
          <Badge
            variant="outline"
            className="rounded-md border-slate-200 bg-slate-50 text-slate-700 text-[11px] font-medium px-2 py-0.5 shadow-none"
          >
            {majorsLabel}
          </Badge>
        </CardContent>
      </CardContent>

      <CardContent className="space-y-1 p-0">
        <CardTitle className="text-base font-bold text-slate-900 leading-snug line-clamp-1 tracking-tight font-sans">
          {vacancy.position || vacancy.title}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm font-semibold text-primary leading-tight truncate font-sans">
          {vacancy.company?.name ?? "-"}
        </CardDescription>
        <CardDescription className="text-xs text-slate-500 line-clamp-3 leading-relaxed min-h-12 pt-1 font-sans">
          {cleanDescription || "Deskripsi pekerjaan belum tersedia."}
        </CardDescription>
      </CardContent>

      <CardContent className="space-y-2 pt-2 border-t border-slate-100 text-xs p-0">
        <CardContent className="flex items-center justify-between gap-2 text-slate-600 p-0">
          <CardContent className="flex items-center gap-1.5 shrink-0 p-0">
            <Users className="size-4 shrink-0 text-primary" />
            <CardDescription className="text-xs text-slate-600 inline font-sans">
              Kuota:{" "}
              <Badge
                variant="outline"
                className="border-none bg-transparent p-0 font-semibold text-slate-900 shadow-none rounded-none text-xs inline"
              >
                {typeof vacancy.quota === "number"
                  ? `${vacancy.quota} Orang`
                  : "-"}
              </Badge>
            </CardDescription>
          </CardContent>
          <CardContent className="flex items-center gap-1.5 truncate max-w-[50%] text-slate-600 p-0">
            <MapPin className="size-4 shrink-0 text-slate-400" />
            <CardDescription className="truncate text-xs text-slate-600 font-sans">
              {vacancy.workLocation || "-"}
            </CardDescription>
          </CardContent>
        </CardContent>

        <CardContent className="flex items-center gap-1.5 text-red-600 font-medium p-0">
          <Clock className="size-4 shrink-0 text-red-500" />
          <CardDescription className="text-xs text-red-600 font-medium inline font-sans">
            Batas Pendaftaran:{" "}
            <Badge
              variant="outline"
              className="border-none bg-transparent p-0 font-semibold text-red-600 shadow-none rounded-none text-xs inline"
            >
              {formattedDeadline}
            </Badge>
          </CardDescription>
        </CardContent>
      </CardContent>

      {vacancy.hasApplied ? (
        <Button
          onClick={handleApplyClick}
          className="w-full h-9 sm:h-9.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-medium text-xs sm:text-sm px-4 flex items-center justify-center gap-2 transition-all border-0 cursor-pointer shadow-none"
        >
          <CheckCircle2 className="size-4 shrink-0 text-white" />
          <Badge
            variant="outline"
            className="border-none bg-transparent p-0 text-white font-medium text-xs sm:text-sm shadow-none"
          >
            Lihat Detail (Sudah Dilamar)
          </Badge>
        </Button>
      ) : (
        <Button
          onClick={handleApplyClick}
          className="group/btn w-full h-9 sm:h-9.5 rounded-lg bg-linear-to-r from-sidebar-gradient-to via-sidebar-strip to-primary hover:opacity-95 active:scale-[0.99] text-primary-foreground font-medium text-xs sm:text-sm px-4 flex items-center justify-center gap-2 transition-all border-0 cursor-pointer shadow-none"
        >
          <Badge
            variant="outline"
            className="border-none bg-transparent p-0 text-primary-foreground font-medium text-xs sm:text-sm shadow-none"
          >
            Lihat Detail & Lamar
          </Badge>
          <ArrowRight className="size-4 shrink-0 transition-transform duration-200 ease-out group-hover/btn:translate-x-1" />
        </Button>
      )}
    </Card>
  );
}

export function LowonganKerjaCardSkeleton() {
  return (
    <Card className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between gap-4 h-70 cursor-default select-none">
      <CardContent className="flex items-start justify-between gap-3 p-0">
        <Skeleton className="size-14 rounded-md! shrink-0" />
        <CardContent className="flex flex-col items-end gap-1.5 p-0">
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </CardContent>
      </CardContent>
      <CardContent className="space-y-2 p-0">
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
        <Skeleton className="h-10 w-full rounded" />
      </CardContent>
      <CardContent className="space-y-2 pt-2 border-t border-slate-100 p-0">
        <CardContent className="flex items-center justify-between p-0">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </CardContent>
        <Skeleton className="h-4 w-36 rounded" />
      </CardContent>
      <Skeleton className="h-9 sm:h-9.5 w-full rounded-lg" />
    </Card>
  );
}
