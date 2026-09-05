import type { DataTableColumn } from "@/components/custom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GraduationCap,
  Mail,
  Phone,
  Pencil,
  Trash2,
} from "lucide-react";
import type { SiswaItem } from "./siswa.schema";

export interface SiswaTableActionHandlers {
  onEdit: (item: SiswaItem) => void;
  onDelete: (item: SiswaItem) => void;
}

export function buildSiswaColumns(
  handlers: SiswaTableActionHandlers
): DataTableColumn<SiswaItem>[] {
  return [
    {
      header: "SISWA & NIS",
      align: "left",
      cell: (siswa) => (
        <div className="flex items-center gap-3.5">
          <Avatar className="h-10 w-10 rounded-xl border border-white shadow-2xs ring-1 ring-slate-100 shrink-0">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${siswa.fullName}`}
              alt={siswa.fullName}
              className="rounded-xl"
            />
            <AvatarFallback className="rounded-xl font-bold text-xs bg-amber-50 text-amber-700">
              {siswa.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-bold text-slate-900 text-sm leading-snug truncate">
              {siswa.fullName}
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <span className="font-semibold text-slate-700">NIS: {siswa.nis}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "JURUSAN & KELAS",
      align: "left",
      cell: (siswa) => (
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span className="truncate max-w-[200px]">{siswa.major?.name || "-"}</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium pl-5">
            {siswa.class?.name || "Kelas -"}
          </div>
        </div>
      ),
    },
    {
      header: "KONTAK",
      align: "left",
      cell: (siswa) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Mail className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="truncate max-w-[180px]">{siswa.email}</span>
          </div>
          {siswa.phone && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <Phone className="h-3 w-3 text-slate-400 shrink-0" />
              <span>{siswa.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "STATUS",
      align: "center",
      cell: (siswa) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
            siswa.isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-50 text-slate-500 border-slate-200"
          }`}
        >
          {siswa.isActive ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
    {
      header: "AKSI",
      align: "right",
      cell: (siswa) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handlers.onEdit(siswa)}
            title="Edit Siswa"
            className="h-8 w-8 rounded-lg border border-blue-200/80 bg-blue-50/70 text-blue-600 hover:bg-blue-100 hover:text-blue-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handlers.onDelete(siswa)}
            title="Hapus Siswa"
            className="h-8 w-8 rounded-lg border border-rose-200/80 bg-rose-50/70 text-rose-600 hover:bg-rose-100 hover:text-rose-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];
}
