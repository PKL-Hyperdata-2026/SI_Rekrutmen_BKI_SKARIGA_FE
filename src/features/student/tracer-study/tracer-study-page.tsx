import { useState, useEffect, useCallback } from "react";
import { LineChart } from "lucide-react";
import { PageHeader } from "@/components/custom/page-header";
import { toast } from "@/components/custom/sonner";
import { tracerApi } from "./tracer-study.api";
import { type TracerStudyData, type SubmitTracerPayload } from "./tracer-study.schema";
import { TracerStudyForm } from "./tracer-study-form";
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Tracer Study Alumni"
        description="Pelacakan keterserapan karir dan riwayat alumni SMK PGRI 3 Malang."
        badge="Tracer Study"
        badgeIcon={<LineChart className="h-3.5 w-3.5 text-cyan-200" />}
        variant="student"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
        <div className="lg:col-span-2">
          <TracerStudyForm
            initialData={tracerData}
            isLoading={isLoading}
            isSaving={isSaving}
            onSubmit={handleSubmitTracer}
          />
        </div>

        <div className="lg:col-span-1">
          <TracerStatsSidebar />
        </div>
      </div>
    </div>
  );
}
