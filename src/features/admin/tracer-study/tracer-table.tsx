import type { DataTableColumn } from "@/components/custom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminTracerItem } from "./tracer.schema";

interface BuildTracerColumnsProps {
  onDetail: (item: AdminTracerItem) => void;
  onEdit: (item: AdminTracerItem) => void;
  onDelete: (item: AdminTracerItem) => void;
}

const formatCurrency = (val?: number | null): string => {
  if (val === null || val === undefined || isNaN(val) || val === 0) return "Rp -";
  return "Rp " + new Intl.NumberFormat("id-ID").format(val);
};

const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
};

export function buildTracerColumns({
  onDetail,
  onEdit,
  onDelete,
}: BuildTracerColumnsProps): DataTableColumn<AdminTracerItem>[] {
  return [
    // 1. ALUMNI & NIS
    {
      header: "ALUMNI & NIS",
      align: "left",
      className: "py-3.5",
      cell: (item) => {
        const fullName = item.studentAlumni?.fullName || "Nama Tidak Diketahui";
        const nis = item.studentAlumni?.nis || "-";
        const major = item.studentAlumni?.major?.name || "Semua Jurusan";
        const year = item.studentAlumni?.graduationYear ? ` (${item.studentAlumni.graduationYear})` : "";

        return (
          <div className="space-y-0.5 min-w-[180px]">
            <p className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
              {fullName}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              NIS : {nis} - {major}{year}
            </p>
          </div>
        );
      },
    },

    // 2. TEMPAT KERJA
    {
      header: "TEMPAT KERJA",
      align: "left",
      className: "py-3.5",
      cell: (item) => {
        let primary = "-";
        let secondary = "-";

        if (item.careerStatus === "bekerja") {
          primary = item.companyName || "Perusahaan Mitra";
          secondary = item.companySector ? `Sektor : ${item.companySector.replace(/^Sektor\s*:\s*/i, "")}` : "Sektor : Umum";
        } else if (item.careerStatus === "lanjut_studi") {
          primary = item.universityName || "Perguruan Tinggi";
          secondary = item.companySector || "Perguruan Tinggi Swasta";
        } else if (item.careerStatus === "wirausaha") {
          primary = item.businessName || "Usaha Mandiri";
          secondary = item.businessField ? `Bidang : ${item.businessField}` : "Wirausaha";
        } else if (item.careerStatus === "mencari_pekerjaan") {
          primary = "-";
          secondary = "Belum bekerja";
        }

        return (
          <div className="space-y-0.5 min-w-[170px]">
            <p className="font-bold text-slate-800 text-xs sm:text-sm leading-tight">
              {primary}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              {secondary}
            </p>
          </div>
        );
      },
    },

    // 3. JABATAN (PRODI)
    {
      header: "JABATAN (PRODI)",
      align: "left",
      className: "py-3.5",
      cell: (item) => {
        let title = "-";
        let location = item.jobLocation || "-";

        if (item.careerStatus === "bekerja") {
          title = item.jobTitle || "Karyawan";
        } else if (item.careerStatus === "lanjut_studi") {
          title = item.studyProgram || "Mahasiswa";
        } else if (item.careerStatus === "wirausaha") {
          title = item.businessField || "Pemilik Usaha";
          location = item.jobLocation || item.businessAddress || "-";
        }

        return (
          <div className="space-y-0.5 min-w-[150px]">
            <p className="font-bold text-slate-800 text-xs sm:text-sm leading-tight">
              {title}
            </p>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[180px]">
              {location}
            </p>
          </div>
        );
      },
    },

    // 4. TGL DITERIMA & MASUK
    {
      header: "TGL DITERIMA & MASUK",
      align: "left",
      className: "py-3.5",
      cell: (item) => {
        const accepted = item.acceptedDate ? formatDate(item.acceptedDate) : "-";
        const masuk = item.startDate ? formatDate(item.startDate) : "-";

        return (
          <div className="space-y-0.5 min-w-[140px] text-xs">
            <p className="font-semibold text-slate-800">
              Diterima : {accepted}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Masuk : {masuk}
            </p>
          </div>
        );
      },
    },

    // 5. MASA TUNGGU & GAJI
    {
      header: "MASA TUNGGU & GAJI",
      align: "left",
      className: "py-3.5",
      cell: (item) => {
        const waiting = item.waitingPeriod || (item.careerStatus === "lanjut_studi" ? "0 Bulan" : "-");
        const salary = item.careerStatus === "bekerja"
          ? formatCurrency(item.minimumSalary || item.maximumSalary)
          : item.careerStatus === "wirausaha" && item.averageRevenue
          ? `Rp ${item.averageRevenue}`
          : "Rp -";

        return (
          <div className="space-y-0.5 min-w-[130px] text-xs">
            <p className="font-bold text-slate-800">
              {waiting}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              {salary}
            </p>
          </div>
        );
      },
    },

    // 6. STATUS 12 BULAN
    {
      header: "STATUS 12 BULAN",
      align: "left",
      className: "py-3.5",
      cell: (item) => {
        const status = item.status12Bulan || (
          item.careerStatus === "lanjut_studi"
            ? "Masih Kuliah"
            : item.careerStatus === "wirausaha"
            ? "Wirausaha"
            : item.careerStatus === "mencari_pekerjaan"
            ? "Mencari Kerja"
            : "Masih Bekerja"
        );

        let badgeStyle = "border-emerald-300 text-emerald-600 bg-emerald-50/60";
        if (status.includes("Kuliah") || item.careerStatus === "lanjut_studi") {
          badgeStyle = "border-purple-300 text-purple-600 bg-purple-50/60";
        } else if (status.includes("Wirausaha") || item.careerStatus === "wirausaha") {
          badgeStyle = "border-blue-300 text-blue-600 bg-blue-50/60";
        } else if (status.includes("Mencari") || status.includes("Resign") || item.careerStatus === "mencari_pekerjaan") {
          badgeStyle = "border-rose-300 text-rose-600 bg-rose-50/60";
        }

        return (
          <div className="min-w-[110px]">
            <span
              className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold border ${badgeStyle}`}
            >
              {status}
            </span>
          </div>
        );
      },
    },

    // 7. AKSI
    {
      header: "AKSI",
      align: "center",
      className: "py-3.5 text-center",
      cell: (item) => {
        return (
          <div className="flex items-center justify-center gap-1.5 min-w-[90px]">
            {/* Detail Eye Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onDetail(item)}
              className="h-8 w-8 rounded-lg text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/80 transition-colors cursor-pointer"
              title="Lihat Detail Profil Alumni"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {/* Edit Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onEdit(item)}
              className="h-8 w-8 rounded-lg text-amber-600 hover:text-amber-800 hover:bg-amber-50/80 transition-colors cursor-pointer"
              title="Edit Data Tracer Study"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            {/* Delete Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item)}
              className="h-8 w-8 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50/80 transition-colors cursor-pointer"
              title="Hapus Data (Soft Delete)"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}
