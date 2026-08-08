import { Search, Mail, Bell, PanelLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { useAppSelector } from "@/hooks/useApp";

export function Topbar() {
  const { user } = useAppSelector((state) => state.auth);
  const { toggleSidebar } = useSidebar();

  return (
    <div className="pt-2 px-4 lg:px-6 w-full">
      <header className="flex h-[72px] shrink-0 items-center justify-between gap-4 rounded-2xl bg-white pl-4 pr-6 w-full shadow-sm border border-white ring-1 ring-slate-100/50">
        <div className="flex items-center flex-1 gap-3">
          <button onClick={toggleSidebar} aria-label="Buka Menu" className="md:hidden relative h-9 w-9 flex items-center justify-center rounded-full border border-blue-200 bg-white text-primary hover:bg-blue-50 transition-colors shadow-sm cursor-pointer">
            <PanelLeft className="h-4.5 w-4.5" strokeWidth={2} />
          </button>
          <div className="relative w-full max-w-[550px] hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              type="search"
              placeholder="Cari posisi pekerjaan, nama perusahaan, atau kata kunci..."
              className="w-full bg-white pl-10 pr-4 border-blue-200/80 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary rounded-xl h-10 text-[13.5px] placeholder:text-slate-400 placeholder:text-[13.5px] shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="relative h-9 w-9 flex items-center justify-center rounded-full border border-blue-200 bg-white text-primary hover:bg-blue-50 transition-colors shadow-sm cursor-pointer">
            <Mail className="h-4.5 w-4.5" strokeWidth={2} />
          </button>

          <button className="relative h-9 w-9 flex items-center justify-center rounded-full border border-blue-200 bg-white text-primary hover:bg-blue-50 transition-colors shadow-sm cursor-pointer">
            <Bell className="h-4.5 w-4.5" strokeWidth={2} />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white"></span>
          </button>

          <div className="w-[1.5px] h-6 bg-slate-200/70 mx-1.5" />

          <div className="flex items-center gap-2.5 pl-1">
            <Avatar className="h-9 w-9 !rounded-xl border border-white shadow-sm ring-1 ring-slate-100">
              <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.full_name}`} alt="Avatar" className="!rounded-xl" />
              <AvatarFallback className="!rounded-xl">{user?.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col justify-center">
              <span className="text-[13px] font-bold text-primary leading-tight mb-0.5">{user?.full_name || "User"}</span>
              <span className="text-[10px] font-medium text-slate-500 leading-tight">
                {user?.role === "siswa" ? "XII RPL A • Siswa Aktif" : user?.role || "Guest"}
              </span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
