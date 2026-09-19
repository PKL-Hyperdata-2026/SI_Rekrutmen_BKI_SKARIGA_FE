import React, { useState, useRef } from "react";
import {
  UploadCloud,
  X,
  FileCheck,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { PortfolioCategory } from "./e-portfolio.schema";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: PortfolioCategory[];
  initialCategoryId?: number | null;
  onUpload: (categoryId: number, file: File) => Promise<void>;
  isUploading: boolean;
}

export function UploadDocumentModal({
  isOpen,
  onClose,
  categories,
  initialCategoryId,
  onUpload,
  isUploading,
}: UploadDocumentModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(() => initialCategoryId || 0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentCategoryId = selectedCategoryId || initialCategoryId || (categories[0]?.id ?? 0);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMsg("");
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Ukuran file melebihi batas maksimal 10MB.");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".pdf")) {
      setErrorMsg("Format file tidak didukung. Harap unggah format PDF, JPG, PNG, atau DOCX.");
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setErrorMsg("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const categoryIdToUse = currentCategoryId;
    if (!categoryIdToUse || categoryIdToUse === 0) {
      setErrorMsg("Harap pilih kategori dokumen.");
      return;
    }

    if (!selectedFile) {
      setErrorMsg("Harap pilih file dokumen yang ingin diunggah.");
      return;
    }

    try {
      await onUpload(categoryIdToUse, selectedFile);
      handleClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Gagal mengunggah berkas. Silakan coba lagi.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-primary px-6 py-5 text-primary-foreground flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-[2px] flex items-center justify-center text-primary-foreground shadow-inner">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-primary-foreground tracking-tight">
                Unggah Dokumen
              </h3>
              <p className="text-xs text-primary-foreground/80 font-medium mt-0.5">
                Tambahkan berkas pendukung lamaran
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isUploading}
            className="h-9 w-9 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-primary-foreground cursor-pointer"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <Label className="block text-xs font-bold text-slate-700 tracking-wider mb-1.5">
              Kategori Dokumen <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={currentCategoryId ? String(currentCategoryId) : undefined}
              onValueChange={(val) => setSelectedCategoryId(Number(val))}
              disabled={isUploading}
            >
              <SelectTrigger className="w-full h-11 px-3.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-primary rounded-xl text-xs sm:text-sm font-medium text-slate-800 transition-all shadow-none">
                <SelectValue placeholder="Pilih Jenis Berkas" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)} className="text-xs sm:text-sm cursor-pointer py-2">
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-xs font-bold text-slate-700 tracking-wider mb-1.5">
              Unggah File <span className="text-rose-500">*</span>
            </Label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : selectedFile
                  ? "border-emerald-300 bg-emerald-50/30"
                  : "border-slate-200 hover:border-primary/50 bg-slate-50/40 hover:bg-primary/5"
              }`}
            >
              {selectedFile ? (
                <>
                  <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <div className="text-center max-w-full px-2">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Klik untuk mengganti
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                      Klik untuk Unggah File
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Maksimal 10MB • Format PDF
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
              className="h-11 px-6 rounded-xl border-slate-200 hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-600 cursor-pointer"
            >
              Batal
            </Button>

            <Button
              type="submit"
              disabled={isUploading}
              className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mengunggah...
                </>
              ) : (
                <>
                  <span>Unggah Berkas</span>
                  <Send className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
