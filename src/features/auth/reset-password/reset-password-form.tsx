import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Link } from "react-router";
import { Loader2, Eye, EyeOff, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResetPasswordSchemaType } from "./reset-password.schema";

interface ResetPasswordFormProps {
  email: string;
  onSubmit: (data: ResetPasswordSchemaType) => Promise<void>;
  errorMessage?: string;
}

export function ResetPasswordForm({
  email,
  onSubmit,
  errorMessage,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useFormContext<ResetPasswordSchemaType>();

  return (
    <div className="w-full max-w-[320px] mx-auto">
      <div className="hidden lg:flex items-center gap-2.5 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-accent text-[14px] leading-tight">BKI SKARIGA</span>
          <span className="text-primary text-[11px] font-medium leading-tight">Sistem Informasi Rekrutmen</span>
        </div>
      </div>

      <div className="mb-4 lg:mb-5">
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">
          SISTEM INFORMASI REKRUTMEN
        </p>
        <h1 className="text-xl lg:text-2xl font-extrabold text-foreground tracking-tight leading-tight">
          Atur Ulang Password<span className="text-primary">.</span>
        </h1>
        <p className="text-gray-500 text-[12px] mt-1.5 leading-relaxed">
          Buat password baru untuk akun{" "}
          <span className="font-semibold text-foreground break-all">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
        {errorMessage && (
          <div className="rounded-lg bg-red-500/10 p-2.5 text-[13px] font-medium text-red-600 border border-red-500/20">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="new-password" className="text-[11px] text-accent font-bold ml-0.5">
            Password Baru
          </label>
          <div
            className={cn(
              "relative rounded-md border px-3 py-1.5 flex items-center transition-colors",
              errors.password
                ? "border-red-500 bg-white"
                : "border-gray-200 bg-[#f9fafb] focus-within:border-primary focus-within:bg-white"
            )}
          >
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-transparent outline-none font-medium text-foreground text-[13px] placeholder:text-gray-400 autofill:shadow-[inset_0_0_0px_1000px_#e8f4fd] autofill:[-webkit-text-fill-color:#111827]"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 ml-2 hover:text-gray-600 transition-colors shrink-0 cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-[10px] font-bold ml-0.5">{errors.password.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="new-password-confirmation" className={cn("text-[11px] font-bold ml-0.5", errors.password_confirmation ? "text-red-500" : "text-accent")}>
            Konfirmasi Password Baru
          </label>
          <div
            className={cn(
              "relative rounded-md border px-3 py-1.5 flex items-center transition-colors",
              errors.password_confirmation
                ? "border-red-500 bg-white"
                : "border-gray-200 bg-[#f9fafb] focus-within:border-primary focus-within:bg-white"
            )}
          >
            <input
              id="new-password-confirmation"
              type={showConfirmation ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-transparent outline-none font-medium text-foreground text-[13px] placeholder:text-gray-400 autofill:shadow-[inset_0_0_0px_1000px_#e8f4fd] autofill:[-webkit-text-fill-color:#111827]"
              {...register("password_confirmation")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmation(!showConfirmation)}
              className="text-gray-400 ml-2 hover:text-gray-600 transition-colors shrink-0 cursor-pointer"
            >
              {showConfirmation ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
          {errors.password_confirmation && (
            <p className="text-red-500 text-[10px] font-bold ml-0.5">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 rounded-md border border-white/20 bg-gradient-to-r from-[#1f66a8] to-primary hover:opacity-90 text-primary-foreground font-semibold text-[13px] shadow-sm transition-all flex justify-center items-center mt-1"
        >
          {isSubmitting && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
          {isSubmitting ? "Memproses..." : "Simpan Password Baru"}
        </button>

        <div className="pt-1 text-center">
          <Link to="/login" className="text-[11px] text-gray-400 font-bold hover:text-primary hover:underline transition-colors">
            Kembali ke halaman login
          </Link>
        </div>
      </form>
    </div>
  );
}
