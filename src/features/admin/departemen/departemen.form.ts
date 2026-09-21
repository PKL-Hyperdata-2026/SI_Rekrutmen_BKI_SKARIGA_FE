import { useState, useCallback } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/custom/sonner";
import { departemenApi } from "./departemen.api";
import {
  departmentFormSchema,
  departmentPayloadSchema,
  type DepartmentFormSchemaType,
  type DepartmentItem,
  type DepartmentPayload,
} from "./departemen.schema";

interface UseDepartmentFormModalProps {
  onSuccess: () => void;
}

const departmentFormResolver = zodResolver(departmentFormSchema);

export function useDepartmentForm(department?: DepartmentItem | null) {
  return useForm<DepartmentFormSchemaType>({
    resolver: departmentFormResolver,
    defaultValues: {
      code: department?.code || "",
      name: department?.name || "",
      description: department?.description || "",
      is_active: department ? department.isActive : true,
    },
  });
}

export function useDepartmentFormFields(
  form: UseFormReturn<DepartmentFormSchemaType>,
) {
  const isActive = form.watch("is_active");
  const handleToggleActive = useCallback(
    (checked: boolean) => {
      form.setValue("is_active", checked);
    },
    [form],
  );

  return {
    isActive,
    handleToggleActive,
  };
}

export function toCreateDepartmentPayload(
  data: DepartmentFormSchemaType,
): DepartmentPayload {
  const rawPayload = {
    code: data.code.toUpperCase().trim(),
    name: data.name.trim(),
    is_active: data.is_active,
    ...(data.description && data.description.trim() !== ""
      ? { description: data.description.trim() }
      : {}),
  };

  return departmentPayloadSchema.parse(rawPayload);
}

export function useDepartmentFormModal({
  onSuccess,
}: UseDepartmentFormModalProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useDepartmentForm(editingDept);

  const handleOpenCreate = useCallback(() => {
    setEditingDept(null);
    form.reset({
      code: "",
      name: "",
      description: "",
      is_active: true,
    });
    setIsFormOpen(true);
  }, [form]);

  const handleOpenEdit = useCallback(
    (item: DepartmentItem) => {
      setEditingDept(item);
      form.reset({
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
      const payload = toCreateDepartmentPayload(values);

      if (editingDept) {
        await departemenApi.updateDepartment(editingDept.id, payload);
        toast.success("Data departemen berhasil diperbarui.");
      } else {
        await departemenApi.createDepartment(payload);
        toast.success("Departemen baru berhasil ditambahkan.");
      }

      setIsFormOpen(false);
      onSuccess();
    } catch (error: unknown) {
      toast.error(
        departemenApi.extractErrorMessage(
          error,
          "Terjadi kesalahan saat menyimpan data departemen.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  });

  const isEditing = Boolean(editingDept);
  const modalTitle = isEditing ? "Edit Departemen" : "Tambah Departemen Baru";
  const modalDescription = isEditing
    ? "Perbarui informasi dan deskripsi bidang keahlian departemen."
    : "Lengkapi data departemen baru sebagai induk program keahlian/jurusan.";
  const modalConfirmText = isEditing
    ? "Perbarui Departemen"
    : "Simpan Departemen";

  return {
    isFormOpen,
    setIsFormOpen,
    editingDept,
    submitting,
    form,
    isEditing,
    modalTitle,
    modalDescription,
    modalConfirmText,
    handleOpenCreate,
    handleOpenEdit,
    handleSubmitForm,
  };
}
