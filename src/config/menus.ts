import {
  LayoutDashboard,
  Briefcase,
  FileText,
  CalendarCheck,
  FolderOpen,
  LineChart,
  Users,
  GraduationCap,
  Building2,
  CheckSquare,
  MapPin,
  Printer,
  ClipboardList,
  CalendarClock,
  CheckCircle,
} from "lucide-react";

export interface MenuItem {
  name: string;
  link: string;
  icon?: any;
}

export const STUDENT_MENUS: MenuItem[] = [
  { name: "Dashboard", link: "/student/dashboard", icon: LayoutDashboard },
  { name: "Lowongan Kerja", link: "/student/lowongan", icon: Briefcase },
  { name: "Lamaran Saya", link: "/student/lamaran", icon: FileText },
  { name: "Absensi Rekrutmen", link: "/student/absensi", icon: CalendarCheck },
  { name: "E-Portofolio", link: "/student/portofolio", icon: FolderOpen },
  { name: "Tracer Study", link: "/student/tracer", icon: LineChart },
];

export const ADMIN_MENUS: MenuItem[] = [
  { name: "Dashboard", link: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Data Siswa", link: "/admin/siswa", icon: Users },
  { name: "Data Alumni", link: "/admin/alumni", icon: GraduationCap },
  { name: "Perusahaan DUDI", link: "/admin/dudi", icon: Building2 },
  { name: "Lowongan Kerja", link: "/admin/lowongan", icon: Briefcase },
  { name: "Seleksi Rekrutmen", link: "/admin/seleksi", icon: CheckSquare },
  { name: "Validasi Absensi", link: "/admin/validasi-absensi", icon: CalendarCheck },
  { name: "Penempatan (3/6/12)", link: "/admin/penempatan", icon: MapPin },
  { name: "Tracer Study", link: "/admin/tracer", icon: LineChart },
  { name: "Laporan & Cetak", link: "/admin/laporan", icon: Printer },
];

export const HRD_MENUS: MenuItem[] = [
  { name: "Dashboard", link: "/hrd/dashboard", icon: LayoutDashboard },
  { name: "Kelola Lowongan", link: "/hrd/lowongan", icon: Briefcase },
  { name: "Review Pelamar", link: "/hrd/review", icon: ClipboardList },
  { name: "Kirim Jadwal Tes", link: "/hrd/jadwal", icon: CalendarClock },
  { name: "Input Hasil Seleksi", link: "/hrd/hasil", icon: CheckCircle },
];
