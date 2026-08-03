import { Link, useLocation, useNavigate } from "react-router-dom";
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

export function AppSidebar() {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { state: sidebarState, toggleSidebar } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  let menus: MenuItem[] = [];
  if (user?.role === "siswa" || user?.role === "alumni") {
    menus = STUDENT_MENUS;
  } else if (user?.role === "admin") {
    menus = ADMIN_MENUS;
  } else if (user?.role === "hrd") {
    menus = HRD_MENUS;
  }

  return (
    <Sidebar 
      style={{ "--sidebar-width-icon": "4rem" } as React.CSSProperties}
      collapsible="icon" 
      side="left" 
      variant="sidebar" 
      className="border-none border-r-0 shadow-none bg-transparent p-2 pr-0"
    >
      {/* Blue Gradient Background Container */}
      <div className={cn(
        "absolute top-2 bottom-2 left-2 right-0 z-0 rounded-2xl overflow-hidden pointer-events-none transition-opacity duration-200 ease-linear bg-gradient-to-b from-primary to-accent border border-white/20 border-r-0",
        isCollapsed ? "opacity-0" : "opacity-100"
      )} />
      
      {/* Dark Strip Background (w-14 di left-2) */}
      <div className="absolute top-2 bottom-2 left-2 w-14 z-0 bg-foreground rounded-2xl border border-white/10 transition-all duration-200 ease-linear" />

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
              className="absolute top-1 right-2 flex items-center justify-center h-9 w-9 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
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
                  Portal {user?.role === 'siswa' || user?.role === 'alumni' ? 'Siswa & Alumni' : user?.role || 'Sistem'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Menu Content - Ditambahkan pt-6 agar cutout Dashboard tidak menabrak Header */}
        <SidebarContent className="p-0 flex-1 overflow-y-auto overflow-x-visible">
          <SidebarGroup className="p-0 overflow-visible">
            <SidebarGroupContent className="overflow-visible">
              <ul className="flex flex-col gap-1.5 h-full relative pt-6 pb-6 overflow-visible">
                {menus.map((menu) => {
                  const isActive = location.pathname.startsWith(menu.link);
                  
                  return (
                    <li key={menu.link} className="relative w-full overflow-visible">
                      <Link to={menu.link} className={cn(
                        "flex items-center w-full h-11 relative transition-all duration-300", 
                        isActive ? "text-primary font-bold" : "text-white/80 hover:text-white"
                      )}>
                        
                        {/* Background Overlay Cutout Putih (Dengan jarak dari strip dark) */}
                        <div className={cn(
                          "absolute inset-y-0 right-0 left-[4.5rem] bg-background transition-all duration-200 pointer-events-none rounded-l-2xl -mr-px z-10",
                          isActive && !isCollapsed ? "opacity-100" : "opacity-0 pointer-events-none"
                        )} />
                        
                        {/* Cutout Corner Top */}
                        <div className={cn(
                          "absolute -top-5 right-0 w-5 h-5 bg-transparent pointer-events-none transition-all duration-200 z-20",
                          isActive && !isCollapsed ? "opacity-100" : "opacity-0"
                        )} style={{ 
                          boxShadow: "5px 5px 0 5px var(--background)", 
                          borderBottomRightRadius: "20px" 
                        }} />
                        
                        {/* Cutout Corner Bottom */}
                        <div className={cn(
                          "absolute -bottom-5 right-0 w-5 h-5 bg-transparent pointer-events-none transition-all duration-200 z-20",
                          isActive && !isCollapsed ? "opacity-100" : "opacity-0"
                        )} style={{ 
                          boxShadow: "5px -5px 0 5px var(--background)", 
                          borderTopRightRadius: "20px" 
                        }} />

                        {/* Icon Container: Presisi w-14 agar Ikon Pas di Tengah Strip Dark */}
                        <div className="w-14 h-full flex justify-center items-center shrink-0 relative z-30">
                          {/* Garis Indikator Putih di Sisi Kiri Strip */}
                          {isActive && (
                            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-white rounded-full shadow-sm" />
                          )}
                          
                          <menu.icon className={cn(
                            "h-4 w-4 transition-transform relative z-30", 
                            isActive ? "text-white scale-110" : "text-white/80 group-hover:text-white"
                          )} />
                          
                          {/* Active Pill Saat Collapsed */}
                          <div className={cn(
                            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-lg transition-all duration-200 pointer-events-none z-20",
                            isActive && isCollapsed ? "bg-white/20 opacity-100" : "opacity-0 scale-95"
                          )} />
                        </div>
                        
                        {/* Text Container */}
                        {!isCollapsed && (
                          <div className="flex-1 h-full flex items-center pl-7 relative z-30 transition-opacity duration-200">
                            <span className="text-[13px] font-semibold whitespace-nowrap">{menu.name}</span>
                          </div>
                        )}
                      </Link>
                    </li>
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
              <AlertDialogTrigger asChild>
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
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
                Ya, Keluar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Sidebar>
  );
}