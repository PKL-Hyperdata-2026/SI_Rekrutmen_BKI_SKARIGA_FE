import { Link } from "react-router-dom";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UnauthorizedPage() {
  return (
    <div
      role="alert"
      aria-labelledby="unauthorized-title"
      aria-describedby="unauthorized-desc"
      className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 ring-8 ring-red-50/50">
        <AlertCircle className="h-10 w-10" aria-hidden="true" />
      </div>

      <h1
        id="unauthorized-title"
        className="mb-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
      >
        Akses Ditolak (403)
      </h1>

      <p
        id="unauthorized-desc"
        className="mb-8 max-w-md text-sm text-slate-600 sm:text-base"
      >
        Anda tidak memiliki izin akses untuk membuka halaman ini. Silakan kembali ke dashboard utama Anda.
      </p>

      <Button asChild className="gap-2 font-medium shadow-sm">
        <Link to="/">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Kembali ke Dashboard
        </Link>
      </Button>
    </div>
  );
}
