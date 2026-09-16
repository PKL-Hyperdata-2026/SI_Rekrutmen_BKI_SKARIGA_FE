import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Loader2, Mail, Eye, EyeOff, Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LoginSchemaType } from "./login.schema";
import { ForgotPasswordModal } from "../forgot-password/forgot-password-modal";

function RememberCheckbox() {
  const { watch, setValue } = useFormContext<LoginSchemaType>();
  const checked = watch("remember") || false;

  return (
    <label
      htmlFor="remember-checkbox"
      className="flex items-center gap-2 text-[13px] text-foreground font-semibold cursor-pointer select-none"
    >
      <input
        id="remember-checkbox"
        type="checkbox"
        checked={checked}
        onChange={(e) => setValue("remember", e.target.checked)}
        className="sr-only"
      />
      <div
        className={cn(
          "w-4 h-4 rounded-[3px] border-[1.5px] flex items-center justify-center transition-all",
          checked
            ? "border-primary bg-white"
            : "border-gray-300 bg-white"
        )}
      >
        {checked && <Check className="h-3 w-3 text-primary stroke-[3]" />}
      </div>
      <span className="text-[11px]">Ingat Saya</span>
    </label>
  );
}

interface LoginFormProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onSubmit"> {
  onSubmit: (data: LoginSchemaType) => Promise<void>;
  errorMessage?: string;
}

export function LoginForm({
  className,
  onSubmit,
  errorMessage,
  ...props
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useFormContext<LoginSchemaType>();

  return (
    <div className={cn("w-full max-w-[320px] mx-auto", className)} {...props}>
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
          Masuk ke <span className="whitespace-nowrap">Sistem <span className="text-primary">.</span></span>
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
        {errorMessage && (
          <div className="rounded-lg bg-red-500/10 p-2.5 text-[13px] font-medium text-red-600 border border-red-500/20">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-[11px] text-accent font-bold ml-0.5">
            Email
          </label>
          <div className={cn(
            "relative rounded-md border px-3 py-1.5 flex items-center transition-colors",
            errors.email ? "border-red-500 bg-white" : "border-gray-200 bg-[#f9fafb] focus-within:border-primary focus-within:bg-white"
          )}>
            <input
              id="email"
              type="email"
              placeholder="nama@email.com"
              className="w-full bg-transparent outline-none font-medium text-foreground text-[13px] placeholder:text-gray-400 autofill:shadow-[inset_0_0_0px_1000px_#e8f4fd] autofill:[-webkit-text-fill-color:#111827]"
              {...register("email")}
            />
            <Mail className="text-gray-400 h-3.5 w-3.5 ml-2 shrink-0" />
          </div>
          {errors.email && (
            <p className="text-red-500 text-[10px] font-bold ml-0.5">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className={cn("text-[11px] font-bold ml-0.5", errors.password ? "text-red-500" : "text-accent")}>
            Password
          </label>
          <div className={cn(
            "relative rounded-md border px-3 py-1.5 flex items-center transition-colors",
            errors.password ? "border-red-500 bg-white" : "border-gray-200 bg-[#f9fafb] focus-within:border-primary focus-within:bg-white"
          )}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-transparent outline-none font-medium text-foreground text-[13px] placeholder:text-gray-400 autofill:shadow-[inset_0_0_0px_1000px_#e8f4fd] autofill:[-webkit-text-fill-color:#111827]"
              {...register("password")}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 ml-2 hover:text-gray-600 transition-colors shrink-0"
            >
              {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-[10px] font-bold ml-0.5">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <RememberCheckbox />
          <button
            type="button"
            onClick={() => setForgotOpen(true)}
            className="text-[11px] text-red-600 font-bold hover:underline cursor-pointer"
          >
            Lupa Password
          </button>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-2 rounded-md border border-white/20 bg-gradient-to-r from-[#1f66a8] to-primary hover:opacity-90 text-primary-foreground font-semibold text-[13px] shadow-sm transition-all flex justify-center items-center"
        >
          {isSubmitting && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
          {isSubmitting ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <ForgotPasswordModal open={forgotOpen} onOpenChange={setForgotOpen} />
    </div>
  );
}
