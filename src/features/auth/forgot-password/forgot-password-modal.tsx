import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { isAxiosError } from "axios";
import { MailCheck, Lock } from "lucide-react";
import { Modal } from "@/components/custom/modal";
import { useForgotPasswordForm } from "./forgot-password.form";
import { forgotPasswordApi } from "./forgot-password.api";
import { ForgotPasswordForm } from "./forgot-password-form";
import type { ForgotPasswordSchemaType } from "./forgot-password.schema";

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordModal({ open, onOpenChange }: ForgotPasswordModalProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const form = useForgotPasswordForm();

  const handleClose = (next: boolean) => {
    if (!next) {
      form.reset();
      setErrorMsg("");
      setSuccessMsg("");
    }
    onOpenChange(next);
  };

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    setErrorMsg("");
    try {
      const response = await forgotPasswordApi(data);
      setSuccessMsg(response.message || "Tautan reset password telah dikirim ke email kamu.");
    } catch (error) {
      if (isAxiosError(error)) {
        setErrorMsg(error.response?.data?.message || "Terjadi kesalahan saat mengirim tautan reset.");
      } else {
        setErrorMsg("Terjadi kesalahan saat mengirim tautan reset.");
      }
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      variant="student"
      size="sm"
      title={successMsg ? "Periksa Email Kamu" : (<span className="inline-flex items-center gap-2"><Lock className="shrink-0" /> Atur Ulang Sandi</span>)}
      description={
        successMsg
          ? undefined
          : "Masukkan email akun terdaftar, kami akan mengirimkan tautan untuk mengatur ulang password."
      }
      footer={null}
    >
      {successMsg ? (
        <div className="flex flex-col items-center text-center py-4 gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <MailCheck className="h-7 w-7 text-emerald-600" />
          </div>
          <p className="text-[13px] text-gray-600 leading-relaxed max-w-[320px]">
            {successMsg}
          </p>
          <button
            type="button"
            onClick={() => handleClose(false)}
            className="mt-1 w-full py-2 rounded-md border border-white/20 bg-linear-to-r from-[#1f66a8] to-primary hover:opacity-90 text-primary-foreground font-semibold text-[13px] shadow-sm transition-all"
          >
            Mengerti
          </button>
        </div>
      ) : (
        <FormProvider {...form}>
          <ForgotPasswordForm onSubmit={onSubmit} errorMessage={errorMsg} />
        </FormProvider>
      )}
    </Modal>
  );
}
