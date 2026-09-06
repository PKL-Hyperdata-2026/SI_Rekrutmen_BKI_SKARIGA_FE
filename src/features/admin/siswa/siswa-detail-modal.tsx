import { useState, useRef, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";
import {
  FileText,
  Upload,
  Eye,
  Trash2,
  X,
  GraduationCap,
} from "lucide-react";
import { Controller } from "react-hook-form";
import { usePortfolioUploadForm } from "./siswa.form";
import type {
  SiswaItem,
  SiswaOptionsData,
  PortfolioUploadSchemaType,
} from "./siswa.schema";

export interface SiswaDetailModalProps {
  isOpen: boolean;
  student: SiswaItem | null;
  options: SiswaOptionsData | null;
  onClose: () => void;
  onUploadPortfolio: (studentId: number | string, formData: FormData) => Promise<void>;
  onDeletePortfolio: (studentId: number | string, portfolioId: number | string) => Promise<void>;
}

export function SiswaDetailModal({
  isOpen,
  student,
  options,
  onClose,
  onUploadPortfolio,
  onDeletePortfolio,
}: SiswaDetailModalProps) {
  const portfolioTypes = options?.portfolio_types || [];
  const defaultCategoryId = portfolioTypes[0] ? String(portfolioTypes[0].id) : "";

  const [showUploadForm, setShowUploadForm] = useState<boolean>(false);
  const uploadForm = usePortfolioUploadForm(defaultCategoryId);

  const [portfolioToDelete, setPortfolioToDelete] = useState<{
    id: number | string;
    title: string;
  } | null>(null);
  const [isDeletingPortfolio, setIsDeletingPortfolio] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!uploadForm.getValues("category_id") && portfolioTypes.length > 0) {
      uploadForm.setValue("category_id", String(portfolioTypes[0].id));
    }
  }, [portfolioTypes, uploadForm]);

  if (!student) return null;

  const handleUpload = uploadForm.handleSubmit(async (data: PortfolioUploadSchemaType) => {
    const formData = new FormData();
    formData.append("category_id", data.category_id);
    formData.append("title", data.title.trim());
    if (data.description && data.description.trim()) {
      formData.append("description", data.description.trim());
    }
    formData.append("file", data.file);

    try {
      await onUploadPortfolio(student.id, formData);
      uploadForm.reset({
        category_id: defaultCategoryId,
        title: "",
        description: "",
        file: undefined,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setShowUploadForm(false);
      toast.success("Berkas portofolio berhasil diunggah.");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal mengunggah berkas portofolio.";
      toast.error(msg);
    }
  });

  const handleConfirmDeletePortfolio = async () => {
    if (!portfolioToDelete) return;
    setIsDeletingPortfolio(true);
    try {
      await onDeletePortfolio(student.id, portfolioToDelete.id);
      setPortfolioToDelete(null);
    } finally {
      setIsDeletingPortfolio(false);
    }
  };

  const portfolios = student.portfolios || [];
  const studentName = student.fullName || student.user?.fullName || "Tanpa Nama";
  const statusLabel =
    student.employmentStatus?.name ||
    (student.currentCompany ? `Diterima ${student.currentCompany.name}` : "Belum Bekerja");

  const socialMediaUrl =
    typeof student.socialMedia === "string"
      ? student.socialMedia
      : (student.socialMedia?.profile_url as string) || "-";

  return (
    <>
      <Modal
        open={isOpen}
        onOpenChange={(open) => !open && onClose()}
        variant="admin"
        size="lg"
        headerIcon={<GraduationCap className="h-5 w-5" />}
        title="E-Portofolio & Berkas Siswa"
        description="Lihat detail profil dan kelola dokumen portofolio pendukung siswa."
        headerAction={
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setShowUploadForm((v) => !v);
            }}
            className="h-8 px-3 rounded-xl text-xs font-semibold bg-white/20 hover:bg-white/30 text-white cursor-pointer shadow-xs gap-1.5 backdrop-blur-xs border border-white/20"
          >
            {showUploadForm ? (
              <>
                <X className="h-3.5 w-3.5" />
                <span>Tutup Form</span>
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Dokumen</span>
              </>
            )}
          </Button>
        }
        cancelText="Tutup"
        hideConfirmButton={true}
      >
        <div className="space-y-5 py-2">
          {/* Top Bar: Student Summary Badge */}
          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100">
            <h3 className="font-bold text-sm text-purple-950">{studentName}</h3>
            <p className="text-xs text-purple-700 mt-0.5">
              NIS: {student.nis} • {student.class?.name || "Kelas -"} • {student.major?.name || "Jurusan -"}
            </p>
          </div>

          {/* Form Unggah Portofolio (Bisa di-toggle) */}
          {showUploadForm && (
            <form
              onSubmit={handleUpload}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-purple-200 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                  <Upload className="h-4 w-4 text-purple-600" />
                  Unggah Berkas Baru
                </h4>
                <span className="text-[11px] text-slate-400">Maks. 10 MB (PDF, Foto, Dokumen)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Controller
                  control={uploadForm.control}
                  name="category_id"
                  render={({ field }) => (
                    <div className="space-y-1">
                      <Label className="text-xs font-bold text-slate-700">Kategori Berkas *</Label>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-9.5 rounded-xl text-xs bg-slate-50 border-slate-200">
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {portfolioTypes.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)} className="text-xs">
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {uploadForm.formState.errors.category_id && (
                        <p className="text-[11px] text-rose-500 font-medium">
                          {uploadForm.formState.errors.category_id.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">Judul Dokumen *</Label>
                  <Input
                    {...uploadForm.register("title")}
                    placeholder="cth. Sertifikat Kompetensi LSP"
                    className="h-9.5 rounded-xl text-xs"
                  />
                  {uploadForm.formState.errors.title && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {uploadForm.formState.errors.title.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Pilih Berkas *</Label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    uploadForm.setValue("file", selected as unknown as File, { shouldValidate: true });
                    if (selected && !uploadForm.getValues("title").trim()) {
                      const nameWithoutExt = selected.name.replace(/\.[^/.]+$/, "");
                      uploadForm.setValue("title", nameWithoutExt, { shouldValidate: true });
                    }
                  }}
                  className="h-9.5 rounded-xl text-xs file:text-xs file:font-semibold cursor-pointer"
                />
                {uploadForm.formState.errors.file && (
                  <p className="text-[11px] text-rose-500 font-medium">{uploadForm.formState.errors.file.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    uploadForm.reset({
                      category_id: defaultCategoryId,
                      title: "",
                      description: "",
                      file: undefined,
                    });
                    if (fileInputRef.current) fileInputRef.current.value = "";
                    setShowUploadForm(false);
                  }}
                  disabled={uploadForm.formState.isSubmitting}
                  className="h-9 px-4 rounded-xl text-xs border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={uploadForm.formState.isSubmitting}
                  className="h-9 px-4 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-xs"
                >
                  {uploadForm.formState.isSubmitting ? "Mengunggah..." : "Simpan Berkas"}
                </Button>
              </div>
            </form>
          )}

          {/* Konten Utama 2 Kolom: Kiri Profil, Kanan Dokumen */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Kolom Kiri: Profil Siswa (Span 7) */}
            <div className="lg:col-span-7 space-y-3.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Informasi Siswa
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500">NIS</span>
                  <Input
                    value={student.nis || "-"}
                    readOnly
                    className="rounded-xl border-slate-200 text-xs h-9 px-3 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500">Nama Lengkap</span>
                  <Input
                    value={studentName}
                    readOnly
                    className="rounded-xl border-slate-200 text-xs h-9 px-3 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500">Kelas & Jurusan</span>
                  <Input
                    value={
                      student.class?.name
                        ? student.major?.name
                          ? `${student.class.name} (${student.major.name})`
                          : student.class.name
                        : "-"
                    }
                    readOnly
                    className="rounded-xl border-slate-200 text-xs h-9 px-3 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500">Status Keterserapan</span>
                  <Input
                    value={statusLabel}
                    readOnly
                    className="rounded-xl border-slate-200 text-xs h-9 px-3 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500">Nomor Telepon</span>
                  <Input
                    value={student.phone || student.user?.phone || "-"}
                    readOnly
                    className="rounded-xl border-slate-200 text-xs h-9 px-3 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500">Alamat Email</span>
                  <Input
                    value={student.email || student.user?.email || "-"}
                    readOnly
                    className="rounded-xl border-slate-200 text-xs h-9 px-3 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500">
                  Tautan Profil / Media Sosial
                </span>
                <Input
                  value={socialMediaUrl}
                  readOnly
                  className="rounded-xl border-slate-200 text-xs h-9 px-3 bg-white"
                />
              </div>
            </div>

            {/* Kolom Kanan: Daftar Dokumen Portofolio (Span 5) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Berkas Portofolio ({portfolios.length})
                </h4>
              </div>

              {portfolios.length > 0 ? (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                  {portfolios.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-purple-200 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <div className="h-9 w-9 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-900 truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                            {item.category?.name || "Dokumen"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {item.fileUrl && (
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Lihat Dokumen"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => setPortfolioToDelete({ id: item.id, title: item.title })}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Dokumen"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-7 text-center rounded-2xl bg-slate-50 border border-slate-200">
                  <FileText className="h-7 w-7 text-slate-300 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-600">
                    Belum ada dokumen portofolio.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Gunakan tombol "Upload Dokumen" di atas untuk menambahkan berkas.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Dialog Konfirmasi Hapus Portofolio */}
      <AlertDialog
        open={Boolean(portfolioToDelete)}
        onOpenChange={(open) => !open && setPortfolioToDelete(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-slate-900">
              Hapus Dokumen Portofolio?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              Apakah Anda yakin ingin menghapus berkas{" "}
              <strong className="text-slate-900">{portfolioToDelete?.title}</strong>? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setPortfolioToDelete(null)}
              className="rounded-xl text-xs cursor-pointer"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeletePortfolio}
              disabled={isDeletingPortfolio}
              className="rounded-xl text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
            >
              {isDeletingPortfolio ? "Menghapus..." : "Ya, Hapus Berkas"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
