import { StudentDashboard } from "./pages/dashboard";
import { LowonganKerja } from "./pages/lowongan";
import { LamaranSaya } from "./pages/lamaran";
import { AbsensiRekrutmen } from "./pages/absensi";
import { EPortofolio } from "./pages/portofolio";
import { TracerStudy } from "./pages/tracer";

export const studentRoute = [
  {
    path: "dashboard",
    element: <StudentDashboard />,
  },
  {
    path: "lowongan",
    element: <LowonganKerja />,
  },
  {
    path: "lamaran",
    element: <LamaranSaya />,
  },
  {
    path: "absensi",
    element: <AbsensiRekrutmen />,
  },
  {
    path: "portofolio",
    element: <EPortofolio />,
  },
  {
    path: "tracer",
    element: <TracerStudy />,
  },
];
