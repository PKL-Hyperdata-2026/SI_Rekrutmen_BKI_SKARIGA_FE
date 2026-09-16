import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import { User, Lock, Plus, Globe, Trash2, RotateCcw, Save, Loader2 } from "lucide-react";
import { SectionCard } from "@/components/custom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const majorDisplay = useMemo(
    () =>
      profileData?.major?.name ||
      options?.majors?.find((m) => m.id === profileData?.majorId)?.name ||
      "-",
    [profileData?.major, profileData?.majorId, options?.majors]
  );

  const classDisplay = useMemo(
    () =>
      profileData?.class?.name ||
      options?.classes?.find((c) => c.id === profileData?.classId)?.name ||
      "-",
    [profileData?.class, profileData?.classId, options?.classes]
  );

  const graduationYearDisplay = useMemo(
    () =>
      profileData?.graduationYear ? String(profileData.graduationYear) : "-",
    [profileData?.graduationYear]
  );

  const departmentDisplay = useMemo(
    () =>
      profileData?.department?.name ||
      (profileData?.major as { department?: { name?: string } } | null)?.department?.name ||
      "-",
    [profileData?.department, profileData?.major]
  );

  return (
    <SectionCard
      className="rounded-xl p-4 sm:p-5 shadow-xs border border-slate-100/90 flex-1 flex flex-col"
      headerClassName="pb-3 sm:pb-3.5 border-b border-slate-100 mb-4 sm:mb-5"
      title={
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
            Data Diri & Akademik Pelamar
          </h2>
        </div>
      }
      action={
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200/80 select-none">
          <Lock className="h-3 w-3 text-slate-400" />
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
          className="space-y-4 sm:space-y-5 flex-1 flex flex-col justify-between"
        >
          <div className="space-y-3.5 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4.5">
              <div>
                <Label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  STATUS
                </Label>
                <Input
                  type="text"
                  readOnly
                  value={roleDisplay}
                  className="h-9 text-xs bg-slate-100/70 text-slate-700 font-medium focus-visible:ring-0 focus-visible:border-input select-text"
                />
              </div>

              <div>
                <Label className="block text-xs font-bold text-slate-500 tracking-wider mb-1.5">
                  Nama Lengkap
                </Label>
                <Input
                  type="text"
                  readOnly
                  value={profileData?.fullName || ""}
                  className="h-9 text-xs bg-slate-100/70 text-slate-700 font-medium focus-visible:ring-0 focus-visible:border-input select-text"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4.5">
              <div>
                <Label className="block text-xs font-bold text-slate-500 tracking-wider mb-1.5">
                  NIS/NISN
                </Label>
                <Input
                  type="text"
                  readOnly
                  value={profileData?.nis || "-"}
                  className="h-9 text-xs bg-slate-100/70 text-slate-700 font-medium focus-visible:ring-0 focus-visible:border-input select-text"
                />
              </div>

              <div>
                <Label className="block text-xs font-bold text-slate-500 tracking-wider mb-1.5">
                  Tahun Lulus
                </Label>
                <Input
                  type="text"
                  readOnly
                  value={graduationYearDisplay}
                  className="h-9 text-xs bg-slate-100/70 text-slate-700 font-medium focus-visible:ring-0 focus-visible:border-input select-text"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4.5">
              <div>
                <Label className="block text-xs font-bold text-slate-500 tracking-wider mb-1.5">
                  Departemen
                </Label>
                <Input
                  type="text"
                  readOnly
                  value={departmentDisplay}
                  className="h-9 text-xs bg-slate-100/70 text-slate-700 font-medium focus-visible:ring-0 focus-visible:border-input select-text"
                />
              </div>

              <div>
                <Label className="block text-xs font-bold text-slate-500 tracking-wider mb-1.5">
                  Jurusan
                </Label>
                <Input
                  type="text"
                  readOnly
                  value={majorDisplay}
                  className="h-9 text-xs bg-slate-100/70 text-slate-700 font-medium focus-visible:ring-0 focus-visible:border-input select-text"
                />
              </div>

              <div>
                <Label className="block text-xs font-bold text-slate-500 tracking-wider mb-1.5">
                  Kelas
                </Label>
                <Input
                  type="text"
                  readOnly
                  value={classDisplay}
                  className="h-9 text-xs bg-slate-100/70 text-slate-700 font-medium focus-visible:ring-0 focus-visible:border-input select-text"
                />
              </div>
            </div>

            <div>
              <Label className="block text-xs font-bold text-slate-500 tracking-wider mb-1.5">
                Email
              </Label>
              <Input
                type="email"
                readOnly
                value={profileData?.email || ""}
                className="h-9 text-xs bg-slate-100/70 text-slate-700 font-medium focus-visible:ring-0 focus-visible:border-input select-text"
              />
            </div>

            <div>
              <Label className="block text-xs font-bold text-slate-800 tracking-wider mb-1.5">
                No . WhatsApp Aktif <span className="text-rose-500">*</span>
              </Label>
              <Input
                type="text"
                {...register("phone")}
                placeholder="e.g +62 123-4567-890"
                className="h-9 text-xs bg-white text-slate-800 focus-visible:border-primary"
              />
              {errors.phone && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="pt-3.5 sm:pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-700">
                    Media Sosial (Opsional)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tautkan akun LinkedIn, GitHub, Instagram, TikTok, Portofolio/CV, dll.
                  </p>
                </div>
                {socialMediaList.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={onOpenAddSocialModal}
                    className="h-7 px-2.5 border-slate-200 hover:border-primary hover:bg-primary/5 text-slate-700 hover:text-primary cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Tambah</span>
                  </Button>
                )}
              </div>

              {socialMediaList.length === 0 ? (
                <div
                  onClick={onOpenAddSocialModal}
                  className="p-3.5 rounded-xl border border-dashed border-slate-200 hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-xs text-slate-400 cursor-pointer select-none"
                >
                  <Plus className="h-3.5 w-3.5 text-slate-400" />
                  <span>Belum ada media sosial ditambahkan. Klik untuk menambah.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {socialMediaList.map((item) => {
                    const config =
                      MONOCHROME_PLATFORMS.find(
                        (p) => p.id === item.platform.toLowerCase()
                      ) || {
                        name: item.platform,
                        icon: <Globe className="h-4 w-4 text-slate-900 stroke-current" />,
                        baseUrl: "",
                      };

                    const targetUrl = item.url
                      ? item.url.startsWith("http://") || item.url.startsWith("https://")
                        ? item.url
                        : `https://${item.url}`
                      : config.baseUrl
                      ? `${config.baseUrl}${item.username.replace(/^@/, "")}`
                      : item.username.startsWith("http://") || item.username.startsWith("https://")
                      ? item.username
                      : `https://${item.username}`;

                    return (
                      <div
                        key={item.platform}
                        className="group relative p-2.5 rounded-xl border border-slate-100 bg-white hover:border-slate-300 hover:shadow-2xs transition-all flex items-center justify-between gap-2.5"
                      >
                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Buka tautan ${config.name} (${targetUrl})`}
                          className="absolute inset-0 rounded-xl"
                        />
                        <div className="flex items-center gap-2.5 min-w-0 flex-1 pointer-events-none">
                          <div className="h-7 w-7 rounded-full bg-slate-100 group-hover:bg-slate-200/80 flex items-center justify-center shrink-0 transition-colors">
                            {config.icon}
                          </div>
                          <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              {config.name}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors truncate">
                              {item.username}
                            </span>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onRemoveSocialMedia(item.platform);
                          }}
                          title="Hapus Media Sosial"
                          className="relative z-10 text-slate-400 hover:text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-2 sm:mt-3 flex items-center justify-end gap-2.5 border-t border-slate-100/60">
            <Button
              type="button"
              variant="secondary"
              onClick={onReset}
              disabled={!isFormChanged || isSaving}
              className="h-9 px-3.5 text-xs font-semibold border-none bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>

            <Button
              type="submit"
              disabled={!isFormChanged || isSaving}
              className="h-9 px-4 sm:px-5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
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
