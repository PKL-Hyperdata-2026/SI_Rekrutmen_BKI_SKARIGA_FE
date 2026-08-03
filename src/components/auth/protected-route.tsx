import { useAppSelector } from "@/hooks/useApp";
import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const {
    user,
    isAuthenticated
  } = useAppSelector((state) => state.auth);
  const token = localStorage.getItem("access_token");

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
