import type { DataTableColumn } from "@/components/custom";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  UserCheck,
  Pencil,
  Trash2,
} from "lucide-react";
import type { DudiItem } from "./dudi.schema";

export interface DudiTableActionHandlers {
  onToggleActive: (item: DudiItem) => void;
  onEdit: (item: DudiItem) => void;
  onDelete: (item: DudiItem) => void;
}

export function buildDudiColumns(
  handlers: DudiTableActionHandlers
): DataTableColumn<DudiItem>[] {
  return [
    {
      header: "PERUSAHAAN / DUDI",
      align: "left",
      cell: (company) => (
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs font-bold text-sm">
            {company.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-slate-900 text-sm leading-snug truncate">
              {company.name}
            </div>
            {company.industry?.name && (
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 mt-0.5">
                <Building2 className="h-3 w-3 shrink-0" />
                <span className="truncate">{company.industry.name}</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "KONTAK KANTOR",
      align: "left",
      cell: (company) => (
        <div className="space-y-1">
          {company.email ? (
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Mail className="h-3 w-3 text-slate-400 shrink-0" />
              <span className="truncate max-w-[180px]">{company.email}</span>
            </div>
          ) : null}
          {company.phone ? (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <Phone className="h-3 w-3 text-slate-400 shrink-0" />
              <span>{company.phone}</span>
            </div>
          ) : null}
          {company.website ? (
            <div className="flex items-center gap-1.5 text-xs text-blue-600">
              <Globe className="h-3 w-3 shrink-0" />
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="truncate max-w-[180px] hover:underline"
              >
                {company.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          ) : null}
          {!company.email && !company.phone && !company.website && (
            <span className="text-slate-400 text-xs font-medium">-</span>
          )}
        </div>
      ),
    },
    {
      header: "PIC / HRD",
      align: "left",
      cell: (company) =>
        company.picName ? (
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>{company.picName}</span>
            </div>
            {company.picContact && (
              <div className="text-[11px] text-slate-500 pl-5">
                {company.picContact}
              </div>
            )}
          </div>
        ) : (
          <span className="text-slate-400 text-xs font-medium">-</span>
        ),
    },
    {
      header: "STATUS KERJASAMA",
      align: "center",
      cell: (company) => (
        <div className="flex items-center justify-center">
          <Switch
            checked={company.isActive}
            onCheckedChange={() => handlers.onToggleActive(company)}
          />
        </div>
      ),
    },
    {
      header: "AKSI",
      align: "right",
      cell: (company) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handlers.onEdit(company)}
            title="Edit Mitra"
            className="h-8 w-8 rounded-lg border border-blue-200/80 bg-blue-50/70 text-blue-600 hover:bg-blue-100 hover:text-blue-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handlers.onDelete(company)}
            title="Hapus Mitra"
            className="h-8 w-8 rounded-lg border border-rose-200/80 bg-rose-50/70 text-rose-600 hover:bg-rose-100 hover:text-rose-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];
}
