import { Modal } from "@/components/custom/modal";
import { Form } from "@/components/ui/form";
import { Field, FieldGroup, FieldError } from "@/components/ui/field";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/custom/date-picker";
import { SearchableSelect } from "@/components/custom/searchable-select";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePenempatanForm } from "../hooks/usePenempatanForm";
import {
  type JobPlacement,
  type PenempatanCompanyOption,
  type PenempatanStudentOption,
} from "../types/penempatan-schema";

export interface PenempatanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  placement?: JobPlacement | null;
  initialCompanies?: PenempatanCompanyOption[];
  initialStudentsAlumni?: PenempatanStudentOption[];
}

export function PenempatanForm({
  open,
  onOpenChange,
  onSuccess,
  placement,
  initialCompanies,
  initialStudentsAlumni,
}: PenempatanFormProps) {
  const {
    studentAlumniId,
    setStudentAlumniId,
    position,
    setPosition,
    acceptedDate,
    setAcceptedDate,
    startDate,
    setStartDate,
    studentOptions,
    isLoadingOptions,
    isSubmitting,
    title,
    description,
    submitButtonText,
    errors,
    hasError,
    handleOpenChange,
    handleCancel,
    handleSubmit,
  } = usePenempatanForm({
    open,
    onOpenChange,
    onSuccess,
    placement,
    initialCompanies,
    initialStudentsAlumni,
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
            Nama Pelamar Kerja
            <Badge
              variant="outline"
              className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm font-bold"
            >
              *
            </Badge>
          </Label>
          <SearchableSelect
            value={studentAlumniId}
            onValueChange={setStudentAlumniId}
            searchable
            placeholder="Pilih Pelamar Kerja"
            searchPlaceholder="Cari nama pelamar kerja..."
            emptyMessage="Pelamar kerja tidak ditemukan"
            options={studentOptions}
            hasError={hasError("studentAlumniId")}
            isLoading={isLoadingOptions}
            className="h-10 rounded-lg border-slate-200 bg-[#F8F9FD] text-slate-800 focus:bg-white"
          />
          {errors.studentAlumniId && (
            <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
              {errors.studentAlumniId}
            </FieldError>
          )}
        </Field>

        <Field className="flex flex-col gap-1.5">
          <Label className="text-sm font-semibold text-[#1e1b4b] flex items-center gap-1">
            Posisi/Jabatan
            <Badge
              variant="outline"
              className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm font-bold"
            >
              *
            </Badge>
          </Label>
          <Input
            value={position}
            onChange={setPosition}
            placeholder="cth. IT Support"
            className={cn(
              "h-10 w-full rounded-lg border bg-[#F8F9FD] px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all",
              hasError("position")
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

        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold text-[#1e1b4b] flex items-center gap-1">
              Tanggal Diterima
              <Badge
                variant="outline"
                className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm font-bold"
              >
                *
              </Badge>
            </Label>
            <DatePicker
              value={acceptedDate}
              onChange={setAcceptedDate}
              hasError={hasError("acceptedDate")}
              className="h-10 rounded-lg border-slate-200 bg-[#F8F9FD] px-3.5"
            />
            {errors.acceptedDate && (
              <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                {errors.acceptedDate}
              </FieldError>
            )}
          </Field>

          <Field className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold text-[#1e1b4b] flex items-center gap-1">
              Tanggal Masuk Kerja
              <Badge
                variant="outline"
                className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm font-bold"
              >
                *
              </Badge>
            </Label>
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              hasError={hasError("startDate")}
              className="h-10 rounded-lg border-slate-200 bg-[#F8F9FD] px-3.5"
            />
            {errors.startDate && (
              <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                {errors.startDate}
              </FieldError>
            )}
          </Field>
        </FieldGroup>

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
