import { useState, useEffect, useMemo } from "react";
import {
  FolderOpen,
  FileText,
  Eye,
  Download,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  Layers,
  CheckCircle2,
  FileQuestion,
  Globe,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Modal } from "@/components/custom/modal";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { siswaApi } from "./siswa.api";
import type { SiswaItem, SiswaPortfolioItem } from "./siswa.schema";

interface SiswaPortfolioModalProps {
  student: SiswaItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; border: string; label: string }
> = {
  cv: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    label: "Curriculum Vitae",
  },
  sertifikat_pkl: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    label: "Sertifikat PKL / Magang",
  },
  sertifikat_prestasi: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    label: "Sertifikat Prestasi",
  },
  sertifikat_bahasa: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    label: "Sertifikat Bahasa",
  },
};

function parseSocialMedia(raw: unknown): Array<{ platform: string; username: string; url?: string }> {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .filter((item) => typeof item === "object" && item !== null)
      .map((item) => {
        const platform = String(item.platform || "");
        const username = String(item.username || "");
        const url = item.url ? String(item.url) : undefined;
        return { platform, username, url };
      })
      .filter((i) => i.platform && i.username);
  }
  if (typeof raw === "object") {
    return Object.entries(raw as Record<string, string>)
      .filter(([, val]) => typeof val === "string" && val.trim() !== "")
      .map(([key, val]) => ({
        platform: key,
        username: val,
      }));
  }
  return [];
}

