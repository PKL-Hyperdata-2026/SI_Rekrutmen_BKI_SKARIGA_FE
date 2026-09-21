import { useState, useEffect, useRef, useMemo } from "react";
import { PageHeader } from "@/components/custom/page-header";
import { SectionCard } from "@/components/custom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/custom/sonner";
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
import {
  FileText,
  Eye,
  Loader2,
  Plus,
  Trash2,
  UploadCloud,
  Download,
  ShieldCheck,
  BadgeCheck,
  Medal,
  Languages,
  CheckCircle2,
} from "lucide-react";
import {
  type StudentProfileSchemaType,
  type StudentProfileData,
  type PortfolioFormOptions,
  type PortfolioItem,
  type PortfolioCategory,
  type SocialMediaItem,
} from "./e-portfolio.schema";
import { portfolioApi } from "./e-portfolio.api";
import { usePortfolioProfileForm } from "./e-portfolio.form";
import { PersonalAcademicForm } from "./personal-academic-form";
import {
  AddSocialMediaModal,
  MONOCHROME_PLATFORMS,
  cleanSocialMediaUsername,
} from "./add-social-media-modal";
import { UploadDocumentModal } from "./upload-document-modal";
import { DocumentPreviewModal } from "./document-preview-modal";

const CATEGORY_CONFIG: Record<
  string,
  {
    icon: React.ReactNode;
    iconClass: string;
  }
> = {
  cv: {
    icon: <FileText className="h-5 w-5" />,
    iconClass: "icon-danger",
  },
  sertifikat_pkl: {
    icon: <BadgeCheck className="h-5 w-5" />,
    iconClass: "icon-warning",
  },
  sertifikat_prestasi: {
    icon: <Medal className="h-5 w-5" />,
    iconClass: "icon-primary",
  },
  sertifikat_bahasa: {
    icon: <Languages className="h-5 w-5" />,
    iconClass: "icon-purple",
  },
};

function extractSocialMediaList(rawSocialMedia: unknown): SocialMediaItem[] {
  if (!rawSocialMedia) return [];

  const list: SocialMediaItem[] = [];

  if (Array.isArray(rawSocialMedia)) {
    for (const item of rawSocialMedia) {
      if (item && typeof item === "object") {
        const platform = String(
          (item as { platform?: string }).platform || ""
        ).toLowerCase();
        const rawUsername = String(
          (item as { username?: string }).username || ""
        );
        const rawUrl = String((item as { url?: string }).url || "");

        let username = rawUsername ? cleanSocialMediaUsername(platform, rawUsername) : "";
        if (!username && rawUrl) {
          username = cleanSocialMediaUsername(platform, rawUrl);
        }

        if (platform && username) {
          const config = MONOCHROME_PLATFORMS.find((p) => p.id === platform);
          list.push({
            platform,
            username,
            url:
              rawUrl ||
              (config && config.baseUrl
                ? `${config.baseUrl}${username}`
                : username.startsWith("http://") || username.startsWith("https://")
                ? username
                : `https://${username}`),
          });
        }
      }
    }
  } else if (typeof rawSocialMedia === "object") {
    for (const [key, val] of Object.entries(rawSocialMedia)) {
      const platform = key.toLowerCase();
      const rawVal = typeof val === "string" ? val : "";
      const username = cleanSocialMediaUsername(platform, rawVal);
      if (platform && username) {
        const config = MONOCHROME_PLATFORMS.find((p) => p.id === platform);
        list.push({
          platform,
          username,
          url:
            config && config.baseUrl
              ? `${config.baseUrl}${username}`
              : username.startsWith("http://") || username.startsWith("https://")
              ? username
              : `https://${username}`,
        });
      }
    }
  }

  return list;
}

