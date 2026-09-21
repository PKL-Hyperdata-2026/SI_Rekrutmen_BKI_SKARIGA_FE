import {
  PageHeader,
  StatCard,
  SectionCard,
  PillTableHeader,
  InteractiveItemCard,
  FilterSelect,
} from "@/components/custom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FilePlus,
  Printer,
  GraduationCap,
  UserPlus,
  Briefcase,
  ClipboardCheck,
  PieChart,
  BadgeCheck,
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

const chartData = [
  { month: "Jun", melamar: 68, diterima: 30, kehadiran: 64, baseline: 0 },
  { month: "Jul", melamar: 26, diterima: 52, kehadiran: 66, baseline: 0 },
  { month: "Aug", melamar: 36, diterima: 80, kehadiran: 35, baseline: 0 },
  { month: "Sept", melamar: 51, diterima: 34, kehadiran: 12, baseline: 0 },
  { month: "Oct", melamar: 83, diterima: 47, kehadiran: 85, baseline: 0 },
  { month: "Nov", melamar: 0, diterima: 0, kehadiran: 0, baseline: 0 },
];

const realtimeAttendance = [
  {
    name: "Pikeu Pinky Pie",
    event: "Tes Interview • PT Es Kul Kul",
    status: "Hadir GPS",
    time: "08.14 WIB",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Pikeu Pinky Pie",
    event: "Tes Interview • PT Es Kul Kul",
    status: "Hadir GPS",
    time: "08.14 WIB",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Pikeu Pinky Pie",
    event: "Tes Interview • PT Es Kul Kul",
    status: "Hadir GPS",
    time: "08.14 WIB",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Pikeu Pinky Pie",
    event: "Tes Interview • PT Es Kul Kul",
    status: "Hadir GPS",
    time: "08.14 WIB",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Pikeu Pinky Pie",
    event: "Tes Interview • PT Es Kul Kul",
    status: "Hadir GPS",
    time: "08.14 WIB",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Pikeu Pinky Pie",
    event: "Tes Interview • PT Es Kul Kul",
    status: "Hadir GPS",
    time: "08.14 WIB",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Pikeu Pinky Pie",
    event: "Tes Interview • PT Es Kul Kul",
    status: "Hadir GPS",
    time: "08.14 WIB",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face",
  },
];

const placementData = [
  {
    name: "Aldi Taher Juicyyy",
    majorYear: "RPL • 2025",
    company: "PT Aldi's Burger",
    position: "Burger Developer",
    date: "10 Feb 2026",
    status: "Lolos 6 Bulan (Bertahan)",
  },
];

const tableColumns = [
  { label: "Nama Alumni", align: "left" as const },
  { label: "Perusahaan & Posisi", align: "left" as const },
  { label: "Tgl Masuk", align: "left" as const },
  { label: "Status Evaluasi", align: "center" as const },
  { label: "Aksi", align: "center" as const },
];

