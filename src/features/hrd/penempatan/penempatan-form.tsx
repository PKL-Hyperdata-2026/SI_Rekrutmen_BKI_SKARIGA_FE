import { useState, useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Field, FieldGroup, FieldError } from "@/components/ui/field";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DatePicker, AsyncSearchableSelect, Modal, CharCounter } from "@/components/custom";
import { selectOptionsApi } from "@/api/select-options";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/custom/sonner";
import { useAppSelector } from "@/hooks/use-app";
import { type JobPlacement } from "./penempatan.schema";
import { penempatanApi } from "./penempatan.api";
import {
  usePenempatanForm,
  toPenempatanDefaultValues,
  toSubmitPenempatanPayload,
} from "./penempatan.form";

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

function isApiError(err: unknown): err is ApiErrorResponse {
  return typeof err === "object" && err !== null && "response" in err;
}

export interface PenempatanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  placement?: JobPlacement | null;
}

export function PenempatanForm({
  open,
  onOpenChange,
  onSuccess,
  placement,
}: PenempatanFormProps) {
  const authUser = useAppSelector((state) => state.auth?.user);
  const authCompanyId = authUser?.company?.id
    ? String(authUser.company.id)
    : undefined;

  const isEditMode = Boolean(placement);

  const [studentFallbackLabel, setStudentFallbackLabel] = useState<
    string | undefined
  >(undefined);

  const form = usePenempatanForm(placement, authCompanyId);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = form;

  const studentAlumniId = watch("studentAlumniId");
  const watchedPosition = watch("position") ?? "";
  const acceptedDate = watch("acceptedDate");
  const startDate = watch("startDate");

  useEffect(() => {
    if (open) {
      if (placement) {
        const pelamarName = placement.studentAlumni?.user?.fullName;
        const pelamarMajor = placement.studentAlumni?.major;
        setStudentFallbackLabel(
          pelamarName
            ? pelamarMajor
              ? `${pelamarName} (${pelamarMajor})`
              : pelamarName
            : undefined,
        );
        reset(toPenempatanDefaultValues(placement, authCompanyId));
      } else {
        setStudentFallbackLabel(undefined);
        reset(toPenempatanDefaultValues(null, authCompanyId));
      }
    }
  }, [open, placement, reset, authCompanyId]);

  const onFormSubmit = handleSubmit(async (values) => {
    clearErrors();

    const payload = toSubmitPenempatanPayload(values, authCompanyId);

    try {
      if (isEditMode && placement?.id) {
        await penempatanApi.updatePlacement(placement.id, payload);
        toast.success("Data penempatan kerja berhasil diperbarui.");
      } else {
        await penempatanApi.createPlacement(payload);
        toast.success("Data penempatan kerja berhasil disimpan.");
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (err: unknown) {
      let msg = "Terjadi kesalahan sistem saat menyimpan data.";
      if (isApiError(err)) {
        msg =
          err.response?.data?.message || "Gagal menyimpan penempatan kerja.";
        const apiErrors = err.response?.data?.errors;
        if (apiErrors) {
          if (apiErrors.student_alumni_id?.[0]) {
            setError("studentAlumniId", {
              message: apiErrors.student_alumni_id[0],
            });
          }
          if (apiErrors.company_id?.[0]) {
            setError("companyId", { message: apiErrors.company_id[0] });
          }
          if (apiErrors.position?.[0]) {
            setError("position", { message: apiErrors.position[0] });
          }
          if (apiErrors.accepted_date?.[0]) {
            setError("acceptedDate", {
              message: apiErrors.accepted_date[0],
            });
          }
          if (apiErrors.start_date?.[0]) {
            setError("startDate", { message: apiErrors.start_date[0] });
          }
        }
      }
      toast.error(msg, {
        title: isEditMode ? "Gagal Memperbarui Data" : "Gagal Menyimpan Data",
      });
    }
  });

  const title = isEditMode ? "Edit Penempatan Kerja" : "Form Penempatan Kerja";
  const description = isEditMode
    ? "Perbarui informasi penempatan kerja."
    : "Lengkapi informasi penempatan untuk pendataan.";

  const submitButtonText = isSubmitting
    ? isEditMode
      ? "Menyimpan Perubahan..."
      : "Menyimpan..."
    : isEditMode
      ? "Perbarui Data"
      : "Simpan Data";

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      variant="hrd"
      headerStyle="gradient"
      size="md"
      title={title}
      description={description}
      footer={null}
      className="w-[95vw] sm:max-w-135 rounded-lg overflow-hidden"
    >
      <Form onSubmit={onFormSubmit} className="space-y-4 py-1">
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
          <AsyncSearchableSelect
            value={studentAlumniId}
            onValueChange={(val) =>
              setValue("studentAlumniId", val, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            onOptionSelect={(item) => setStudentFallbackLabel(item.label)}
            placeholder="Pilih Pelamar Kerja"
            searchPlaceholder="Cari nama pelamar kerja..."
            emptyMessage="Pelamar kerja tidak ditemukan"
            fetchPage={selectOptionsApi.getHrdStudentsAlumni}
            fallbackLabel={studentFallbackLabel}
            hasError={Boolean(errors.studentAlumniId)}
            className="h-10 rounded-lg border-slate-200 bg-[#F8F9FD] text-slate-800 focus:bg-white"
          />
          {errors.studentAlumniId && (
            <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
              {errors.studentAlumniId.message}
            </FieldError>
          )}
        </Field>

        <Field className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-[#1e1b4b] flex items-center gap-1">
              Posisi/Jabatan
              <Badge
                variant="outline"
                className="border-none bg-transparent p-0 text-red-500 shadow-none text-sm font-bold"
              >
                *
              </Badge>
            </Label>
            <CharCounter length={watchedPosition.length} max={255} />
          </div>
          <Input
            {...register("position")}
            placeholder="cth. IT Support"
            maxLength={255}
            className={cn(
              "h-10 w-full rounded-lg border bg-[#F8F9FD] px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all",
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
              onChange={(val) =>
                setValue("acceptedDate", val, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              hasError={Boolean(errors.acceptedDate)}
              className="h-10 rounded-lg border-slate-200 bg-[#F8F9FD] px-3.5"
            />
            {errors.acceptedDate && (
              <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                {errors.acceptedDate.message}
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
              onChange={(val) =>
                setValue("startDate", val, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              hasError={Boolean(errors.startDate)}
              className="h-10 rounded-lg border-slate-200 bg-[#F8F9FD] px-3.5"
            />
            {errors.startDate && (
              <FieldError className="text-[11px] font-medium text-red-500 ml-0.5">
                {errors.startDate.message}
              </FieldError>
            )}
          </Field>
        </FieldGroup>

        <CardContent className="flex items-center justify-end gap-3 pt-5 p-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
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
