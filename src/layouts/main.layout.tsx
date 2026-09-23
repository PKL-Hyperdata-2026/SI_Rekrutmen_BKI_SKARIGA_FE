import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/use-app";
import { logout, setCredentials } from "@/slices/authSlice";
import { useEffect, useState, useRef } from "react";
import { getMeApi } from "@/features/auth/login/login.api";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar, Topbar, GlobalLoading } from "@/components/custom";
import { Toaster } from "@/components/custom/sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MainLayout() {
  const token = localStorage.getItem("access_token");
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const [fetchingUser, setFetchingUser] = useState(!!token);

  useEffect(() => {
    if (token) {
      getMeApi()
      .then((data) => {
        dispatch(setCredentials(data.user));
      })
      .catch(() => {
        dispatch(logout());
      })
      .finally(() => {
        setFetchingUser(false);
      });
    }
  }, [token, dispatch]);

  const detectedRole =
    user?.role ||
    (location.pathname.startsWith("/admin")
      ? "admin"
      : location.pathname.startsWith("/hrd")
        ? "hrd"
        : location.pathname.startsWith("/student")
          ? "siswa"
          : undefined);

  const themeClass =
    detectedRole === "siswa" || detectedRole === "alumni"
      ? "theme-siswa"
      : detectedRole === "admin" || detectedRole === "superadmin"
        ? "theme-admin"
        : detectedRole === "hrd"
          ? "theme-hrd"
          : "theme-admin";

  useEffect(() => {
    if (!themeClass) return;
    document.body.classList.add(themeClass);
    return () => document.body.classList.remove(themeClass);
  }, [themeClass]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]');
      if (viewport) {
        viewport.scrollTo({ top: 0, behavior: "instant" });
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!fetchingUser && user) {
      const frameId = requestAnimationFrame(() => {
        window.dispatchEvent(new Event("resize"));
      });
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 150);
      return () => {
        cancelAnimationFrame(frameId);
        clearTimeout(timer);
      };
    }
  }, [fetchingUser, user]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <GlobalLoading show={fetchingUser} role={detectedRole} />
      <TooltipProvider>
        <Toaster position="top-right" />
        <SidebarProvider
          style={
            {
              "--sidebar-width": "16rem",
              "--sidebar-width-icon": "4.5rem",
            } as React.CSSProperties
          }
          className="bg-slate-50 print:bg-white"
        >
          <div className="print:hidden">
            <AppSidebar key={user ? `${user.role}-${user.id}` : "sidebar-loading"} />
          </div>
          <SidebarInset className="w-full min-w-0 flex flex-col h-screen overflow-hidden bg-slate-50 print:h-auto print:overflow-visible print:bg-white print:m-0 print:p-0">
            <ScrollArea ref={scrollAreaRef} className="h-full w-full min-w-0 print:h-auto print:overflow-visible [&>div>div]:block! [&>div>div]:w-full [&>div>div]:min-w-0">
              <div className="print:hidden">
                <Topbar />
              </div>
              <main className="p-3.5 sm:p-4 md:p-6 w-full max-w-full min-w-0 relative print:p-0 print:m-0">
                <Outlet />
              </main>
            </ScrollArea>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </>
  );
}
