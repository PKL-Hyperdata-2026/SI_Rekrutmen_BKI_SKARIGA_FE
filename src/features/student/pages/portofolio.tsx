import { useState, useEffect } from "react";
import { api } from "@/api/axios";
import { PortfolioHeader } from "../components/portfolio-header";
import { PersonalAcademicForm } from "../components/personal-academic-form";
import { DocumentListCard } from "../components/document-list-card";
import { UploadDocumentModal } from "../components/upload-document-modal";
import { DocumentPreviewModal } from "../components/document-preview-modal";
import type {
  StudentProfileData,
  PortfolioFormOptions,
  StudentProfileSchemaType,
  PortfolioItem,
} from "../schemas/portfolio.schema";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export function EPortofolio() {
  const [profileData, setProfileData] = useState<StudentProfileData | null>(null);
  const [options, setOptions] = useState<PortfolioFormOptions | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadInitialCategoryId, setUploadInitialCategoryId] = useState<number | null>(null);
  const [previewItem, setPreviewItem] = useState<PortfolioItem | null>(null);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadData = async () => {
    try {
      const [profileRes, optionsRes] = await Promise.all([
        api.get<{ success: boolean; message?: string; data: StudentProfileData }>(
          "/student/portfolio/profile"
        ),
        api.get<{ success: boolean; message?: string; data: PortfolioFormOptions }>(
          "/student/portfolio/options"
        ),
      ]);

      if (profileRes.data?.data) {
        setProfileData(profileRes.data.data);
      }
      if (optionsRes.data?.data) {
        setOptions(optionsRes.data.data);
      }
    } catch (err: unknown) {
      console.error("Gagal mengambil data portfolio:", err);
      showToast("error", "Gagal memuat data profil atau dokumen.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const [profileRes, optionsRes] = await Promise.all([
          api.get<{ success: boolean; message?: string; data: StudentProfileData }>(
            "/student/portfolio/profile"
          ),
          api.get<{ success: boolean; message?: string; data: PortfolioFormOptions }>(
            "/student/portfolio/options"
          ),
        ]);

        if (isMounted) {
          if (profileRes.data?.data) {
            setProfileData(profileRes.data.data);
          }
          if (optionsRes.data?.data) {
            setOptions(optionsRes.data.data);
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.error("Gagal mengambil data portfolio:", err);
          showToast("error", "Gagal memuat data profil atau dokumen.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveProfile = async (formData: StudentProfileSchemaType) => {
    setIsSaving(true);
    try {
      const payload = {
        fullName: formData.fullName,
        full_name: formData.fullName,
        nis: formData.nis,
        email: formData.email,
        phone: formData.phone,
        majorId: formData.majorId,
        major_id: formData.majorId,
        classId: formData.classId,
        class_id: formData.classId,
        graduationYear: formData.graduationYear,
        graduation_year: formData.graduationYear,
        socialMedia: formData.socialMedia,
        social_media: formData.socialMedia,
      };

      const response = await api.put<{
        success: boolean;
        message?: string;
        data: StudentProfileData;
      }>("/student/portfolio/profile", payload);

      if (response.data?.data) {
        setProfileData(response.data.data);
      }
      showToast("success", response.data?.message || "Data profil berhasil diperbarui!");
    } catch (err: unknown) {
      console.error("Gagal menyimpan profil:", err);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Terjadi kesalahan saat memperbarui data.";
      showToast("error", msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenUpload = (categoryId?: number) => {
    setUploadInitialCategoryId(categoryId || null);
    setIsUploadModalOpen(true);
  };

  const handleUploadDocument = async (categoryId: number, file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("category_id", String(categoryId));
      formData.append("file", file);

      const response = await api.post<{
        success: boolean;
        message?: string;
        data: PortfolioItem;
      }>("/student/portfolio/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showToast("success", response.data?.message || "Dokumen berhasil diunggah!");
      await loadData();
    } catch (err: unknown) {
      console.error("Gagal mengunggah dokumen:", err);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal mengunggah berkas dokumen.";
      showToast("error", msg);
      throw new Error(msg, { cause: err });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (portfolio: PortfolioItem) => {
    const isConfirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus dokumen "${portfolio.title || portfolio.category?.name}"?`
    );
    if (!isConfirmed) return;

    setIsDeletingId(portfolio.id);
    try {
      const response = await api.delete<{ success: boolean; message?: string }>(
        `/student/portfolio/${portfolio.id}`
      );
      showToast("success", response.data?.message || "Dokumen berhasil dihapus!");
      await loadData();
    } catch (err: unknown) {
      console.error("Gagal menghapus dokumen:", err);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menghapus dokumen.";
      showToast("error", msg);
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Feedback */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-3 duration-300">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border text-xs sm:text-sm font-semibold ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <PortfolioHeader />

      {/* Main 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Biodata & Akademik (7 cols on lg) */}
        <div className="lg:col-span-7">
          <PersonalAcademicForm
            initialData={profileData}
            options={options}
            onSubmit={handleSaveProfile}
            isLoading={isLoading}
            isSaving={isSaving}
          />
        </div>

        {/* Right Column: Kelola Berkas (5 cols on lg) */}
        <div className="lg:col-span-5">
          <DocumentListCard
            portfolios={profileData?.portfolios || []}
            categories={options?.portfolio_types || []}
            onOpenUpload={handleOpenUpload}
            onPreview={(item) => setPreviewItem(item)}
            onDelete={handleDeleteDocument}
            isLoading={isLoading}
            isDeletingId={isDeletingId}
          />
        </div>
      </div>

      {/* Modals */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        categories={options?.portfolio_types || []}
        initialCategoryId={uploadInitialCategoryId}
        onUpload={handleUploadDocument}
        isUploading={isUploading}
      />

      <DocumentPreviewModal
        portfolio={previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </div>
  );
}
