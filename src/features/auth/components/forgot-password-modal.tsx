import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Loader2, Mail, MailCheck, SendHorizontal, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { api } from "@/api/axios";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchemaType,
} from "../schemas/forgot-password.schema";

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordModal({ open, onOpenChange }: ForgotPasswordModalProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleClose = (next: boolean) => {
    if (!next) {
      reset();
      setErrorMsg("");
      setSuccessMsg("");
    }
    onOpenChange(next);
  };

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    setErrorMsg("");
    try {
      const response = await api.post("/forgot-password", { email: data.email });
      setSuccessMsg(response.data.message || "Tautan reset password telah dikirim ke email kamu.");
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
      title={successMsg ? "Periksa Email Kamu" : (<span className="inline-flex items-center gap-2"><Lock className="shrink-0" /> Atur Ulang Sandi</span>) }
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-1">
          {errorMsg && (
            <div className="rounded-lg bg-red-500/10 p-2.5 text-[13px] font-medium text-red-600 border border-red-500/20">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="forgot-email" className="text-[11px] text-accent font-bold ml-0.5">
              Email
            </label>
            <div
              className={cn(
                "relative rounded-md border px-3 py-1.5 flex items-center transition-colors",
                errors.email
                  ? "border-red-500 bg-white"
                  : "border-gray-200 bg-[#f9fafb] focus-within:border-primary focus-within:bg-white"
              )}
            >
              <input
                id="forgot-email"
                type="email"
                placeholder="nama@email.com"
                className="w-full bg-transparent outline-none font-medium text-foreground text-[13px] placeholder:text-gray-400 autofill:shadow-[inset_0_0_0px_1000px_#e8f4fd] autofill:[-webkit-text-fill-color:#111827]"
                {...register("email")}
                autoFocus
              />
              <Mail className="text-gray-400 h-3.5 w-3.5 ml-2 shrink-0" />
            </div>
            {errors.email && (
              <p className="text-red-500 text-[10px] font-bold ml-0.5">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 rounded-md border border-white/20 bg-linear-to-r from-[#1f66a8] to-primary hover:opacity-90 text-primary-foreground font-semibold text-[13px] shadow-sm transition-all flex justify-center items-center gap-2 disabled:opacity-70 cursor-pointer"
          >
            {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isSubmitting ? "Mengirim..." : "Kirim Tautan Reset"}
            {!isSubmitting && <SendHorizontal className="h-3.5 w-3.5" />}
          </button>
        </form>
      )}
    </Modal>
  );
}
