import { AdminDashboard } from "./pages/dashboard";
import { DataSiswaPage } from "./pages/siswa";
import { DataAlumniPage } from "./pages/alumni";
import { PerusahaanDudiPage } from "./pages/dudi";
import { LowonganKerjaPage } from "./pages/lowongan";
import { SeleksiRekrutmenPage } from "./pages/seleksi";
import { ValidasiAbsensiPage } from "./pages/validasi-absensi";
import { PenempatanKerjaPage } from "./pages/penempatan";
import { TracerStudyPage } from "./pages/tracer";
import { LaporanCetakPage } from "./pages/laporan";
import { UsersManagementPage } from "./pages/users";

export const adminRoute = [
  {
    path: "dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "users",
    element: <UsersManagementPage />,
  },
  {
    path: "siswa",
    element: <DataSiswaPage />,
  },
  {
    path: "alumni",
    element: <DataAlumniPage />,
  },
  {
    path: "dudi",
    element: <PerusahaanDudiPage />,
  },
  {
    path: "lowongan",
    element: <LowonganKerjaPage />,
  },
  {
    path: "seleksi",
    element: <SeleksiRekrutmenPage />,
  },
  {
    path: "validasi-absensi",
    element: <ValidasiAbsensiPage />,
  },
  {
    path: "penempatan",
    element: <PenempatanKerjaPage />,
  },
  {
    path: "tracer",
    element: <TracerStudyPage />,
  },
  {
    path: "laporan",
    element: <LaporanCetakPage />,
  },
];
