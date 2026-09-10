import { Modal } from "@/components/custom/modal";
import { Form } from "@/components/ui/form";
import { Field, FieldError } from "@/components/ui/field";
import { CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePenempatanUpdateStatusForm } from "../hooks/usePenempatanUpdateStatusForm";
import { type JobPlacement } from "../types/penempatan-schema";

export interface PenempatanUpdateStatusFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  placement?: JobPlacement | null;
}

export function PenempatanUpdateStatusForm({
  open,
  onOpenChange,
  onSuccess,
  placement,
}: PenempatanUpdateStatusFormProps) {
  const {
    period,
    setPeriod,
    availablePeriods,
    workStatus,
    setWorkStatus,
    workStatusOptions,
    notes,
    setNotes,
    isLoadingOptions,
    isSubmitting,
    submitButtonText,
    errors,
    hasError,
    title,
    description,
    handleOpenChange,
    handleCancel,
    handleSubmit,
  } = usePenempatanUpdateStatusForm({
    open,
    onOpenChange,
    onSuccess,
    placement,
  });

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      variant="hrd"
      headerStyle="gradient"
      size="md"
      title={title}
      description={description}
      footer={null}
      className="w-[95vw] sm:max-w-135 rounded-lg overflow-hidden"
    >
      <Form onSubmit={handleSubmit} className="space-y-4 py-1">
        <Field className="flex flex-col gap-1.5">
          <Label className="text-sm font-semibold text-[#1e1b4b] flex items-center gap-1">
            Periode Evaluasi Monitoring
            <Badge
              variant="outline"
              className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm font-bold"
            >
              *
            </Badge>
          </Label>
          <Select value={period || undefined} onValueChange={setPeriod}>
            <SelectTrigger
              className={cn(
                "h-10 w-full justify-between rounded-lg border border-slate-200 bg-[#F8F9FD] px-3.5 text-sm text-slate-800 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                hasError("period") &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              )}
            >
              <SelectValue placeholder="Pilih Periode Monitoring" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 p-1.5 shadow-xl bg-white theme-hrd">
              {availablePeriods.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                  className="rounded-lg py-2 px-3 text-sm font-medium text-slate-700 cursor-pointer focus:bg-[#8D1D96] focus:text-white data-[state=checked]:bg-[#8D1D96] data-[state=checked]:text-white data-disabled:opacity-40 data-disabled:cursor-not-allowed"
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.period && (
            <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
              {errors.period}
            </FieldError>
          )}
        </Field>

        <Field className="flex flex-col gap-1.5">
          <Label className="text-sm font-semibold text-[#1e1b4b] flex items-center gap-1">
            Status Bekerja
            <Badge
              variant="outline"
              className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm font-bold"
            >
              *
            </Badge>
          </Label>
          <Select
            value={workStatus || undefined}
            onValueChange={setWorkStatus}
            disabled={isLoadingOptions}
          >
            <SelectTrigger
              isLoading={isLoadingOptions}
              className={cn(
                "h-10 w-full justify-between rounded-lg border border-slate-200 bg-[#F8F9FD] px-3.5 text-sm text-slate-800 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                hasError("workStatus") &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              )}
            >
              <SelectValue placeholder="Pilih Status Bekerja" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 p-1.5 shadow-xl bg-white theme-hrd">
              {workStatusOptions.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="rounded-lg py-2 px-3 text-sm font-medium text-slate-700 cursor-pointer focus:bg-[#8D1D96] focus:text-white data-[state=checked]:bg-[#8D1D96] data-[state=checked]:text-white"
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.workStatus && (
            <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
              {errors.workStatus}
            </FieldError>
          )}
        </Field>

        <Field className="flex flex-col gap-1.5">
          <Label className="text-sm font-semibold text-[#1e1b4b] flex items-center gap-1">
            Catatan Monitoring (Opsional)
          </Label>
          <Textarea
            value={notes}
            onChange={setNotes}
            placeholder="Masukkan catatan evaluasi..."
            rows={3}
            className={cn(
              "min-h-24 w-full rounded-lg border border-slate-200 bg-[#F8F9FD] px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none",
              hasError("notes") &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            )}
          />
          {errors.notes && (
            <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
              {errors.notes}
            </FieldError>
          )}
        </Field>

        <CardContent className="flex items-center gap-3 rounded-lg border border-[#D069D7]/30 bg-[#FDF2F8]/80 p-3.5 text-slate-800">
          <Info className="size-5 text-[#8D1D96] shrink-0" />
          <CardDescription className="text-xs font-medium text-slate-800 leading-snug font-sans">
            Perbaruan status ini akan secara otomatis memperbarui data
            keterserapan di modul Tracer Study
          </CardDescription>
        </CardContent>

        <CardContent className="flex items-center justify-end gap-3 pt-5 p-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="h-9.5 px-6 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-xs cursor-pointer justify-center"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-9.5 px-7 rounded-lg bg-linear-to-r from-[#3D0040] via-[#5A0C62] to-[#D46AD8] hover:opacity-95 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {submitButtonText}
              </>
            ) : (
              <>
                {submitButtonText}
                <Send className="size-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Form>
    </Modal>
  );
}
