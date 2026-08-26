import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import { Loader2, Eye, EyeOff, Building2, ShieldQuestion, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/api/axios";
import {
  resetPasswordSchema,
  type ResetPasswordSchemaType,
} from "../schemas/reset-password.schema";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") || searchParams.get("amp;email") || "";
  const isValidLink = token !== "" && email !== "";

  return (
    <div className="theme-siswa flex flex-col lg:flex-row min-h-screen bg-background text-foreground">
      <div className="relative w-full h-[28vh] lg:h-auto lg:flex-1 lg:order-2 overflow-hidden">
        <svg
          className="absolute left-0 top-0 h-full w-87.5 xl:w-112.5 z-10 hidden lg:block"
          viewBox="0 0 500 1000"
          preserveAspectRatio="none"
        >
          <path
            d="M0,-10 L450,-10 C450,200 100,300 150,500 C200,700 500,800 150,1010 L0,1010 Z"
            className="fill-background"
          />
        </svg>

        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Classroom"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="w-full lg:w-[50%] shrink-0 relative z-20 flex flex-col px-6 pt-5 pb-6 lg:p-24 justify-center lg:order-1 bg-background -mt-4 lg:mt-0 rounded-t-3xl lg:rounded-none">
        {isValidLink ? (
          <ResetPasswordForm token={token} email={email} />
        ) : (
          <InvalidResetLink />
        )}
      </div>
    </div>
  );
}

function ResetPasswordForm({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, email },
  });

  const onSubmit = async (data: ResetPasswordSchemaType) => {
    setErrorMsg("");
    try {
      await api.post("/reset-password", {
        token: data.token,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      navigate("/login", {
        state: {
          flashMessage: "Password berhasil direset. Silakan login dengan password baru kamu.",
        },
      });
    } catch (error) {
      if (isAxiosError(error)) {
        const fieldError = error.response?.data?.errors?.password?.[0];
        setErrorMsg(
          fieldError || error.response?.data?.message || "Terjadi kesalahan saat mereset password."
        );
      } else {
        setErrorMsg("Terjadi kesalahan saat mereset password.");
      }
    }
  };

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
        {errorMsg && (
          <div className="rounded-lg bg-red-500/10 p-2.5 text-[13px] font-medium text-red-600 border border-red-500/20">
            {errorMsg}
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
              className="text-gray-400 ml-2 hover:text-gray-600 transition-colors flex-shrink-0 cursor-pointer"
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
              className="text-gray-400 ml-2 hover:text-gray-600 transition-colors flex-shrink-0 cursor-pointer"
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

function InvalidResetLink() {
  return (
    <div className="w-full max-w-[320px] mx-auto flex flex-col items-center text-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm mb-1">
        <Building2 className="h-4 w-4" />
      </div>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <ShieldQuestion className="h-7 w-7 text-red-500" />
      </div>
      <h1 className="text-lg lg:text-xl font-extrabold text-foreground tracking-tight">
        Tautan Tidak Valid<span className="text-primary">.</span>
      </h1>
      <p className="text-gray-500 text-[12px] leading-relaxed">
        Tautan reset password tidak valid atau telah kedaluwarsa. Silakan ajukan tautan baru melalui halaman login.
      </p>
      <Link
        to="/login"
        className="mt-2 w-full py-2 rounded-md border border-white/20 bg-gradient-to-r from-[#1f66a8] to-primary hover:opacity-90 text-primary-foreground font-semibold text-[13px] shadow-sm transition-all flex justify-center items-center gap-2"
      >
        <Lock className="h-3.5 w-3.5" />
        Kembali ke Login
      </Link>
    </div>
  );
}
