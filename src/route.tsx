import { createBrowserRouter } from "react-router-dom";
import { authRoute } from "./features/auth/route";
import { AuthLayout } from "./layouts/auth.layout";
import { MainLayout } from "./layouts/main.layout";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [...authRoute],
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <div className="rounded-xl bg-slate-800/50 p-6 text-slate-200">
            <h2 className="text-2xl font-semibold mb-2">Selamat Datang!</h2>
            <p className="text-slate-400">
              Anda berhasil login ke sistem BKI. Halaman dashboard ini masih dalam tahap pengembangan.
            </p>
          </div>
        ),
      },
    ],
  },
]);
