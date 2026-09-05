import { StudentDashboard } from "./dashboard/dashboard-page";
import { LowonganKerjaPage } from "./lowongan-kerja/lowongan-kerja-page";
import { LamaranSaya } from "./lamaran/lamaran-page";
import { AbsensiRekrutmen } from "./absensi/absensi-page";
import { EPortofolio } from "./e-portfolio/portofolio-page";
import { TracerStudy } from "./tracer-study/tracer-page";

export const studentRoute = [
  {
    path: "dashboard",
    element: <StudentDashboard />,
  },
  {
    path: "lowongan",
    element: <LowonganKerjaPage />,
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
