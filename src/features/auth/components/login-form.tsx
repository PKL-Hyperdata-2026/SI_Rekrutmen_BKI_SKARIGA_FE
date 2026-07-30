import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema } from "../schemas/login.schema";
import type { LoginSchemaType } from "../schemas/login.schema";
import { api } from "@/api/axios";
import { useAppDispatch } from "@/hooks/useApp";
import { setCredentials } from "@/slices/authSlice";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginSchemaType) {
    setErrorMsg("");
    try {
      const response = await api.post("/login", values);
      const { access_token, user } = response.data;
      
      localStorage.setItem("access_token", access_token);
      dispatch(setCredentials(user));
      navigate("/");
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Terjadi kesalahan. Silakan coba lagi.");
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Masuk ke Akun Anda</CardTitle>
          <CardDescription>
            Masukkan email dan password Anda di bawah ini untuk mengakses sistem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {errorMsg && (
                <div className="rounded-md bg-red-500/10 p-3 text-sm font-medium text-red-500 border border-red-500/20">
                  {errorMsg}
                </div>
              )}
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && (
                  <FieldDescription className="text-red-500">{errors.email.message}</FieldDescription>
                )}
              </Field>
              <Field data-invalid={!!errors.password}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Lupa password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                {errors.password && (
                  <FieldDescription className="text-red-500">{errors.password.message}</FieldDescription>
                )}
              </Field>
              <Field className="pt-2">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Memproses..." : "Masuk"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
