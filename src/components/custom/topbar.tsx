import { Search, Mail, Bell, PanelLeft, Power } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { useAppSelector, useAppDispatch } from "@/hooks/useApp";
import { useNavigate } from "react-router-dom";
import { logout } from "@/slices/authSlice";
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

export function Topbar() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-30 pt-3 pb-1 px-4 lg:px-6 w-full bg-transparent transition-all pointer-events-none">
      <header className="flex h-13 sm:h-14 shrink-0 items-center justify-between gap-3 rounded-xl bg-white px-3 sm:px-4 w-full shadow-md border border-slate-100 pointer-events-auto">
        <div className="flex items-center flex-1 gap-2.5">
          <button
            onClick={toggleSidebar}
            aria-label="Buka Menu"
            className="md:hidden relative h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-primary hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            <PanelLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <div className="relative w-full max-w-lg hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              type="search"
              placeholder="Cari posisi pekerjaan, nama perusahaan, atau kata kunci..."
              className="w-full bg-slate-50/60 hover:bg-slate-50 focus-visible:bg-white pl-9 pr-3.5 border-slate-200 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary rounded-lg h-8.5 text-xs placeholder:text-slate-400 shadow-none transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Pesan"
            className="relative h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-primary hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            <Mail className="h-3.5 w-3.5" strokeWidth={2} />
          </button>

          <button
            aria-label="Notifikasi"
            className="relative h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-primary hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            <Bell className="h-3.5 w-3.5" strokeWidth={2} />
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-primary ring-2 ring-white"></span>
          </button>

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

          {/* Red Power Off Logout Button */}
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
