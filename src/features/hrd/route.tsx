import { LowonganPage } from "./lowongan/pages/lowongan-page";
import { ReviewPage } from "./review/pages/review-page";
import { JadwalPage } from "./jadwal/pages/jadwal-page";
import { HasilPage } from "./hasil/pages/hasil-page";
import { PenempatanPage } from "./penempatan/penempatan-page";

export const hrdRoute = [
  {
    path: "dashboard",
    // element: <HRDDashboard />,
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