export function SiswaPortfolioModal({
  student,
  open,
  onOpenChange,
}: SiswaPortfolioModalProps) {
  const [detailStudent, setDetailStudent] = useState<SiswaItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<SiswaPortfolioItem | null>(null);

  useEffect(() => {
    if (!open || !student?.id) {
      setDetailStudent(null);
      setPreviewDocument(null);
      return;
    }

    let ignore = false;
    setLoading(true);

    siswaApi
      .getStudent(student.id)
      .then((res) => {
        if (!ignore && res.data?.data) {
          setDetailStudent(res.data.data);
        }
      })
      .catch(() => {
        if (!ignore) {
          setDetailStudent(student);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [open, student]);

  const activeData = detailStudent || student;
  const portfolios = activeData?.portfolios || [];
  const socialList = useMemo(
    () => parseSocialMedia(activeData?.socialMedia),
    [activeData?.socialMedia]
  );

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        variant="admin"
        size="lg"
        headerIcon={<FolderOpen className="h-5 w-5" />}
        title="E-Portofolio & Dokumen Siswa"
        description="Tinjau berkas portofolio, sertifikat, dan kelengkapan profil karir siswa."
        footer={null}
      >
        <div className="space-y-5">
          {/* Header Profil Siswa */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/80 shadow-2xs">
            {loading ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-64" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <Avatar className="h-14 w-14 rounded-2xl border-2 border-white shadow-xs ring-1 ring-slate-200 shrink-0">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${activeData?.fullName || "Siswa"}`}
                      alt={activeData?.fullName || "Siswa"}
                      className="rounded-2xl"
                    />
                    <AvatarFallback className="rounded-2xl font-bold text-base bg-blue-100 text-blue-700">
                      {activeData?.fullName ? activeData.fullName.charAt(0) : "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
                        {activeData?.fullName}
                      </h3>
                      <Badge
                        variant="outline"
                        className="text-xs bg-white/80 border-slate-200 font-semibold text-slate-700"
                      >
                        NIS: {activeData?.nis || "-"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 font-medium flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <GraduationCap className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        {activeData?.major?.name || "Semua Jurusan"}
                      </span>
                      <span>•</span>
                      <span>{activeData?.class?.name || "Kelas -"}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
                      {activeData?.email && (
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-44">{activeData.email}</span>
                        </span>
                      )}
                      {activeData?.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                          <span>{activeData.phone}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {socialList.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap sm:self-start bg-white/80 p-2 rounded-xl border border-slate-200/60 shadow-2xs">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                      Sosmed:
                    </span>
                    {socialList.map((soc, idx) => (
                      <a
                        key={idx}
                        href={
                          soc.url ||
                          (soc.username.startsWith("http")
                            ? soc.username
                            : `https://${soc.platform}.com/${soc.username.replace(/^@/, "")}`)
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-semibold transition-colors cursor-pointer border border-slate-200/60"
                        title={`${soc.platform}: ${soc.username}`}
                      >
                        <Globe className="h-3 w-3" />
                        <span className="capitalize">{soc.platform}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Daftar Dokumen E-Portfolio */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Dokumen Lampiran E-Portofolio
                </h4>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {portfolios.length} Dokumen Terlampir
              </span>
            </div>

            {loading ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-3.5 w-40" />
                        <Skeleton className="h-2.5 w-24" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16 rounded-lg" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : portfolios.length === 0 ? (
              <div className="py-10 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <FileQuestion className="h-6 w-6" />
                </div>
                <h5 className="text-sm font-bold text-slate-800">
                  Belum Ada Dokumen E-Portfolio
                </h5>
                <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                  Siswa ini belum mengunggah dokumen curriculum vitae (CV), sertifikat PKL, atau berkas pendukung lainnya ke portal karir.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {portfolios.map((item) => {
                  const catCode = item.category?.code?.toLowerCase() || "";
                  const catConfig = CATEGORY_COLORS[catCode] || {
                    bg: "bg-slate-50",
                    text: "text-slate-700",
                    border: "border-slate-200",
                    label: item.category?.name || "Dokumen",
                  };

                  const formattedDate = item.createdAt
                    ? (() => {
                        try {
                          return format(new Date(item.createdAt), "d MMMM yyyy", {
                            locale: idLocale,
                          });
                        } catch {
                          return item.createdAt;
                        }
                      })()
                    : null;

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-blue-200 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                          <FileText className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-2 py-0.5 rounded-md text-xs font-bold border ${catConfig.bg} ${catConfig.text} ${catConfig.border}`}
                            >
                              {item.category?.name || catConfig.label}
                            </span>
                            <h5 className="text-xs font-bold text-slate-900 truncate">
                              {item.title || item.category?.name || "Dokumen Lampiran"}
                            </h5>
                          </div>

                          {item.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400 font-medium">
                            {formattedDate && (
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Diunggah {formattedDate}</span>
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Format PDF</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        {item.fileUrl ? (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setPreviewDocument(item)}
                              className="h-8 px-3 rounded-lg border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-700 text-xs font-semibold gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Lihat</span>
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              asChild
                              className="h-8 w-8 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-slate-50 cursor-pointer shadow-2xs"
                              title="Unduh Dokumen"
                            >
                              <a
                                href={item.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </a>
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Berkas tidak tersedia
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Dokumen Preview Modal dengan Radix Dialog (Portalled on top) */}
      <Dialog
        open={!!previewDocument}
        onOpenChange={(open) => {
          if (!open) setPreviewDocument(null);
        }}
      >
        <DialogContent className="max-w-4xl h-5/6 p-0 overflow-hidden rounded-3xl border border-slate-100 flex flex-col z-50 [&>button]:hidden shadow-2xl">
          <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
            <div className="min-w-0 pr-4">
              <DialogTitle className="text-sm font-bold text-white truncate">
                {previewDocument?.title || previewDocument?.category?.name || "Preview Dokumen"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 truncate mt-0.5">
                {previewDocument?.category?.name || "E-Portofolio"} • {activeData?.fullName}
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {previewDocument?.fileUrl && (
                <Button
                  size="sm"
                  asChild
                  className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer"
                >
                  <a
                    href={previewDocument.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Unduh</span>
                  </a>
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setPreviewDocument(null)}
                className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 bg-slate-100 p-2 overflow-hidden flex items-center justify-center">
            {previewDocument?.fileUrl ? (
              <iframe
                src={`${previewDocument.fileUrl}#toolbar=0`}
                title={previewDocument.title || "Dokumen"}
                className="w-full h-full rounded-2xl border border-slate-200 bg-white"
              />
            ) : (
              <div className="text-center text-slate-500 text-sm">
                URL file tidak tersedia.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
