import { useState, useEffect, useCallback } from "react";
import { LineChart } from "lucide-react";
import { PageHeader } from "@/components/custom/page-header";
import { toast } from "@/components/custom/sonner";
import { tracerApi } from "./tracer.api";
import { type TracerStudyData, type SubmitTracerPayload } from "./tracer.schema";
import { TracerCareerForm } from "./tracer-career-form";
import { TracerStatsSidebar } from "./tracer-stats-sidebar";

export function TracerStudy() {
  const [tracerData, setTracerData] = useState<TracerStudyData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fetchTracerStudy = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await tracerApi.getTracerStudy();
      if (res.data?.data) {
        setTracerData(res.data.data);
      } else {
        setTracerData(null);
      }
    } catch {
      // If user has no tracer study yet or is not alumni, data will be null
      setTracerData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTracerStudy();
  }, [fetchTracerStudy]);

  const handleSubmitTracer = async (payload: SubmitTracerPayload) => {
    try {
      setIsSaving(true);
      const res = await tracerApi.submitTracerStudy(payload);
      if (res.data?.success || res.data?.data) {
        toast.success(
          res.data?.message || "Data tracer study berhasil disimpan!"
        );
        if (res.data?.data) {
          setTracerData(res.data.data);
        } else {
          await fetchTracerStudy();
        }
      } else {
        toast.success("Data tracer study berhasil diperbarui!");
        await fetchTracerStudy();
      }
    } catch (error: unknown) {
      const err = error as {
        response?: {
          data?: {
            message?: string;
            errors?: Record<string, string[]>;
          };
        };
      };

      const serverMessage = err.response?.data?.message;
      const validationErrors = err.response?.data?.errors;

      if (validationErrors) {
        const firstError = Object.values(validationErrors)[0]?.[0];
        toast.error(firstError || "Gagal menyimpan data tracer study.");
      } else if (serverMessage) {
        toast.error(serverMessage);
      } else {
        toast.error("Terjadi kesalahan saat menyimpan data tracer study.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // const hasSubmitted = Boolean(tracerData && tracerData.careerStatus);

  return (
    <div className="space-y-3.5 pb-6">
      {/* Header Banner */}
      <PageHeader
        variant="student"
        badge="Penelusuran Keterserapan Kerja Alumni"
        badgeIcon={<LineChart className="h-3 w-3" />}
        title="Tracer Studi SKARIGA"
        description="Khusus diisi oleh alumni untuk memperbarui data keterserapan kerja dan ketersediaan karir."
      >
        {/* <div className="bg-white/10 border border-white/25 backdrop-blur-xs shadow-md rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center gap-3">
          {hasSubmitted ? (
            <>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/25 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-wider text-emerald-300 uppercase">
                  STATUS TRACER
                </span>
                <span className="text-xs font-semibold text-white mt-0.5">
                  Sudah Memperbarui Data
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="h-8 w-8 rounded-lg bg-amber-500/25 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 shadow-inner">
                <Clock className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-wider text-amber-300 uppercase">
                  STATUS TRACER
                </span>
                <span className="text-xs font-semibold text-amber-200 mt-0.5">
                  Belum Memperbarui Data
                </span>
              </div>
            </>
          )}
        </div> */}
      </PageHeader>

      {/* Main Grid: Form on Left, Stats & Info on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <TracerCareerForm
            initialData={tracerData}
            isLoading={isLoading}
            isSaving={isSaving}
            onSubmit={handleSubmitTracer}
          />
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <TracerStatsSidebar />
        </div>
      </div>
    </div>
  );
}
export default TracerStudy;
