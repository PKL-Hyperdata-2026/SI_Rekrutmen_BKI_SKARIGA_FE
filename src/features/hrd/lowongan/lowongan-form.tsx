import * as React from "react";
import { Controller } from "react-hook-form";
import { Plus, Pencil, BadgeCheck, RotateCcw, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/custom/searchable-select";
import { DatePicker } from "@/components/custom/date-picker";
import type { useLowonganForm } from "./lowongan.form";
import type {
  HrdJobVacancyOptions,
  HrdJobVacancyItem,
} from "./lowongan.schema";

interface LowonganFormProps {
  formState: ReturnType<typeof useLowonganForm>;
  options: HrdJobVacancyOptions;
  selectedVacancy: HrdJobVacancyItem | null;
  isLoadingOptions?: boolean;
}

export function LowonganForm({
  formState,
  options,
  selectedVacancy,
  isLoadingOptions = false,
}: LowonganFormProps) {
  const { form, isSubmitting, isEditMode, handleReset, onSubmit } = formState;
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const majorOptions = React.useMemo(() => {
    return options.majors.map((m) => ({
      value: String(m.id),
      label: `${m.name} (${m.code})`,
    }));
  }, [options.majors]);

  const targetOptions = React.useMemo(() => {
    return options.targetApplicants.map((t) => ({
      value: String(t.id),
      label: t.name,
    }));
  }, [options.targetApplicants]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 sm:p-6 lg:p-7 flex flex-col h-fit">
      {/* Header */}
      <div className="flex items-start gap-3 pb-5 border-b border-slate-100">
        <div className="mt-0.5 text-[#8D1D96]">
          {isEditMode ? (
            <Pencil className="h-5 w-5 text-[#8D1D96] stroke-[2.2]" />
          ) : (
            <Plus className="h-5 w-5 text-[#8D1D96] stroke-[2.2]" />
          )}
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {isEditMode
              ? "Edit Lowongan Kerja"
              : "Form Publikasi Lowongan Baru"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isEditMode
              ? `Mengedit lowongan ${selectedVacancy?.position || ""}`
              : "Isi data posisi secara lengkap untuk diterbitkan ke alumni/siswa."}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={onSubmit} className="mt-5 space-y-4 sm:space-y-4.5">
        {/* Posisi Pekerjaan */}
        <div className="space-y-1.5">
          <label htmlFor="position" className="text-xs font-semibold text-slate-800">
            Posisi Pekerjaan <span className="text-rose-500">*</span>
          </label>
          <Input
            id="position"
            aria-required="true"
            aria-invalid={Boolean(errors.position)}
            aria-describedby={errors.position ? "position-error" : undefined}
            {...register("position")}
            placeholder="e.g Junior Operator Assembly"
            className="h-10.5 rounded-xl border-slate-200 bg-[#F8F9FD] px-3.5 text-xs sm:text-sm placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-[#8D1D96] focus-visible:ring-[#8D1D96]/20"
          />
          {errors.position && (
            <p id="position-error" role="alert" className="text-[11px] font-medium text-rose-500">
              {errors.position.message}
            </p>
          )}
        </div>

        {/* Row: Kategori Jurusan & Target */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="major_id" className="text-xs font-semibold text-slate-800">
              Kategori Jurusan <span className="text-rose-500">*</span>
            </label>
            <Controller
              name="major_id"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  id="major_id"
                  value={field.value}
                  onValueChange={field.onChange}
                  options={majorOptions}
                  placeholder="Pilih Jurusan"
                  searchPlaceholder="Cari jurusan..."
                  emptyMessage="Jurusan tidak ditemukan"
                  searchable
                  variant="hrd"
                  isLoading={isLoadingOptions}
                  className="h-10.5 rounded-xl border-slate-200 bg-[#F8F9FD] text-xs sm:text-sm"
                  hasError={Boolean(errors.major_id)}
                />
              )}
            />
            {errors.major_id && (
              <p id="major_id-error" role="alert" className="text-[11px] font-medium text-rose-500">
                {errors.major_id.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="target_applicant_id" className="text-xs font-semibold text-slate-800">
              Target <span className="text-rose-500">*</span>
            </label>
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
                  className="h-10.5 rounded-xl border-slate-200 bg-[#F8F9FD] text-xs sm:text-sm"
                  hasError={Boolean(errors.target_applicant_id)}
                />
              )}
            />
            {errors.target_applicant_id && (
              <p id="target_applicant_id-error" role="alert" className="text-[11px] font-medium text-rose-500">
                {errors.target_applicant_id.message}
              </p>
            )}
          </div>
        </div>

        {/* Row: Kuota & Batas Pendaftaran */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="quota" className="text-xs font-semibold text-slate-800">
              Kuota <span className="text-rose-500">*</span>
            </label>
            <Input
              id="quota"
              type="number"
              min={1}
              aria-required="true"
              aria-invalid={Boolean(errors.quota)}
              aria-describedby={errors.quota ? "quota-error" : undefined}
              {...register("quota")}
              placeholder="e.g 25 Orang"
              className="h-10.5 rounded-xl border-slate-200 bg-[#F8F9FD] px-3.5 text-xs sm:text-sm placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-[#8D1D96] focus-visible:ring-[#8D1D96]/20"
            />
            {errors.quota && (
              <p id="quota-error" role="alert" className="text-[11px] font-medium text-rose-500">
                {errors.quota.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="deadline" className="text-xs font-semibold text-slate-800">
              Batas Pendaftaran <span className="text-rose-500">*</span>
            </label>
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
                  className="h-10.5 rounded-xl border-slate-200 bg-[#F8F9FD] text-xs sm:text-sm"
                  hasError={Boolean(errors.deadline)}
                />
              )}
            />
            {errors.deadline && (
              <p id="deadline-error" role="alert" className="text-[11px] font-medium text-rose-500">
                {errors.deadline.message}
              </p>
            )}
          </div>
        </div>

        {/* Lokasi Kerja */}
        <div className="space-y-1.5">
          <label htmlFor="work_location" className="text-xs font-semibold text-slate-800">
            Lokasi Kerja <span className="text-rose-500">*</span>
          </label>
          <Input
            id="work_location"
            aria-required="true"
            aria-invalid={Boolean(errors.work_location)}
            aria-describedby={errors.work_location ? "work_location-error" : undefined}
            {...register("work_location")}
            placeholder="e.g Surabaya, Jawa Timur"
            className="h-10.5 rounded-xl border-slate-200 bg-[#F8F9FD] px-3.5 text-xs sm:text-sm placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-[#8D1D96] focus-visible:ring-[#8D1D96]/20"
          />
          {errors.work_location && (
            <p id="work_location-error" role="alert" className="text-[11px] font-medium text-rose-500">
              {errors.work_location.message}
            </p>
          )}
        </div>

        {/* Kualifikasi / Persyaratan */}
        <div className="space-y-1.5">
          <label htmlFor="qualification" className="text-xs font-semibold text-slate-800">
            Kualifikasi / Persyaratan <span className="text-rose-500">*</span>
          </label>
          <Textarea
            id="qualification"
            aria-required="true"
            aria-invalid={Boolean(errors.qualification)}
            aria-describedby={errors.qualification ? "qualification-error" : undefined}
            {...register("qualification")}
            placeholder="Tuliskan persyaratan lengkap"
            rows={4}
            className="rounded-xl border-slate-200 bg-[#F8F9FD] px-3.5 py-2.5 text-xs sm:text-sm placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-[#8D1D96] focus-visible:ring-[#8D1D96]/20"
          />
          {errors.qualification && (
            <p id="qualification-error" role="alert" className="text-[11px] font-medium text-rose-500">
              {errors.qualification.message}
            </p>
          )}
        </div>

        {/* Checkbox: Kirim Notifikasi */}
        <div className="pt-1">
          <Controller
            name="send_notification"
            control={control}
            render={({ field }) => (
              <label htmlFor="send_notification" className="flex items-center gap-2.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
                <Checkbox
                  id="send_notification"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-[#8D1D96] data-[state=checked]:border-[#8D1D96] rounded-md"
                />
                <span>Kirim Notifikasi otomatis ke target siswa/alumni</span>
              </label>
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isSubmitting}
            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 px-5 h-10.5 text-xs sm:text-sm font-medium transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
            {isEditMode ? "Batal" : "Reset"}
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-gradient-to-r from-[#4A0050] via-[#75157E] to-[#A328AE] hover:opacity-95 text-white px-6 h-10.5 text-xs sm:text-sm font-semibold shadow-sm transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <span>{isEditMode ? "Simpan Perubahan" : "Publikasikan Lowongan"}</span>
                <BadgeCheck className="h-4 w-4 ml-2 stroke-[2.2]" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
