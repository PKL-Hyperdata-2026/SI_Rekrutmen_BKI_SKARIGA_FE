import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RecruitmentSelectionItem } from "./types";

export interface CekStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: RecruitmentSelectionItem | null;
}

function resolveAttendanceLabelForModal(item: RecruitmentSelectionItem | null): string {
  if (!item) return "-";
  const histories = item.stageHistories ?? [];
  if (histories.length === 0) return "Belum Absensi";
  const currentStageId = item.currentStage?.id != null ? String(item.currentStage.id) : null;
  let target = histories.find((h) =>
    currentStageId && h.selectionStage?.id != null ? String(h.selectionStage.id) === currentStageId : false
  );
  if (!target) {
    const sorted = [...histories].sort((a, b) => {
      const ca = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const cb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return cb - ca;
    });
    target = sorted[0] ?? histories[0];
  }
  const raw = target?.attendance?.attendanceLabel ?? target?.attendance?.attendanceStatus?.name ?? null;
  const normalized = (raw ?? "").trim().toLowerCase();
  if (normalized === "hadir" || normalized === "present") return "Hadir";
  if (
    normalized === "tidak hadir" ||
    normalized === "tidak_hadir" ||
    normalized === "absent" ||
    normalized.includes("tidak hadir")
  )
    return "Tidak Hadir";
  return raw && raw.trim() !== "" && raw !== "Belum Presensi" ? raw : "Belum Absensi";
}

export function CekStatusModal({ open, onOpenChange, item }: CekStatusModalProps) {
  const companyName = item?.jobVacancy?.companyName ?? "-";
  const quota = item?.jobVacancy?.quota != null ? String(item.jobVacancy.quota) : "-";
  const qualification = item?.jobVacancy?.qualification ?? item?.jobVacancy?.description ?? "-";
  const namaPelamar = item?.student?.name ?? item?.studentAlumni?.user?.fullName ?? "-";
  const jurusan = item?.student?.majorName ?? item?.studentAlumni?.major?.name ?? "-";
  const statusKehadiran = resolveAttendanceLabelForModal(item);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-xl w-full overflow-hidden rounded-2xl bg-white border-0 shadow-2xl flex flex-col max-h-screen">
        {/* Header gradien ungu spec */}
        <div className="relative px-6 py-5 flex items-start justify-between gap-4 bg-gradient-to-r from-primary to-accent text-white shrink-0">
          <div className="flex flex-col gap-1 min-w-0">
            <DialogTitle className="text-lg font-bold tracking-tight text-white leading-tight">
              Cek Status
            </DialogTitle>
            <DialogDescription className="text-xs text-white/80 leading-snug">
              Cek status dari alumni
            </DialogDescription>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Tutup modal"
            className="rounded-full p-1.5 text-white/80 hover:text-white hover:bg-white/15 transition-colors shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body view-only */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
          {/* Nama Lengkap Pelamar */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="cek-nama" className="text-xs font-semibold text-slate-700">
              Nama Lengkap Pelamar <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="cek-nama"
              value={namaPelamar}
              readOnly
              disabled
              className="h-10 rounded-xl border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>

          {/* Jurusan */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="cek-jurusan" className="text-xs font-semibold text-slate-700">
              Jurusan <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="cek-jurusan"
              value={jurusan}
              readOnly
              disabled
              className="h-10 rounded-xl border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>

          {/* Status Kehadiran */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="cek-kehadiran" className="text-xs font-semibold text-slate-700">
              Status Kehadiran <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="cek-kehadiran"
              value={statusKehadiran}
              readOnly
              disabled
              className="h-10 rounded-xl border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>

          {/* Nama Perusahaan Mitra */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="cek-company" className="text-xs font-semibold text-slate-700">
              Nama Perusahaan Mitra <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="cek-company"
              value={companyName}
              readOnly
              disabled
              className="h-10 rounded-xl border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>

          {/* Kuota */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="cek-quota" className="text-xs font-semibold text-slate-700">
              Kuota <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="cek-quota"
              value={quota}
              readOnly
              disabled
              className="h-10 rounded-xl border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>

          {/* Kualifikasi / Persyaratan */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="cek-qualification" className="text-xs font-semibold text-slate-700">
              Kualifikasi / Persyaratan <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="cek-qualification"
              value={qualification}
              readOnly
              disabled
              rows={5}
              className="min-h-28 rounded-xl border-slate-200 bg-slate-50 text-slate-900 text-sm leading-relaxed disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-slate-50 resize-none"
            />
          </div>
        </div>
        {/* No footer / no submit button - view only */}
      </DialogContent>
    </Dialog>
  );
}
