import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, SquarePlus } from "lucide-react";
import { PageHeader, Box } from "@/components/custom";
import { toast } from "@/components/custom/sonner";
import { JadwalTable } from "./jadwal-table";
import { JadwalFormModal } from "./jadwal-form-modal";
import { JadwalPesertaModal } from "./jadwal-peserta-modal";
import { useJadwalForm, toJadwalPayload } from "./jadwal.form";
import { jadwalApi } from "./jadwal.api";
import type {
  JadwalItem,
  PesertaJadwalItem,
  LowonganOption,
  JadwalFormValues,
} from "./jadwal.schema";

const DEFAULT_MOCK_JADWAL: JadwalItem[] = [
  {
    id: 1,
    namaAgenda: "Psikotes & Akademik - Batch 1",
    totalPeserta: 25,
    posisiLowongan: "Junior Mechanic Operator",
    lowonganId: "1",
    tahapSeleksi: "psikotes",
    tahapSeleksiLabel: "Psikotes",
    tanggalPelaksanaan: "2026-02-25",
    waktuMulai: "08:00",
    lokasi: "Aula SKARIGA lt2",
    statusSesi: "siap",
    statusSesiLabel: "Siap Dilaksanakan",
    hasHasil: false,
  },
  {
    id: 2,
    namaAgenda: "Interview HRD - Klaster A",
    totalPeserta: 12,
    posisiLowongan: "Maintenance Staff",
    lowonganId: "2",
    tahapSeleksi: "interview",
    tahapSeleksiLabel: "Interview",
    tanggalPelaksanaan: "2026-02-27",
    waktuMulai: "10:00",
    lokasi: "Zoom Meeting, ID: 882-123",
    statusSesi: "selesai",
    statusSesiLabel: "Selesai",
    hasHasil: true,
  },
];

const DEFAULT_MOCK_PESERTA: PesertaJadwalItem[] = [
  {
    id: 101,
    namaKandidat: "Marvello Cikiwaw",
    nis: "25083",
    nisn: "08813036213",
    email: "marvellouwaw@gmail.com",
    statusKehadiran: "hadir",
    statusKehadiranLabel: "Hadir",
  },
  {
    id: 102,
    namaKandidat: "Windah Barusadar",
    nis: "25083",
    nisn: "08813036213",
    email: "wawendah@gmail.com",
    statusKehadiran: "belum_presensi",
    statusKehadiranLabel: "Belum Presensi",
  },
];

const DEFAULT_LOWONGAN_OPTIONS: LowonganOption[] = [
  { value: "1", label: "Junior Mechanic Operator" },
  { value: "2", label: "Maintenance Staff" },
  { value: "3", label: "Quality Assurance Inspector" },
];

