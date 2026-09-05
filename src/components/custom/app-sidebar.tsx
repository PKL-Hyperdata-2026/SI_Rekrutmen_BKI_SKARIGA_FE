import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppSelector, useAppDispatch } from "@/hooks/useApp";
import { logout } from "@/slices/authSlice";
import { STUDENT_MENUS, ADMIN_MENUS, HRD_MENUS } from "@/config/menus";
import type { MenuItem } from "@/config/menus";
import { Building2, LogOut, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarMenuItem } from "./sidebar-menu-item";

export function AppSidebar() {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { state: sidebarState, toggleSidebar, setOpenMobile, isMobile } = useSidebar();
  const isCollapsed = !isMobile && sidebarState === "collapsed";

  useEffect(() => {
    setOpenMobile(false);
  }, [location.pathname, setOpenMobile]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  let menus: MenuItem[] = [];
  if (user?.role === "siswa" || user?.role === "alumni") {
    menus = STUDENT_MENUS;
  } else if (user?.role === "superadmin") {
    menus = ADMIN_MENUS;
  } else if (user?.role === "admin") {
    menus = ADMIN_MENUS.filter((item) => !item.superadminOnly);
  } else if (user?.role === "hrd") {
    menus = HRD_MENUS;
  }

  return (
    <Sidebar
      style={{ "--sidebar-width-icon": "4rem" } as React.CSSProperties}
      collapsible="icon"
      side="left"
      variant="sidebar"
      className="border-none border-r-0 shadow-none bg-transparent p-0 md:p-2 md:pr-0 overflow-x-hidden"
    >
      {/* Role-based Gradient Background Container */}
      <div className={cn(
        "absolute inset-0 md:top-2 md:bottom-2 md:left-2 md:right-0 z-0 rounded-none rounded-r-2xl md:rounded-2xl overflow-hidden pointer-events-none transition-opacity duration-200 ease-linear bg-gradient-to-b from-sidebar-gradient-from to-sidebar-gradient-to border-y-0 border-l-0 md:border md:border-r-0 border-white/20",
        isCollapsed ? "opacity-0" : "opacity-100"
      )} />
      {/* Role-based Dark Strip Background (w-14 di left-2) */}
      <div className="absolute inset-y-0 left-0 md:top-2 md:bottom-2 md:left-2 w-14 z-0 bg-sidebar-strip rounded-none md:rounded-2xl border-r md:border border-white/10 transition-all duration-200 ease-linear" />

      <div className="relative z-10 flex flex-col h-full text-white py-2">
        {/* Custom Header */}
        <div className="h-20 flex items-center shrink-0 relative">
          {/* Toggle Button di Strip Dark */}
          <div className="w-14 flex justify-center items-center shrink-0 h-full relative">
            {/* Toggle Button (Muncul Saat Collapsed) */}
            <button
              onClick={toggleSidebar}
              className={cn(
                "flex justify-center items-center h-10 w-10 text-white hover:bg-white/10 rounded-lg transition-all duration-200 absolute",
                isCollapsed ? "opacity-100 z-50 scale-100" : "opacity-0 pointer-events-none scale-90"
              )}
            >
              <PanelLeft className="h-6 w-6" />
            </button>
          </div>

          <div className={cn(
            "flex-1 h-full relative transition-opacity duration-200 overflow-hidden whitespace-nowrap",
            isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          )}>
            {/* Toggle Button (Expanded State) */}
            <button
              onClick={toggleSidebar}
              className="absolute top-1 right-2 flex items-center justify-center h-9 w-9 rounded-lg text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
            >
              <PanelLeft className="h-5 w-5" />
            </button>

            {/* Logo and Text (Sejajar dengan teks menu di pl-7) */}
            <div className="absolute bottom-1 left-0 flex items-center pl-7 gap-2.5">
              <Building2 className="h-8 w-8 text-white shrink-0" strokeWidth={1.5} />
              <div className="flex flex-col justify-end">
                <span className="font-bold text-[14px] leading-tight text-white">
                  BKI SKARIGA
                </span>
                <span className="text-[10px] text-white/90 capitalize mt-0.5">
                  Portal {user?.role === 'siswa' || user?.role === 'alumni' ? 'Siswa & Alumni' : user?.role === 'superadmin' ? 'Super Admin' : user?.role || 'Sistem'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Menu Content - Ditambahkan pt-6 agar cutout Dashboard tidak menabrak Header */}
        <SidebarContent className="p-0 flex-1 overflow-y-auto overflow-x-visible">
          <SidebarGroup className="p-0 overflow-visible">
            <SidebarGroupContent className="overflow-visible">
              <ul className="flex flex-col gap-1.5 h-full relative pt-6 pb-6 overflow-x-hidden  ">
                {menus.map((menu) => {
                  const isActive = location.pathname.startsWith(menu.link);

                  return (
                    <SidebarMenuItem
                      key={menu.link}
                      menu={menu}
                      isActive={isActive}
                      isCollapsed={isCollapsed}
                    />
                  );
                })}
              </ul>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Custom Footer Compact */}
        <AlertDialog>
          <div className="h-12 shrink-0 border-none flex items-center pt-1 pb-2 relative">
            <div className="w-14 flex justify-center items-center shrink-0">
              <AlertDialogTrigger asChild>
                <button className={cn(
                  "flex justify-center items-center h-9 w-9 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200 absolute",
                  isCollapsed ? "opacity-100 z-50" : "opacity-0 pointer-events-none"
                )}>
                  <LogOut className="h-4 w-4" />
                </button>
              </AlertDialogTrigger>
            </div>

            <div className={cn(
              "flex-1 h-full transition-opacity duration-200 overflow-hidden whitespace-nowrap",
              isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
              <AlertDialogTrigger asChild className="cursor-pointer">
                <button className="flex items-center w-[calc(100%-1rem)] h-9 text-white/90 hover:text-white transition-colors rounded-lg hover:bg-white/10 mx-2 pl-3 gap-3">
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span className="font-semibold text-[13px]">Log Out</span>
                </button>
              </AlertDialogTrigger>
            </div>
          </div>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin keluar dari sistem? Sesi Anda akan berakhir dan Anda harus masuk kembali.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="border-none bg-transparent mt-4 p-0 sm:p-0 m-0">
              <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">
                Ya, Keluar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Sidebar>
  );
}
