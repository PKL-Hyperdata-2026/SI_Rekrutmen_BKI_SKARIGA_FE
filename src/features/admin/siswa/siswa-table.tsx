import type { DataTableColumn } from "@/components/custom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GraduationCap,
  Mail,
  Phone,
  Pencil,
  Trash2,
  FileText,
} from "lucide-react";
import type { SiswaItem } from "./siswa.schema";

export interface SiswaTableActionHandlers {
  onDetail: (item: SiswaItem) => void;
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
      cell: (siswa) => {
        const studentName = siswa.fullName || siswa.user?.fullName || "Tanpa Nama";
        const initial = studentName.charAt(0).toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 rounded-full border border-slate-100 shadow-2xs shrink-0">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(studentName)}`}
                alt={studentName}
                className="rounded-full"
              />
              <AvatarFallback className="rounded-full font-bold text-xs bg-amber-50 text-amber-700">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 text-sm leading-snug truncate">
                {studentName}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">
                NIS: {siswa.nis}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "JURUSAN & KELAS",
      align: "left",
      cell: (siswa) => (
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span className="truncate max-w-[280px]">{siswa.major?.name || "-"}</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium pl-5 uppercase">
            {siswa.class?.name || "Kelas -"}
          </div>
        </div>
      ),
    },
    {
      header: "KONTAK",
      align: "left",
      cell: (siswa) => {
        const email = siswa.email || siswa.user?.email || "-";
        const phone = siswa.phone || siswa.user?.phone || "-";

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate max-w-[260px]">{email}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{phone}</span>
            </div>
          </div>
        );
      },
    },
    {
      header: "STATUS KETERSERAPAN",
      align: "center",
      cell: (siswa) => {
        const label =
          siswa.employmentStatus?.name ||
          (siswa.currentCompany ? `Diterima ${siswa.currentCompany.name}` : "Mencari Kerja");

        return (
          <div className="flex justify-center">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium border border-emerald-400/80 text-emerald-600 bg-emerald-50/40">
              {label}
            </span>
          </div>
        );
      },
    },
    {
      header: "AKSI",
      align: "right",
      cell: (siswa) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handlers.onDetail(siswa)}
            title="Detail & Portofolio"
            className="h-8 w-8 rounded-lg border border-sky-200/80 bg-sky-50/70 text-sky-600 hover:bg-sky-100 hover:text-sky-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <FileText className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handlers.onEdit(siswa)}
            title="Edit Siswa"
            className="h-8 w-8 rounded-lg border border-purple-200/80 bg-purple-50/70 text-purple-600 hover:bg-purple-100 hover:text-purple-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
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
