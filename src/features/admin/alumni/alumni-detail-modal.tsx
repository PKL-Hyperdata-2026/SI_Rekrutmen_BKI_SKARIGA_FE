import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
  Upload,
  UploadCloud,
  FileText,
  Award,
  Briefcase,
  FileCode2,
  FileCheck,
  Eye,
  Trash2,
  Send,
  Loader2,
  FolderOpen,
  Plus,
  ExternalLink,
  Download,
  UserCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import {
  alumniFormSchema,
  type AlumniFormSchemaType,
  type AlumniPortfolioUploadSchemaType,
  type AlumniItem,
  type AlumniOptionsData,
  type AlumniPortfolio,
  type AlumniReferenceItem,
} from "./alumni.schema";
import {
  findMatchingClassId,
  findMatchingMajorId,
  findMatchingOptionId,
  resolveMajorByClass,
  toUpdateAlumniPayload,
  useAlumniPortfolioUploadForm,
} from "./alumni.form";
import { alumniApi } from "./alumni.api";

export interface AlumniDetailModalProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  alumni: AlumniItem | null;
  options: AlumniOptionsData;
  onUpdateAlumni?: (id: string | number, payload: Record<string, unknown>) => Promise<void> | void;
  onUploadPortfolio?: (alumniId: string | number, formData: FormData) => Promise<void> | void;
  onDeletePortfolio?: (alumniId: string | number, portfolioId: string | number) => Promise<void> | void;
  onRefresh?: () => void | Promise<void>;
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1048576) {
    return (bytes / 1048576).toFixed(1) + " MB";
  }
  if (bytes >= 1024) {
    return (bytes / 1024).toFixed(1) + " KB";
  }
  return bytes + " B";
}

function getCategoryIconConfig(categoryName?: string, categoryCode?: string, title?: string) {
  const text = `${categoryName || ""} ${categoryCode || ""} ${title || ""}`.toLowerCase();
  if (text.includes("cv") || text.includes("resume") || text.includes("curriculum")) {
    return {
      icon: FileText,
      badgeBg: "bg-rose-50 border-rose-200 text-rose-700",
      iconBg: "bg-rose-100 text-rose-600",
      typeLabel: "CV",
    };
  }
  if (
    text.includes("sertifikat") ||
    text.includes("pkl") ||
    text.includes("magang") ||
    text.includes("prestasi") ||
    text.includes("bahasa") ||
    text.includes("cert")
  ) {
    return {
      icon: Award,
      badgeBg: "bg-purple-50 border-purple-200 text-purple-700",
      iconBg: "bg-purple-100 text-purple-600",
      typeLabel: "Sertifikat",
    };
  }
  if (
    text.includes("porto") ||
    text.includes("project") ||
    text.includes("karya") ||
    text.includes("desain")
  ) {
    return {
      icon: Briefcase,
      badgeBg: "bg-teal-50 border-teal-200 text-teal-700",
      iconBg: "bg-teal-100 text-teal-600",
      typeLabel: "Portofolio",
    };
  }
  return {
    icon: FileCode2,
    badgeBg: "bg-indigo-50 border-indigo-200 text-indigo-700",
    iconBg: "bg-indigo-100 text-indigo-600",
    typeLabel: "Dokumen",
  };
}

const DEFAULT_PORTFOLIO_CATEGORIES: AlumniReferenceItem[] = [
  { id: "1", code: "cv", name: "Curriculum Vitae (CV)" },
  { id: "2", code: "sertifikat_pkl", name: "Sertifikat PKL / Magang" },
  { id: "3", code: "sertifikat_prestasi", name: "Sertifikasi Prestasi" },
  { id: "4", code: "sertifikat_bahasa", name: "Sertifikat Bahasa (TOEIC/JLPT)" },
];

