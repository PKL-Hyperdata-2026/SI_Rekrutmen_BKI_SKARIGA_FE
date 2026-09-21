import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/custom/sonner";
import { hasilApi } from "./hasil.api";
import {
  evaluationModalSchema,
  type EvaluationModalFormValues,
  type SelectionResultItem,
} from "./hasil.schema";

interface UseHasilEvaluationModalOptions {
  onSuccess: () => void;
}

const evaluationModalResolver = zodResolver(evaluationModalSchema);

export function useHasilEvaluationModal({ onSuccess }: UseHasilEvaluationModalOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectionResultItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<EvaluationModalFormValues>({
    resolver: evaluationModalResolver,
    defaultValues: {
      application_id: "",
      admin_selection_status: "lolos",
      psychotest_score: "",
      interview_score: "",
      mcu_score: "",
      decision: "pending",
      notes: "",
    },
  });

  const openModal = useCallback(
    (item: SelectionResultItem) => {
      setSelectedItem(item);
      setSelectedFile(null);

      form.reset({
        application_id: item.id,
        admin_selection_status: item.adminSelectionStatus === "tidak_lolos" ? "tidak_lolos" : "lolos",
        psychotest_score: item.psychotestScore !== null && item.psychotestScore !== undefined ? String(item.psychotestScore) : "",
        interview_score: item.interviewScore !== null && item.interviewScore !== undefined ? String(item.interviewScore) : "",
        mcu_score: item.mcuScore !== null && item.mcuScore !== undefined ? String(item.mcuScore) : "",
        decision: item.decision || "pending",
        notes: item.notes || "",
      });
      setIsOpen(true);
    },
    [form]
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedItem(null);
    setSelectedFile(null);
    form.reset();
  }, [form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!selectedItem) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (values.psychotest_score !== "" && values.psychotest_score !== undefined) {
        formData.append("psychotest_score", String(values.psychotest_score));
      }
      if (values.interview_score !== "" && values.interview_score !== undefined) {
        formData.append("interview_score", String(values.interview_score));
      }
      if (values.mcu_score !== "" && values.mcu_score !== undefined) {
        formData.append("mcu_score", String(values.mcu_score));
      }
      formData.append("decision", values.decision);
      formData.append("admin_selection_status", values.admin_selection_status);
      if (values.notes?.trim()) {
        formData.append("notes", values.notes.trim());
      }
      if (selectedFile) {
        formData.append("letter_file", selectedFile);
      }

      await hasilApi.saveEvaluation(selectedItem.id, formData);
      toast.success("Evaluasi peserta berhasil disimpan.");
      closeModal();
      onSuccess();
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (err as { response: { data: { message: string } } }).response.data.message
          : "Gagal menyimpan evaluasi peserta.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  });

  return {
    isOpen,
    selectedItem,
    selectedFile,
    setSelectedFile,
    submitting,
    form,
    openModal,
    closeModal,
    handleSubmit,
  };
}
