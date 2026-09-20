import * as React from "react";
import { Controller } from "react-hook-form";
import { Send, BadgeCheck, Loader2, X } from "lucide-react";
import { Modal } from "@/components/custom/modal";
import { Form } from "@/components/ui/form";
import { Field, FieldGroup, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchableSelect } from "@/components/custom/searchable-select";
import { DatePicker } from "@/components/custom/date-picker";
import { cn } from "@/lib/utils";
import type { useLowonganForm } from "./lowongan.form";
import { loadLowonganDraft } from "./lowongan.form";
import type {
  HrdJobVacancyOptions,
} from "./lowongan.schema";

export interface LowonganFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formState: ReturnType<typeof useLowonganForm>;
  options: HrdJobVacancyOptions;
  isLoadingOptions?: boolean;
}

function RequiredBadge() {
  return (
    <Badge
      variant="outline"
      aria-hidden="true"
      className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm font-bold"
    >
      *
    </Badge>
  );
}

function CharCounter({ length, max }: { length: number; max: number }) {
  return (
    <span className="text-[10px] text-slate-400 font-medium tabular-nums">
      {length}/{max}
    </span>
  );
}

export function LowonganForm({
  open,
  onOpenChange,
  formState,
  options,
  isLoadingOptions = false,
}: LowonganFormProps) {
  const {
    form,
    isSubmitting,
    isEditMode,
    isCloseConfirmOpen,
    handleSafeClose,
    confirmClose,
    cancelClose,
    onSubmit,
  } = formState;

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const watchedTitle = watch("title") ?? "";
  const watchedPosition = watch("position") ?? "";
  const watchedWorkLocation = watch("work_location") ?? "";
  const watchedDeadline = watch("deadline") ?? "";

  // A stored draft is always restored on open, so its presence here means
  // the note below applies. Recomputed only on open/mode change.
  const hasRestoredDraft = React.useMemo(
    () => !isEditMode && open && loadLowonganDraft() !== null,
    [isEditMode, open]
  );

  const majorOptions = React.useMemo(() => {
    return (options.majors || []).map((m) => ({
      value: String(m.id),
      label: `${m.name} (${m.code})`,
    }));
  }, [options.majors]);

  const targetOptions = React.useMemo(() => {
    return (options.targetApplicants || []).map((t) => ({
      value: String(t.id),
      label: t.name,
    }));
  }, [options.targetApplicants]);

  const jobTypeOptions = React.useMemo(() => {
    return (options.jobTypes || []).map((jt) => ({
      value: String(jt.id),
      label: jt.name,
    }));
  }, [options.jobTypes]);

  return (
    <>
    <Modal
      open={open}
      onOpenChange={(isOpen) => (!isOpen ? handleSafeClose() : onOpenChange(isOpen))}
      variant="hrd"
      headerStyle="gradient"
      size="lg"
      title={isEditMode ? "Edit Lowongan Kerja" : "Form Publikasi Lowongan Kerja"}
      description={
        isEditMode
          ? "Perbarui informasi dan kualifikasi lowongan kerja."
          : "Lengkapi informasi posisi secara lengkap untuk diterbitkan kepada siswa dan alumni."
      }
      footer={null}
      className="w-[95vw] sm:max-w-160 max-h-[92vh] rounded-lg overflow-hidden"
    >
      <Form onSubmit={onSubmit} className="space-y-4 pt-1">
        {!isEditMode && hasRestoredDraft && (
          <p className="text-[11px] text-purple-700 bg-purple-50 border border-purple-200/70 rounded-lg px-3 py-2 font-medium">
            Draf terakhir dipulihkan otomatis. Draf terhapus setelah lowongan
            tersimpan.
          </p>
        )}
        {/* Section 1: Informasi Posisi */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8D1D96]">
              1. Informasi Posisi
            </span>
          </div>

          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="position"
                  className="text-xs font-semibold text-[#1e1b4b] flex items-center gap-1"
                >
                  Posisi Pekerjaan
                  <RequiredBadge />
                </Label>
                <CharCounter length={watchedPosition.length} max={255} />
              </div>
              <Input
                id="position"
                {...register("position")}
                placeholder="cth. Staff Administrasi / Operator Assembly"
                maxLength={255}
                aria-required="true"
                aria-invalid={Boolean(errors.position)}
                aria-describedby={errors.position ? "position-error" : undefined}
                className={cn(
                  "h-10 w-full rounded-lg border bg-[#F8F9FD] px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all",
                  errors.position
                    ? "border-red-500 bg-red-50/20"
                    : "border-slate-200"
                )}
              />
              {errors.position && (
                <FieldError id="position-error" className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.position.message}
                </FieldError>
              )}
            </Field>

            <Field className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="title"
                  className="text-xs font-semibold text-[#1e1b4b] flex items-center gap-1"
                >
                  Judul Publikasi
                  <RequiredBadge />
                </Label>
                <CharCounter length={watchedTitle.length} max={255} />
              </div>
              <Input
                id="title"
                {...register("title")}
                placeholder="cth. Rekrutmen Operator Produksi 2026"
                maxLength={255}
                aria-required="true"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "title-error" : undefined}
                className={cn(
                  "h-10 w-full rounded-lg border bg-[#F8F9FD] px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all",
                  errors.title
                    ? "border-red-500 bg-red-50/20"
                    : "border-slate-200"
                )}
              />
              {errors.title && (
                <FieldError id="title-error" className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.title.message}
                </FieldError>
              )}
            </Field>
          </FieldGroup>

          <Field className="flex flex-col gap-1.5 sm:col-span-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="job_type_id"
                className="text-xs font-semibold text-[#1e1b4b]"
              >
                Tipe Pekerjaan
              </Label>
              <span className="text-[10px] text-slate-400 font-medium">
                Opsional
              </span>
            </div>
            <Controller
              name="job_type_id"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  id="job_type_id"
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  options={jobTypeOptions}
                  placeholder="Pilih Tipe Pekerjaan"
                  searchPlaceholder="Cari tipe pekerjaan..."
                  emptyMessage="Tipe pekerjaan tidak ditemukan"
                  variant="hrd"
                  isLoading={isLoadingOptions}
                  hasError={Boolean(errors.job_type_id)}
                  className="h-10 rounded-lg border-slate-200 bg-[#F8F9FD] text-xs sm:text-sm text-slate-800 focus:bg-white"
                />
              )}
            />
            {errors.job_type_id && (
              <FieldError id="job_type_id-error" className="text-[11px] font-medium text-red-500 ml-0.5">
                {errors.job_type_id.message}
              </FieldError>
            )}
          </Field>
        </div>

        {/* Section 2: Sasaran Jurusan & Kuota */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8D1D96]">
              2. Sasaran Jurusan & Kuota
            </span>
          </div>

          {/* Target Jurusan (Multi-select with chips) */}
          <Field className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="major_ids"
                className="text-xs font-semibold text-[#1e1b4b] flex items-center gap-1"
              >
                Target Jurusan
                <RequiredBadge />
              </Label>
              <span className="text-[10px] text-slate-400 font-medium">
                Bisa multi-jurusan
              </span>
            </div>
            <Controller
              name="major_ids"
              control={control}
              render={({ field }) => {
                const selectedList = field.value || [];
                const availableOptions = majorOptions.filter(
                  (opt) => !selectedList.includes(opt.value)
                );

                return (
                  <div className="space-y-2">
                    <SearchableSelect
                      id="major_ids"
                      value=""
                      onValueChange={(val) => {
                        if (val && !selectedList.includes(val)) {
                          field.onChange([...selectedList, val]);
                        }
                      }}
                      options={availableOptions}
                      placeholder={
                        selectedList.length > 0
                          ? "+ Tambah Jurusan Lain..."
                          : "Pilih Target Jurusan"
                      }
                      searchPlaceholder="Cari nama atau kode jurusan..."
                      emptyMessage="Semua jurusan telah dipilih"
                      searchable
                      variant="hrd"
                      isLoading={isLoadingOptions}
                      hasError={Boolean(errors.major_ids)}
                      className="h-10 rounded-lg border-slate-200 bg-[#F8F9FD] text-xs sm:text-sm text-slate-800 focus:bg-white"
                    />

                    {selectedList.length > 0 && (
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[10px] text-slate-500 font-medium">
                          {selectedList.length} jurusan dipilih
                        </span>
                        <button
                          type="button"
                          onClick={() => field.onChange([])}
                          className="text-[10px] font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                        >
                          Hapus semua
                        </button>
                      </div>
                    )}

                    {selectedList.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        {selectedList.map((id) => {
                          const major = (options?.majors || []).find(
                            (m) => String(m.id) === String(id)
                          );
                          const displayLabel = major
                            ? `${major.name} (${major.code})`
                            : `Jurusan #${id}`;
                          const ariaLabel = major
                            ? `Hapus jurusan ${major.code}`
                            : `Hapus jurusan #${id}`;

                          return (
                            <span
                              key={id}
                              className="inline-flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-lg bg-purple-50 text-[#7A1384] border border-purple-200/80 text-xs font-semibold"
                            >
                              <span>{displayLabel}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  field.onChange(
                                    selectedList.filter((item) => item !== id)
                                  )
                                }
                                aria-label={ariaLabel}
                                className="inline-flex items-center justify-center min-w-8 min-h-8 w-8 h-8 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-100/60 focus-visible:ring-2 focus-visible:ring-purple-500 outline-none transition-colors cursor-pointer"
                              >
                                <X className="h-4 w-4 stroke-[2.2]" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }}
            />
            {errors.major_ids && (
              <FieldError id="major_ids-error" className="text-[11px] font-medium text-red-500 ml-0.5">
                {errors.major_ids.message}
              </FieldError>
            )}
          </Field>

          {/* Target Pelamar, Kuota, Batas Pendaftaran */}
          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field className="flex flex-col gap-1.5 sm:col-span-2">
              <Label
                htmlFor="target_applicant_id"
                className="text-xs font-semibold text-[#1e1b4b] flex items-center gap-1"
              >
                Target Pelamar
                <RequiredBadge />
              </Label>
              <Controller
                name="target_applicant_id"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    id="target_applicant_id"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={targetOptions}
                    placeholder="Pilih Target"
                    searchPlaceholder="Cari target..."
                    emptyMessage="Target tidak ditemukan"
                    variant="hrd"
                    isLoading={isLoadingOptions}
                    hasError={Boolean(errors.target_applicant_id)}
                    className="h-10 rounded-lg border-slate-200 bg-[#F8F9FD] text-xs sm:text-sm text-slate-800 focus:bg-white"
                  />
                )}
              />
              {errors.target_applicant_id && (
                <FieldError id="target_applicant_id-error" className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.target_applicant_id.message}
                </FieldError>
              )}
            </Field>

            <Field className="flex flex-col gap-1.5">
              <Label
                htmlFor="quota"
                className="text-xs font-semibold text-[#1e1b4b] flex items-center gap-1"
              >
                Kuota
                <RequiredBadge />
              </Label>
              <Input
                id="quota"
                type="text"
                inputMode="numeric"
                maxLength={4}
                {...register("quota", {
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  },
                })}
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(e.key) &&
                    !e.ctrlKey &&
                    !e.metaKey
                  ) {
                    e.preventDefault();
                  }
                }}
                placeholder="cth. 25"
                aria-required="true"
                aria-invalid={Boolean(errors.quota)}
                aria-describedby={errors.quota ? "quota-error" : undefined}
                className={cn(
                  "h-10 w-full rounded-lg border bg-[#F8F9FD] px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all",
                  errors.quota
                    ? "border-red-500 bg-red-50/20"
                    : "border-slate-200"
                )}
              />
              {errors.quota && (
                <FieldError id="quota-error" className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.quota.message}
                </FieldError>
              )}
            </Field>

            <Field className="flex flex-col gap-1.5">
              <Label
                htmlFor="deadline"
                className="text-xs font-semibold text-[#1e1b4b] flex items-center gap-1"
              >
                Batas Pendaftaran
                <RequiredBadge />
              </Label>
              <Controller
                name="deadline"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="deadline"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pilih Tanggal"
                    variant="hrd"
                    hasError={Boolean(errors.deadline)}
                    className="h-10 rounded-lg border-slate-200 bg-[#F8F9FD] px-3.5 text-xs sm:text-sm"
                  />
                )}
              />
              {errors.deadline && (
                <FieldError id="deadline-error" className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.deadline.message}
                </FieldError>
              )}
            </Field>
          </FieldGroup>
        </div>

        {/* Section 3: Penempatan & Kualifikasi */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8D1D96]">
              3. Penempatan & Kualifikasi
            </span>
          </div>

          <Field className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="work_location"
                className="text-xs font-semibold text-[#1e1b4b] flex items-center gap-1"
              >
                Lokasi Kerja
                <RequiredBadge />
              </Label>
              <CharCounter length={watchedWorkLocation.length} max={255} />
            </div>
            <Input
              id="work_location"
              {...register("work_location")}
              placeholder="cth. Surabaya, Jawa Timur"
              maxLength={255}
              aria-required="true"
              aria-invalid={Boolean(errors.work_location)}
              aria-describedby={errors.work_location ? "work_location-error" : undefined}
              className={cn(
                "h-10 w-full rounded-lg border bg-[#F8F9FD] px-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all",
                errors.work_location
                  ? "border-red-500 bg-red-50/20"
                  : "border-slate-200"
              )}
            />
            {errors.work_location && (
              <FieldError id="work_location-error" className="text-[11px] font-medium text-red-500 ml-0.5">
                {errors.work_location.message}
              </FieldError>
            )}
          </Field>

          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field className="flex flex-col gap-1.5">
              <Label
                htmlFor="qualification"
                className="text-xs font-semibold text-[#1e1b4b] flex items-center gap-1"
              >
                Kualifikasi Lengkap
                <RequiredBadge />
              </Label>
              <Textarea
                id="qualification"
                rows={3}
                {...register("qualification")}
                placeholder="Tuliskan persyaratan lengkap posisi ini..."
                aria-invalid={Boolean(errors.qualification)}
                aria-describedby={errors.qualification ? "qualification-error" : undefined}
                className={cn(
                  "min-h-20 max-h-36 w-full rounded-lg border bg-[#F8F9FD] p-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all resize-y custom-scrollbar",
                  errors.qualification
                    ? "border-red-500 bg-red-50/20"
                    : "border-slate-200"
                )}
              />
              {errors.qualification && (
                <FieldError id="qualification-error" className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.qualification.message}
                </FieldError>
              )}
            </Field>

            <Field className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="description"
                  className="text-xs font-semibold text-[#1e1b4b]"
                >
                  Deskripsi Tugas
                </Label>
                <span className="text-[10px] text-slate-400 font-medium">
                  Opsional
                </span>
              </div>
              <Textarea
                id="description"
                rows={3}
                {...register("description")}
                placeholder="Jelaskan ringkasan tugas dan tanggung jawab posisi ini..."
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? "description-error" : undefined}
                className={cn(
                  "min-h-20 max-h-36 w-full rounded-lg border bg-[#F8F9FD] p-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all resize-y custom-scrollbar",
                  errors.description
                    ? "border-red-500 bg-red-50/20"
                    : "border-slate-200"
                )}
              />
              {errors.description && (
                <FieldError id="description-error" className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.description.message}
                </FieldError>
              )}
            </Field>
          </FieldGroup>

          {/* Checkbox Notifikasi Otomatis */}
          <Controller
            name="send_notification"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2.5 pt-1 select-none">
                <Checkbox
                  id="send_notification"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-[#8D1D96] data-[state=checked]:border-[#8D1D96] rounded-md cursor-pointer"
                />
                <Label
                  htmlFor="send_notification"
                  className="text-xs font-normal text-slate-600 cursor-pointer font-sans"
                >
                  {isEditMode
                    ? "Kirim notifikasi pembaruan ke target siswa/alumni"
                    : "Kirim notifikasi otomatis ke target siswa/alumni"}
                </Label>
              </div>
            )}
          />
        </div>

        {/* Preview Katalog Siswa */}
        <div className="rounded-xl border border-slate-200 bg-[#F8F9FD] p-3.5 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Pratinjau katalog siswa
          </p>
          <p className="text-sm font-bold text-slate-900 leading-snug">
            {watchedTitle || watchedPosition || "Judul lowongan"}
          </p>
          <p className="text-xs text-slate-500">
            {watchedPosition ? `Posisi: ${watchedPosition}` : "Posisi: -"}
            {watchedWorkLocation ? ` • Lokasi: ${watchedWorkLocation}` : ""}
            {watchedDeadline ? ` • Batas: ${watchedDeadline}` : ""}
          </p>
        </div>

        {/* Sticky Footer */}
        <div className="sticky -bottom-4 bg-white/95 backdrop-blur-xs pt-3 pb-2 -mx-6 px-6 border-t border-slate-100 flex items-center justify-end gap-3 z-10 mt-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleSafeClose}
            disabled={isSubmitting}
            className="h-9.5 px-6 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-xs cursor-pointer justify-center"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-9.5 px-7 rounded-lg bg-linear-to-r from-[#3D0040] via-[#5A0C62] to-[#D46AD8] hover:opacity-95 text-white font-semibold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <span>{isEditMode ? "Simpan Perubahan" : "Publikasikan Lowongan"}</span>
                {isEditMode ? (
                  <BadgeCheck className="size-4" />
                ) : (
                  <Send className="size-4" />
                )}
              </>
            )}
          </Button>
        </div>
      </Form>
    </Modal>

      {/* Confirm Close Modal */}
      <Modal
        open={isCloseConfirmOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) cancelClose();
        }}
        title="Tutup Formulir?"
        description="Perubahan yang belum disimpan akan hilang dari layar ini."
        variant="hrd"
        headerStyle="white"
        size="sm"
        confirmText="Ya, Tutup"
        cancelText="Tetap di Form"
        onConfirm={confirmClose}
        onCancel={cancelClose}
      >
        <p className="text-xs sm:text-sm text-slate-600">
          Draf tersimpan otomatis di perangkat ini dan dipulihkan saat
          formulir dibuka kembali.
        </p>
      </Modal>
    </>
  );
}

export default LowonganForm;