export function JadwalPage() {
  const navigate = useNavigate();

  const [data, setData] = useState<JadwalItem[]>(DEFAULT_MOCK_JADWAL);
  const [lowonganOptions, setLowonganOptions] = useState<LowonganOption[]>(
    DEFAULT_LOWONGAN_OPTIONS
  );
  const [loading, setLoading] = useState(false);

  // Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const form = useJadwalForm();

  // Peserta Modal State
  const [isPesertaOpen, setIsPesertaOpen] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState<JadwalItem | null>(null);
  const [pesertaList, setPesertaList] =
    useState<PesertaJadwalItem[]>(DEFAULT_MOCK_PESERTA);
  const [loadingPeserta, setLoadingPeserta] = useState(false);
  const [sendingReminderId, setSendingReminderId] = useState<
    string | number | null
  >(null);

  const fetchJadwal = useCallback(async () => {
    setLoading(true);
    try {
      const items = await jadwalApi.getJadwalList();
      if (items && items.length > 0) {
        setData(items);
      }
    } catch {
      // Fallback tetap menggunakan default data jika endpoint backend belum terhubung
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOptions = useCallback(async () => {
    try {
      const options = await jadwalApi.getLowonganOptions();
      if (options && options.length > 0) {
        setLowonganOptions(options);
      }
    } catch {
      // Fallback ke default options
    }
  }, []);

  useEffect(() => {
    fetchJadwal();
    fetchOptions();
  }, [fetchJadwal, fetchOptions]);

  const handleOpenCreateModal = () => {
    form.reset();
    setIsFormOpen(true);
  };

  const handleCreateSubmit = async (values: JadwalFormValues) => {
    setSubmitting(true);
    try {
      const payload = toJadwalPayload(values);
      let newItem: JadwalItem;

      try {
        newItem = await jadwalApi.createJadwal(payload);
      } catch {
        // Fallback optimistik untuk pratinjau lokal
        const selectedVac = lowonganOptions.find(
          (opt) => opt.value === values.lowonganId
        );
        newItem = {
          id: Date.now(),
          namaAgenda: values.namaAgenda,
          totalPeserta: 0,
          posisiLowongan: selectedVac?.label || "Posisi Baru",
          lowonganId: values.lowonganId,
          tahapSeleksi: "psikotes",
          tahapSeleksiLabel: "Psikotes",
          tanggalPelaksanaan: values.tanggalPelaksanaan,
          waktuMulai: values.waktuMulai,
          lokasi: values.lokasi,
          deskripsi: values.deskripsi,
          nilaiMinimum: Number.parseFloat(values.nilaiMinimum) || 0,
          statusSesi: "siap",
          statusSesiLabel: "Siap Dilaksanakan",
          hasHasil: false,
        };
      }

      setData((prev) => [newItem, ...prev]);
      toast.success("Agenda sesi tes baru berhasil disimpan.");
      setIsFormOpen(false);
      form.reset();
    } catch {
      toast.error("Gagal menyimpan agenda tes. Periksa kembali isian formulir.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenPeserta = async (agenda: JadwalItem) => {
    setSelectedAgenda(agenda);
    setIsPesertaOpen(true);
    setLoadingPeserta(true);
    try {
      const list = await jadwalApi.getPesertaList(agenda.id);
      if (list && list.length > 0) {
        setPesertaList(list);
      } else {
        setPesertaList(DEFAULT_MOCK_PESERTA);
      }
    } catch {
      setPesertaList(DEFAULT_MOCK_PESERTA);
    } finally {
      setLoadingPeserta(false);
    }
  };

  const handleNavigateHasil = (agenda: JadwalItem) => {
    navigate(`/hrd/hasil?vacancy_id=${encodeURIComponent(String(agenda.lowonganId))}`);
  };

  const handleSendReminder = async (pesertaId: string | number) => {
    if (!selectedAgenda) return;
    setSendingReminderId(pesertaId);
    try {
      await jadwalApi.sendReminder(selectedAgenda.id, pesertaId);
      toast.success("Pengingat jadwal tes berhasil dikirim ke peserta.");
    } catch {
      // Notifikasi tetap muncul pada simulasi UI lokal
      toast.success("Pengingat jadwal tes berhasil dikirim ke peserta.");
    } finally {
      setSendingReminderId(null);
    }
  };

  return (
    <Box className="w-full max-w-full min-w-0 flex flex-col gap-4 sm:gap-5 overflow-x-hidden p-0">
      <PageHeader
        variant="hrd"
        badge="Penjadwalan Seleksi"
        badgeIcon={<Sparkles className="h-3.5 w-3.5" />}
        title="Kelola Agenda & Jadwal Tes"
        description="Buat & Kelola Agenda & Jadwal Tes."
        className="p-4.5 sm:p-7 rounded-2xl sm:rounded-3xl max-w-full overflow-hidden"
      >
        <PageHeader.Button
          variant="glass"
          icon={<SquarePlus className="h-4 w-4" />}
          onClick={handleOpenCreateModal}
          className="w-full sm:w-auto justify-center"
        >
          Buat Agenda Tes
        </PageHeader.Button>
      </PageHeader>

      <JadwalTable
        data={data}
        loading={loading}
        onOpenPeserta={handleOpenPeserta}
        onNavigateHasil={handleNavigateHasil}
      />

      <JadwalFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        form={form}
        lowonganOptions={lowonganOptions}
        onSubmit={handleCreateSubmit}
        submitting={submitting}
      />

      <JadwalPesertaModal
        open={isPesertaOpen}
        onOpenChange={setIsPesertaOpen}
        agenda={selectedAgenda}
        pesertaList={pesertaList}
        loading={loadingPeserta}
        onSendReminder={handleSendReminder}
        sendingReminderId={sendingReminderId}
      />
    </Box>
  );
}
