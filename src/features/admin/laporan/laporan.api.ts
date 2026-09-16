import api from '@/api/axios';
import type {
  AbsorptionMetrics,
  AbsorptionRow,
  AttendanceMetrics,
  AttendanceRow,
  LaporanOptions,
  RecruitmentMetrics,
  RecruitmentRow,
  ReportFilterState,
  TracerStudyMetrics,
  TracerStudyRow,
} from './laporan.types';

interface ReportEnvelope<TMetrics, TRow> {
  metrics: TMetrics;
  data: TRow[];
}

function cleanParams(params: Record<string, string | undefined>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(params).filter((entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1] !== ''),
  );
}

export const reportApi = {
  getOptions: async (): Promise<LaporanOptions> => {
    const res = await api.get('/admin/reports/options');
    return res.data.data as LaporanOptions;
  },
  getRecruitment: async (
    filters: Partial<ReportFilterState>,
  ): Promise<ReportEnvelope<RecruitmentMetrics, RecruitmentRow>> => {
    const res = await api.get('/admin/reports/recruitment', {
      params: cleanParams({
        start_date: filters.startDate,
        end_date: filters.endDate,
        applicant_type: filters.applicantType,
      }),
    });
    return res.data.data as ReportEnvelope<RecruitmentMetrics, RecruitmentRow>;
  },
  getAttendance: async (
    filters: Partial<ReportFilterState>,
  ): Promise<ReportEnvelope<AttendanceMetrics, AttendanceRow>> => {
    const res = await api.get('/admin/reports/attendance', {
      params: cleanParams({
        start_date: filters.startDate,
        end_date: filters.endDate,
        company_id: filters.companyId,
      }),
    });
    return res.data.data as ReportEnvelope<AttendanceMetrics, AttendanceRow>;
  },
  getAbsorption: async (
    filters: Partial<ReportFilterState>,
  ): Promise<ReportEnvelope<AbsorptionMetrics, AbsorptionRow>> => {
    const res = await api.get('/admin/reports/absorption', {
      params: cleanParams({
        start_date: filters.startDate,
        end_date: filters.endDate,
        major_id: filters.majorId,
      }),
    });
    return res.data.data as ReportEnvelope<AbsorptionMetrics, AbsorptionRow>;
  },
  getTracerStudy: async (
    filters: Partial<ReportFilterState>,
  ): Promise<ReportEnvelope<TracerStudyMetrics, TracerStudyRow>> => {
    const res = await api.get('/admin/reports/tracer-study', {
      params: cleanParams({
        start_date: filters.startDate,
        end_date: filters.endDate,
        graduation_year: filters.graduationYear,
      }),
    });
    return res.data.data as ReportEnvelope<TracerStudyMetrics, TracerStudyRow>;
  },
};
