import React from "react";
import {
  FileText,
  UploadCloud,
  Eye,
  Download,
  Trash2,
  Award,
  BookOpen,
  ShieldCheck,
  Plus,
  Loader2,
} from "lucide-react";
import type { PortfolioItem, PortfolioCategory } from "../schemas/portfolio.schema";

interface DocumentListCardProps {
  portfolios: PortfolioItem[];
  categories: PortfolioCategory[];
  onOpenUpload: (categoryId?: number) => void;
  onPreview: (portfolio: PortfolioItem) => void;
  onDelete: (portfolio: PortfolioItem) => void;
  isLoading: boolean;
  isDeletingId?: number | null;
}

const CATEGORY_CONFIG: Record<
  string,
  {
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }
> = {
  cv: {
    icon: <FileText className="h-5 w-5" />,
    bgColor: "bg-red-50",
    textColor: "text-red-500",
    borderColor: "border-red-100",
  },
  sertifikat_pkl: {
    icon: <ShieldCheck className="h-5 w-5" />,
    bgColor: "bg-amber-50",
    textColor: "text-amber-500",
    borderColor: "border-amber-100",
  },
  sertifikat_prestasi: {
    icon: <Award className="h-5 w-5" />,
    bgColor: "bg-blue-50",
    textColor: "text-blue-500",
    borderColor: "border-blue-100",
  },
  sertifikat_bahasa: {
    icon: <BookOpen className="h-5 w-5" />,
    bgColor: "bg-purple-50",
    textColor: "text-purple-500",
    borderColor: "border-purple-100",
  },
};

export function DocumentListCard({
  portfolios,
  categories,
  onOpenUpload,
  onPreview,
  onDelete,
  isLoading,
  isDeletingId,
}: DocumentListCardProps) {
  const displayCategories: PortfolioCategory[] =
    categories.length > 0
      ? categories
      : [
          { id: 1, code: "cv", name: "Curriculum Vitae (CV)" },
          { id: 2, code: "sertifikat_pkl", name: "Sertifikat PKL/Magang" },
          { id: 3, code: "sertifikat_prestasi", name: "Sertifikat Prestasi" },
          {
            id: 4,
            code: "sertifikat_bahasa",
            name: "Sertifikat Bahasa (TOEIC/JLPT)",
          },
        ];

  const getPortfolioForCategory = (cat: PortfolioCategory) => {
    return portfolios.find(
      (p) =>
        p.categoryId === cat.id ||
        p.category?.code?.toLowerCase() === cat.code?.toLowerCase()
    );
  };

  const handleDownload = (item: PortfolioItem) => {
    if (item.fileUrl) {
      window.open(item.fileUrl, "_blank");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-100/90 flex flex-col h-full">
      {/* Card Header matching media_1788184725129.png */}
      <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-2.5">
          <FileText className="h-5 w-5 text-blue-500 stroke-[2.2]" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Kelola Berkas
          </h2>
        </div>

        <button
          type="button"
          onClick={() => onOpenUpload()}
          className="h-10 px-5 rounded-full bg-gradient-to-r from-[#0a2342] to-[#1e6091] hover:opacity-95 text-white text-xs sm:text-sm font-medium transition-all flex items-center gap-2 shadow-sm cursor-pointer active:scale-95 shrink-0 select-none"
        >
          <UploadCloud className="h-4 w-4" />
          <span>Upload Dokumen</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-xs font-medium">Memuat berkas dokumen...</p>
        </div>
      ) : (
        <div className="space-y-3.5 flex-1">
          {displayCategories.map((cat) => {
            const uploadedItem = getPortfolioForCategory(cat);
            const style =
              CATEGORY_CONFIG[cat.code.toLowerCase()] || {
                icon: <FileText className="h-5 w-5" />,
                bgColor: "bg-slate-50",
                textColor: "text-slate-500",
                borderColor: "border-slate-100",
              };

            return (
              <div
                key={cat.id || cat.code}
                className="p-3.5 sm:p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-xs transition-all flex items-center justify-between gap-3"
              >
                {/* Left: Icon & Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`h-11 w-11 rounded-2xl ${style.bgColor} ${style.textColor} border ${style.borderColor} flex items-center justify-center shrink-0 shadow-2xs`}
                  >
                    {style.icon}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                      {uploadedItem ? (
                        <>
                          <span className="text-slate-700 font-semibold">
                            {uploadedItem.fileName || uploadedItem.title}
                          </span>
                          {uploadedItem.fileSize && (
                            <span className="text-slate-400 ml-1.5 font-normal">
                              • {uploadedItem.fileSize}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-slate-400 italic font-normal">
                          Belum diunggah • PDF (Maks. 10MB)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="shrink-0 flex items-center gap-1">
                  {uploadedItem ? (
                    <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50/50 gap-0.5">
                      <button
                        type="button"
                        onClick={() => onPreview(uploadedItem)}
                        title="Lihat Dokumen"
                        className="h-7 w-7 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-white flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownload(uploadedItem)}
                        title="Unduh Dokumen"
                        className="h-7 w-7 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-white flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(uploadedItem)}
                        disabled={isDeletingId === uploadedItem.id}
                        title="Hapus Dokumen"
                        className="h-7 w-7 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isDeletingId === uploadedItem.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenUpload(cat.id)}
                      className="h-8 px-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 text-[11px] font-semibold text-slate-600 hover:text-blue-600 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Unggah</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
