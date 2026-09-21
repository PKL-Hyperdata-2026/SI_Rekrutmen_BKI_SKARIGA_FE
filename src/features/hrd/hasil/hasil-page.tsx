import { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  Send,
  Save,
  GraduationCap,
} from "lucide-react";
import { PageHeader, Box } from "@/components/custom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/custom/sonner";
import { hasilApi, type SelectionResultOptionsData } from "./hasil.api";
import type {
  SelectionResultItem,
  SelectionResultSummary,
} from "./hasil.schema";
import { HasilTable } from "./hasil-table";
import { HasilModal } from "./hasil-modal";
import { useHasilEvaluationModal } from "./hasil.form";

export function HasilPage() {
  const [data, setData] = useState<SelectionResultItem[]>([]);
  const [summary, setSummary] = useState<SelectionResultSummary>({
    total: 0,
    lolos: 0,
    gagal: 0,
    cadangan: 0,
  });
  const [options, setOptions] = useState<SelectionResultOptionsData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const [selectedVacancyId, setSelectedVacancyId] = useState<string>("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        job_vacancy_id: selectedVacancyId !== "all" ? selectedVacancyId : undefined,
      };

      const res = await hasilApi.getSelectionResults(params);
      setData(res.applicants.data || []);
      if (res.summary) {
        setSummary(res.summary);
      }
      if (res.filters) {
        setOptions(res.filters);
        if (selectedVacancyId === "all" && res.filters.vacancies.length > 0) {
          setSelectedVacancyId(String(res.filters.vacancies[0].value));
        }
      }
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedVacancyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const modal = useHasilEvaluationModal({
    onSuccess: fetchData,
  });

  const handlePublishSync = async () => {
    if (selectedVacancyId === "all" || !selectedVacancyId) {
      toast.error("Silakan pilih posisi lowongan kerja terlebih dahulu.");
      return;
    }

    setPublishing(true);
    try {
      const count = await hasilApi.publish(selectedVacancyId);
      toast.success(
        `Pengumuman hasil seleksi berhasil dikirim & disinkronkan (${count} pelamar diproses).`
      );
      fetchData();
    } catch {
      toast.error("Gagal mengirim pengumuman hasil seleksi.");
    } finally {
      setPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    if (selectedVacancyId === "all" || !selectedVacancyId) {
      toast.error("Silakan pilih posisi lowongan kerja terlebih dahulu.");
      return;
    }

    setSavingDraft(true);
    try {
      const count = await hasilApi.saveDraft(selectedVacancyId);
      toast.success(`Hasil seleksi berhasil disimpan sebagai draft (${count} data).`);
      fetchData();
    } catch {
      toast.error("Gagal menyimpan draft.");
    } finally {
      setSavingDraft(false);
    }
  };

  return (
    <Box className="w-full max-w-full min-w-0 flex flex-col gap-4 sm:gap-5 overflow-x-hidden p-0">
      <PageHeader
        variant="hrd"
        badge="Rekap Seleksi dan Sync BKK"
        badgeIcon={<Sparkles className="h-3.5 w-3.5" />}
        title="Penetapan Kelulusan & Finansial"
        description="Kelola seluruh proses rekrutmen mulai dari publikasi lowongan hingga penempatan kandidat."
        className="p-4.5 sm:p-7 rounded-2xl sm:rounded-3xl max-w-full overflow-hidden"
      >
        <PageHeader.Button
          variant="primary"
          icon={<Send className="h-4 w-4" />}
          onClick={handlePublishSync}
          disabled={publishing || loading}
          className="w-full sm:w-auto justify-center"
        >
          {publishing ? "Mengirim..." : "Kirim Pengumuman & Sync"}
        </PageHeader.Button>
        <PageHeader.Button
          variant="glass"
          icon={<Save className="h-4 w-4" />}
          onClick={handleSaveDraft}
          disabled={savingDraft || loading}
          className="w-full sm:w-auto justify-center"
        >
          {savingDraft ? "Menyimpan..." : "Simpan Draft"}
        </PageHeader.Button>
      </PageHeader>

      <Card className="theme-hrd rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
        <CardContent className="p-0 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="w-full lg:w-96">
            <Select value={selectedVacancyId} onValueChange={setSelectedVacancyId}>
              <SelectTrigger className="w-full h-10 bg-purple-50/40 border-purple-200 rounded-xl text-xs font-semibold text-slate-800 gap-2">
                <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                <SelectValue placeholder="Pilih Lowongan Kerja" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Lowongan Aktif</SelectItem>
                {(options?.vacancies || []).map((v) => (
                  <SelectItem key={v.value} value={String(v.value)}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border border-purple-200/80 rounded-full px-4 py-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-medium text-slate-600 bg-purple-50/20">
            <span>
              Total :{" "}
              <strong className="font-bold text-primary">
                {summary.total} Pelamar
              </strong>
            </span>
            <span className="text-purple-300">|</span>
            <span>
              Lolos :{" "}
              <strong className="font-bold text-primary">
                {summary.lolos} Pelamar
              </strong>
            </span>
            <span className="text-purple-300">|</span>
            <span>
              Gagal :{" "}
              <strong className="font-bold text-primary">
                {summary.gagal} Pelamar
              </strong>
            </span>
            <span className="text-purple-300">|</span>
            <span>
              Cadangan :{" "}
              <strong className="font-bold text-primary">
                {summary.cadangan} Pelamar
              </strong>
            </span>
          </div>
        </CardContent>
      </Card>

      <HasilTable
        data={data}
        loading={loading}
        onEdit={modal.openModal}
      />

      <HasilModal
        isOpen={modal.isOpen}
        onOpenChange={(open) => !open && modal.closeModal()}
        selectedItem={modal.selectedItem}
        form={modal.form}
        selectedFile={modal.selectedFile}
        onFileSelect={modal.setSelectedFile}
        onSubmit={modal.handleSubmit}
        submitting={modal.submitting}
      />
    </Box>
  );
}
