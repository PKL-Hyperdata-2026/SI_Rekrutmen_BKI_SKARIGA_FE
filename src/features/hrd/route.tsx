import { DashboardPage } from "./dashboard/dashboard-page";
import { LowonganPage } from "./lowongan/lowongan-page";
import { ReviewPage } from "./review/review-page";
import { JadwalPage } from "./jadwal/jadwal-page";
import { HasilPage } from "./hasil/hasil-page";
import { PenempatanPage } from "./penempatan/penempatan-page";

export const hrdRoute = [
  {
    path: "dashboard",
    element: <DashboardPage />,
  },
  {
    path: "lowongan",
    element: <LowonganPage />,
  },
  {
    path: "review",
    element: <ReviewPage />,
  },
  {
    path: "jadwal",
    element: <JadwalPage />,
  },
  {
    path: "hasil",
    element: <HasilPage />,
  },
  {
    path: "penempatan",
    element: <PenempatanPage />,
  },
];
