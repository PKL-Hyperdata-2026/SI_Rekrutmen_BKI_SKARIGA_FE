import { X, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PortfolioItem } from "./portfolio.schema";

interface DocumentPreviewModalProps {
  portfolio: PortfolioItem | null;
  onClose: () => void;
}

export function DocumentPreviewModal({
  portfolio,
  onClose,
}: DocumentPreviewModalProps) {
  if (!portfolio) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="min-w-0 pr-4">
            <h3 className="text-base font-bold text-white truncate">
              {portfolio.title || portfolio.category?.name || "Preview Dokumen"}
            </h3>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {portfolio.fileName} {portfolio.fileSize ? `• ${portfolio.fileSize}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {portfolio.fileUrl && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium cursor-pointer"
                >
                  <a
                    href={portfolio.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Tab Baru</span>
                  </a>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="h-8 px-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium cursor-pointer"
                >
                  <a
                    href={portfolio.fileUrl}
                    download
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Unduh</span>
                  </a>
                </Button>
              </>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 bg-slate-100 p-2 overflow-hidden flex items-center justify-center">
          {portfolio.fileUrl ? (
            <iframe
              src={`${portfolio.fileUrl}#toolbar=0`}
              title={portfolio.title}
              className="w-full h-full rounded-2xl border border-slate-200 bg-white"
            />
          ) : (
            <div className="text-center text-slate-500 text-sm">
              URL file tidak tersedia.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
