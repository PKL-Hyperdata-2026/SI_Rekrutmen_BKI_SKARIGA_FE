import { Modal } from "@/components/custom/modal";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckSquare,
  CheckCircle2,
  Send,
  Loader2,
} from "lucide-react";
import { RichTextEditor } from "@/components/custom";
import type { StudentJobVacancy } from "./lowongan-kerja.card";
import { useLowonganKerjaForm } from "./lowongan-kerja.form";

export interface LowonganKerjaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vacancy: StudentJobVacancy | null;
  onApplySuccess?: () => void;
}

export function LowonganKerjaForm({
  open,
  onOpenChange,
  vacancy,
  onApplySuccess,
}: LowonganKerjaFormProps) {
  const {
    activeVacancy,
    hasApplied,
    isSubmitting,
    formattedDeadline,
    majorsLabel,
    cleanDescription,
    qualificationLines,
    handleSubmitApplication,
  } = useLowonganKerjaForm({
    vacancy,
    open,
    onOpenChange,
    onApplySuccess,
  });

  if (!activeVacancy) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      variant="student"
      headerStyle="gradient"
      size="md"
      title={activeVacancy.position || activeVacancy.title}
      description={activeVacancy.company?.name || "-"}
      footer={
        hasApplied ? null : (
          <CardFooter className="flex items-center justify-end gap-3 w-full p-0 border-0 bg-transparent">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="h-10 rounded-lg border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-6 cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleSubmitApplication}
              disabled={isSubmitting}
              className="h-10 rounded-lg font-semibold px-6 transition-all flex items-center gap-2 cursor-pointer bg-linear-to-r from-sidebar-gradient-to via-sidebar-strip to-primary hover:opacity-95 text-primary-foreground shadow-md active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <Badge
                    variant="outline"
                    className="border-none bg-transparent p-0 text-primary-foreground font-semibold text-sm shadow-none"
                  >
                    Mengirim...
                  </Badge>
                </>
              ) : (
                <>
                  <Badge
                    variant="outline"
                    className="border-none bg-transparent p-0 text-primary-foreground font-semibold text-sm shadow-none"
                  >
                    Lamar Sekarang
                  </Badge>
                  <Send className="size-4" />
                </>
              )}
            </Button>
          </CardFooter>
        )
      }
      className="w-[95vw] sm:max-w-160 max-h-[92vh] rounded-lg! border-0! ring-0! outline-none! shadow-2xl overflow-hidden p-0 bg-white"
    >
      <CardContent className="space-y-5 text-slate-800 py-1 p-0">
        <Card className="rounded-lg border border-slate-200/90 bg-slate-50/60 p-4 sm:p-5 shadow-none ring-0">
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-4 text-left p-0">
            <CardContent className="space-y-1 p-0">
              <CardDescription className="text-xs text-slate-500 font-medium block">
                Lokasi Kerja
              </CardDescription>
              <CardTitle className="text-sm font-bold text-slate-900 leading-snug truncate font-sans">
                {activeVacancy.workLocation || "-"}
              </CardTitle>
            </CardContent>

            <CardContent className="space-y-1 p-0">
              <CardDescription className="text-xs text-slate-500 font-medium block">
                Kuota
              </CardDescription>
              <CardTitle className="text-sm font-bold text-primary leading-snug font-sans">
                {typeof activeVacancy.quota === "number"
                  ? `${activeVacancy.quota} Orang`
                  : "-"}
              </CardTitle>
            </CardContent>

            <CardContent className="space-y-1 p-0">
              <CardDescription className="text-xs text-slate-500 font-medium block">
                Batas Pendaftaran
              </CardDescription>
              <CardTitle className="text-sm font-bold text-red-600 leading-snug font-sans">
                {formattedDeadline}
              </CardTitle>
            </CardContent>

            <CardContent className="space-y-1 p-0">
              <CardDescription className="text-xs text-slate-500 font-medium block">
                Target Jurusan
              </CardDescription>
              <CardTitle className="text-sm font-bold text-slate-900 leading-snug truncate font-sans">
                {majorsLabel}
              </CardTitle>
            </CardContent>

            <CardContent className="space-y-1 p-0">
              <CardDescription className="text-xs text-slate-500 font-medium block">
                Kategori Target
              </CardDescription>
              <CardTitle className="text-sm font-bold text-slate-900 leading-snug truncate font-sans">
                {activeVacancy.targetApplicant?.name || "Semua Target"}
              </CardTitle>
            </CardContent>

            <CardContent className="space-y-1 p-0">
              <CardDescription className="text-xs text-slate-500 font-medium block">
                Notifikasi Email
              </CardDescription>
              <CardTitle className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 leading-snug font-sans">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <Badge
                  variant="outline"
                  className="border-none bg-transparent p-0 text-emerald-600 font-bold text-sm shadow-none"
                >
                  Aktif
                </Badge>
              </CardTitle>
            </CardContent>
          </CardContent>
        </Card>

        <CardContent className="space-y-1.5 p-0">
          <CardContent className="flex items-center gap-2 p-0">
            <FileText className="size-4 text-primary shrink-0" />
            <CardTitle className="text-[13px] sm:text-sm font-bold text-slate-900 font-sans">
              Deskripsi Pekerjaan
            </CardTitle>
          </CardContent>
          {activeVacancy?.description ? (
            <RichTextEditor.Content
              content={activeVacancy.description}
              className="text-xs text-slate-500 font-sans"
            />
          ) : (
            <CardDescription className="text-xs text-slate-500 leading-relaxed font-sans">
              {cleanDescription || "Deskripsi pekerjaan belum tersedia."}
            </CardDescription>
          )}
        </CardContent>

        <CardContent className="space-y-1.5 p-0">
          <CardContent className="flex items-center gap-2 p-0">
            <CheckSquare className="size-4 text-primary shrink-0" />
            <CardTitle className="text-[13px] sm:text-sm font-bold text-slate-900 font-sans">
              Syarat & Kualifikasi Berkas
            </CardTitle>
          </CardContent>
          {activeVacancy?.qualification &&
          activeVacancy.qualification.includes("<") &&
          activeVacancy.qualification.includes(">") ? (
            <RichTextEditor.Content
              content={activeVacancy.qualification}
              className="text-xs text-slate-500 font-sans"
            />
          ) : qualificationLines.length === 0 ? (
            <CardDescription className="text-xs text-slate-500 italic font-sans">
              Belum ada syarat & kualifikasi yang dicantumkan.
            </CardDescription>
          ) : (
            <CardContent className="space-y-1 text-xs text-slate-500 leading-relaxed p-0">
              {qualificationLines.map((line, idx) => (
                <CardDescription
                  key={idx}
                  className="text-xs text-slate-500 leading-relaxed font-sans"
                >
                  {line}
                </CardDescription>
              ))}
            </CardContent>
          )}
        </CardContent>
      </CardContent>
    </Modal>
  );
}
