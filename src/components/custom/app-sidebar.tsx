import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/hooks/use-app";
import { STUDENT_MENUS, ADMIN_MENUS, HRD_MENUS } from "@/config/menus";
import type { MenuItem } from "@/config/menus";
import { Building2, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarMenuItem } from "./sidebar-menu-item";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AppSidebar() {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const { state: sidebarState, toggleSidebar, setOpenMobile, isMobile } = useSidebar();
  const isCollapsed = !isMobile && sidebarState === "collapsed";

  const isHrd = user?.role === "hrd";
  const brandTitle = isHrd ? (user?.company?.name || "Perusahaan Mitra") : "BKI SKARIGA";
  const brandSubtitle = isHrd
    ? "Portal HRD"
    : user?.role === "siswa" || user?.role === "alumni"
      ? "Portal Siswa & Alumni"
      : user?.role === "superadmin"
        ? "Portal Super Admin"
        : user?.role === "admin"
          ? "Portal Admin"
          : `Portal ${user?.role || "Sistem"}`;

  const sidebarContainerRef = useRef<HTMLDivElement>(null);
  const [notchData, setNotchData] = useState<{ y: number; height: number; width: number; totalHeight: number } | null>(null);

  const updateNotch = useCallback(() => {
    if (isMobile) {
      setNotchData(null);
      return;
    }

    const container = sidebarContainerRef.current;
    if (!container) return;

    const activeEl = container.querySelector<HTMLElement>('[data-sidebar-active="true"]');
    const bgEl = container.querySelector<HTMLElement>('[data-sidebar-gradient="true"]');

    if (activeEl && bgEl) {
      const bgRect = bgEl.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      const y = activeRect.top - bgRect.top;
      setNotchData((prev) => ({
        y,
        height: activeRect.height || 40,
        width: bgRect.width > 150 ? bgRect.width : (prev?.width || 248),
        totalHeight: bgRect.height || 800,
      }));
    }
  }, [isMobile]);

  useEffect(() => {
    updateNotch();
    const frameId = requestAnimationFrame(updateNotch);
    const timer = setTimeout(updateNotch, 320);
    window.addEventListener("resize", updateNotch);
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
      window.removeEventListener("resize", updateNotch);
    };
  }, [location.pathname, isCollapsed, updateNotch]);

  useEffect(() => {
    setOpenMobile(false);
  }, [location.pathname, setOpenMobile]);

  let menus: MenuItem[] = [];
  if (user?.role === "siswa" || user?.role === "alumni") {
    menus = STUDENT_MENUS.filter((item) => {
      if (item.alumniOnly || item.link === "/student/tracer") {
        return user?.role === "alumni";
      }
      return true;
    });
  } else if (user?.role === "superadmin") {
    menus = ADMIN_MENUS;
  } else if (user?.role === "admin") {
    menus = ADMIN_MENUS.filter((item) => !item.superadminOnly);
  } else if (user?.role === "hrd") {
    menus = HRD_MENUS;
  }

  const clipPathD = (!isMobile && notchData)
    ? [
        `M 0 0`,
        `H ${notchData.width - 16}`,
        `A 16 16 0 0 1 ${notchData.width} 16`,
        `V ${notchData.y - 14}`,
        `A 14 14 0 0 1 ${notchData.width - 14} ${notchData.y}`,
        `H 80`,
        `A 12 12 0 0 0 68 ${notchData.y + 12}`,
        `V ${notchData.y + notchData.height - 12}`,
        `A 12 12 0 0 0 80 ${notchData.y + notchData.height}`,
        `H ${notchData.width - 14}`,
        `A 14 14 0 0 1 ${notchData.width} ${notchData.y + notchData.height + 14}`,
        `V ${notchData.totalHeight - 16}`,
        `A 16 16 0 0 1 ${notchData.width - 16} ${notchData.totalHeight}`,
        `H 0`,
        `Z`,
      ].join(" ")
    : undefined;

  return (
    <Sidebar
      collapsible="icon"
      side="left"
      variant="sidebar"
      className="border-none border-r-0 shadow-none bg-transparent p-0 overflow-x-hidden [&>[data-slot=sidebar-inner]]:bg-transparent"
    >
      <div ref={sidebarContainerRef} className="relative h-full w-full">
        {/* SVG ClipPath Definition for True Vector Cutout */}
        {clipPathD && (
          <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
            <defs>
              <clipPath id="sidebar-true-cutout-clip" clipPathUnits="userSpaceOnUse">
                <path d={clipPathD} />
              </clipPath>
            </defs>
          </svg>
        )}

        {/* Role-based Gradient Background Container with True Vector Cutout */}
        <div
          data-sidebar-gradient="true"
          className={cn(
            "absolute inset-0 md:top-2 md:bottom-2 md:left-2 md:right-0 z-0 rounded-none rounded-r-2xl md:rounded-2xl pointer-events-none transition-opacity duration-300 ease-in-out bg-gradient-to-b from-sidebar-gradient-from to-sidebar-gradient-to border-y-0 border-l-0 md:border md:border-r-0 border-white/20",
            isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
          style={
            clipPathD
              ? {
                  clipPath: "url(#sidebar-true-cutout-clip)",
                }
              : undefined
          }
        />
        {/* Role-based Dark Strip Background */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 md:top-2 md:bottom-2 md:left-2 w-14 z-0 bg-sidebar-strip transition-all duration-300 ease-in-out",
            "rounded-none md:rounded-2xl border md:border-white/10",
            isCollapsed && "shadow-lg"
          )}
        />

      <div className="relative z-10 flex flex-col h-full text-white md:py-2 md:pl-2 w-full">
        {/* Custom Header */}
        <div className="pt-5 pb-3 flex items-center shrink-0 relative pr-3">
          {/* Brand Icon in Dark Strip */}
          <div className="w-14 flex justify-center items-center shrink-0 h-10 relative">
            <Building2 className="h-5 w-5 text-white shrink-0" strokeWidth={1.5} />
          </div>

          {/* Brand Info in Expanded Area */}
          <div
            className={cn(
              "flex-1 h-10 flex items-center overflow-hidden whitespace-nowrap pl-6 transition-all duration-300 ease-in-out",
              isCollapsed ? "opacity-0 pointer-events-none -translate-x-3" : "opacity-100 translate-x-0"
            )}
          >
            <div className="flex flex-col justify-center min-w-0 pr-2">
              <span
                className="font-bold text-xs leading-tight text-white tracking-wide truncate"
                title={brandTitle}
              >
                {brandTitle}
              </span>
              <span className="text-xs text-white/75 mt-0.5 font-medium whitespace-nowrap">
                {brandSubtitle}
              </span>
            </div>
          </div>

          {/* Mobile Collapse/Close Button */}
          {isMobile && (
            <button
              onClick={() => setOpenMobile(false)}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Tutup Menu"
              aria-label="Tutup Menu"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Custom Menu Content */}
        <SidebarContent onScroll={updateNotch} className="p-0 flex-1 overflow-y-auto overflow-x-visible">
          <SidebarGroup className="p-0 overflow-visible">
            <SidebarGroupContent className="overflow-visible">
              <ul className="flex flex-col gap-1 h-full relative pt-3 pb-3 overflow-x-hidden">
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

        {/* Custom Footer: Collapse / Expand Toggle Button in Dark Strip (Desktop Only) */}
        {!isMobile && (
          <div className="h-12 shrink-0 border-none flex items-center pb-1.5 pt-1 relative">
            <div className="w-14 flex justify-center items-center shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleSidebar}
                    aria-label={isCollapsed ? "Perluas Sidebar" : "Perkecil Sidebar"}
                    className="flex justify-center items-center h-8 w-8 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-300 ease-in-out cursor-pointer"
                  >
                    <PanelLeft
                      className={cn(
                        "h-4 w-4 transition-transform duration-300 ease-in-out",
                        isCollapsed ? "rotate-180" : "rotate-0"
                      )}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" align="center">
                  {isCollapsed ? "Perluas Sidebar" : "Perkecil Sidebar"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
      </div>
    </Sidebar>
  );
}
