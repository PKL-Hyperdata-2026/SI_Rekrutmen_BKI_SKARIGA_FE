import { createBrowserRouter, Navigate } from "react-router-dom";
import { authRoute } from "./features/auth/route";
import { AuthLayout } from "./layouts/auth.layout";
import { MainLayout } from "./layouts/main.layout";
import { ProtectedRoute } from "./features/auth/components/protected-route";
import { DashboardRedirector } from "./features/auth/components/dashboard-redirector";
import { studentRoute } from "./features/student/route";
import { adminRoute } from "./features/admin/route";

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
        element: <DashboardRedirector />
      },
      {
        path: "/student",
        element: <ProtectedRoute allowedRoles={['siswa', 'alumni']} />,
        children: studentRoute,
      },
      {
        path: "/admin",
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: adminRoute,
      },
      {
        element: <ProtectedRoute allowedRoles={['hrd']} />,
        children: [
          {
            path: "/hrd/dashboard",
            // element: <HRDDashboard />,
          },
          // {
          //   path: "/hrd/feature",
          //   element: <HRDFeature />,
          // },
        ],
      },
      {
        path: "/unauthorized",
        // element: <ForbiddenPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

// helper
// function DashboardRedirector() {
//   const { user } = useAppSelector((state) => state.auth);

//   if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
//   if (user?.role === "hrd") return <Navigate to="/hrd/dashboard" replace />;
//   return <Navigate to="/student/dashboard" replace />;
// }
