import { StudentDashboard } from "./dashboard/dashboard-page";
import { LowonganKerjaPage } from "./lowongan-kerja/lowongan-kerja-page";
import { LamaranSaya } from "./lamaran/lamaran-page";
import { EPortofolio } from "./e-portfolio/e-portfolio-page";
import { TracerStudy } from "./tracer-study/tracer-study-page";

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
    path: "portofolio",
    element: <EPortofolio />,
  },
  {
    path: "tracer",
    element: <TracerStudy />,
  },
];
