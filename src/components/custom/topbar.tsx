import { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  Mail,
  Bell,
  PanelLeft,
  Power,
  CheckCheck,
  Briefcase,
  Sparkles,
  RotateCw,
  AlertCircle,
  X,
  UserPlus,
  Calendar,
  CheckCircle2,
  XCircle,
  Building2,
} from "lucide-react";
import { getRoleMenus } from "@/config/menus";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { useAppSelector, useAppDispatch } from "@/hooks/use-app";
import { useNavigate } from "react-router-dom";
import { logout } from "@/slices/authSlice";
import { useNotification, type NotificationItem } from "@/hooks/use-notification";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { getAvatarUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

function formatRelativeTime(dateString: string): string {
  try {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (diff < 60) return "Baru saja";
    if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return "";
  }
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "job_vacancy":
      return <Briefcase className="h-4 w-4 text-sky-600" />;
    case "job_application":
    case "application":
      return <UserPlus className="h-4 w-4 text-purple-600" />;
    case "test_schedule":
    case "test_schedule_update":
    case "test_reminder":
      return <Calendar className="h-4 w-4 text-amber-600" />;
    case "attendance_validated":
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    case "attendance_rejected":
      return <XCircle className="h-4 w-4 text-rose-600" />;
    case "job_placement":
    case "job_placement_update":
      return <Building2 className="h-4 w-4 text-indigo-600" />;
    default:
      return <Sparkles className="h-4 w-4 text-primary" />;
  }
}

