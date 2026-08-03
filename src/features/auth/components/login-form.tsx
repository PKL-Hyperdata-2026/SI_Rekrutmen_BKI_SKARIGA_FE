import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, Eye, EyeOff, Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/hooks/useApp";
import { setCredentials } from "@/slices/authSlice";
import { api } from "@/api/axios";
import { useNavigate } from "react-router";

const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(1, { message: "Password tidak boleh kosong" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function RememberCheckbox() {
  const [checked, setChecked] = useState(false);

  return (
    <label
      className="flex items-center gap-2 text-[13px] text-foreground font-semibold cursor-pointer select-none"
      onClick={() => setChecked(!checked)}
    >
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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg("");
    try {
      const response = await api.post("/login", {
        email: data.email,
        password: data.password,
      });

      const { user, access_token } = response.data;
      localStorage.setItem("access_token", access_token);
      dispatch(setCredentials(user));
      navigate("/");
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.message || "Terjadi kesalahan saat login."
      );
    }
  };

  return (
    <div className={cn("w-full max-w-[320px] mx-auto", className)} {...props}>
      <div className="hidden lg:flex items-center gap-2.5 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-accent text-[14px] leading-tight">BKI SKARIGA</span>
          <span className="text-primary text-[11px] font-medium leading-tight">Portal Siswa & Alumni</span>
        </div>
      </div>

      <div className="mb-4 lg:mb-5">
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">
          PORTAL SISWA & ALUMNI
        </p>
        <h1 className="text-xl lg:text-2xl font-extrabold text-foreground tracking-tight leading-tight">
          Lanjut sebagai <span className="whitespace-nowrap">Siswa <span className="text-primary">.</span></span>
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
        {errorMsg && (
          <div className="rounded-lg bg-red-500/10 p-2.5 text-[13px] font-medium text-red-600 border border-red-500/20">
            {errorMsg}
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
            <Mail className="text-gray-400 h-3.5 w-3.5 ml-2 flex-shrink-0" />
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
              className="text-gray-400 ml-2 hover:text-gray-600 transition-colors flex-shrink-0"
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
          <a href="#" className="text-[11px] text-red-600 font-bold hover:underline">
            Lupa Password
          </a>
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
    </div>
  );
}
