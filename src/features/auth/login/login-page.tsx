import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { isAxiosError } from "axios";
import { useNavigate, useLocation } from "react-router";
import { useAppDispatch } from "@/hooks/use-app";
import { setCredentials } from "@/slices/authSlice";
import { useLoginForm } from "./login.form";
import { loginApi } from "./login.api";
import { LoginForm } from "./login-form";
import type { LoginSchemaType } from "./login.schema";

export function LoginPage() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const form = useLoginForm();
  const flashMessage = (location.state as { flashMessage?: string } | null)?.flashMessage;

  const onSubmit = async (data: LoginSchemaType) => {
    setErrorMsg("");
    try {
      const response = await loginApi(data);
      const { user, access_token } = response;
      localStorage.setItem("access_token", access_token);
      dispatch(setCredentials(user));
      navigate("/");
    } catch (error) {
      if (isAxiosError(error)) {
        setErrorMsg(error.response?.data?.message || "Terjadi kesalahan saat login.");
      } else {
        setErrorMsg("Terjadi kesalahan saat login.");
      }
    }
  };

  return (
    <div className="theme-siswa flex flex-col lg:flex-row min-h-screen bg-background text-foreground">
      <div className="relative w-full h-[28vh] lg:h-auto lg:flex-1 lg:order-2 overflow-hidden">
        <svg 
          className="absolute left-0 top-0 h-full w-[350px] xl:w-[450px] z-10 hidden lg:block" 
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
        {flashMessage && (
          <div className="absolute top-6 left-6 right-6 lg:left-24 lg:right-auto lg:max-w-[320px] rounded-lg bg-emerald-500/10 p-2.5 text-[13px] font-medium text-emerald-700 border border-emerald-500/20">
            {flashMessage}
          </div>
        )}
        <FormProvider {...form}>
          <LoginForm onSubmit={onSubmit} errorMessage={errorMsg} />
        </FormProvider>
      </div>
    </div>
  );
}
