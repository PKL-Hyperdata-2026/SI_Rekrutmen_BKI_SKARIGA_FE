import { LoginForm } from "../components/login-form";
import { FileText } from "lucide-react";

export function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Kiri: Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-bold text-lg text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
              <FileText className="h-5 w-5" />
            </div>
            BKI Rekrutmen
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
      
      {/* Kanan: Gambar Unsplash */}
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://images.unsplash.com/photo-1572544731033-c41d0ed8316c?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="BKI Vessel"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4] dark:grayscale-0"
        />
      </div>
    </div>
  );
}
