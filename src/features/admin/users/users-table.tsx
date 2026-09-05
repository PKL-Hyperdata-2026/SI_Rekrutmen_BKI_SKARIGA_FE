import type { ReactNode } from "react";
import type { DataTableColumn } from "@/components/custom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  KeyRound,
  Pencil,
  Trash2,
  Building2,
  ShieldCheck,
  UserCheck,
  Briefcase,
  GraduationCap,
  Users,
  Mail,
  Phone,
} from "lucide-react";
import type { UserItem } from "./users.schema";

export function renderRoleBadge(role: string): ReactNode {
  switch (role) {
    case "superadmin":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-purple-200 bg-purple-50 text-purple-700 shadow-2xs">
          <ShieldCheck className="h-3.5 w-3.5" />
          Super Admin
        </span>
      );
    case "admin":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-blue-200 bg-blue-50 text-blue-700 shadow-2xs">
          <UserCheck className="h-3.5 w-3.5" />
          Admin BKI
        </span>
      );
    case "hrd":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-2xs">
          <Briefcase className="h-3.5 w-3.5" />
          HRD Mitra
        </span>
      );
    case "siswa":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-amber-200 bg-amber-50 text-amber-700 shadow-2xs">
          <Users className="h-3.5 w-3.5" />
          Siswa
        </span>
      );
    case "alumni":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-cyan-200 bg-cyan-50 text-cyan-700 shadow-2xs">
          <GraduationCap className="h-3.5 w-3.5" />
          Alumni
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-700">
          {role}
        </span>
      );
  }
}

export interface UserTableActionHandlers {
  onToggleActive: (user: UserItem) => void;
  onResetPassword: (user: UserItem) => void;
  onEdit: (user: UserItem) => void;
  onDelete: (user: UserItem) => void;
}

export function buildUserColumns(
  handlers: UserTableActionHandlers
): DataTableColumn<UserItem>[] {
  return [
    {
      header: "PENGGUNA",
      align: "left",
      cell: (user) => (
        <div className="flex items-center gap-3.5">
          <Avatar className="h-10 w-10 rounded-xl border border-white shadow-2xs ring-1 ring-slate-100 shrink-0">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.fullName}`}
              alt={user.fullName}
              className="rounded-xl"
            />
            <AvatarFallback className="rounded-xl font-bold text-xs bg-primary/10 text-primary">
              {user.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-bold text-slate-900 text-sm leading-snug truncate">
              {user.fullName}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <Mail className="h-3 w-3 text-slate-400 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "ROLE",
      align: "left",
      cell: (user) => renderRoleBadge(user.role),
    },
    {
      header: "KONTAK",
      align: "left",
      cell: (user) =>
        user.phone ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{user.phone}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-xs font-medium">-</span>
        ),
    },
    {
      header: "INSTANSI / MITRA DUDI",
      align: "left",
      cell: (user) =>
        user.company ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
            <Building2 className="h-3.5 w-3.5 text-slate-500" />
            <span className="truncate max-w-[180px]">{user.company.name}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-xs font-medium">-</span>
        ),
    },
    {
      header: "STATUS AKUN",
      align: "center",
      cell: (user) => (
        <div className="flex items-center justify-center">
          <Switch
            checked={user.isActive}
            onCheckedChange={() => handlers.onToggleActive(user)}
          />
        </div>
      ),
    },
    {
      header: "AKSI",
      align: "right",
      cell: (user) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handlers.onResetPassword(user)}
            title="Reset Kata Sandi"
            className="h-8 w-8 rounded-lg border border-amber-200/80 bg-amber-50/70 text-amber-600 hover:bg-amber-100 hover:text-amber-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <KeyRound className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handlers.onEdit(user)}
            title="Edit Pengguna"
            className="h-8 w-8 rounded-lg border border-blue-200/80 bg-blue-50/70 text-blue-600 hover:bg-blue-100 hover:text-blue-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handlers.onDelete(user)}
            title="Hapus Pengguna"
            className="h-8 w-8 rounded-lg border border-rose-200/80 bg-rose-50/70 text-rose-600 hover:bg-rose-100 hover:text-rose-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];
}
