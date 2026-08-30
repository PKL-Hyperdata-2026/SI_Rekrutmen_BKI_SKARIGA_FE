import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  description?: string;
  duration: number;
  isExiting?: boolean;
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners: Set<Listener> = new Set();

const notify = () => {
  listeners.forEach((l) => l([...toasts]));
};

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    toast.custom("success", message, options);
  },
  error: (message: string, options?: ToastOptions) => {
    toast.custom("error", message, options);
  },
  info: (message: string, options?: ToastOptions) => {
    toast.custom("info", message, options);
  },
  warning: (message: string, options?: ToastOptions) => {
    toast.custom("warning", message, options);
  },
  custom: (type: ToastType, message: string, options?: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = options?.duration ?? 4000;
    const newToast: ToastItem = {
      id,
      type,
      title: options?.title || message,
      description: options?.title ? message : options?.description,
      duration,
      isExiting: false,
    };
    toasts = [newToast, ...toasts.slice(0, 4)];
    notify();

    if (duration > 0) {
      setTimeout(() => {
        toast.dismiss(id);
      }, duration);
    }
    return id;
  },
  dismiss: (id?: string) => {
    if (id) {
      toasts = toasts.map((t) => (t.id === id ? { ...t, isExiting: true } : t));
      notify();
      setTimeout(() => {
        toasts = toasts.filter((t) => t.id !== id);
        notify();
      }, 300);
    } else {
      toasts = toasts.map((t) => ({ ...t, isExiting: true }));
      notify();
      setTimeout(() => {
        toasts = [];
        notify();
      }, 300);
    }
  },
};

export function Toaster({
  position = "top-center",
}: {
  position?: "top-center" | "top-right" | "bottom-right";
}) {
  const [activeToasts, setActiveToasts] = React.useState<ToastItem[]>([]);

  React.useEffect(() => {
    listeners.add(setActiveToasts);
    return () => {
      listeners.delete(setActiveToasts);
    };
  }, []);

  if (activeToasts.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed z-[9999] flex flex-col gap-2.5 pointer-events-none p-4 w-full max-w-[420px] transition-all",
        position === "top-center" && "top-4 left-1/2 -translate-x-1/2 items-center",
        position === "top-right" && "top-4 right-4 items-end",
        position === "bottom-right" && "bottom-4 right-4 items-end"
      )}
    >
      {activeToasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-300 ease-out",
            t.isExiting
              ? "opacity-0 -translate-y-5 scale-95 pointer-events-none"
              : "opacity-100 translate-y-0 scale-100 animate-in fade-in slide-in-from-top-3",
            "bg-white/95 text-slate-900 border-slate-200/90",
            t.type === "success" && "border-emerald-500/30 bg-emerald-50/95",
            t.type === "error" && "border-rose-500/30 bg-rose-50/95",
            t.type === "warning" && "border-amber-500/30 bg-amber-50/95",
            t.type === "info" && "border-primary/30 bg-white/95"
          )}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="shrink-0">
              {t.type === "success" && (
                <div className="h-8 w-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                </div>
              )}
              {t.type === "error" && (
                <div className="h-8 w-8 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-600">
                  <AlertCircle className="h-4.5 w-4.5" />
                </div>
              )}
              {t.type === "warning" && (
                <div className="h-8 w-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600">
                  <AlertTriangle className="h-4.5 w-4.5" />
                </div>
              )}
              {t.type === "info" && (
                <div className="h-8 w-8 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
                  <Info className="h-4.5 w-4.5" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                {t.title}
              </div>
              {t.description && (
                <div className="text-xs text-slate-600 mt-0.5 leading-snug">
                  {t.description}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            aria-label="Tutup notifikasi"
            className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors cursor-pointer self-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
