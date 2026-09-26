import { useEffect, useState, useCallback } from "react";
import {
  PageHeader,
  StatCard,
  SectionCard,
  FilterSelect,
} from "@/components/custom";
import {
  FilePlus,
  Printer,
  GraduationCap,
  UserPlus,
  Briefcase,
  ClipboardCheck,
  PieChart as PieChartIcon,
  AlertCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { dashboardApi } from "./dashboard.api";
import { DashboardPieChart } from "./dashboard-pie-chart";
import type { AdminDashboardData } from "./dashboard.types";

export function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");

  const fetchDashboard = useCallback(async (year?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dashboardApi.getDashboard(year);
      setData(result);
      if (!selectedYear && result.academicYearOptions.length > 0) {
        setSelectedYear(result.academicYearOptions[0].value);
      }
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } };
      setError(apiError?.response?.data?.message || "Gagal memuat data dashboard.");
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    fetchDashboard(year);
  };

  const metrics = data?.metrics;
  const chartData = data?.recruitmentChart || [];
  const departmentData = data?.departmentDistribution || [];
  const yearOptions = data?.academicYearOptions || [
    { value: "2026/2027", label: "T.A 2026/2027" },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        variant="admin"
        title="Dashboard BKI SKARIGA"
        description="Temukan peluang karir terbaik dari industri mitra resmi SKARIGA."
      >
        <PageHeader.Button
          variant="primary"
          icon={<FilePlus className="h-4 w-4" />}
          onClick={() => navigate("/admin/lowongan/create")}
        >
          Buat Lowongan
        </PageHeader.Button>
        <PageHeader.Button
          variant="glass"
          icon={<Printer className="h-4 w-4" />}
          onClick={() => navigate("/admin/laporan")}
        >
          Cetak Laporan
        </PageHeader.Button>
      </PageHeader>

      {error ? (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-700 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchDashboard(selectedYear)}
            className="h-8 gap-1.5 border-rose-200 hover:bg-rose-100 text-rose-700 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Coba Lagi
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          label="Siswa XII Aktif"
          value={(metrics?.activeStudents ?? 0).toLocaleString("id-ID")}
          icon={GraduationCap}
          color="purple"
          isLoading={loading}
        />
        <StatCard
          label="Alumni Terdata"
          value={(metrics?.totalAlumni ?? 0).toLocaleString("id-ID")}
          icon={UserPlus}
          color="sky"
          isLoading={loading}
        />
        <StatCard
          label="Lowongan Aktif"
          value={(metrics?.activeVacancies ?? 0).toLocaleString("id-ID")}
          icon={Briefcase}
          color="teal"
          isLoading={loading}
        />
        <StatCard
          label="Pelamar Bulan Ini"
          value={(metrics?.applicantsThisMonth ?? 0).toLocaleString("id-ID")}
          icon={FilePlus}
          color="dark-purple"
          isLoading={loading}
        />
        <StatCard
          label="Diterima Kerja"
          value={(metrics?.placedWorkers ?? 0).toLocaleString("id-ID")}
          icon={ClipboardCheck}
          color="cyan"
          isLoading={loading}
        />
        <StatCard
          label="Keterserapan"
          value={`${metrics?.absorptionRate ?? 0}%`}
          icon={PieChartIcon}
          color="blue"
          isLoading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <SectionCard
            title="Grafik Keaktifan Pelamar & Rekrutmen"
            subtitle="Tren pendaftaran dan kelulusan diterima kerja 6 bulan terakhir"
            action={
              <FilterSelect
                role="admin"
                value={selectedYear}
                options={yearOptions}
                onValueChange={handleYearChange}
              />
            }
            className="h-full flex flex-col justify-between"
          >
            <div className="flex items-center justify-end gap-4 sm:gap-6 mb-3 text-xs flex-wrap">
              <div className="flex items-center gap-2 font-medium text-slate-800">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block shadow-2xs" />
                Melamar Lowongan
              </div>
              <div className="flex items-center gap-2 font-medium text-slate-800">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-600 inline-block shadow-2xs" />
                Diterima Kerja
              </div>
            </div>

            <div className="h-68 w-full pt-1 relative">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-xs rounded-2xl z-10">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
              ) : null}
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="gradMelamar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradDiterima" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    className="text-xs font-medium fill-slate-500"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    className="text-xs fill-slate-400"
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    domain={[0, "auto"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      color: "#0f172a",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="melamar"
                    name="Melamar Lowongan"
                    stroke="#f43f5e"
                    strokeWidth={1.8}
                    fill="url(#gradMelamar)"
                    fillOpacity={1}
                    dot={{ r: 3.5, fill: "#fff", stroke: "#f43f5e", strokeWidth: 1.5 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="diterima"
                    name="Diterima Kerja"
                    stroke="#7c3aed"
                    strokeWidth={1.8}
                    fill="url(#gradDiterima)"
                    fillOpacity={1}
                    dot={{ r: 3.5, fill: "#fff", stroke: "#7c3aed", strokeWidth: 1.5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <SectionCard
            title="Keterserapan Departemen"
            subtitle="Distribusi kandidat diterima kerja"
            className="h-full flex flex-col justify-between"
          >
            {loading ? (
              <div className="h-68 w-full flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
            ) : (
              <DashboardPieChart
                data={departmentData}
                totalPlaced={metrics?.placedWorkers ?? 0}
              />
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

export const AdminDashboard = DashboardPage;
