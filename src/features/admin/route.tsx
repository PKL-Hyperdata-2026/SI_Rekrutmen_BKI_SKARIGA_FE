import { DashboardPage } from "./dashboard/dashboard-page";
import { DepartemenPage } from "./departemen/departemen-page";
import { JurusanPage } from "./jurusan/jurusan-page";
import { UsersPage } from "./users/users-page";
import { SiswaPage } from "./siswa/siswa-page";
import { AlumniPage } from "./alumni/alumni-page";
import { DudiPage } from "./dudi/dudi-page";
import { LowonganKerjaPage } from "./lowongan-kerja/lowongan-kerja-page";
import { SeleksiPage } from "./seleksi/seleksi-page";
import { ValidasiAbsensiPage } from "./validasi-absensi/validasi-absensi-page";
import { TracerPage } from "./tracer-study/tracer-study-page";
import { LaporanPage } from "./laporan/laporan-page";

export const adminRoute = [
  {
    path: "dashboard",
    element: <DashboardPage />,
  },
  {
    path: "departemen",
    element: <DepartemenPage />,
  },
  {
    path: "jurusan",
    element: <JurusanPage />,
  },
  {
    path: "users",
    element: <UsersPage />,
  },
  {
    path: "siswa",
    element: <SiswaPage />,
  },
  {
    path: "alumni",
    element: <AlumniPage />,
  },
  {
    path: "dudi",
    element: <DudiPage />,
  },
  {
    path: "lowongan",
    element: <LowonganKerjaPage />,
  },
  {
    path: "seleksi",
    element: <SeleksiPage />,
  },
  {
    path: "validasi-absensi",
    element: <ValidasiAbsensiPage />,
  },
  {
    path: "tracer",
    element: <TracerPage />,
  },
  {
    path: "laporan",
    element: <LaporanPage />,
  },
];
