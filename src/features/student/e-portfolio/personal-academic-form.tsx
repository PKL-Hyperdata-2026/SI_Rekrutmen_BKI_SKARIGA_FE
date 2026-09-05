import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import { User, Lock, Plus, Globe, ExternalLink, Trash2, RotateCcw, Save, Loader2 } from "lucide-react";
import { SectionCard } from "@/components/custom";
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
import type {
  StudentProfileData,
  PortfolioFormOptions,
  StudentProfileSchemaType,
  SocialMediaItem,
} from "./portfolio.schema";
import { MONOCHROME_PLATFORMS } from "./add-social-media-modal";

interface PersonalAcademicFormProps {
  form: UseFormReturn<StudentProfileSchemaType>;
  profileData: StudentProfileData | null;
  options: PortfolioFormOptions | null;
  isLoading: boolean;
  isSaving: boolean;
  isFormChanged: boolean;
  socialMediaList: SocialMediaItem[];
  onOpenAddSocialModal: () => void;
  onRemoveSocialMedia: (platform: string) => void;
  onReset: () => void;
  onSubmit: (data: StudentProfileSchemaType) => Promise<void>;
}

export function PersonalAcademicForm({
  form,
  profileData,
  options,
  isLoading,
  isSaving,
  isFormChanged,
  socialMediaList,
  onOpenAddSocialModal,
  onRemoveSocialMedia,
  onReset,
  onSubmit,
}: PersonalAcademicFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const roleDisplay = useMemo(
    () => profileData?.role?.toUpperCase() || "SISWA",
    [profileData?.role]
  );

  return (
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-2.5 flex-1 flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div>
                <Label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  STATUS
                </Label>
                <Select disabled value={roleDisplay}>
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
                  value={
                    profileData?.graduationYear
                      ? String(profileData.graduationYear)
                      : "default"
                  }
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
                    onClick={onOpenAddSocialModal}
                    className="border-slate-200 hover:border-primary hover:bg-primary/5 text-slate-700 hover:text-primary cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Tambah</span>
                  </Button>
                )}
              </div>

              {socialMediaList.length === 0 ? (
                <div
                  onClick={onOpenAddSocialModal}
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
                            onClick={() => onRemoveSocialMedia(item.platform)}
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

          <div className="pt-3 mt-1 flex items-center justify-end gap-2 border-t border-slate-100/60">
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
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
  );
}
