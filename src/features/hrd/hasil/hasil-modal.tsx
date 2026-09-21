import { useRef } from "react";
import { type UseFormReturn } from "react-hook-form";
import {
  Pencil,
  UploadCloud,
  CheckCircle,
  FileText,
  X,
} from "lucide-react";
import { Modal } from "@/components/custom/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SelectionResultItem, EvaluationModalFormValues } from "./hasil.schema";

export interface HasilModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: SelectionResultItem | null;
  form: UseFormReturn<EvaluationModalFormValues>;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  onSubmit: () => void | Promise<void>;
  submitting: boolean;
}

export function HasilModal({
  isOpen,
  onOpenChange,
  selectedItem,
  form,
  selectedFile,
  onFileSelect,
  onSubmit,
  submitting,
}: HasilModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!selectedItem) return null;

  const decisionValue = form.watch("decision");

  return (
    <Modal
      open={isOpen}
      onOpenChange={onOpenChange}
      variant="hrd"
      size="md"
      headerIcon={<Pencil className="h-5 w-5" />}
      title={`Rekap Evaluasi: ${selectedItem.applicant.name}`}
      description="Lembar Penilaian Individual Pelamar."
      confirmText="Simpan Data"
      cancelText="Tutup"
      isLoading={submitting}
      onConfirm={onSubmit}
    >
      <div className="space-y-4 pt-1">
        <div className="grid grid-cols-2 gap-3 p-3.5 bg-purple-50/50 border border-purple-100 rounded-xl">
          <div>
            <span className="text-[11px] font-medium text-slate-500 block uppercase tracking-wider">
              Kandidat
            </span>
            <span className="font-bold text-slate-900 text-sm block">
              {selectedItem.applicant.name}
            </span>
            <span className="text-xs font-semibold text-primary block mt-0.5">
              {selectedItem.applicant.majorName || "Teknik"} - Lulus T.A{" "}
              {selectedItem.applicant.graduationYear || "2025"}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block uppercase tracking-wider">
              Posisi Lowongan
            </span>
            <span className="font-bold text-slate-900 text-sm block">
              {selectedItem.vacancy.position || selectedItem.vacancy.title}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs sm:text-sm font-bold text-slate-800">
            Skor Seleksi
          </Label>

          <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg">
            <span className="text-xs font-medium text-slate-600">
              Seleksi Admin
            </span>
            <span className="bg-emerald-600 text-white font-bold text-[11px] px-3 py-0.5 rounded-full inline-flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" />
              LOLOS
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg">
            <span className="text-xs font-medium text-slate-600">
              Tes Psikotes
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="0"
              {...form.register("psychotest_score")}
              className="w-20 text-right font-bold text-primary text-sm border-none bg-transparent outline-none focus:ring-0"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg">
            <span className="text-xs font-medium text-slate-600">
              Tes Interview HRD
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="0"
              {...form.register("interview_score")}
              className="w-20 text-right font-bold text-primary text-sm border-none bg-transparent outline-none focus:ring-0"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg">
            <span className="text-xs font-medium text-slate-600">
              Tes MCU (Medical Check Up)
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="0"
              {...form.register("mcu_score")}
              className="w-20 text-right font-bold text-primary text-sm border-none bg-transparent outline-none focus:ring-0"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs sm:text-sm font-bold text-slate-800">
            Catatan (Opsional)
          </Label>
          <Textarea
            rows={3}
            placeholder="Catatan evaluasi atau kelebihan pelamar..."
            {...form.register("notes")}
            className="bg-white text-xs border-slate-200 focus-visible:border-primary rounded-lg resize-none text-slate-700 leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs sm:text-sm font-bold text-slate-800">
            Keputusan Kelulusan
          </Label>
          <Select
            value={decisionValue}
            onValueChange={(val: "diterima" | "tidak_diterima" | "cadangan" | "pending") =>
              form.setValue("decision", val)
            }
          >
            <SelectTrigger className="w-full bg-white text-xs h-10 border-slate-200 rounded-lg">
              <SelectValue placeholder="Pilih keputusan kelulusan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diterima" className="text-emerald-700 font-semibold">
                Diterima (Lolos Bekerja)
              </SelectItem>
              <SelectItem value="tidak_diterima" className="text-rose-700 font-semibold">
                Tidak Diterima (Gugur)
              </SelectItem>
              <SelectItem value="cadangan" className="text-purple-700 font-semibold">
                Cadangan (Waiting List)
              </SelectItem>
              <SelectItem value="pending" className="text-slate-600 font-medium">
                Pending (Menunggu Nilai Lengkap)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {decisionValue === "diterima" && (
          <div className="space-y-1.5 pt-1">
            <Label className="text-xs sm:text-sm font-bold text-slate-800">
              Kirim Surat Penempatan <span className="text-rose-500">*</span>
            </Label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                onFileSelect(file);
              }}
            />

            {selectedFile ? (
              <div className="flex items-center justify-between p-3 border border-purple-200 rounded-xl bg-purple-50/30">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {selectedFile.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onFileSelect(null)}
                  className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : selectedItem.letterUrl ? (
              <div className="flex items-center justify-between p-3 border border-purple-200 rounded-xl bg-purple-50/30">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-5 w-5 text-primary shrink-0" />
                  <a
                    href={selectedItem.letterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-primary hover:underline truncate"
                  >
                    Lihat Surat Penempatan Tersimpan
                  </a>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-7 text-[11px] px-2"
                >
                  Ganti
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-200 hover:border-primary rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center bg-purple-50/20 hover:bg-purple-50/40 transition-colors cursor-pointer"
              >
                <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center text-primary mb-1.5">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800">
                  Klik untuk Unggah File
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Maksimal 10MB (PDF/JPG/PNG)
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
