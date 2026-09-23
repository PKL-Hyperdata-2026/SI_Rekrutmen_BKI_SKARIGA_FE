import * as React from "react";
import { PlusCircle, Save, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { Modal } from "@/components/custom/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { UseFormReturn } from "react-hook-form";
import type { JadwalFormValues, LowonganOption } from "./jadwal.schema";

export interface JadwalFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<JadwalFormValues>;
  lowonganOptions: LowonganOption[];
  onSubmit: (values: JadwalFormValues) => Promise<void>;
  submitting?: boolean;
}

export function JadwalFormModal({
  open,
  onOpenChange,
  form,
  lowonganOptions,
  onSubmit,
  submitting = false,
}: JadwalFormModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  const lowonganIdValue = watch("lowonganId");
  const kirimNotifikasiValue = watch("kirimNotifikasi");

  const handleReset = React.useCallback(() => {
    reset();
  }, [reset]);

  const handleFormSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      variant="hrd"
      headerStyle="white"
      size="md"
      title="Form Buat Agenda Sesi Tes Baru"
      description="Tentukan Jadwal & alokasikan pelamar yang telah lolos berkas."
      headerIcon={<PlusCircle className="h-5 w-5 text-purple-800" />}
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={submitting}
            className="h-10 px-6 rounded-xl border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="jadwal-form"
            disabled={submitting}
            className="h-10 px-6 rounded-xl bg-linear-to-r from-sidebar-strip to-sidebar-gradient-from hover:opacity-90 text-white font-semibold text-xs inline-flex items-center gap-2 cursor-pointer shadow-xs"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <span>Simpan Data</span>
                <Save className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      }
    >
      <form
        id="jadwal-form"
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-4 py-2"
        noValidate
      >
        {/* Nama Agenda */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="namaAgenda"
            className="text-xs font-bold text-purple-900"
          >
            Nama Agenda <span className="text-rose-500">*</span>
          </label>
          <Input
            id="namaAgenda"
            placeholder="e.g Psikotes - Batch 1"
            aria-invalid={Boolean(errors.namaAgenda)}
            aria-describedby={errors.namaAgenda ? "namaAgenda-error" : undefined}
            className="h-10 rounded-xl bg-purple-50/20 border-purple-200 text-xs focus-visible:ring-purple-400 placeholder:text-slate-400"
            {...register("namaAgenda")}
          />
          {errors.namaAgenda && (
            <p id="namaAgenda-error" role="alert" className="text-xs font-medium text-rose-500">
              {errors.namaAgenda.message}
            </p>
          )}
        </div>

        {/* Lowongan Kerja & Nilai Minimum */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="lowonganId"
              className="text-xs font-bold text-purple-900"
            >
              Lowongan Kerja <span className="text-rose-500">*</span>
            </label>
            <Select
              value={lowonganIdValue}
              onValueChange={(val) =>
                setValue("lowonganId", val, { shouldValidate: true })
              }
            >
              <SelectTrigger
                id="lowonganId"
                aria-invalid={Boolean(errors.lowonganId)}
                aria-describedby={errors.lowonganId ? "lowonganId-error" : undefined}
                className="h-10 rounded-xl bg-purple-50/20 border-purple-200 text-xs text-slate-800 focus:ring-purple-400"
              >
                <SelectValue placeholder="Pilih Lowongan" />
              </SelectTrigger>
              <SelectContent>
                {lowonganOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.lowonganId && (
              <p id="lowonganId-error" role="alert" className="text-xs font-medium text-rose-500">
                {errors.lowonganId.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="nilaiMinimum"
              className="text-xs font-bold text-purple-900"
            >
              Nilai Minimum Diterima <span className="text-rose-500">*</span>
            </label>
            <Input
              id="nilaiMinimum"
              type="number"
              placeholder="400"
              aria-invalid={Boolean(errors.nilaiMinimum)}
              aria-describedby={errors.nilaiMinimum ? "nilaiMinimum-error" : undefined}
              className="h-10 rounded-xl bg-purple-50/20 border-purple-200 text-xs tabular-nums focus-visible:ring-purple-400 placeholder:text-slate-400"
              {...register("nilaiMinimum")}
            />
            {errors.nilaiMinimum && (
              <p id="nilaiMinimum-error" role="alert" className="text-xs font-medium text-rose-500">
                {errors.nilaiMinimum.message}
              </p>
            )}
          </div>
        </div>

        {/* Tanggal Pelaksanaan & Waktu Mulai */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="tanggalPelaksanaan"
              className="text-xs font-bold text-purple-900"
            >
              Tanggal Pelaksanaan <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="tanggalPelaksanaan"
                type="date"
                aria-invalid={Boolean(errors.tanggalPelaksanaan)}
                aria-describedby={errors.tanggalPelaksanaan ? "tanggalPelaksanaan-error" : undefined}
                className="h-10 rounded-xl bg-purple-50/20 border-purple-200 text-xs tabular-nums focus-visible:ring-purple-400 pr-10 text-slate-800"
                {...register("tanggalPelaksanaan")}
              />
              <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            </div>
            {errors.tanggalPelaksanaan && (
              <p id="tanggalPelaksanaan-error" role="alert" className="text-xs font-medium text-rose-500">
                {errors.tanggalPelaksanaan.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="waktuMulai"
              className="text-xs font-bold text-purple-900"
            >
              Waktu Mulai <span className="text-rose-500">*</span>
            </label>
            <Input
              id="waktuMulai"
              placeholder="e.g 08:00"
              aria-invalid={Boolean(errors.waktuMulai)}
              aria-describedby={errors.waktuMulai ? "waktuMulai-error" : undefined}
              className="h-10 rounded-xl bg-purple-50/20 border-purple-200 text-xs tabular-nums focus-visible:ring-purple-400 placeholder:text-slate-400"
              {...register("waktuMulai")}
            />
            {errors.waktuMulai && (
              <p id="waktuMulai-error" role="alert" className="text-xs font-medium text-rose-500">
                {errors.waktuMulai.message}
              </p>
            )}
          </div>
        </div>

        {/* Lokasi / Link Online */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="lokasi"
            className="text-xs font-bold text-purple-900"
          >
            Lokasi / Link Online <span className="text-rose-500">*</span>
          </label>
          <Input
            id="lokasi"
            placeholder="e.g Surabaya, Jawa Timur"
            aria-invalid={Boolean(errors.lokasi)}
            aria-describedby={errors.lokasi ? "lokasi-error" : undefined}
            className="h-10 rounded-xl bg-purple-50/20 border-purple-200 text-xs focus-visible:ring-purple-400 placeholder:text-slate-400"
            {...register("lokasi")}
          />
          {errors.lokasi && (
            <p id="lokasi-error" role="alert" className="text-xs font-medium text-rose-500">
              {errors.lokasi.message}
            </p>
          )}
        </div>

        {/* Deskripsi */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="deskripsi"
            className="text-xs font-bold text-purple-900"
          >
            Deskripsi
          </label>
          <Textarea
            id="deskripsi"
            placeholder="Lorem Ipsum Dolor Sir Ahmed"
            rows={3}
            aria-invalid={Boolean(errors.deskripsi)}
            aria-describedby={errors.deskripsi ? "deskripsi-error" : undefined}
            className="rounded-xl bg-purple-50/20 border-purple-200 text-xs focus-visible:ring-purple-400 placeholder:text-slate-400 resize-none"
            {...register("deskripsi")}
          />
          {errors.deskripsi && (
            <p id="deskripsi-error" role="alert" className="text-xs font-medium text-rose-500">
              {errors.deskripsi.message}
            </p>
          )}
        </div>

        {/* Checkbox Notifikasi Otomatis */}
        <div className="flex items-center gap-2.5 pt-1">
          <Checkbox
            id="kirimNotifikasi"
            checked={kirimNotifikasiValue}
            onCheckedChange={(checked) =>
              setValue("kirimNotifikasi", Boolean(checked))
            }
            className="border-purple-300 data-[state=checked]:bg-sidebar-strip data-[state=checked]:border-sidebar-strip cursor-pointer"
          />
          <label
            htmlFor="kirimNotifikasi"
            className="text-xs font-medium text-slate-700 cursor-pointer select-none"
          >
            Kirim Notifikasi otomatis ke target siswa/alumni
          </label>
        </div>
      </form>
    </Modal>
  );
}
