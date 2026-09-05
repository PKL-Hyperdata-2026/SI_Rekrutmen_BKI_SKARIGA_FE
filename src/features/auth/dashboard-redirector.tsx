import { useAppSelector } from "@/hooks/useApp";
import { Navigate } from "react-router";

export function DashboardRedirector() {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
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
