import { Controller } from "react-hook-form";
import { PageHeader, RichTextEditor } from "@/components/custom";
import { Field, FieldGroup, FieldError } from "@/components/ui/field";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LowonganKerjaFormSkeleton } from "./lowongan-kerja-form-skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/custom/date-picker";
import { AsyncSearchableSelect } from "@/components/custom/async-searchable-select";
import { ChevronLeft, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLowonganKerjaFormPage } from "./lowongan-kerja.form";

export function LowonganKerjaForm() {
  const {
    isEditMode,
    isLoadingData,
    isLoadingOptions,
    errorMsg,
    register,
    setValue,
    companyId,
    deadline,
    majorId,
    targetId,
    sendNotification,
    companyFallbackLabel,
    setCompanyFallbackLabel,
    majors,
    targetApplicants,
    errors,
    control,
    isSubmitting,
    onFormSubmit,
    handleBack,
    getCompanies,
  } = useLowonganKerjaFormPage();

  return (
    <CardContent className="flex flex-col gap-5 sm:gap-6 min-w-0 max-w-full overflow-hidden theme-admin p-0">
      <PageHeader
        variant="admin"
        title={isEditMode ? "Edit Lowongan Kerja" : "Tambah Lowongan Kerja"}
        description={
          isEditMode
            ? "Perbarui informasi dan kualifikasi lowongan kerja mitra."
            : "Tambahkan data pembukaan lowongan pekerjaan baru dari perusahaan mitra."
        }
      >
        <CardContent className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 p-0">
          <PageHeader.Button
            variant="glass"
            icon={<ChevronLeft className="h-4 w-4" />}
            onClick={handleBack}
            className="w-full sm:w-auto justify-center rounded-xl"
          >
            Kembali
          </PageHeader.Button>
          <PageHeader.Button
            variant="dark"
            icon={
              isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )
            }
            onClick={onFormSubmit}
            disabled={isSubmitting || isLoadingData}
            className="w-full sm:w-auto justify-center"
          >
            {isSubmitting
              ? "Menyimpan..."
              : isEditMode
                ? "Perbarui Lowongan"
                : "Simpan Lowongan"}
          </PageHeader.Button>
        </CardContent>
      </PageHeader>

      {isLoadingData ? (
        <LowonganKerjaFormSkeleton />
      ) : (
        <Form
          onSubmit={onFormSubmit}
          className="space-y-5 sm:space-y-6 min-w-0 max-w-full"
        >
          {errorMsg && (
            <CardContent className="rounded-lg bg-red-500/10 p-2.5 text-xs font-medium text-red-600 border border-red-500/20">
              {errorMsg}
            </CardContent>
          )}

          <CardContent className="bg-white rounded-xl border border-slate-200 shadow-xs px-5 sm:px-6 py-5 sm:py-6 min-w-0 max-w-full space-y-2.5">
            <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field className="flex flex-col gap-1">
                <Label className="text-xs text-slate-700 flex items-center gap-1 h-5">
                  Nama Perusahaan Mitra
                  <Badge
                    variant="outline"
                    className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
                  >
                    *
                  </Badge>
                </Label>
                <AsyncSearchableSelect
                  value={companyId}
                  onValueChange={(val) =>
                    setValue("companyId", val, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  onOptionSelect={(item) => setCompanyFallbackLabel(item.label)}
                  placeholder="Pilih Perusahaan"
                  searchPlaceholder="Cari nama perusahaan..."
                  emptyMessage="Perusahaan tidak ditemukan"
                  fetchPage={getCompanies}
                  fallbackLabel={companyFallbackLabel}
                  hasError={Boolean(errors.companyId)}
                />
                {errors.companyId && (
                  <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                    {errors.companyId.message}
                  </FieldError>
                )}
              </Field>

              <Field className="flex flex-col gap-1">
                <Label className="text-xs text-slate-700 flex items-center gap-1 h-5">
                  Posisi Pekerjaan
                  <Badge
                    variant="outline"
                    className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
                  >
                    *
                  </Badge>
                </Label>
                <Input
                  {...register("position")}
                  placeholder="cth. Customer Service"
                  className={cn(
                    "h-10 w-full rounded-lg border bg-slate-50 px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all",
                    errors.position
                      ? "border-red-500 bg-red-50/20"
                      : "border-slate-200",
                  )}
                />
                {errors.position && (
                  <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                    {errors.position.message}
                  </FieldError>
                )}
              </Field>
            </FieldGroup>

            <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field className="flex flex-col gap-1">
                <Label className="text-xs text-slate-700 flex items-center gap-1 h-5">
                  Kuota
                  <Badge
                    variant="outline"
                    className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
                  >
                    *
                  </Badge>
                </Label>
                <Input
                  {...register("quota")}
                  placeholder="cth. 30 Orang"
                  className={cn(
                    "h-10 w-full rounded-lg border bg-slate-50 px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all",
                    errors.quota
                      ? "border-red-500 bg-red-50/20"
                      : "border-slate-200",
                  )}
                />
                {errors.quota && (
                  <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                    {errors.quota.message}
                  </FieldError>
                )}
              </Field>

              <Field className="flex flex-col gap-1">
                <Label className="text-xs text-slate-700 flex items-center gap-1 h-5">
                  Batas Pendaftaran
                  <Badge
                    variant="outline"
                    className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
                  >
                    *
                  </Badge>
                </Label>
                <DatePicker
                  value={deadline}
                  onChange={(val) =>
                    setValue("deadline", val, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  hasError={Boolean(errors.deadline)}
                />
                {errors.deadline && (
                  <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                    {errors.deadline.message}
                  </FieldError>
                )}
              </Field>
            </FieldGroup>

            <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field className="flex flex-col gap-1">
                <Label className="text-xs text-slate-700 flex items-center gap-1 h-5">
                  Jurusan
                </Label>
                <Select
                  value={majorId || "all"}
                  onValueChange={(val) =>
                    setValue("majorId", val, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger
                    isLoading={isLoadingOptions}
                    className={cn(
                      "h-10 w-full rounded-lg border bg-slate-50 px-3.5 text-sm text-slate-800 data-placeholder:text-slate-700 hover:bg-white focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer",
                      errors.majorId
                        ? "border-red-500 bg-red-50/20"
                        : "border-slate-200",
                    )}
                  >
                    <SelectValue placeholder="Semua Jurusan" />
                  </SelectTrigger>
                  <SelectContent
                    className="rounded-lg max-h-60"
                    isLoading={isLoadingOptions}
                  >
                    <SelectItem value="all" className="text-sm cursor-pointer">
                      Semua Jurusan
                    </SelectItem>
                    {majors.map((m) => (
                      <SelectItem
                        key={m.id}
                        value={String(m.id)}
                        className="text-sm cursor-pointer"
                      >
                        {m.name} ({m.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.majorId && (
                  <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                    {errors.majorId.message}
                  </FieldError>
                )}
              </Field>

              <Field className="flex flex-col gap-1">
                <Label className="text-xs text-slate-700 flex items-center gap-1 h-5">
                  Target
                  <Badge
                    variant="outline"
                    className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
                  >
                    *
                  </Badge>
                </Label>
                <Select
                  value={
                    targetApplicants.some(
                      (t) => String(t.id) === String(targetId),
                    )
                      ? String(targetId)
                      : undefined
                  }
                  onValueChange={(val) =>
                    setValue("targetId", val, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger
                    isLoading={isLoadingOptions}
                    aria-required="true"
                    className={cn(
                      "h-10 w-full rounded-lg border bg-slate-50 px-3.5 text-sm text-slate-800 data-placeholder:text-slate-700 hover:bg-white focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer",
                      errors.targetId
                        ? "border-red-500 bg-red-50/20"
                        : "border-slate-200",
                    )}
                  >
                    <SelectValue placeholder="Pilih Target" />
                  </SelectTrigger>
                  <SelectContent
                    className="rounded-lg max-h-60"
                    isLoading={isLoadingOptions}
                  >
                    {targetApplicants.map((t) => (
                      <SelectItem
                        key={t.id}
                        value={String(t.id)}
                        className="text-sm cursor-pointer"
                      >
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.targetId && (
                  <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                    {errors.targetId.message}
                  </FieldError>
                )}
              </Field>
            </FieldGroup>
          </CardContent>

          <CardContent className="bg-white rounded-xl border border-slate-200 shadow-xs px-5 sm:px-6 py-5 sm:py-6 min-w-0 max-w-full space-y-2.5">
            <Field className="flex flex-col gap-1">
              <Label className="text-xs text-slate-700 flex items-center gap-1 h-5">
                Lokasi Kerja
                <Badge
                  variant="outline"
                  className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
                >
                  *
                </Badge>
              </Label>
              <Input
                {...register("workLocation")}
                placeholder="cth. Surabaya"
                className={cn(
                  "h-10 w-full rounded-lg border bg-slate-50 px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all",
                  errors.workLocation
                    ? "border-red-500 bg-red-50/20"
                    : "border-slate-200",
                )}
              />
              {errors.workLocation && (
                <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.workLocation.message}
                </FieldError>
              )}
            </Field>

            <Field className="flex flex-col gap-1 min-w-0 max-w-full">
              <Label className="text-xs text-slate-700 flex items-center gap-1 h-5">
                Deskripsi Pekerjaan
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="cth. Bertanggung jawab melayani pelanggan.."
                    hasError={Boolean(errors.description)}
                  />
                )}
              />
              {errors.description && (
                <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.description.message}
                </FieldError>
              )}
            </Field>

            <Field className="flex flex-col gap-1 min-w-0 max-w-full">
              <Label className="text-xs text-slate-700 flex items-center gap-1 h-5">
                Kualifikasi / Persyaratan
                <Badge
                  variant="outline"
                  className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
                >
                  *
                </Badge>
              </Label>
              <Controller
                name="qualification"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="cth. Surat Lamaran Kerja, CV, .."
                    hasError={Boolean(errors.qualification)}
                  />
                )}
              />
              {errors.qualification && (
                <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.qualification.message}
                </FieldError>
              )}
            </Field>

            <CardContent className="flex items-center gap-2.5 pt-0.5 select-none cursor-pointer p-0">
              <Checkbox
                id="send-notification"
                checked={sendNotification}
                onCheckedChange={(checked) =>
                  setValue("sendNotification", Boolean(checked), {
                    shouldDirty: true,
                  })
                }
              />
              <Label
                htmlFor="send-notification"
                className="text-xs font-normal text-slate-600 cursor-pointer font-sans"
              >
                {isEditMode
                  ? "Kirim notifikasi pembaruan ke target siswa/alumni"
                  : "Kirim notifikasi otomatis ke target siswa/alumni"}
              </Label>
            </CardContent>
          </CardContent>
        </Form>
      )}
    </CardContent>
  );
}
