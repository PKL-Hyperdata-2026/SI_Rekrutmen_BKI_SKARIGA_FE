import { useState, useCallback, useMemo } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/custom/sonner";
import type { SearchableSelectOption } from "@/components/custom/searchable-select";
import { jurusanApi } from "./jurusan.api";
import {
  majorFormSchema,
  majorPayloadSchema,
  type MajorFormSchemaType,
  type MajorItem,
  type DepartmentOption,
  type MajorPayload,
} from "./jurusan.schema";

interface UseMajorFormModalProps {
  onSuccess: () => void;
}

const majorFormResolver = zodResolver(majorFormSchema);

export function useMajorForm(major?: MajorItem | null) {
  return useForm<MajorFormSchemaType>({
    resolver: majorFormResolver,
    defaultValues: {
      department_id: major?.departmentId ? String(major.departmentId) : "",
      code: major?.code || "",
      name: major?.name || "",
      description: major?.description || "",
      is_active: major ? major.isActive : true,
    },
  });
}

export function useMajorFormFields(
  form: UseFormReturn<MajorFormSchemaType>,
  departmentOptions: DepartmentOption[] = [],
) {
  const { watch, setValue } = form;

  const currentDepartmentId = watch("department_id");
  const isActive = watch("is_active");
  const watchedCode = watch("code") ?? "";
  const watchedName = watch("name") ?? "";
  const watchedDescription = watch("description") ?? "";

  const options = useMemo<SearchableSelectOption[]>(() => {
    return departmentOptions.map((dept) => ({
      value: String(dept.id),
      label: `${dept.name} (${dept.code})`,
    }));
  }, [departmentOptions]);

  const handleDepartmentChange = useCallback(
    (val: string) => {
      setValue("department_id", val, { shouldValidate: true });
    },
    [setValue],
  );

  const handleToggleActive = useCallback(
    (checked: boolean) => {
      setValue("is_active", checked);
    },
    [setValue],
  );

  return {
    currentDepartmentId,
    isActive,
    watchedCode,
    watchedName,
    watchedDescription,
    options,
    handleDepartmentChange,
    handleToggleActive,
  };
}

export function toCreateMajorPayload(data: MajorFormSchemaType): MajorPayload {
  const rawPayload = {
    department_id: data.department_id,
    code: data.code.toUpperCase().trim(),
    name: data.name.trim(),
    is_active: data.is_active,
    ...(data.description && data.description.trim() !== ""
      ? { description: data.description.trim() }
      : {}),
  };

  return majorPayloadSchema.parse(rawPayload);
}

export function useMajorFormModal({ onSuccess }: UseMajorFormModalProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMajor, setEditingMajor] = useState<MajorItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useMajorForm(editingMajor);

  const handleOpenCreate = useCallback(() => {
    setEditingMajor(null);
    form.reset({
      department_id: "",
      code: "",
      name: "",
      description: "",
      is_active: true,
    });
    setIsFormOpen(true);
  }, [form]);

  const handleOpenEdit = useCallback(
    (item: MajorItem) => {
      setEditingMajor(item);
      form.reset({
        department_id: String(item.departmentId),
        code: item.code,
        name: item.name,
        description: item.description || "",
        is_active: item.isActive,
      });
      setIsFormOpen(true);
    },
    [form],
  );

  const handleSubmitForm = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const payload = toCreateMajorPayload(values);

      if (editingMajor) {
        await jurusanApi.updateMajor(editingMajor.id, payload);
        toast.success("Data jurusan berhasil diperbarui.");
      } else {
        await jurusanApi.createMajor(payload);
        toast.success("Jurusan baru berhasil ditambahkan.");
      }

      setIsFormOpen(false);
      onSuccess();
    } catch (err: unknown) {
      toast.error(
        jurusanApi.extractErrorMessage(
          err,
          "Terjadi kesalahan saat menyimpan data jurusan.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  });

  const isEditing = Boolean(editingMajor);
  const modalTitle = isEditing ? "Edit Jurusan" : "Tambah Jurusan Baru";
  const modalDescription = isEditing
    ? "Perbarui informasi dan induk departemen program keahlian."
    : "Lengkapi data jurusan baru dan pilih departemen induk keahlian.";
  const modalConfirmText = isEditing ? "Perbarui Jurusan" : "Simpan Jurusan";
  const departmentFallbackLabel = editingMajor?.department
    ? `${editingMajor.department.name} (${editingMajor.department.code})`
    : undefined;

  return {
    isFormOpen,
    setIsFormOpen,
    editingMajor,
    submitting,
    form,
    isEditing,
    modalTitle,
    modalDescription,
    modalConfirmText,
    departmentFallbackLabel,
    handleOpenCreate,
    handleOpenEdit,
    handleSubmitForm,
  };
}
