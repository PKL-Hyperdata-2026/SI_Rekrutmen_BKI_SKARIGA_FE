import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { isAxiosError } from "axios";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Building2, ShieldQuestion, Lock } from "lucide-react";
import { useResetPasswordForm } from "./reset-password.form";
import { resetPasswordApi } from "./reset-password.api";
import { ResetPasswordForm } from "./reset-password-form";
import type { ResetPasswordSchemaType } from "./reset-password.schema";

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

function ResetPasswordContainer({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const form = useResetPasswordForm(token, email);

  const onSubmit = async (data: ResetPasswordSchemaType) => {
    setErrorMsg("");
    try {
      await resetPasswordApi(data);
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
    <FormProvider {...form}>
      <ResetPasswordForm
        email={email}
        onSubmit={onSubmit}
        errorMessage={errorMsg}
      />
    </FormProvider>
  );
}

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
          <ResetPasswordContainer token={token} email={email} />
        ) : (
          <InvalidResetLink />
        )}
      </div>
    </div>
  );
}
