import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useApp";
import { logout, setCredentials } from "@/slices/authSlice";
import { useEffect, useState } from "react";
import { api } from "@/api/axios";
import { Loader2 } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/custom/app-sidebar";
import { Topbar } from "@/components/custom/topbar";

export function MainLayout() {
  const token = localStorage.getItem("access_token");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const [fetchingUser, setFetchingUser] = useState(!user && !!token);

  useEffect(() => {
    if (token && !user) {
      api.get('/me')
      .then((res) => {
        dispatch(setCredentials(res.data.user));
      })
      .catch(() => {
        dispatch(logout());
      })
      .finally(() => {
        setFetchingUser(false);
      });
    }
  }, [token, user, dispatch]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (fetchingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error(`Kesalahan saat logout: ${error}`);
    }
    finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  const themeClass = user?.role === "siswa" || user?.role === "alumni" 
    ? "theme-siswa" 
    : user?.role === "admin" 
      ? "theme-admin" 
      : "theme-hrd";

  return (
    <div className={themeClass}>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="w-full flex flex-col min-h-screen bg-slate-50">
            <Topbar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 relative">
              <div className="h-full">
                <Outlet />
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
