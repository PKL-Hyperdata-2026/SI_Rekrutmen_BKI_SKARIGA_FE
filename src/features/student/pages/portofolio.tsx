import { useState, useEffect, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/api/axios";
import { PageHeader } from "@/components/custom/page-header";
import { SectionCard } from "@/components/custom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Eye,
  User,
  Save,
  RotateCcw,
  Loader2,
  Lock,
  Plus,
  Trash2,
  ExternalLink,
  Globe,
  UploadCloud,
  Download,
  ShieldCheck,
  BadgeCheck,
  Medal,
  Languages,
  CheckCircle2,
} from "lucide-react";
import {
  studentProfileSchema,
  type StudentProfileSchemaType,
  type StudentProfileData,
  type PortfolioFormOptions,
  type PortfolioItem,
  type PortfolioCategory,
  type SocialMediaItem,
} from "../schemas/portfolio.schema";
import {
  AddSocialMediaModal,
  UploadDocumentModal,
  DocumentPreviewModal,
  MONOCHROME_PLATFORMS,
  cleanSocialMediaUsername,
} from "../components/portfolio";

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
            url: rawUrl || (config && config.baseUrl ? `${config.baseUrl}${username}` : undefined),
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
          url: config && config.baseUrl ? `${config.baseUrl}${username}` : undefined,
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

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<StudentProfileSchemaType>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      fullName: "",
      nis: "",
      email: "",
      phone: "",
      majorId: 0,
      classId: 0,
      graduationYear: 2026,
      socialMedia: [],
    },
  });

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
        api.get<{ success: boolean; message?: string; data: StudentProfileData }>(
          "/siswa/portfolio/profile"
        ),
        api.get<{ success: boolean; message?: string; data: PortfolioFormOptions }>(
          "/siswa/portfolio/options"
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
      toast.error("Gagal memuat data profil atau dokumen.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync profileData to form & social media state
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

      const response = await api.put<{
        success: boolean;
        message?: string;
        data: StudentProfileData;
      }>("/siswa/portfolio/profile", payload);

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
      const formData = new FormData();
      formData.append("category_id", String(categoryId));
      formData.append("file", file);

      const response = await api.post<{
        success: boolean;
        message?: string;
        data: PortfolioItem;
      }>("/siswa/portfolio/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
      const response = await api.delete<{ success: boolean; message?: string }>(
        `/siswa/portfolio/${portfolio.id}`
      );
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
      {/* Header Banner */}
      <PageHeader
        variant="student"
        size="compact"
        badge="Berkas Terverifikasi Sistem"
        badgeIcon={<FileText className="h-3 w-3" />}
        title="E-Portofolio & Profil Pelamar"
        description="Kelola biodata dan lampiran berkas PDF yang dapat di-review secara langsung oleh HRD Perusahaan."
      >
        <div className="bg-white/10 border border-white/25 backdrop-blur-[4px] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.15)] rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center gap-3">
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
        </div>
      </PageHeader>

      {/* Main 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Column: Form Biodata & Akademik (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col">
          <SectionCard
            className="rounded-xl p-3.5 sm:p-4 shadow-xs border border-slate-100/90 flex-1 flex flex-col"
            headerClassName="pb-2.5 border-b border-slate-100 mb-3"
            title={
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                  Data Diri & Akademik Pelamar
                </h2>
              </div>
            }
            action={
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200/80 select-none">
                <Lock className="h-2.5 w-2.5 text-slate-400" />
                <span>Data Akademik Terkunci</span>
              </div>
            }
          >
            {isLoading ? (
              <div className="py-8 flex flex-col items-center justify-center gap-1.5 text-slate-400 flex-1">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-xs font-medium">Memuat data profil...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(handleSaveProfile)} className="space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  {/* Row 1: Status & Nama Lengkap */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <div>
                      <Label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        STATUS
                      </Label>
                      <Select
                        disabled
                        value={profileData?.role?.toUpperCase() || "SISWA"}
                      >
                        <SelectTrigger className="w-full h-8 px-2.5 bg-slate-100/70 border-input text-xs font-medium text-slate-500 cursor-not-allowed shadow-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SISWA">SISWA</SelectItem>
                          <SelectItem value="ALUMNI">ALUMNI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="block text-xs font-bold text-slate-500 tracking-wider mb-1">
                        Nama Lengkap
                      </Label>
                      <Input
                        type="text"
                        disabled
                        value={profileData?.fullName || ""}
                        className="h-8 text-xs bg-slate-100/70 text-slate-500 font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Row 2: NIS/NISN & Jurusan */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <div>
                      <Label className="block text-xs font-bold text-slate-500 tracking-wider mb-1">
                        NIS/NISN
                      </Label>
                      <Input
                        type="text"
                        disabled
                        value={profileData?.nis || "-"}
                        className="h-8 text-xs bg-slate-100/70 text-slate-500 font-medium cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <Label className="block text-xs font-bold text-slate-500 tracking-wider mb-1">
                        Jurusan
                      </Label>
                      <Select
                        disabled
                        value={profileData?.majorId ? String(profileData.majorId) : "0"}
                      >
                        <SelectTrigger className="w-full h-8 px-2.5 bg-slate-100/70 border-input text-xs font-medium text-slate-500 cursor-not-allowed shadow-none">
                          <SelectValue placeholder="Pilih Jurusan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Pilih Jurusan</SelectItem>
                          {options?.majors?.map((major) => (
                            <SelectItem key={major.id} value={String(major.id)}>
                              {major.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row 3: Kelas & Tahun Lulus */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <div>
                      <Label className="block text-xs font-bold text-slate-500 tracking-wider mb-1">
                        Kelas
                      </Label>
                      <Select
                        disabled
                        value={profileData?.classId ? String(profileData.classId) : "0"}
                      >
                        <SelectTrigger className="w-full h-8 px-2.5 bg-slate-100/70 border-input text-xs font-medium text-slate-500 cursor-not-allowed shadow-none">
                          <SelectValue placeholder="Pilih Kelas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Pilih Kelas</SelectItem>
                          {options?.classes?.map((cls) => (
                            <SelectItem key={cls.id} value={String(cls.id)}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="block text-xs font-bold text-slate-500 tracking-wider mb-1">
                        Tahun Lulus
                      </Label>
                      <Select
                        disabled
                        value={profileData?.graduationYear ? String(profileData.graduationYear) : "default"}
                      >
                        <SelectTrigger className="w-full h-8 px-2.5 bg-slate-100/70 border-input text-xs font-medium text-slate-500 cursor-not-allowed shadow-none">
                          <SelectValue placeholder="Pilih Tahun Lulus" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Pilih Tahun Lulus</SelectItem>
                          {options?.graduation_years?.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row 4: Email (Full 1 Col - Read Only) */}
                  <div>
                    <Label className="block text-xs font-bold text-slate-500 tracking-wider mb-1">
                      Email
                    </Label>
                    <Input
                      type="email"
                      disabled
                      value={profileData?.email || ""}
                      className="h-8 text-xs bg-slate-100/70 text-slate-500 font-medium cursor-not-allowed"
                    />
                  </div>

                  {/* Row 5: No WA (Editable) */}
                  <div>
                    <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1">
                      No . WhatsApp Aktif <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      {...register("phone")}
                      placeholder="e.g +62 123-4567-890"
                      className="h-8 text-xs bg-white text-slate-800 focus-visible:border-primary"
                    />
                    {errors.phone && (
                      <p className="text-xs text-rose-500 mt-0.5 font-medium">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Sub-section: Media Sosial (Opsional) */}
                  <div className="pt-2.5 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-xs font-bold text-slate-700">
                          Media Sosial (Opsional)
                        </h3>
                        <p className="text-xs text-slate-400">
                          Tautkan akun LinkedIn, GitHub, Instagram, TikTok, Portofolio/CV, dll.
                        </p>
                      </div>
                      {socialMediaList.length > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          onClick={() => setIsAddSocialModalOpen(true)}
                          className="border-slate-200 hover:border-primary hover:bg-primary/5 text-slate-700 hover:text-primary cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Tambah</span>
                        </Button>
                      )}
                    </div>

                    {socialMediaList.length === 0 ? (
                      <div
                        onClick={() => setIsAddSocialModalOpen(true)}
                        className="p-3 rounded-xl border border-dashed border-slate-200 hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-xs text-slate-400 cursor-pointer select-none"
                      >
                        <Plus className="h-3.5 w-3.5 text-slate-400" />
                        <span>Belum ada media sosial ditambahkan. Klik untuk menambah.</span>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {socialMediaList.map((item) => {
                          const config =
                            MONOCHROME_PLATFORMS.find(
                              (p) => p.id === item.platform.toLowerCase()
                            ) || {
                              name: item.platform,
                              icon: <Globe className="h-4 w-4 text-slate-900 stroke-current" />,
                              baseUrl: "",
                            };

                          return (
                            <div
                              key={item.platform}
                              className="p-2 rounded-xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-2xs transition-all flex items-center justify-between gap-2.5"
                            >
                              {/* Left: Icon, Platform Name & Username */}
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                  {config.icon}
                                </div>
                                <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    {config.name}
                                  </span>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-xs font-bold text-slate-800 truncate">
                                    {item.username}
                                  </span>
                                </div>
                              </div>

                              {/* Right: View Link & Delete */}
                              <div className="shrink-0 flex items-center gap-1">
                                {item.url && (
                                  <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    asChild
                                    className="text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                                  >
                                    <a
                                      href={item.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title={`Buka tautan ${config.name}`}
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={() => handleRemoveSocialMedia(item.platform)}
                                  title="Hapus Media Sosial"
                                  className="text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3 mt-1 flex items-center justify-end gap-2 border-t border-slate-100/60">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetForm}
                    disabled={!isFormChanged || isSaving}
                    className="h-8 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </Button>

                  <Button
                    type="submit"
                    disabled={!isFormChanged || isSaving}
                    className="h-8 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="h-3 w-3" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </SectionCard>
        </div>

        {/* Right Column: Kelola Berkas & Kelengkapan Portofolio (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <SectionCard
            className="rounded-xl p-3.5 sm:p-4 shadow-xs border border-slate-100/90 flex flex-col"
            headerClassName="pb-2.5 border-b border-slate-100 mb-3"
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
                      {/* Left: Icon & Info */}
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

                      {/* Right: Actions */}
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

          {/* Card Kelengkapan Portofolio */}
          <SectionCard
            className="rounded-xl p-3.5 sm:p-4 shadow-xs border border-slate-100/90"
            headerClassName="pb-2 border-b border-slate-100 mb-2.5"
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
              {/* Progress Bar & Counter */}
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

              {/* Checklist Grid */}
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

              {/* Motivational Hint (No Emoji) */}
              <p className="text-xs text-slate-500 pt-0.5 leading-relaxed">
                <span className="font-bold text-slate-700">Tips:</span> Lengkapi seluruh berkas dan media sosial untuk meningkatkan skor kredibilitas profil di hadapan HRD.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Hidden File Input for Direct Upload */}
      <input
        ref={directFileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        onChange={handleDirectFileChange}
        className="hidden"
      />

      {/* Delete Confirmation Alert Dialog (Shadcn UI - Clean Style) */}
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
              disabled={isDeletingId !== null}
              className="cursor-pointer"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeletingId !== null}
              onClick={(e) => {
                e.preventDefault();
                if (portfolioToDelete) {
                  handleConfirmDeleteDocument(portfolioToDelete);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
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

      {/* Modals Only */}
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

