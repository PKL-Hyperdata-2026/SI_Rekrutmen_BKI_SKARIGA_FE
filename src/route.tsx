import { createBrowserRouter, Navigate } from "react-router-dom";
import { authRoute } from "./features/auth/route";
import { AuthLayout } from "./layouts/auth.layout";
import { MainLayout } from "./layouts/main.layout";
import { ProtectedRoute } from "./components/auth/protected-route";
import { useAppSelector } from "./hooks/useApp";
import { DashboardRedirector } from "./components/auth/dashboard-redirector";

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
        element: <ProtectedRoute allowedRoles={['siswa', 'alumni']} />,
        children: [
          {
            path: "/student/dashboard",
            // element: <StudentDashboard />,
          },
          // {
          //   path: "/student/feature",
          //   element: <StudentFeature />,
          // },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          {
            path: "/admin/dashboard",
            // element: <AdminDashboard />,
          },
          // {
          //   path: "/admin/feature",
          //   element: <AdminFeature />,
          // },
        ],
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
