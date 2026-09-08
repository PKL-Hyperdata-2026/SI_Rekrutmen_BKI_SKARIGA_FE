import type { DataTableColumn } from "@/components/custom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GraduationCap,
  Mail,
  Phone,
  Globe,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";
import type { AlumniItem } from "./alumni.schema";

export interface AlumniTableActionHandlers {
  onDetail?: (item: AlumniItem) => void;
  onEdit: (item: AlumniItem) => void;
  onDelete: (item: AlumniItem) => void;
  currentPage?: number;
  perPage?: number;
}

export function buildAlumniColumns(
  handlers: AlumniTableActionHandlers
): DataTableColumn<AlumniItem>[] {
  return [
    {
      header: "NO",
      align: "center",
      className: "w-14 text-center",
      headerClassName: "w-14 text-center",
      cell: (_alumni, index) => {
        const page = handlers.currentPage || 1;
        const perPage = handlers.perPage || 15;
        const rowNumber =
          (page - 1) * perPage + (index !== undefined ? index + 1 : 1);
        return (
          <span className="font-bold text-slate-400 text-xs">{rowNumber}</span>
        );
      },
    },
    {
      header: "ALUMNI & NIS",
      align: "left",
      cell: (alumni) => {
        const alumniName =
          alumni.fullName || alumni.user?.fullName || "Alumni";
        const initial = alumniName.charAt(0).toUpperCase();
        const nis = alumni.nis || "-";

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 rounded-full border border-purple-100 shadow-2xs shrink-0">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(alumniName)}`}
                alt={alumniName}
                className="rounded-full"
              />
              <AvatarFallback className="rounded-full font-bold text-xs bg-purple-50 text-purple-700">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 text-sm leading-snug truncate max-w-[200px]">
                {alumniName}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium font-mono">
                NIS: {nis}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "JURUSAN & LULUS",
      align: "left",
      cell: (alumni) => {
        const className =
          typeof alumni.class === "object"
            ? alumni.class?.name
            : alumni.class;
        const majorName =
          typeof alumni.major === "object"
            ? alumni.major?.name
            : alumni.major;
        const majorDisplay = majorName || className || "-";
        const gradYear = alumni.graduationYear
          ? `Lulus T.A ${alumni.graduationYear}`
          : "Tahun Lulus -";

        return (
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-purple-600 shrink-0" />
              <span className="truncate max-w-[240px]">{majorDisplay}</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium pl-5">
              {className && majorName ? `${className} • ` : ""}
              {gradYear}
            </div>
          </div>
        );
      },
    },
    {
      header: "KONTAK & SOSMED",
      align: "left",
      cell: (alumni) => {
        const phone = alumni.phone || alumni.user?.phone || "-";
        const email = alumni.email || alumni.user?.email || null;

        let rawSocial: string | null = null;
        if (typeof alumni.socialMedia === "string") {
          try {
            const parsed = JSON.parse(alumni.socialMedia);
            rawSocial =
              parsed?.profile_url ||
              parsed?.linkedin ||
              parsed?.github ||
              alumni.socialMedia;
          } catch {
            rawSocial = alumni.socialMedia;
          }
        } else if (alumni.socialMedia && typeof alumni.socialMedia === "object") {
          rawSocial =
            (alumni.socialMedia.profile_url as string) ||
            alumni.socialMedia.linkedin ||
            alumni.socialMedia.github ||
            null;
        }

        let socialUrl: string | null = null;
        if (rawSocial) {
          const trimmed = rawSocial.trim();
          const lower = trimmed.toLowerCase();
          if (
            trimmed !== "" &&
            trimmed !== "-" &&
            lower !== "null" &&
            lower !== "undefined"
          ) {
            socialUrl = /^https?:\/\//i.test(trimmed)
              ? trimmed
              : `https://${trimmed}`;
          }
        }

        const secondContact = socialUrl || email || "-";
        const isUrl = Boolean(socialUrl);

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
              <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              {isUrl ? (
                <>
                  <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <a
                    href={socialUrl!}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate max-w-[200px] hover:underline text-purple-600 hover:text-purple-700"
                    title={socialUrl!}
                  >
                    {socialUrl!.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </>
              ) : (
                <>
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span
                    className="truncate max-w-[200px]"
                    title={secondContact}
                  >
                    {secondContact}
                  </span>
                </>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: "STATUS KETERSERAPAN",
      align: "center",
      cell: (alumni) => {
        const statusName =
          (typeof alumni.employmentStatus === "object"
            ? alumni.employmentStatus?.name
            : alumni.employmentStatus) || "";

        const companyName =
          alumni.currentCompany?.name ||
          (alumni as { companyNameManual?: string }).companyNameManual ||
          alumni.currentPosition ||
          "";

        const s = statusName.toLowerCase();

        let label = "Belum Bekerja";
        let badgeStyle =
          "border border-slate-300 text-slate-600 bg-slate-50";

        if (s.includes("lanjut") || s.includes("kuliah") || s.includes("studi")) {
          label = `Melanjutkan - ${companyName || "Kuliah"}`;
          badgeStyle = "border border-sky-400/80 text-sky-700 bg-sky-50/50";
        } else if (
          s.includes("wirausaha") ||
          s.includes("usaha") ||
          s.includes("bisnis") ||
          s.includes("entrepreneur")
        ) {
          label = `Wirausaha ${companyName ? `(${companyName})` : ""}`;
          badgeStyle =
            "border border-purple-400/80 text-purple-700 bg-purple-50/50";
        } else if (s.includes("kerja") || s.includes("bekerja") || companyName) {
          label = `Diterima ${companyName || statusName || "Bekerja"}`;
          badgeStyle =
            "border border-emerald-400/80 text-emerald-700 bg-emerald-50/50";
        }

        return (
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shadow-2xs ${badgeStyle}`}
            >
              {label}
            </span>
          </div>
        );
      },
    },
    {
      header: "AKSI",
      align: "right",
      className: "w-36 text-right",
      headerClassName: "w-36 text-right",
      cell: (alumni) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handlers.onDetail?.(alumni)}
            title="Detail & Portofolio"
            className="h-8 w-8 rounded-lg border border-sky-200/80 bg-sky-50/70 text-sky-600 hover:bg-sky-100 hover:text-sky-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <FileText className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handlers.onEdit(alumni)}
            title="Ubah Data"
            className="h-8 w-8 rounded-lg border border-purple-200/80 bg-purple-50/70 text-purple-600 hover:bg-purple-100 hover:text-purple-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handlers.onDelete(alumni)}
            title="Hapus Data"
            className="h-8 w-8 rounded-lg border border-rose-200/80 bg-rose-50/70 text-rose-600 hover:bg-rose-100 hover:text-rose-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];
}
