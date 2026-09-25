import { useAppSelector } from "@/hooks/use-app";
import { Navigate } from "react-router";

export function DashboardRedirector() {
  const { user } = useAppSelector((state) => state.auth);
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return null;
  }

  switch (user.role) {
    case "superadmin":
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "hrd":
      return <Navigate to="/hrd/dashboard" replace />;
    case "siswa":
    case "alumni":
      return <Navigate to="/student/dashboard" replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
}