export function Topbar() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuSearchOpen, setIsMenuSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const availableMenus = useMemo(() => getRoleMenus(user?.role), [user?.role]);
  const filteredMenus = useMemo(() => {
    if (!searchQuery.trim()) return availableMenus;
    const q = searchQuery.toLowerCase();
    return availableMenus.filter((m) => m.name.toLowerCase().includes(q));
  }, [availableMenus, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsMenuSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    notifications,
    unreadCount,
    loading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
  } = useNotification(user?.rawId ?? user?.id);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleNotificationClick = (n: NotificationItem) => {
    const isRead = Boolean(n.read_at || n.readAt);
    if (!isRead) {
      markAsRead(n.id);
    }
    setPopoverOpen(false);

    const role = user?.role;
    const isStudentRole = role === "siswa" || role === "alumni";
    const isHrdRole = role === "hrd";

    switch (n.type) {
      case "job_vacancy":
        navigate(isStudentRole ? "/student/lowongan" : isHrdRole ? "/hrd/lowongan" : "/admin/lowongan");
        break;
      case "job_application":
      case "application":
        navigate(isHrdRole ? "/hrd/review" : isStudentRole ? "/student/lamaran" : "/admin/seleksi");
        break;
      case "test_schedule":
      case "test_schedule_update":
      case "test_reminder":
        navigate(isStudentRole ? "/student/lamaran" : isHrdRole ? "/hrd/jadwal" : "/admin/seleksi");
        break;
      case "attendance_validated":
      case "attendance_rejected":
        navigate(isStudentRole ? "/student/lamaran" : "/admin/validasi-presensi");
        break;
      case "job_placement":
      case "job_placement_update":
        navigate(isStudentRole ? "/student/tracer" : isHrdRole ? "/hrd/penempatan" : "/admin/tracer");
        break;
      default:
        break;
    }
  };

  return (
    <div className="sticky top-0 z-30 pt-3 pb-1 px-3.5 sm:px-4 md:px-6 w-full max-w-full min-w-0 bg-transparent transition-all pointer-events-none">
      <header className="flex h-13 sm:h-14 shrink-0 items-center justify-between gap-2 sm:gap-3 rounded-xl bg-white px-2.5 sm:px-4 w-full max-w-full shadow-md border border-slate-100 pointer-events-auto">
        <div className="flex items-center flex-1 gap-2.5 min-w-0">
          <button
            onClick={toggleSidebar}
            aria-label="Buka Menu"
            className="md:hidden relative h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-primary hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            <PanelLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <div ref={searchContainerRef} className="relative w-full max-w-lg hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsMenuSearchOpen(true);
              }}
              onFocus={() => setIsMenuSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsMenuSearchOpen(false);
                } else if (e.key === "Enter" && filteredMenus.length > 0) {
                  e.preventDefault();
                  navigate(filteredMenus[0].link);
                  setSearchQuery("");
                  setIsMenuSearchOpen(false);
                }
              }}
              placeholder="Cari menu..."
              className="w-full bg-slate-50/60 hover:bg-slate-50 focus-visible:bg-white pl-9 pr-8 border-slate-200 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary rounded-lg h-8.5 text-xs placeholder:text-slate-400 shadow-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setIsMenuSearchOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}

            {isMenuSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 max-h-64 overflow-y-auto rounded-xl bg-white border border-slate-200/90 shadow-xl p-1.5 z-50">
                {filteredMenus.length === 0 ? (
                  <div className="py-3 px-3 text-center text-xs text-slate-400">
                    Menu tidak ditemukan
                  </div>
                ) : (
                  filteredMenus.map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.link}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          navigate(m.link);
                          setSearchQuery("");
                          setIsMenuSearchOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors text-left cursor-pointer"
                      >
                        {Icon && <Icon className="h-4 w-4 text-slate-400 shrink-0" />}
                        <span>{m.name}</span>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            aria-label="Pesan"
            className="relative h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-primary hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            <Mail className="h-3.5 w-3.5" strokeWidth={2} />
          </button>

          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                aria-label="Notifikasi"
                className="relative h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-primary hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs cursor-pointer shrink-0"
              >
                <Bell className="h-3.5 w-3.5" strokeWidth={2} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white shadow-xs">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-80 sm:w-96 p-0 rounded-2xl border border-slate-200/90 shadow-xl bg-white overflow-hidden z-50"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Notifikasi</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/10 text-primary">
                      {unreadCount} Baru
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={loading}
                    title="Muat ulang notifikasi"
                    aria-label="Muat ulang notifikasi"
                    className="p-1 rounded-md text-slate-400 hover:text-primary hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RotateCw className={cn("h-3 w-3", loading && "animate-spin text-primary")} />
                  </button>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={() => markAllAsRead()}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      <span>Tandai dibaca</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                {loading && notifications.length === 0 ? (
                  <div className="p-4 space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-1.5 py-0.5">
                          <Skeleton className="h-3.5 w-3/4 rounded" />
                          <Skeleton className="h-3 w-full rounded" />
                          <Skeleton className="h-2.5 w-1/3 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="py-8 px-4 text-center">
                    <div className="h-10 w-10 mx-auto rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-2.5">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">{error}</p>
                    <button
                      type="button"
                      onClick={() => refetch()}
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                    >
                      <RotateCw className="h-3 w-3" />
                      <span>Coba lagi</span>
                    </button>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-10 px-4 text-center">
                    <div className="h-10 w-10 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2.5">
                      <Bell className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">Belum ada notifikasi</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Pemberitahuan lowongan dan seleksi akan muncul di sini.
                    </p>
                  </div>
                ) : (
                  notifications.map((item) => {
                    const isRead = Boolean(item.read_at || item.readAt);
                    const createdAt = item.created_at || item.createdAt || "";

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={cn(
                          "flex gap-3 px-4 py-3 transition-colors cursor-pointer hover:bg-slate-50/80",
                          !isRead && "bg-sky-50/30"
                        )}
                      >
                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                          {getNotificationIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1.5">
                            <p
                              className={cn(
                                "text-xs leading-snug truncate",
                                isRead
                                  ? "font-medium text-slate-700"
                                  : "font-bold text-slate-900"
                              )}
                            >
                              {item.title}
                            </p>
                            {!isRead && (
                              <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mt-0.5">
                            {item.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {formatRelativeTime(createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </PopoverContent>
          </Popover>

          <div className="w-px h-5 bg-slate-200/80 mx-1" />

          <div className="flex items-center gap-2 pl-0.5">
            <Avatar className="h-8 w-8 rounded-lg border border-slate-100 shadow-2xs">
              <AvatarImage
                src={getAvatarUrl(user?.full_name || "")}
                alt="Avatar"
                className="rounded-lg"
              />
              <AvatarFallback className="rounded-lg text-xs">
                {user?.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col justify-center">
              <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-36">
                {user?.full_name || "User"}
              </span>
              <span className="text-xs font-medium text-slate-400 leading-tight">
                {user?.role === "siswa"
                  ? "XII RPL A • Siswa Aktif"
                  : user?.role || "Guest"}
              </span>
            </div>
          </div>

          <div className="w-px h-5 bg-slate-200/80 mx-1" />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                aria-label="Keluar / Logout"
                title="Keluar dari sistem"
                className="relative h-8 w-8 flex items-center justify-center rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer shrink-0"
              >
                <Power className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin keluar dari sistem? Sesi Anda akan
                  berakhir dan Anda harus masuk kembali.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="border-none bg-transparent mt-4 p-0 sm:p-0 m-0">
                <AlertDialogCancel
                  variant="secondary"
                  className="border-none bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer"
                >
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  Ya, Keluar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>
    </div>
  );
}
