import type { DataTableColumn } from "@/components/custom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GraduationCap,
  Briefcase,
  Building2,
  Phone,
  Pencil,
  Trash2,
} from "lucide-react";
import type { AlumniItem } from "./alumni.schema";

export interface AlumniTableActionHandlers {
  onEdit: (item: AlumniItem) => void;
  onDelete: (item: AlumniItem) => void;
}

export function buildAlumniColumns(
  handlers: AlumniTableActionHandlers
): DataTableColumn<AlumniItem>[] {
  return [
    {
      header: "ALUMNI & LULUSAN",
      align: "left",
      cell: (alumni) => {
        const name = alumni.fullName || alumni.user?.fullName || "Alumni";
        return (
          <div className="flex items-center gap-3.5">
            <Avatar className="h-10 w-10 rounded-xl border border-white shadow-2xs ring-1 ring-slate-100 shrink-0">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`}
                alt={name}
                className="rounded-xl"
              />
              <AvatarFallback className="rounded-xl font-bold text-xs bg-cyan-50 text-cyan-700">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 text-sm leading-snug truncate">
                {name}
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <GraduationCap className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
                <span className="font-medium text-slate-700">
                  Lulusan {alumni.graduationYear}
                </span>
                {alumni.nis && <span>• NIS: {alumni.nis}</span>}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "JURUSAN",
      align: "left",
      cell: (alumni) => {
        const majorName =
          typeof alumni.major === "object"
            ? alumni.major?.name
            : alumni.major || "-";
        return (
          <div className="text-xs font-semibold text-slate-700 truncate max-w-[180px]">
            {majorName}
          </div>
        );
      },
    },
    {
      header: "STATUS KARIR / KERJA",
      align: "left",
      cell: (alumni) => {
        const statusName =
          typeof alumni.employmentStatus === "object"
            ? alumni.employmentStatus?.name
            : alumni.employmentStatus;

        return (
          <div className="space-y-1">
            {statusName && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-emerald-200 bg-emerald-50 text-emerald-700">
                <Briefcase className="h-3 w-3" />
                {statusName}
              </span>
            )}
            {alumni.currentCompany?.name && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                <span className="truncate max-w-[160px]">{alumni.currentCompany.name}</span>
              </div>
            )}
            {!statusName && !alumni.currentCompany?.name && (
              <span className="text-slate-400 text-xs font-medium">-</span>
            )}
          </div>
        );
      },
    },
    {
      header: "KONTAK",
      align: "left",
      cell: (alumni) => {
        const phone = alumni.phone || alumni.user?.phone;
        return phone ? (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Phone className="h-3 w-3 text-slate-400 shrink-0" />
            <span>{phone}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-xs font-medium">-</span>
        );
      },
    },
    {
      header: "AKSI",
      align: "right",
      cell: (alumni) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handlers.onEdit(alumni)}
            title="Edit Alumni"
            className="h-8 w-8 rounded-lg border border-blue-200/80 bg-blue-50/70 text-blue-600 hover:bg-blue-100 hover:text-blue-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handlers.onDelete(alumni)}
            title="Hapus Alumni"
            className="h-8 w-8 rounded-lg border border-rose-200/80 bg-rose-50/70 text-rose-600 hover:bg-rose-100 hover:text-rose-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];
}