export function AlumniDetailModal({
  open,
  isOpen,
  onOpenChange,
  onClose,
  alumni,
  options,
  onUpdateAlumni,
  onUploadPortfolio,
  onDeletePortfolio,
  onRefresh,
}: AlumniDetailModalProps) {
  const modalOpen = open ?? isOpen ?? false;

  const handleClose = useCallback(() => {
    onOpenChange?.(false);
    onClose?.();
  }, [onOpenChange, onClose]);

  // Left Column: Profile edit form
  const form = useForm<AlumniFormSchemaType>({
    resolver: zodResolver(alumniFormSchema),
    defaultValues: {
      mode: "manual",
      user_id: "",
      nis: "",
      full_name: "",
      phone: "",
      email: "",
      major_id: "",
      class_id: "",
      graduation_year: String(new Date().getFullYear()),
      employment_status_id: "",
      current_company_id: "",
      current_position: "",
      profile_url: "",
      company_name_manual: "",
      starting_salary: "",
      waiting_time_months: "",
      is_active: true,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = form;

  const currentClassId = watch("class_id");
  const currentMajorId = watch("major_id");
  const currentGraduationYear = watch("graduation_year");
  const currentStatusId = watch("employment_status_id");

  // Sync alumni values into form when opened or alumni changes
  useEffect(() => {
    if (!alumni) return;

    const resolvedClassId =
      findMatchingClassId(options.classes, alumni.class) ||
      (alumni.classId ? findMatchingOptionId(options.classes, String(alumni.classId)) || String(alumni.classId) : "");

    const resolvedMajorId =
      findMatchingMajorId(options.majors, alumni.major) ||
      (alumni.majorId ? findMatchingOptionId(options.majors, String(alumni.majorId)) || String(alumni.majorId) : "");

    const resolvedStatusId =
      findMatchingOptionId(options.employment_statuses, alumni.employmentStatus) ||
      (alumni.employmentStatusId ? findMatchingOptionId(options.employment_statuses, String(alumni.employmentStatusId)) || String(alumni.employmentStatusId) : "");

    const resolvedCompanyId = options.companies?.find(
      (comp) => comp.name.toLowerCase() === (alumni.currentCompany?.name || "").toLowerCase()
    )
      ? String(
          options.companies.find(
            (comp) => comp.name.toLowerCase() === (alumni.currentCompany?.name || "").toLowerCase()
          )!.id
        )
      : alumni.currentCompanyId
      ? String(alumni.currentCompanyId)
      : "";

    const profileUrl =
      typeof alumni.socialMedia === "string"
        ? alumni.socialMedia
        : (alumni.socialMedia?.profile_url as string) ||
          (alumni.socialMedia?.linkedin as string) ||
          "";

    reset({
      mode: alumni.userId ? "graduate" : "manual",
      user_id: alumni.userId ? String(alumni.userId) : "",
      nis: alumni.nis || "",
      full_name: alumni.fullName || alumni.user?.fullName || "",
      phone: alumni.phone || alumni.user?.phone || "",
      email: alumni.email || alumni.user?.email || "",
      major_id: resolvedMajorId,
      class_id: resolvedClassId,
      graduation_year: alumni.graduationYear
        ? String(alumni.graduationYear)
        : String(new Date().getFullYear()),
      employment_status_id: resolvedStatusId,
      current_company_id: resolvedCompanyId,
      current_position: alumni.currentPosition || "",
      profile_url: profileUrl,
      company_name_manual: alumni.currentCompany?.name || "",
      starting_salary: alumni.startingSalary ? String(alumni.startingSalary) : "",
      waiting_time_months: alumni.waitingTimeMonths ? String(alumni.waitingTimeMonths) : "",
      is_active: alumni.isActive ?? true,
    });
  }, [alumni, modalOpen, options, reset]);

  // Options memoization for left form
  const classMajorOptions = useMemo(() => {
    const result: { value: string; label: string }[] = [];

    if (options.classes && options.classes.length > 0) {
      options.classes.forEach((c) => {
        const resolvedMajorId = resolveMajorByClass(String(c.id), options.classes, options.majors);
        const majorName = options.majors?.find((m) => String(m.id) === resolvedMajorId)?.name;
        result.push({
          value: `class_${c.id}`,
          label: majorName ? `${c.name} - ${majorName}` : c.name,
        });
      });
    }

    (options.majors || []).forEach((m) => {
      result.push({
        value: `major_${m.id}`,
        label: `Jurusan: ${m.name}`,
      });
    });

    return result;
  }, [options.classes, options.majors]);

  const currentClassMajorValue = useMemo(() => {
    if (currentClassId) {
      const matchedClass = options.classes?.find(
        (c) => String(c.id) === String(currentClassId) || (c.code && c.code === currentClassId)
      );
      if (matchedClass) return `class_${matchedClass.id}`;
    }
    if (currentMajorId) {
      const matchedMajor = options.majors?.find(
        (m) => String(m.id) === String(currentMajorId) || (m.code && m.code === currentMajorId)
      );
      if (matchedMajor) return `major_${matchedMajor.id}`;
    }
    return "";
  }, [currentClassId, currentMajorId, options.classes, options.majors]);

  const statusOptions = useMemo(() => {
    if (options.employment_statuses && options.employment_statuses.length > 0) {
      return options.employment_statuses.map((s) => ({
        value: String(s.id),
        label: s.name,
      }));
    }
    return [
      { value: "belum_bekerja", label: "Belum Bekerja" },
      { value: "bekerja", label: "Bekerja (Kolektif/Mandiri)" },
      { value: "wirausaha", label: "Wirausaha" },
      { value: "melanjutkan_studi", label: "Melanjutkan Studi" },
    ];
  }, [options.employment_statuses]);

  const yearOptions = useMemo(() => {
    if (options.graduation_years && options.graduation_years.length > 0) {
      return options.graduation_years.map((yr) => ({
        value: String(yr),
        label: `Lulusan ${yr}`,
      }));
    }
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => currentYear - i).map((yr) => ({
      value: String(yr),
      label: `Lulusan ${yr}`,
    }));
  }, [options.graduation_years]);

  const handleClassMajorChange = (val: string) => {
    if (val.startsWith("class_")) {
      const cId = val.replace("class_", "");
      setValue("class_id", cId);
      const resolvedMajorId = resolveMajorByClass(cId, options.classes, options.majors);
      if (resolvedMajorId) {
        setValue("major_id", resolvedMajorId, { shouldValidate: true });
      } else if (options.majors && options.majors.length > 0) {
        setValue("major_id", String(options.majors[0].id), { shouldValidate: true });
      }
    } else if (val.startsWith("major_")) {
      const mId = val.replace("major_", "");
      setValue("major_id", mId, { shouldValidate: true });
      setValue("class_id", "");
    }
    clearErrors("major_id");
  };

  const { onChange: onCompanyManualRHFChange, ...companyManualRest } = register("company_name_manual");

  const handleCompanyManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCompanyManualRHFChange(e);
    const val = e.target.value;
    const matched = options.companies?.find(
      (c) => c.name.toLowerCase() === val.trim().toLowerCase()
    );
    if (matched) {
      setValue("current_company_id", String(matched.id));
    } else {
      setValue("current_company_id", "");
    }
  };

  const handleProfileSubmit = handleSubmit(async (values) => {
    if (!alumni?.id) return;
    try {
      const payload = toUpdateAlumniPayload(values);
      if (onUpdateAlumni) {
        await onUpdateAlumni(alumni.id, payload);
      } else {
        await alumniApi.updateAlumni(alumni.id, payload);
      }
      toast.success("Data alumni berhasil diperbarui.");
      if (onRefresh) {
        await onRefresh();
      }
      await fetchFreshPortfolios();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Gagal memperbarui data profil alumni.";
      toast.error(msg);
    }
  });

  // Right Column: E-Portfolio stack & Upload Drawer
  const [portfolios, setPortfolios] = useState<AlumniPortfolio[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [portfolioToDelete, setPortfolioToDelete] = useState<AlumniPortfolio | null>(null);
  const [isDeletingPortfolio, setIsDeletingPortfolio] = useState(false);
  const [previewPortfolio, setPreviewPortfolio] = useState<AlumniPortfolio | null>(null);

  const portfolioCategories = useMemo(() => {
    if (options.portfolio_types && options.portfolio_types.length > 0) {
      return options.portfolio_types;
    }
    return DEFAULT_PORTFOLIO_CATEGORIES;
  }, [options.portfolio_types]);

  const portfolioCategoryOptions = useMemo(() => {
    return portfolioCategories.map((cat) => ({
      value: String(cat.id),
      label: cat.name,
    }));
  }, [portfolioCategories]);

  const defaultUploadCategory = portfolioCategories[0] ? String(portfolioCategories[0].id) : "";

  const uploadForm = useAlumniPortfolioUploadForm(defaultUploadCategory);
  const {
    register: registerUpload,
    handleSubmit: handleUploadSubmitRHF,
    setValue: setUploadValue,
    watch: watchUpload,
    reset: resetUpload,
    formState: { errors: uploadErrors, isSubmitting: uploadIsSubmitting },
  } = uploadForm;

  const uploadCategoryId = watchUpload("category_id");
  const selectedFile = watchUpload("file");

  useEffect(() => {
    if (!watchUpload("category_id") && portfolioCategories.length > 0) {
      setUploadValue("category_id", String(portfolioCategories[0].id));
    }
  }, [portfolioCategories, setUploadValue, watchUpload]);

  const fetchFreshPortfolios = useCallback(async () => {
    if (!alumni?.id) return;
    try {
      const res = await alumniApi.getAlumniById(alumni.id);
      const data = res.data?.data || res.data;
      if (data && Array.isArray(data.portfolios)) {
        setPortfolios(data.portfolios);
      }
    } catch {
      // Keep existing items if request fails
    }
  }, [alumni?.id]);

  useEffect(() => {
    if (modalOpen && alumni) {
      setPortfolios(alumni.portfolios || []);
      fetchFreshPortfolios();
    }
  }, [modalOpen, alumni, fetchFreshPortfolios]);

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    setUploadValue("file", file, { shouldValidate: true });
    if (!uploadForm.getValues("title").trim()) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setUploadValue("title", nameWithoutExt, { shouldValidate: true });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const resetUploadState = () => {
    resetUpload({
      category_id: defaultUploadCategory,
      title: "",
      description: "",
      file: undefined,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadSubmit = handleUploadSubmitRHF(async (data: AlumniPortfolioUploadSchemaType) => {
    if (!alumni?.id) {
      toast.error("Data alumni tidak ditemukan.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("category_id", data.category_id);
      formData.append("title", data.title.trim());
      if (data.description && data.description.trim()) {
        formData.append("description", data.description.trim());
      }
      formData.append("file", data.file);

      if (onUploadPortfolio) {
        await onUploadPortfolio(alumni.id, formData);
      } else {
        await alumniApi.uploadPortfolio(alumni.id, formData);
      }

      toast.success("Dokumen portofolio berhasil diunggah.");
      resetUploadState();
      setShowUpload(false);
      await fetchFreshPortfolios();
      if (onRefresh) {
        await onRefresh();
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Gagal mengunggah dokumen portofolio.";
      toast.error(msg);
    }
  });

  const handleConfirmDeletePortfolio = async () => {
    if (!alumni?.id || !portfolioToDelete) return;
    setIsDeletingPortfolio(true);
    try {
      if (onDeletePortfolio) {
        await onDeletePortfolio(alumni.id, portfolioToDelete.id);
      } else {
        await alumniApi.deletePortfolio(alumni.id, portfolioToDelete.id);
      }

      toast.success("Berkas portofolio berhasil dihapus.");
      setPortfolioToDelete(null);
      await fetchFreshPortfolios();
      if (onRefresh) {
        await onRefresh();
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Gagal menghapus berkas portofolio.";
      toast.error(msg);
    } finally {
      setIsDeletingPortfolio(false);
    }
  };

  const handlePreview = (item: AlumniPortfolio) => {
    if (item.fileUrl) {
      setPreviewPortfolio(item);
    } else {
      toast.error("Tautan berkas dokumen belum tersedia.");
    }
  };

  return (
    <>
      <Dialog open={modalOpen} onOpenChange={(val) => { if (!val) handleClose(); }}>
        <DialogContent className="max-w-5xl w-full p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-white max-h-[92vh] flex flex-col [&>button]:hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2A1063] via-[#351477] to-[#8B5CF6] text-white p-6 relative select-none shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <DialogTitle className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  E-Portofolio & Berkas Alumni
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-purple-100/90 leading-snug">
                  Lengkapi data Alumni dengan mengunggah portofolio dan dokumen pendukung.
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setShowUpload((prev) => !prev)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold backdrop-blur-md transition-all cursor-pointer border border-white/30 shadow-xs",
                    showUpload
                      ? "bg-white text-purple-950 shadow-sm"
                      : "bg-white/15 text-white hover:bg-white/25"
                  )}
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>{showUpload ? "Tutup Form Upload" : "Upload Dokumen"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full p-1.5 text-white/80 hover:text-white hover:bg-white/20 transition-all outline-none cursor-pointer border-none bg-transparent"
                  aria-label="Tutup Dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-y-auto flex-1">
            {/* Left Column: Form edit profil alumni (lg:col-span-7) */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Informasi Utama Alumni</h3>
                </div>
                {alumni?.isActive !== undefined && (
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                      alumni.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    )}
                  >
                    {alumni.isActive ? "Akun Aktif" : "Non-Aktif"}
                  </span>
                )}
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-3.5 flex-1 flex flex-col justify-between">
                <div className="space-y-3.5">
                  {/* Row 1: NIS * & Nama Lengkap * */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">NIS *</label>
                      <Input
                        {...register("nis")}
                        placeholder="cth. 212200881"
                        className="h-9.5 text-xs rounded-xl"
                      />
                      {errors.nis && (
                        <p className="text-[11px] text-rose-500 font-medium">{errors.nis.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Nama Lengkap *</label>
                      <Input
                        {...register("full_name")}
                        placeholder="cth. Bagas Setiawan"
                        className="h-9.5 text-xs rounded-xl"
                      />
                      {errors.full_name && (
                        <p className="text-[11px] text-rose-500 font-medium">{errors.full_name.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Kelas & Jurusan * & Tahun Lulus * */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Kelas & Jurusan *</label>
                      <SearchableSelect
                        searchable={true}
                        value={currentClassMajorValue}
                        onValueChange={handleClassMajorChange}
                        placeholder="Pilih Kelas atau Jurusan"
                        searchPlaceholder="Cari kelas atau jurusan..."
                        options={classMajorOptions}
                        hasError={Boolean(errors.major_id)}
                      />
                      {errors.major_id && (
                        <p className="text-[11px] text-rose-500 font-medium">{errors.major_id.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Tahun Lulus *</label>
                      <SearchableSelect
                        searchable={false}
                        value={currentGraduationYear}
                        onValueChange={(val) => setValue("graduation_year", val, { shouldValidate: true })}
                        placeholder="Pilih Tahun Kelulusan"
                        options={yearOptions}
                        hasError={Boolean(errors.graduation_year)}
                      />
                      {errors.graduation_year && (
                        <p className="text-[11px] text-rose-500 font-medium">{errors.graduation_year.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Nomor Handphone * & Status Keterserapan * */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Nomor Handphone *</label>
                      <Input
                        {...register("phone")}
                        placeholder="081234567890"
                        className="h-9.5 text-xs rounded-xl"
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-rose-500 font-medium">{errors.phone.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Status Keterserapan *</label>
                      <SearchableSelect
                        searchable={false}
                        value={currentStatusId}
                        onValueChange={(val) => setValue("employment_status_id", val, { shouldValidate: true })}
                        placeholder="Pilih Status Keterserapan"
                        options={statusOptions}
                      />
                      {errors.employment_status_id && (
                        <p className="text-[11px] text-rose-500 font-medium">{errors.employment_status_id.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Tautan Profil (Linkedin/Website) * (full width) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Tautan Profil (Linkedin/Website) *</label>
                    <Input
                      {...register("profile_url")}
                      placeholder="https://linkedin.com/in/... atau tautan website portofolio"
                      className="h-9.5 text-xs rounded-xl"
                    />
                    {errors.profile_url && (
                      <p className="text-[11px] text-rose-500 font-medium">{errors.profile_url.message}</p>
                    )}
                  </div>

                  {/* Row 5: Nama Kampus/PT/Usaha * (full width) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Nama Kampus/PT/Usaha *</label>
                    <Input
                      {...companyManualRest}
                      onChange={handleCompanyManualChange}
                      placeholder="Nama Tempat Kerja / Perusahaan / Kampus"
                      className="h-9.5 text-xs rounded-xl"
                      list="alumni-detail-company-suggestions"
                    />
                    {options.companies && options.companies.length > 0 && (
                      <datalist id="alumni-detail-company-suggestions">
                        {options.companies.map((c) => (
                          <option key={c.id} value={c.name} />
                        ))}
                      </datalist>
                    )}
                    {errors.company_name_manual && (
                      <p className="text-[11px] text-rose-500 font-medium">{errors.company_name_manual.message}</p>
                    )}
                  </div>

                  {/* Collapsible Tracer Study Details */}
                  <details className="group pt-1">
                    <summary className="text-[11px] font-medium text-slate-500 hover:text-slate-800 cursor-pointer select-none list-none flex items-center gap-1.5">
                      <span className="transition-transform group-open:rotate-90">▸</span>
                      <span>Informasi Tambahan Tracer Study (Opsional)</span>
                    </summary>
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-600">Posisi / Jabatan</label>
                        <Input
                          {...register("current_position")}
                          placeholder="cth. Staff IT"
                          className="h-8.5 text-xs rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-600">Gaji Pertama (Rp)</label>
                        <Input
                          type="number"
                          {...register("starting_salary")}
                          placeholder="cth. 4500000"
                          className="h-8.5 text-xs rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-600">Masa Tunggu (Bulan)</label>
                        <Input
                          type="number"
                          {...register("waiting_time_months")}
                          placeholder="cth. 2"
                          className="h-8.5 text-xs rounded-lg"
                        />
                      </div>
                    </div>
                  </details>
                </div>

                {/* Footer: Batal & Simpan Data */}
                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="h-9.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-9.5 px-4.5 rounded-xl bg-[#2A1063] hover:bg-[#351477] text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <span>Simpan Data</span>
                        <Send className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Berkas E-Portofolio (lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col space-y-4 border-t lg:border-t-0 lg:border-l lg:border-slate-100 lg:pl-6 pt-6 lg:pt-0">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Berkas E-Portofolio</h3>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {portfolios.length} Berkas
                  </span>
                </div>
                {!showUpload && (
                  <button
                    type="button"
                    onClick={() => setShowUpload(true)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Upload</span>
                  </button>
                )}
              </div>

              {/* Upload Drawer Form */}
              {showUpload && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Upload className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Unggah Dokumen Portofolio</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUpload(false);
                        resetUploadState();
                      }}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
                      aria-label="Tutup form upload"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Category select */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Kategori Berkas *</label>
                    <SearchableSelect
                      searchable={false}
                      value={uploadCategoryId}
                      onValueChange={(val) => setUploadValue("category_id", val, { shouldValidate: true })}
                      placeholder="Pilih Kategori Dokumen"
                      options={portfolioCategoryOptions}
                      hasError={Boolean(uploadErrors.category_id)}
                    />
                    {uploadErrors.category_id && (
                      <p className="text-[10px] text-rose-500 font-medium">
                        {uploadErrors.category_id.message}
                      </p>
                    )}
                  </div>

                  {/* Title input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Judul Berkas *</label>
                    <Input
                      {...registerUpload("title")}
                      placeholder="cth. CV ATS Friendly / Sertifikat Web"
                      className={cn(
                        "h-9 text-xs rounded-xl bg-white",
                        uploadErrors.title && "border-rose-400 focus-visible:ring-rose-400"
                      )}
                    />
                    {uploadErrors.title && (
                      <p className="text-[10px] text-rose-500 font-medium">
                        {uploadErrors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Description input (optional) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Keterangan (Opsional)</label>
                    <Input
                      {...registerUpload("description")}
                      placeholder="Keterangan singkat berkas..."
                      className="h-8.5 text-xs rounded-xl bg-white"
                    />
                  </div>

                  {/* File picker */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">File Dokumen *</label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-1.5",
                        uploadErrors.file
                          ? "border-rose-300 bg-rose-50/40"
                          : isDragging
                          ? "border-indigo-500 bg-indigo-50/70"
                          : selectedFile
                          ? "border-emerald-300 bg-emerald-50/40"
                          : "border-slate-300 hover:border-indigo-300 bg-white"
                      )}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      {selectedFile ? (
                        <div className="flex items-center justify-between w-full px-1">
                          <div className="flex items-center gap-2 min-w-0 text-left">
                            <FileCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-900 truncate">
                                {selectedFile.name}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {formatFileSize(selectedFile.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadValue("file", undefined as unknown as File, { shouldValidate: true });
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-md cursor-pointer"
                            title="Hapus file"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="h-5 w-5 text-indigo-500" />
                          <div className="text-[11px] font-semibold text-slate-700">
                            Pilih file atau tarik ke sini
                          </div>
                          <p className="text-[10px] text-slate-400">
                            PDF, JPG, PNG, DOC/DOCX (Maks. 10 MB)
                          </p>
                        </>
                      )}
                    </div>
                    {uploadErrors.file && (
                      <p className="text-[10px] text-rose-500 font-medium">{uploadErrors.file.message}</p>
                    )}
                  </div>

                  {/* Submit actions */}
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUpload(false);
                        resetUploadState();
                      }}
                      disabled={uploadIsSubmitting}
                      className="h-8.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleUploadSubmit}
                      disabled={uploadIsSubmitting}
                      className="h-8.5 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {uploadIsSubmitting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Mengunggah...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-3.5 w-3.5" />
                          <span>Unggah Dokumen</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Document Card List */}
              {portfolios.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-2xs">
                    <FolderOpen className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-700">Belum Ada Berkas</h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 max-w-[240px] leading-relaxed">
                      Alumni ini belum memiliki portofolio atau sertifikat yang diunggah ke sistem.
                    </p>
                  </div>
                  {!showUpload && (
                    <button
                      type="button"
                      onClick={() => setShowUpload(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/80 rounded-xl transition-colors cursor-pointer border border-indigo-200"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Unggah Berkas Baru</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {portfolios.map((item) => {
                    const categoryName = item.category?.name || "";
                    const categoryCode = item.category?.code || "";
                    const iconConfig = getCategoryIconConfig(categoryName, categoryCode, item.title);
                    const IconComp = iconConfig.icon;
                    const fileName = item.filePath ? item.filePath.split("/").pop() || "Dokumen" : "Dokumen";

                    return (
                      <div
                        key={item.id}
                        className="group p-3 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-200 hover:shadow-xs transition-all flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={cn("p-2.5 rounded-xl shrink-0", iconConfig.iconBg)}>
                            <IconComp className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {item.title || categoryName || "Dokumen Alumni"}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                              <span
                                className={cn(
                                  "px-1.5 py-0.2 rounded text-[10px] font-semibold border",
                                  iconConfig.badgeBg
                                )}
                              >
                                {categoryName || iconConfig.typeLabel}
                              </span>
                              <span className="truncate max-w-[130px] text-slate-400">
                                • {fileName}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handlePreview(item)}
                            title="Lihat Dokumen"
                            className="h-8 w-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPortfolioToDelete(item)}
                            title="Hapus Dokumen"
                            className="h-8 w-8 rounded-lg border border-rose-100 bg-rose-50/60 text-rose-600 hover:bg-rose-100 hover:text-rose-700 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog
        open={Boolean(portfolioToDelete)}
        onOpenChange={(openVal) => {
          if (!openVal) setPortfolioToDelete(null);
        }}
      >
        <AlertDialogContent className="rounded-3xl p-6 sm:p-7 border-none shadow-xl bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg text-slate-900">
              Hapus Berkas Portofolio
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
              Apakah Anda yakin ingin menghapus berkas{" "}
              <strong className="text-slate-900 font-semibold">
                {portfolioToDelete?.title || portfolioToDelete?.category?.name || "dokumen ini"}
              </strong>
              ? Berkas yang dihapus tidak dapat dipulihkan kembali.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-5 border-none bg-transparent p-0 flex-row justify-end gap-2.5">
            <AlertDialogCancel
              disabled={isDeletingPortfolio}
              className="h-10 rounded-xl px-5 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeletePortfolio}
              disabled={isDeletingPortfolio}
              className="h-10 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl px-5 cursor-pointer shadow-sm"
            >
              {isDeletingPortfolio ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  <span>Menghapus...</span>
                </>
              ) : (
                "Ya, Hapus Berkas"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Document Preview Lightbox / Modal */}
      {previewPortfolio && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setPreviewPortfolio(null)}
        >
          <div
            className="relative w-full max-w-4xl h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div className="min-w-0 pr-4">
                <h3 className="text-base font-bold text-white truncate">
                  {previewPortfolio.title || previewPortfolio.category?.name || "Preview Dokumen"}
                </h3>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {previewPortfolio.filePath?.split("/").pop() || previewPortfolio.category?.name || "Berkas"}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {previewPortfolio.fileUrl && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium cursor-pointer"
                    >
                      <a
                        href={previewPortfolio.fileUrl}
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
                      className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium cursor-pointer"
                    >
                      <a
                        href={previewPortfolio.fileUrl}
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
                  onClick={() => setPreviewPortfolio(null)}
                  className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 p-2 overflow-hidden flex items-center justify-center">
              {previewPortfolio.fileUrl ? (
                previewPortfolio.fileUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                  <img
                    src={previewPortfolio.fileUrl}
                    alt={previewPortfolio.title}
                    className="max-h-full max-w-full object-contain rounded-xl"
                  />
                ) : (
                  <iframe
                    src={`${previewPortfolio.fileUrl}#toolbar=0`}
                    title={previewPortfolio.title}
                    className="w-full h-full rounded-2xl border border-slate-200 bg-white"
                  />
                )
              ) : (
                <div className="text-center text-slate-500 text-sm">
                  URL berkas tidak tersedia.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const AlumniDetail = AlumniDetailModal;