export function DashboardPage() {
  const navigate = useNavigate();
  
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
          onClick={() => navigate("/admin/lowongan")}
        >
          Buat Lowongan
        </PageHeader.Button>
        <PageHeader.Button
          variant="glass"
          icon={<Printer className="h-4 w-4" />}
        >
          Cetak Laporan
        </PageHeader.Button>
      </PageHeader>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Siswa XII TA 2026" value="491" icon={GraduationCap} color="purple" />
        <StatCard label="Alumni Terdata" value="1.340" icon={UserPlus} color="sky" />
        <StatCard label="Lowongan Aktif" value="52" icon={Briefcase} color="teal" />
        <StatCard label="Pelamar Bulan Ini" value="608" icon={FilePlus} color="dark-purple" />
        <StatCard label="Diterima Kerja" value="195" icon={ClipboardCheck} color="cyan" />
        <StatCard label="Keterserapan" value="84.2%" icon={PieChart} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
        <div className="lg:col-span-2 flex flex-col gap-5 sm:gap-6">
          <SectionCard
            title="Grafik Keaktifan Pelamar & Rekrutmen"
            subtitle="Tren pendaftaran, kehadiran tes, dan kelulusan 6 bulan terakhir"
            action={
              <FilterSelect
                role="admin"
                defaultValue="2026/2027"
                options={[
                  { value: "2026/2027", label: "T.A 2026/2027" },
                  { value: "2025/2026", label: "T.A 2025/2026" },
                  { value: "2024/2025", label: "T.A 2024/2025" },
                ]}
              />
            }
          >
            <div className="flex items-center justify-end gap-6 mb-3 text-xs">
              <div className="flex items-center gap-2 font-medium text-slate-800">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FA8272] inline-block shadow-2xs" />
                Melamar Lowongan
              </div>
              <div className="flex items-center gap-2 font-medium text-slate-800">
                <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block shadow-2xs" />
                Diterima Kerja
              </div>
            </div>

            <div className="h-60 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="gradMelamar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FA8272" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#FA8272" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradDiterima" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradKehadiran" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.02} />
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
                    domain={[0, 100]}
                    ticks={[0, 20, 40, 60, 80, 100]}
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
                    type="linear"
                    dataKey="baseline"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    fillOpacity={0}
                    dot={{ r: 3.5, fill: "#fff", stroke: "#f59e0b", strokeWidth: 1.5 }}
                  />
                  <Area
                    type="natural"
                    dataKey="kehadiran"
                    name="Kehadiran Tes"
                    stroke="#38BDF8"
                    strokeWidth={1.8}
                    fill="url(#gradKehadiran)"
                    fillOpacity={1}
                    dot={{ r: 3.5, fill: "#fff", stroke: "#38BDF8", strokeWidth: 1.5 }}
                  />
                  <Area
                    type="natural"
                    dataKey="melamar"
                    name="Melamar Lowongan"
                    stroke="#FA8272"
                    strokeWidth={1.8}
                    fill="url(#gradMelamar)"
                    fillOpacity={1}
                    dot={{ r: 3.5, fill: "#fff", stroke: "#FA8272", strokeWidth: 1.5 }}
                  />
                  <Area
                    type="natural"
                    dataKey="diterima"
                    name="Diterima Kerja"
                    stroke="#7C3AED"
                    strokeWidth={1.8}
                    fill="url(#gradDiterima)"
                    fillOpacity={1}
                    dot={{ r: 3.5, fill: "#fff", stroke: "#7C3AED", strokeWidth: 1.5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard
            title="Monitoring Penempatan Kerja (3/6/12)"
            subtitle="Evaluasi daya tahan kerja alumni di Industri Mitra"
            action={
              <Button variant="link" size="sm" className="h-auto p-0 text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer">
                Lihat Semua (3)
              </Button>
            }
            className="flex-1 flex flex-col justify-between"
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead colSpan={5} className="p-0 pb-2">
                      <PillTableHeader columns={tableColumns} role="admin" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placementData.map((item, idx) => (
                    <TableRow key={idx} className="border-none hover:bg-slate-50/60 transition-colors">
                      <TableCell className="py-4 px-5">
                        <div className="font-bold text-xs sm:text-sm text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-400 font-medium mt-0.5">{item.majorYear}</div>
                      </TableCell>
                      <TableCell className="py-4 px-5">
                        <div className="font-bold text-xs sm:text-sm text-slate-900">{item.company}</div>
                        <div className="text-xs text-slate-400 font-medium mt-0.5">{item.position}</div>
                      </TableCell>
                      <TableCell className="py-4 px-5 text-xs sm:text-sm font-semibold text-slate-800">{item.date}</TableCell>
                      <TableCell className="py-4 px-5 text-center">
                        <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 text-xs font-semibold px-3 py-1 rounded-full">
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-5 text-center">
                        <Button size="sm" className="bg-[var(--accent)] hover:bg-[var(--sidebar-strip)] text-white rounded-full h-8 px-4 text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer">
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </div>

        <div className="lg:col-span-1 flex flex-col">
          <SectionCard
            title="Absensi Realtime"
            action={
              <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 text-xs font-bold px-2.5 py-0.5 rounded-full">
                LIVE
              </Badge>
            }
            className="h-full"
          >
            <div className="space-y-2">
              {realtimeAttendance.map((user, idx) => (
                <InteractiveItemCard
                  key={idx}
                  role="admin"
                  avatar={user.avatar}
                  title={user.name}
                  subtitle={user.event}
                  status={user.status}
                  time={user.time}
                />
              ))}
            </div>

            <div className="pt-4 mt-auto">
              <Button className="w-full bg-[var(--sidebar-gradient-to)] hover:bg-[var(--sidebar-strip)] text-white font-bold text-xs sm:text-sm py-3 h-11 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer">
                <BadgeCheck className="h-4 w-4" />
                Validasi
              </Button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

export const AdminDashboard = DashboardPage;
