import { useCallback, useEffect, useState } from 'react';
import { LaporanHeader } from './components/laporan-header';
import { LaporanFilterBar } from './components/laporan-filter-bar';
import { TabRekrutmen } from './components/tab-rekrutmen';
import { TabAbsensi } from './components/tab-absensi';
import { TabKeterserapan } from './components/tab-keterserapan';
import { TabTracerStudy } from './components/tab-tracer-study';
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
  // NOTE: semua setState di sini terjadi setelah await (async boundary),
  // dan setIsLoading(true) dilakukan dari event handler, bukan dari effect.
  const fetchActiveTabReport = useCallback(
    async (tab: ReportTabType = activeTab, snapshot: Partial<ReportFilterState> = filters) => {
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
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [activeTab, filters],
  );

  useEffect(() => {
    void fetchActiveTabReport(activeTab, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handlePrintPDF = () => {
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
    <div className="space-y-6 pb-12 print:p-0 print:space-y-4">
      {/* Header Banner */}
      <LaporanHeader onPrint={handlePrintPDF} />

      {/* Print Header (Only visible in PDF/Print) */}
      <div className="hidden print:block border-b pb-4 text-center">
        <h2 className="text-xl font-bold">SMK SKARIGA - BKI & TRACER STUDY</h2>
        <p className="text-xs text-slate-500">Rekapitulasi Laporan Resmi Administrator</p>
      </div>

      {/* Tab Nav Switcher */}
      <div className="flex items-center gap-2 rounded-xl bg-white p-1.5 border border-slate-200/80 shadow-sm print:hidden">
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
          onApply={() => void fetchActiveTabReport('rekrutmen', filters)}
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
          onApply={() => void fetchActiveTabReport('absensi', filters)}
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
          onApply={() => void fetchActiveTabReport('keterserapan', filters)}
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
          onApply={() => void fetchActiveTabReport('tracer-study', filters)}
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
  );
}

export const LaporanCetakPage = LaporanPage;
