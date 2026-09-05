import { useFormContext } from "react-hook-form";
import { Loader2, Mail, SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ForgotPasswordSchemaType } from "./forgot-password.schema";

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordSchemaType) => Promise<void>;
  errorMessage?: string;
}

export function ForgotPasswordForm({ onSubmit, errorMessage }: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useFormContext<ForgotPasswordSchemaType>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-1">
      {errorMessage && (
        <div className="rounded-lg bg-red-500/10 p-2.5 text-[13px] font-medium text-red-600 border border-red-500/20">
          {errorMessage}
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
  );
}