export function EPortofolio() {
  const [profileData, setProfileData] = useState<StudentProfileData | null>(null);
  const [options, setOptions] = useState<PortfolioFormOptions | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  const [socialMediaList, setSocialMediaList] = useState<SocialMediaItem[]>([]);
  const [isAddSocialModalOpen, setIsAddSocialModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadInitialCategoryId, setUploadInitialCategoryId] = useState<number | null>(null);
  const [previewItem, setPreviewItem] = useState<PortfolioItem | null>(null);
  const [portfolioToDelete, setPortfolioToDelete] = useState<PortfolioItem | null>(null);

  const directFileInputRef = useRef<HTMLInputElement>(null);
  const [directUploadCategoryId, setDirectUploadCategoryId] = useState<number | null>(null);

  const form = usePortfolioProfileForm(profileData, socialMediaList);
  const { reset, watch } = form;

  const currentPhone = watch("phone") ?? "";
  const initialPhone = profileData?.phone ?? "";
  const initialSocial = useMemo(
    () =>
      profileData
        ? extractSocialMediaList(
            profileData.socialMedia ||
              (profileData as unknown as { social_media?: unknown }).social_media
          )
        : [],
    [profileData]
  );

  const isSocialChanged = useMemo(() => {
    if (socialMediaList.length !== initialSocial.length) return true;
    const cleanListA = socialMediaList
      .map((i) => ({
        platform: i.platform.toLowerCase(),
        username: i.username.trim(),
      }))
      .sort((a, b) => a.platform.localeCompare(b.platform));
    const cleanListB = initialSocial
      .map((i) => ({
        platform: i.platform.toLowerCase(),
        username: i.username.trim(),
      }))
      .sort((a, b) => a.platform.localeCompare(b.platform));
    return JSON.stringify(cleanListA) !== JSON.stringify(cleanListB);
  }, [socialMediaList, initialSocial]);

  const isFormChanged = isSocialChanged || currentPhone.trim() !== initialPhone.trim();

  const loadData = async () => {
    try {
      const [profileRes, optionsRes] = await Promise.all([
        portfolioApi.getProfile(),
        portfolioApi.getOptions(),
      ]);

      if (profileRes.data?.data) {
        setProfileData(profileRes.data.data);
      }
      if (optionsRes.data?.data) {
        setOptions(optionsRes.data.data);
      }
    } catch (err: unknown) {
      console.error("Gagal mengambil data portfolio:", err);
      toast.error("Gagal memuat data profil atau dokumen.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (profileData) {
      const rawSocial =
        profileData.socialMedia ||
        (profileData as unknown as { social_media?: unknown }).social_media;
      const parsedSocial = extractSocialMediaList(rawSocial);
      setSocialMediaList(parsedSocial);
      reset({
        fullName: profileData.fullName || "",
        nis: profileData.nis || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        majorId: profileData.majorId || 0,
        classId: profileData.classId || 0,
        graduationYear: profileData.graduationYear || new Date().getFullYear(),
        socialMedia: parsedSocial,
      });
    }
  }, [profileData, reset]);

  const handleResetForm = () => {
    if (profileData) {
      const rawSocial =
        profileData.socialMedia ||
        (profileData as unknown as { social_media?: unknown }).social_media;
      const parsedSocial = extractSocialMediaList(rawSocial);
      setSocialMediaList(parsedSocial);
      reset({
        fullName: profileData.fullName || "",
        nis: profileData.nis || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        majorId: profileData.majorId || 0,
        classId: profileData.classId || 0,
        graduationYear: profileData.graduationYear || new Date().getFullYear(),
        socialMedia: parsedSocial,
      });
    }
  };

  const handleRemoveSocialMedia = (platform: string) => {
    setSocialMediaList((prev) =>
      prev.filter((p) => p.platform.toLowerCase() !== platform.toLowerCase())
    );
  };

  const handleSaveProfile = async (formData: StudentProfileSchemaType) => {
    setIsSaving(true);
    try {
      const validSocialMediaList = socialMediaList
        .filter((item) => !!item.username && item.username.trim() !== "")
        .map((item) => ({
          platform: item.platform,
          username: item.username.trim(),
        }));

      const payload = {
        phone: formData.phone,
        social_media: validSocialMediaList,
      };

      const response = await portfolioApi.updateProfile(payload);

      if (response.data?.data) {
        setProfileData(response.data.data);
      } else {
        await loadData();
      }
      toast.success(response.data?.message || "Data profil berhasil diperbarui!");
    } catch (err: unknown) {
      console.error("Gagal menyimpan profil:", err);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Terjadi kesalahan saat memperbarui data.";
      toast.error(msg);
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
      const response = await portfolioApi.uploadDocument(categoryId, file);
      toast.success(response.data?.message || "Dokumen berhasil diunggah!");
      await loadData();
    } catch (err: unknown) {
      console.error("Gagal mengunggah dokumen:", err);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal mengunggah berkas dokumen.";
      toast.error(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setIsUploading(false);
    }
  };

  const handleTriggerDirectUpload = (categoryId: number) => {
    setDirectUploadCategoryId(categoryId);
    if (directFileInputRef.current) {
      directFileInputRef.current.value = "";
      directFileInputRef.current.click();
    }
  };

  const handleDirectFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && directUploadCategoryId) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Ukuran file melebihi batas maksimal 10MB.");
        return;
      }
      try {
        await handleUploadDocument(directUploadCategoryId, file);
      } finally {
        setDirectUploadCategoryId(null);
      }
    }
  };

  const handleConfirmDeleteDocument = async (portfolio: PortfolioItem) => {
    setIsDeletingId(portfolio.id);
    try {
      const response = await portfolioApi.deleteDocument(portfolio.id);
      toast.success(response.data?.message || "Dokumen berhasil dihapus!");
      setPortfolioToDelete(null);
      await loadData();
    } catch (err: unknown) {
      console.error("Gagal menghapus dokumen:", err);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menghapus dokumen.";
      toast.error(msg);
    } finally {
      setIsDeletingId(null);
    }
  };

  const displayCategories: PortfolioCategory[] =
    options?.portfolio_types && options.portfolio_types.length > 0
      ? options.portfolio_types
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
    return (profileData?.portfolios || []).find(
      (p) =>
        p.categoryId === cat.id ||
        p.category?.code?.toLowerCase() === cat.code?.toLowerCase()
    );
  };

  const completenessItems = useMemo(() => {
    const hasPhone = Boolean((currentPhone || profileData?.phone)?.trim());
    const hasSocial = socialMediaList.length > 0;
    const hasCV = Boolean(
      (profileData?.portfolios || []).some(
        (p) => p.category?.code?.toLowerCase() === "cv" || p.categoryId === 1
      )
    );
    const hasPKL = Boolean(
      (profileData?.portfolios || []).some(
        (p) =>
          p.category?.code?.toLowerCase() === "sertifikat_pkl" ||
          p.categoryId === 2
      )
    );
    const hasPrestasi = Boolean(
      (profileData?.portfolios || []).some(
        (p) =>
          p.category?.code?.toLowerCase() === "sertifikat_prestasi" ||
          p.categoryId === 3
      )
    );
    const hasBahasa = Boolean(
      (profileData?.portfolios || []).some(
        (p) =>
          p.category?.code?.toLowerCase() === "sertifikat_bahasa" ||
          p.categoryId === 4
      )
    );

    return [
      { label: "Nomor WhatsApp", isCompleted: hasPhone },
      { label: "Curriculum Vitae (CV)", isCompleted: hasCV },
      { label: "Media Sosial / Web", isCompleted: hasSocial },
      { label: "Sertifikat PKL / Magang", isCompleted: hasPKL },
      { label: "Sertifikat Prestasi", isCompleted: hasPrestasi },
      { label: "Sertifikat Bahasa", isCompleted: hasBahasa },
    ];
  }, [currentPhone, profileData, socialMediaList]);

  const completedCount = completenessItems.filter((i) => i.isCompleted).length;
  const totalCount = completenessItems.length;
  const completenessPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-3.5 pb-6">
      <PageHeader
        variant="student"
        badge="Berkas Terverifikasi Sistem"
        badgeIcon={<FileText className="h-3 w-3" />}
        title="E-Portofolio & Profil Pelamar"
        description="Kelola biodata dan lampiran berkas PDF yang dapat di-review secara langsung oleh HRD Perusahaan."
      >
        {/* <div className="bg-white/10 border border-white/25 backdrop-blur-xs shadow-md rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
            <Eye className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold tracking-wider text-emerald-300 uppercase">
                Status Visibilitas HRD
              </span>
            </div>
            <span className="text-xs font-semibold text-white mt-0.5">
              Siap di-Review oleh HRD
            </span>
          </div>
        </div> */}
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <PersonalAcademicForm
            form={form}
            profileData={profileData}
            options={options}
            isLoading={isLoading}
            isSaving={isSaving}
            isFormChanged={isFormChanged}
            socialMediaList={socialMediaList}
            onOpenAddSocialModal={() => setIsAddSocialModalOpen(true)}
            onRemoveSocialMedia={handleRemoveSocialMedia}
            onReset={handleResetForm}
            onSubmit={handleSaveProfile}
          />
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <SectionCard
            className="rounded-xl p-4 sm:p-5 shadow-xs border border-slate-100/90 flex flex-col"
            headerClassName="pb-3 sm:pb-3.5 border-b border-slate-100 mb-4"
            title={
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary stroke-[2.2]" />
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                  Kelola Berkas
                </h2>
              </div>
            }
            action={
              <Button
                type="button"
                size="sm"
                onClick={() => handleOpenUpload()}
                className="h-7.5 px-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium shadow-xs shrink-0 cursor-pointer"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Upload Dokumen</span>
              </Button>
            }
          >
            {isLoading ? (
              <div className="py-8 flex flex-col items-center justify-center gap-1.5 text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-xs font-medium">Memuat berkas dokumen...</p>
              </div>
            ) : (
              <div className="space-y-2 flex-1">
                {displayCategories.map((cat) => {
                  const uploadedItem = getPortfolioForCategory(cat);
                  const style =
                    CATEGORY_CONFIG[cat.code.toLowerCase()] || {
                      icon: <FileText className="h-4 w-4" />,
                      iconClass: "icon-primary",
                    };

                  return (
                    <div
                      key={cat.id || cat.code}
                      className="p-2 sm:p-2.5 rounded-lg border border-slate-100 bg-white hover:border-slate-200 hover:shadow-xs transition-all flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 shadow-2xs ${style.iconClass}`}
                        >
                          {style.icon}
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-xs font-bold text-slate-800 truncate">
                            {cat.name}
                          </h3>
                          <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                            {uploadedItem ? (
                              <>
                                <span className="text-slate-700 font-semibold">
                                  {uploadedItem.fileName || uploadedItem.title}
                                </span>
                                {uploadedItem.fileSize && (
                                  <span className="text-slate-400 ml-1 font-normal">
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

                      <div className="shrink-0 flex items-center gap-1">
                        {uploadedItem ? (
                          <div className="flex items-center border border-slate-200 rounded-md p-0.5 bg-slate-50/50 gap-0.5">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => setPreviewItem(uploadedItem)}
                              title="Lihat Dokumen"
                              className="text-slate-600 hover:text-primary hover:bg-white cursor-pointer"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => {
                                if (uploadedItem.fileUrl) {
                                  window.open(uploadedItem.fileUrl, "_blank");
                                }
                              }}
                              title="Unduh Dokumen"
                              className="text-slate-600 hover:text-emerald-600 hover:bg-white cursor-pointer"
                            >
                              <Download className="h-3 w-3" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => setPortfolioToDelete(uploadedItem)}
                              disabled={isDeletingId === uploadedItem.id}
                              title="Hapus Dokumen"
                              className="text-slate-400 hover:text-rose-500 hover:bg-white disabled:opacity-50 cursor-pointer"
                            >
                              {isDeletingId === uploadedItem.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isUploading && directUploadCategoryId === cat.id}
                            onClick={() => handleTriggerDirectUpload(cat.id)}
                            className="h-7 px-2 border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 text-xs font-semibold text-slate-600 hover:text-primary cursor-pointer disabled:opacity-60"
                          >
                            {isUploading && directUploadCategoryId === cat.id ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span>Mengunggah...</span>
                              </>
                            ) : (
                              <>
                                <Plus className="h-3 w-3" />
                                <span>Unggah</span>
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          <SectionCard
            className="rounded-xl p-4 sm:p-5 shadow-xs border border-slate-100/90"
            headerClassName="pb-3 sm:pb-3.5 border-b border-slate-100 mb-3.5"
            title={
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary stroke-[2.2]" />
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                  Kelengkapan Portofolio
                </h2>
              </div>
            }
            action={
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border select-none ${
                  completenessPercentage === 100
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-primary/10 text-primary border-primary/20"
                }`}
              >
                {completenessPercentage}% Lengkap
              </span>
            }
          >
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1.5">
                  <span>
                    <strong className="text-slate-800 font-bold">{completedCount}</strong> dari {totalCount} item terpenuhi
                  </span>
                  <span className="font-bold text-slate-900">{completenessPercentage}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      completenessPercentage === 100
                        ? "bg-emerald-500"
                        : "bg-primary"
                    }`}
                    style={{ width: `${completenessPercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {completenessItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`px-2.5 py-1.5 rounded-md border text-xs flex items-center gap-2 transition-all ${
                      item.isCompleted
                        ? "bg-emerald-50/50 border-emerald-100/80 text-emerald-800 font-medium"
                        : "bg-slate-50/60 border-slate-100 text-slate-400"
                    }`}
                  >
                    {item.isCompleted ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span className="truncate">{item.label}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-500 pt-0.5 leading-relaxed">
                <span className="font-bold text-slate-700">Tips:</span> Lengkapi seluruh berkas dan media sosial untuk meningkatkan skor kredibilitas profil di hadapan HRD.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>

      <input
        ref={directFileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        onChange={handleDirectFileChange}
        className="hidden"
      />

      <AlertDialog
        open={!!portfolioToDelete}
        onOpenChange={(open) => {
          if (!open && isDeletingId === null) {
            setPortfolioToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Dokumen</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus berkas{" "}
              <span className="font-semibold text-slate-800">
                "{portfolioToDelete?.title || portfolioToDelete?.category?.name}"
              </span>
              ? Berkas yang sudah dihapus tidak dapat dipulihkan kembali.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-none bg-transparent mt-4 p-0 sm:p-0 m-0">
            <AlertDialogCancel
              variant="secondary"
              disabled={isDeletingId !== null}
              className="border-none bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeletingId !== null}
              onClick={(e) => {
                e.preventDefault();
                if (portfolioToDelete) {
                  handleConfirmDeleteDocument(portfolioToDelete);
                }
              }}
              className="cursor-pointer"
            >
              {isDeletingId !== null ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Menghapus...
                </>
              ) : (
                "Hapus Dokumen"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddSocialMediaModal
        isOpen={isAddSocialModalOpen}
        onClose={() => setIsAddSocialModalOpen(false)}
        socialMediaList={socialMediaList}
        onUpdateList={setSocialMediaList}
      />

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
