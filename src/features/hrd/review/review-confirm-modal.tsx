import { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { CheckCircle2, XCircle } from "lucide-react";
import { Modal } from "@/components/custom/modal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { resetReviewDecisionForm, useReviewDecisionForm } from "./review.form";
import type { ReviewDecisionValues } from "./review.schema";
import { getReviewRowDetails } from "./review.status";
import type { ReviewConfirmState } from "./use-review-page";

export interface ReviewConfirmModalProps {
  confirm: ReviewConfirmState | null;
  isProcessing?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (values: ReviewDecisionValues) => void;
}

export function ReviewConfirmModal({
  confirm,
  isProcessing = false,
  onOpenChange,
  onConfirm,
}: ReviewConfirmModalProps) {
  const open = confirm !== null;
  const isReject = confirm?.decision === "tidak_lolos";
  const form = useReviewDecisionForm(confirm?.decision ?? "lolos");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (open) resetReviewDecisionForm(form, confirm?.decision ?? "lolos");
  }, [open, confirm?.decision]);

  const bulkCount = confirm?.mode === "bulk" ? confirm.bulkIds.length : 0;
  const previewNames = confirm?.mode === "bulk" ? (confirm.bulkPreview ?? []).slice(0, 5) : [];
  const remaining = bulkCount - previewNames.length;
  const singleDetails = confirm?.mode === "single" && confirm.applicant ? getReviewRowDetails(confirm.applicant) : null;
  const notesError = errors.notes?.message;
  const confirmText =
    confirm?.mode === "bulk"
      ? isReject
        ? `Tolak ${bulkCount} pelamar`
        : `Loloskan ${bulkCount} pelamar`
      : isReject
        ? "Tolak pelamar"
        : "Loloskan pelamar";

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      variant="hrd"
      size="sm"
      title={isReject ? "Tolak Pelamar?" : "Loloskan Pelamar?"}
      description={
        confirm?.mode === "bulk"
          ? `Keputusan ini berlaku untuk ${bulkCount} pelamar terpilih di halaman ini. Hanya status perlu review yang diproses.`
          : "Pastikan berkas pelamar sudah diperiksa lengkap."
      }
      headerIcon={
        isReject ? <XCircle className="h-6 w-6 text-white" /> : <CheckCircle2 className="h-6 w-6 text-white" />
      }
      confirmText={confirmText}
      cancelText="Batal"
      onConfirm={() => {
        void handleSubmit(onConfirm)();
      }}
      isLoading={isProcessing}
    >
      <FormProvider {...form}>
        <div className="flex flex-col gap-3.5">
          {singleDetails && confirm?.applicant ? (
            <div className="rounded-xl border border-slate-300 bg-slate-50/70 px-4 py-3">
              <p className="text-xs font-semibold text-slate-600">Pelamar</p>
              <p className="mt-0.5 text-sm font-bold text-slate-900">{singleDetails.applicantName}</p>
              <p className="mt-0.5 text-xs text-slate-600">
                {singleDetails.position} | Dilamar {singleDetails.appliedDateLabel}
              </p>
              <div className="mt-2 flex flex-col gap-1 border-t border-slate-200 pt-2">
                {confirm.applicant.documents.length === 0 ? (
                  <p className="text-xs font-medium text-slate-500">Belum ada berkas terunggah.</p>
                ) : (
                  confirm.applicant.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.fileUrl ?? undefined}
                      target="_blank"
                      rel="noreferrer"
                      title={doc.originalFilename !== "" ? doc.originalFilename : doc.title}
                      className="truncate text-xs font-bold text-blue-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-700"
                    >
                      {doc.originalFilename !== "" ? doc.originalFilename : doc.title}
                    </a>
                  ))
                )}
              </div>
            </div>
          ) : null}
          {confirm?.mode === "bulk" ? (
            <div className="rounded-xl border border-slate-300 bg-slate-50/70 px-4 py-3">
              <p className="text-xs font-semibold text-slate-600">Pelamar terpilih ({bulkCount})</p>
              <ul className="mt-1.5 flex list-disc flex-col gap-0.5 pl-4">
                {previewNames.map((item) => (
                  <li key={item.id} className="truncate text-xs font-medium text-slate-800">
                    {item.name} | {item.position}
                  </li>
                ))}
              </ul>
              {remaining > 0 ? <p className="mt-1 text-xs text-slate-500">+{remaining} pelamar lainnya</p> : null}
            </div>
          ) : null}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="review-confirm-notes" className="text-xs font-semibold text-slate-700">
              Catatan HRD {isReject ? "(wajib diisi)" : "(opsional)"}
            </Label>
            <Textarea
              id="review-confirm-notes"
              rows={4}
              disabled={isProcessing}
              placeholder={isReject ? "Tulis alasan penolakan berkas..." : "Tulis catatan kelulusan berkas (opsional)..."}
              aria-invalid={Boolean(notesError)}
              aria-describedby={notesError ? "review-confirm-notes-error" : undefined}
              {...register("notes")}
            />
            {notesError ? (
              <p id="review-confirm-notes-error" role="alert" className="text-xs font-medium text-rose-700">
                {notesError}
              </p>
            ) : null}
          </div>
        </div>
      </FormProvider>
    </Modal>
  );
}
