import { useCallback, useEffect, useState } from 'react';
import { toast } from '@/components/custom/sonner';
import { useAppSelector } from '@/hooks/use-app';
import { LaporanHeader } from './components/laporan-header';
import { LaporanFilterBar } from './components/laporan-filter-bar';
import { TabRekrutmen } from './components/tab-rekrutmen';
import { TabAbsensi } from './components/tab-absensi';
import { TabKeterserapan } from './components/tab-keterserapan';
import { TabTracerStudy } from './components/tab-tracer-study';
import { LaporanPrintDocument } from './components/laporan-print-document';
import { reportApi } from './laporan.api';
import type {
  AbsorptionMetrics,
  AbsorptionRow,
  AttendanceMetrics,
  AttendanceRow,
  LaporanOptions,
  RecruitmentMetrics,
  RecruitmentRow,
  ReportFilterState,
  ReportTabType,
  TracerStudyMetrics,
  TracerStudyRow,
} from './laporan.types';

const initialFilters: ReportFilterState = {
  startDate: '',
  endDate: '',
  applicantType: '',
  companyId: '',
  majorId: '',
  graduationYear: '',
};

const initialOptions: LaporanOptions = {
  companies: [],
  majors: [],
  graduation_years: [],
};

export function LaporanPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<ReportTabType>('rekrutmen');

  // Filter States
  const [filters, setFilters] = useState<ReportFilterState>(initialFilters);

  // Dynamic Options
  const [options, setOptions] = useState<LaporanOptions>(initialOptions);

  // Report Data per tab
  const [rekrutmenData, setRekrutmenData] = useState<{ metrics: RecruitmentMetrics; data: RecruitmentRow[] }>({
    metrics: {},
    data: [],
  });
  const [absensiData, setAbsensiData] = useState<{ metrics: AttendanceMetrics; data: AttendanceRow[] }>({
    metrics: {},
    data: [],
  });
  const [keterserapanData, setKeterserapanData] = useState<{ metrics: AbsorptionMetrics; data: AbsorptionRow[] }>({
    metrics: {},
    data: [],
  });
  const [tracerData, setTracerData] = useState<{ metrics: TracerStudyMetrics; data: TracerStudyRow[] }>({
    metrics: {},
    data: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initial Fetch Options
  useEffect(() => {
    let cancelled = false;
    reportApi
      .getOptions()
      .then((res) => {
        if (!cancelled && res) setOptions(res);
      })
      .catch((err: unknown) => {
        console.error(err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch Report Data based on active tab.
  const fetchActiveTabReport = useCallback(
    async (tab: ReportTabType, snapshot: Partial<ReportFilterState>) => {
      try {
        if (tab === 'rekrutmen') {
          const res = await reportApi.getRecruitment(snapshot);
          setRekrutmenData({ metrics: res.metrics ?? {}, data: res.data ?? [] });
        } else if (tab === 'absensi') {
          const res = await reportApi.getAttendance(snapshot);
          setAbsensiData({ metrics: res.metrics ?? {}, data: res.data ?? [] });
        } else if (tab === 'keterserapan') {
          const res = await reportApi.getAbsorption(snapshot);
          setKeterserapanData({ metrics: res.metrics ?? {}, data: res.data ?? [] });
        } else if (tab === 'tracer-study') {
          const res = await reportApi.getTracerStudy(snapshot);
          setTracerData({ metrics: res.metrics ?? {}, data: res.data ?? [] });
        }
      } catch (err: unknown) {
        if (err && typeof err === 'object' && ('code' in err || 'name' in err)) {
          const e = err as { code?: string; name?: string };
          if (e.code === 'ERR_CANCELED' || e.name === 'CanceledError' || e.name === 'AbortError') {
            return;
          }
        }
        console.error(err);
        toast.error('Gagal memuat data laporan.');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    let isSubscribed = true;

    const load = async () => {
      try {
        if (activeTab === 'rekrutmen') {
          const res = await reportApi.getRecruitment(filters);
          if (isSubscribed) setRekrutmenData({ metrics: res.metrics ?? {}, data: res.data ?? [] });
        } else if (activeTab === 'absensi') {
          const res = await reportApi.getAttendance(filters);
          if (isSubscribed) setAbsensiData({ metrics: res.metrics ?? {}, data: res.data ?? [] });
        } else if (activeTab === 'keterserapan') {
          const res = await reportApi.getAbsorption(filters);
          if (isSubscribed) setKeterserapanData({ metrics: res.metrics ?? {}, data: res.data ?? [] });
        } else if (activeTab === 'tracer-study') {
          const res = await reportApi.getTracerStudy(filters);
          if (isSubscribed) setTracerData({ metrics: res.metrics ?? {}, data: res.data ?? [] });
        }
      } catch (err: unknown) {
        if (!isSubscribed) return;
        if (err && typeof err === 'object' && ('code' in err || 'name' in err)) {
          const e = err as { code?: string; name?: string };
          if (e.code === 'ERR_CANCELED' || e.name === 'CanceledError' || e.name === 'AbortError') {
            return;
          }
        }
        console.error(err);
        toast.error('Gagal memuat data laporan.');
      } finally {
        if (isSubscribed) setIsLoading(false);
      }
    };

    void load();

    return () => {
      isSubscribed = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // FITUR CETAK DIARSIPKAN SEMENTARA
  // Untuk mengaktifkan kembali, ubah nilai isPrintEnabled menjadi true
  const isPrintEnabled = false;

  const handlePrintPDF = () => {
    if (!isPrintEnabled) return;
    window.print();
  };

  const handleTabChange = (tab: ReportTabType) => {
    if (tab === activeTab) return;
    setIsLoading(true);
    setActiveTab(tab);
  };

  const handleApply = (tab: ReportTabType) => {
    setIsLoading(true);
    void fetchActiveTabReport(tab, filters);
  };

  const tabs: { key: ReportTabType; label: string }[] = [
    { key: 'rekrutmen', label: 'Laporan Rekrutmen' },
    { key: 'absensi', label: 'Laporan Absensi' },
    { key: 'keterserapan', label: 'Laporan Keterserapan' },
    { key: 'tracer-study', label: 'Laporan Tracer Study' },
  ];

  return (
    <div className="space-y-6 pb-12 print:p-0 print:m-0 print:space-y-0">
      {/* 1. TAMPILAN RESMI CETAK (Diarsipkan: Aktifkan kembali saat PRD Cetak disetujui) */}
      {isPrintEnabled && (
        <LaporanPrintDocument
          activeTab={activeTab}
          filters={filters}
          options={options}
          rekrutmenData={rekrutmenData}
          absensiData={absensiData}
          keterserapanData={keterserapanData}
          tracerData={tracerData}
          adminName={user?.name || 'Administrator BKK SKARIGA'}
        />
      )}

      {/* 2. TAMPILAN DASHBOARD INTERAKTIF WEB (Disembunyikan Saat Print) */}
      <div className="space-y-6 print:hidden">
        {/* Header Banner */}
        <LaporanHeader onPrint={handlePrintPDF} />

        {/* Tab Nav Switcher */}
        <div className="flex items-center gap-2 rounded-xl bg-white p-1.5 border border-slate-200/80 shadow-sm">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-sidebar-strip to-sidebar-gradient-from text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filter Bar */}
        {activeTab === 'rekrutmen' && (
          <LaporanFilterBar
            startDate={filters.startDate}
            endDate={filters.endDate}
            onStartDateChange={(val) => setFilters({ ...filters, startDate: val })}
            onEndDateChange={(val) => setFilters({ ...filters, endDate: val })}
            selectLabel="Pelamar"
            selectPlaceholder="Semua Pelamar"
            selectedValue={filters.applicantType}
            onSelectChange={(val) => setFilters({ ...filters, applicantType: val })}
            options={[
              { value: 'siswa', label: 'Siswa Aktif' },
              { value: 'alumni', label: 'Alumni' },
            ]}
            onApply={() => handleApply('rekrutmen')}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'absensi' && (
          <LaporanFilterBar
            startDate={filters.startDate}
            endDate={filters.endDate}
            onStartDateChange={(val) => setFilters({ ...filters, startDate: val })}
            onEndDateChange={(val) => setFilters({ ...filters, endDate: val })}
            selectLabel="Perusahaan"
            selectPlaceholder="Semua Perusahaan"
            selectedValue={filters.companyId}
            onSelectChange={(val) => setFilters({ ...filters, companyId: val })}
            options={options.companies}
            onApply={() => handleApply('absensi')}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'keterserapan' && (
          <LaporanFilterBar
            startDate={filters.startDate}
            endDate={filters.endDate}
            onStartDateChange={(val) => setFilters({ ...filters, startDate: val })}
            onEndDateChange={(val) => setFilters({ ...filters, endDate: val })}
            selectLabel="Jurusan"
            selectPlaceholder="Semua Jurusan"
            selectedValue={filters.majorId}
            onSelectChange={(val) => setFilters({ ...filters, majorId: val })}
            options={options.majors}
            onApply={() => handleApply('keterserapan')}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'tracer-study' && (
          <LaporanFilterBar
            startDate={filters.startDate}
            endDate={filters.endDate}
            onStartDateChange={(val) => setFilters({ ...filters, startDate: val })}
            onEndDateChange={(val) => setFilters({ ...filters, endDate: val })}
            selectLabel="Tahun Lulus"
            selectPlaceholder="Semua"
            selectedValue={filters.graduationYear}
            onSelectChange={(val) => setFilters({ ...filters, graduationYear: val })}
            options={options.graduation_years}
            onApply={() => handleApply('tracer-study')}
            isLoading={isLoading}
          />
        )}

        {/* Active Tab View */}
        <div>
          {activeTab === 'rekrutmen' && (
            <TabRekrutmen metrics={rekrutmenData.metrics} data={rekrutmenData.data} isLoading={isLoading} />
          )}
          {activeTab === 'absensi' && (
            <TabAbsensi metrics={absensiData.metrics} data={absensiData.data} isLoading={isLoading} />
          )}
          {activeTab === 'keterserapan' && (
            <TabKeterserapan metrics={keterserapanData.metrics} data={keterserapanData.data} isLoading={isLoading} />
          )}
          {activeTab === 'tracer-study' && (
            <TabTracerStudy metrics={tracerData.metrics} data={tracerData.data} isLoading={isLoading} />
          )}
        </div>
      </div>
    </div>
  );
}

export const LaporanCetakPage = LaporanPage;

