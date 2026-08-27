import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useApp";
import { logout, setCredentials } from "@/slices/authSlice";
import { useEffect, useState } from "react";
import { api } from "@/api/axios";
import { Loader2 } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar, Topbar } from "@/components/custom";

export function MainLayout() {
  const token = localStorage.getItem("access_token");
  const dispatch = useAppDispatch();
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

  const themeClass = user?.role === "siswa" || user?.role === "alumni" ? "theme-siswa" : user?.role === "admin" ? "theme-admin" : "theme-hrd";

  // Pasang class tema di <body> agar konten portal (Sheet sidebar mobile) ikut mewarisi CSS variables.
  useEffect(() => {
    if (!themeClass) return;
    document.body.classList.add(themeClass);
    return () => document.body.classList.remove(themeClass);
  }, [themeClass]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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

  return (
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
  );
}