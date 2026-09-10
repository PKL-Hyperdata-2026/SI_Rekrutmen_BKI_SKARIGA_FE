import { Modal } from "@/components/custom/modal";
import { Form } from "@/components/ui/form";
import { Field, FieldGroup, FieldError } from "@/components/ui/field";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLowonganKerjaForm } from "../hooks/useLowonganKerjaForm";
import {
  type Company,
  type MajorItem,
  type StandardTypeItem,
  type JobVacancy,
} from "../types";
import { DatePicker } from "@/components/custom/date-picker";
import { SearchableSelect } from "@/components/custom/searchable-select";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LowonganKerjaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  vacancy?: JobVacancy | null;
  companies?: Company[];
  majors?: MajorItem[];
  targetApplicants?: StandardTypeItem[];
}

export function LowonganKerjaForm({
  open,
  onOpenChange,
  onSuccess,
  vacancy,
  companies: initialCompanies,
  majors: initialMajors,
  targetApplicants: initialTargetApplicants,
}: LowonganKerjaFormProps) {
  const {
    companies,
    majors,
    targetApplicants,
    companyId,
    setCompanyId,
    position,
    setPosition,
    quota,
    setQuota,
    deadline,
    setDeadline,
    majorId,
    setMajorId,
    targetId,
    setTargetId,
    workLocation,
    setWorkLocation,
    qualification,
    setQualification,
    sendNotification,
    setSendNotification,
    errors,
    isSubmitting,
    isLoadingData,
    isLoadingOptions,
    isEditMode,
    errorMsg,
    handleOpenChange,
    handleSubmit,
  } = useLowonganKerjaForm({
    open,
    onOpenChange,
    onSuccess,
    vacancy,
    initialCompanies,
    initialMajors,
    initialTargetApplicants,
  });

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      variant="admin"
      headerStyle="gradient"
      size="md"
      title={
        isEditMode ? "Edit Lowongan Kerja" : "Form Publikasi Lowongan Kerja"
      }
      description={
        isEditMode
          ? "Perbarui informasi dan kualifikasi lowongan kerja."
          : "Lengkapi informasi lowongan untuk pendataan."
      }
      footer={null}
      className="w-[95vw] sm:max-w-160 max-h-[92vh] rounded-lg overflow-hidden"
    >
      {isLoadingData ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="size-8 animate-spin text-purple-600" />
          <p className="text-xs font-medium text-slate-500 font-sans">
            Memuat data lowongan kerja...
          </p>
        </div>
      ) : (
        <Form onSubmit={handleSubmit} className="space-y-2.5 pt-0.5">
          {errorMsg && (
            <CardContent className="rounded-lg bg-red-500/10 p-2.5 text-xs font-medium text-red-600 border border-red-500/20">
              {errorMsg}
            </CardContent>
          )}

          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field className="flex flex-col gap-1">
              <Label className="text-xs text-[#1e1b4b] flex items-center gap-1">
                Nama Perusahaan Mitra
                <Badge
                  variant="outline"
                  className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
                >
                  *
                </Badge>
              </Label>
              <SearchableSelect
                value={companyId}
                onValueChange={setCompanyId}
                searchable
                placeholder="Pilih Perusahaan"
                searchPlaceholder="Cari nama perusahaan..."
                emptyMessage="Perusahaan tidak ditemukan"
                options={companies.map((c) => ({
                  value: String(c.id),
                  label: c.name,
                }))}
                hasError={Boolean(errors.companyId)}
                isLoading={isLoadingOptions}
              />
              {errors.companyId && (
                <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.companyId}
                </FieldError>
              )}
            </Field>

            <Field className="flex flex-col gap-1">
              <Label className="text-xs text-[#1e1b4b] flex items-center gap-1">
                Posisi Pekerjaan
                <Badge
                  variant="outline"
                  className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
                >
                  *
                </Badge>
              </Label>
              <Input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="cth. Customer Service"
                className={cn(
                  "h-10 w-full rounded-lg border bg-[#F8F9FD] px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all",
                  errors.position
                    ? "border-red-500 bg-red-50/20"
                    : "border-slate-200",
                )}
              />
              {errors.position && (
                <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.position}
                </FieldError>
              )}
            </Field>
          </FieldGroup>

          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field className="flex flex-col gap-1">
              <Label className="text-xs text-[#1e1b4b] flex items-center gap-1">
                Kuota
                <Badge
                  variant="outline"
                  className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
                >
                  *
                </Badge>
              </Label>
              <Input
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                placeholder="cth. 30 Orang"
                className={cn(
                  "h-10 w-full rounded-lg border bg-[#F8F9FD] px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all",
                  errors.quota
                    ? "border-red-500 bg-red-50/20"
                    : "border-slate-200",
                )}
              />
              {errors.quota && (
                <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.quota}
                </FieldError>
              )}
            </Field>

            <Field className="flex flex-col gap-1">
              <Label className="text-xs text-[#1e1b4b] flex items-center gap-1">
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
                onChange={setDeadline}
                hasError={Boolean(errors.deadline)}
              />
              {errors.deadline && (
                <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                  {errors.deadline}
                </FieldError>
              )}
            </Field>
          </FieldGroup>

          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field className="flex flex-col gap-1">
              <Label className="text-xs text-[#1e1b4b] flex items-center gap-1">
                Jurusan
                <Badge
                  variant="outline"
                  className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
                >
                  *
                </Badge>
              </Label>
              <Select value={majorId} onValueChange={setMajorId}>
                <SelectTrigger
                  isLoading={isLoadingOptions}
                  className={cn(
                    "h-10 w-full rounded-lg border bg-[#F8F9FD] px-3.5 text-sm text-slate-800 data-placeholder:text-slate-700 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                    errors.majorId
                      ? "border-red-500 bg-red-50/20"
                      : "border-slate-200",
                  )}
                >
                  <SelectValue placeholder="Semua Jurusan" />
                </SelectTrigger>
                <SelectContent className="rounded-lg max-h-60" isLoading={isLoadingOptions}>
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
                  {errors.majorId}
                </FieldError>
              )}
            </Field>

            <Field className="flex flex-col gap-1">
              <Label className="text-xs text-[#1e1b4b] flex items-center gap-1">
                Target
                <Badge
                  variant="outline"
                  className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
                >
                  *
                </Badge>
              </Label>
              <Select value={targetId} onValueChange={setTargetId}>
                <SelectTrigger
                  isLoading={isLoadingOptions}
                  className={cn(
                    "h-10 w-full rounded-lg border bg-[#F8F9FD] px-3.5 text-sm text-slate-800 data-placeholder:text-slate-700 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                    errors.targetId
                      ? "border-red-500 bg-red-50/20"
                      : "border-slate-200",
                  )}
                >
                  <SelectValue placeholder="Semua Target" />
                </SelectTrigger>
                <SelectContent className="rounded-lg max-h-60" isLoading={isLoadingOptions}>
                  <SelectItem value="all" className="text-sm cursor-pointer">
                    Semua Target
                  </SelectItem>
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
                  {errors.targetId}
                </FieldError>
              )}
            </Field>
          </FieldGroup>

          <Field className="flex flex-col gap-1">
            <Label className="text-xs text-[#1e1b4b] flex items-center gap-1">
              Lokasi Kerja
              <Badge
                variant="outline"
                className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
              >
                *
              </Badge>
            </Label>
            <Input
              value={workLocation}
              onChange={(e) => setWorkLocation(e.target.value)}
              placeholder="cth. Surabaya"
              className={cn(
                "h-10 w-full rounded-lg border bg-[#F8F9FD] px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all",
                errors.workLocation
                  ? "border-red-500 bg-red-50/20"
                  : "border-slate-200",
              )}
            />
            {errors.workLocation && (
              <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                {errors.workLocation}
              </FieldError>
            )}
          </Field>

          <Field className="flex flex-col gap-1">
            <Label className="text-xs text-[#1e1b4b] flex items-center gap-1">
              Kualifikasi / Persyaratan
              <Badge
                variant="outline"
                className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm"
              >
                *
              </Badge>
            </Label>
            <Textarea
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              placeholder="cth. Surat Lamaran Kerja, CV, .."
              className={cn(
                "min-h-20 max-h-28 w-full rounded-lg border bg-[#F8F9FD] p-3 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all resize-y custom-scrollbar",
                errors.qualification
                  ? "border-red-500 bg-red-50/20"
                  : "border-slate-200",
              )}
            />
            {errors.qualification && (
              <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                {errors.qualification}
              </FieldError>
            )}
          </Field>

          <CardContent className="flex items-center gap-2.5 pt-0.5 select-none cursor-pointer p-0">
            <Checkbox
              id="send-notification"
              checked={sendNotification}
              onCheckedChange={(checked) =>
                setSendNotification(Boolean(checked))
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

          <CardContent className="sticky -bottom-4 bg-white/95 backdrop-blur-xs pt-2.5 pb-3 sm:pb-2 -mx-6 px-6 border-t border-slate-100 flex items-center justify-end gap-3 z-10 mt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
              className="hidden sm:inline-flex h-9.5 w-auto px-6 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-xs cursor-pointer justify-center"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9.5 w-full sm:w-auto px-7 rounded-lg bg-linear-to-r from-[#2e1065] via-[#4c1d95] to-[#7c3aed] hover:opacity-95 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {isEditMode ? "Menyimpan Perubahan..." : "Menyimpan..."}
                </>
              ) : (
                <>
                  {isEditMode ? "Perbarui Data" : "Simpan Data"}
                  <Send className="size-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Form>
      )}
    </Modal>
  );
}
