import { useMemo } from "react";
import { Clock3, GraduationCap, Pencil, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/custom/data-table";
import { DataTablePagination } from "@/components/custom/data-table-pagination";
import { getAvatarUrl } from "@/lib/utils";
import type { RecruitmentSelectionItem } from "../types";

export interface SeleksiTableProps {
  data: RecruitmentSelectionItem[];
  loading?: boolean;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onUpdateStatus?: (item: RecruitmentSelectionItem) => void;
}

function formatTime(iso?: string | null): string {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
  } catch {
    return "-";
  }
}

function resolveAttendanceBadge(attendanceLabel?: string | null): {
  label: string;
  className: string;
} {
  const raw = (attendanceLabel ?? "").trim().toLowerCase();
  if (raw === "hadir" || raw === "present") {
    return {
      label: "Hadir",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }
  if (
    raw === "tidak hadir" ||
    raw === "tidak_hadir" ||
    raw === "absent" ||
    raw.includes("tidak hadir")
  ) {
    return {
      label: "Tidak Hadir",
      className: "bg-rose-50 text-rose-700 border-rose-200",
    };
  }
  return {
    label: attendanceLabel && attendanceLabel.trim() !== "" ? attendanceLabel : "Belum Absensi",
    className: "bg-slate-50 text-slate-600 border-slate-200",
  };
}

function resolveStageBadge(name?: string | null, code?: string | null): {
  label: string;
  className: string;
} {
  const lower = `${name ?? ""} ${code ?? ""}`.toLowerCase();
  if (lower.includes("diterima") || lower.includes("lolos final") || lower.includes("accepted")) {
    return { label: name ?? code ?? "Diterima", className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  }
  if (lower.includes("administrasi")) {
    if (lower.includes("lolos") || lower.includes("passed")) {
      return { label: name ?? "Administrasi Lolos", className: "bg-sky-50 text-sky-700 border-sky-200" };
    }
    return { label: name ?? "Administrasi", className: "bg-amber-50 text-amber-700 border-amber-200" };
  }
  if (lower.includes("tidak lolos") || lower.includes("gagal") || lower.includes("rejected") || lower.includes("ditolak")) {
    return { label: name ?? "Tidak Lolos", className: "bg-rose-50 text-rose-700 border-rose-200" };
  }
  if (lower.includes("psikotes") || lower.includes("psychotest")) {
    return { label: name ?? "Psikotes", className: "bg-purple-50 text-purple-700 border-purple-200" };
  }
  if (lower.includes("interview") || lower.includes("wawancara")) {
    return { label: name ?? "Interview", className: "bg-indigo-50 text-indigo-700 border-indigo-200" };
  }
  if (lower.includes("mcu") || lower.includes("medical")) {
    return { label: name ?? "MCU", className: "bg-teal-50 text-teal-700 border-teal-200" };
  }
  if (!name && !code) return { label: "-", className: "bg-slate-50 text-slate-600 border-slate-200" };
  return { label: name ?? code ?? "-", className: "bg-slate-50 text-slate-700 border-slate-200" };
}

function resolveAttendanceForItem(
  item: RecruitmentSelectionItem
): { label: string | null; attendedAt: string | null } {
  const histories = item.stageHistories ?? [];
  if (histories.length === 0) return { label: null, attendedAt: null };

  const currentStageId = item.currentStage?.id != null ? String(item.currentStage.id) : null;
  let target = histories.find((h) =>
    currentStageId && h.selectionStage?.id != null ? String(h.selectionStage.id) === currentStageId : false
  );

  if (!target) {
    const sorted = [...histories].sort((a, b) => {
      const ca = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const cb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return cb - ca;
    });
    target = sorted[0] ?? histories[0];
  }

  if (!target) return { label: null, attendedAt: null };
  return {
    label: target.attendance?.attendanceLabel ?? target.attendance?.attendanceStatus?.name ?? null,
    attendedAt: target.attendance?.attendedAt ?? null,
  };
}

export function SeleksiTable({
  data,
  loading = false,
  currentPage,
  pageSize,
  totalPages,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onUpdateStatus,
}: SeleksiTableProps) {
  const columns = useMemo<DataTableColumn<RecruitmentSelectionItem>[]>(
    () => [
      {
        header: "NO",
        align: "center",
        headerClassName: "w-14 text-center",
        className: "w-14 text-center",
        cell: (_row, index) => {
          const rowNumber = (currentPage - 1) * pageSize + (index !== undefined ? index + 1 : 1);
          return <span className="font-bold text-slate-400 text-xs">{rowNumber}</span>;
        },
      },
      {
        header: "IDENTITAS PELAMAR",
        align: "left",
        cell: (row) => {
          const alumniName =
            row.student?.name ??
            row.studentAlumni?.user?.fullName ??
            "Pelamar";
          const initial = alumniName.charAt(0).toUpperCase();
          const nis = row.student?.nis ?? row.studentAlumni?.nis ?? "-";
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 rounded-full border border-purple-100 shadow-2xs shrink-0">
                <AvatarImage src={getAvatarUrl(alumniName)} alt={alumniName} className="rounded-full" />
                <AvatarFallback className="rounded-full font-bold text-xs bg-purple-50 text-purple-700">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 text-sm leading-snug truncate max-w-[180px]">{alumniName}</div>
                <div className="text-xs text-slate-500 mt-0.5 font-medium font-mono">NIS: {nis}</div>
              </div>
            </div>
          );
        },
      },
      {
        header: "JURUSAN & STATUS",
        align: "left",
        cell: (row) => {
          const majorName =
            row.student?.majorName ??
            row.studentAlumni?.major?.name ??
            "-";
          const statusName = row.status?.name ?? row.status?.code ?? "-";
          const gradYear = row.studentAlumni?.graduationYear
            ? `Lulus ${row.studentAlumni.graduationYear}`
            : null;
          const { label, className } = resolveStageBadge(statusName);
          const isNeutral = label === "-" ? "bg-slate-50 text-slate-500 border-slate-200" : className;
          return (
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                <span className="truncate max-w-[180px]">{majorName}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border shadow-none ${isNeutral}`}>
                  {label}
                </Badge>
                {gradYear ? <span className="text-[11px] text-slate-500">{gradYear}</span> : null}
              </div>
            </div>
          );
        },
      },
      {
        header: "ABSENSI",
        align: "center",
        headerClassName: "text-center",
        className: "text-center",
        cell: (row) => {
          const { label, attendedAt } = resolveAttendanceForItem(row);
          const badge = resolveAttendanceBadge(label);
          const time = formatTime(attendedAt);
          return (
            <div className="flex flex-col items-center gap-1">
              <Badge variant="outline" className={`rounded-full px-3 py-0.5 text-xs font-semibold border shadow-none ${badge.className}`}>
                {badge.label}
              </Badge>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                <Clock3 className="h-3 w-3 text-slate-400" />
                {attendedAt ? time : "-"}
              </span>
            </div>
          );
        },
      },
      {
        header: "TAHAP SELEKSI SAAT INI",
        align: "center",
        headerClassName: "text-center",
        className: "text-center",
        cell: (row) => {
          const stageName = row.currentStage?.name ?? row.stageHistories?.[0]?.selectionStage?.name ?? "-";
          const statusLabel = row.status?.name ?? row.status?.code ?? row.currentStage?.name ?? "-";
          const badge = resolveStageBadge(statusLabel, row.status?.code ?? undefined);
          return (
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-slate-900 truncate max-w-[160px]">{stageName}</span>
              <Badge variant="outline" className={`rounded-full px-3 py-0.5 text-xs font-semibold border shadow-none ${badge.className}`}>
                {badge.label}
              </Badge>
            </div>
          );
        },
      },
      {
        header: "UPDATE STATUS",
        align: "center",
        headerClassName: "text-center w-36",
        className: "text-center w-36",
        cell: (row) => (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onUpdateStatus?.(row)}
              className="h-8 rounded-lg border-purple-200 bg-purple-50/70 text-purple-700 hover:bg-purple-100 hover:text-purple-800 hover:border-purple-300 text-xs font-semibold gap-1.5 shadow-2xs cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
              Update
            </Button>
          </div>
        ),
      },
    ],
    [currentPage, pageSize, onUpdateStatus]
  );

  const numberStartIndex = (currentPage - 1) * pageSize + 1;

  return (
    <Card className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden p-0 gap-0 flex flex-col">
      <CardContent className="flex flex-col gap-3 md:hidden p-3">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Memuat data seleksi...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Tidak ada data seleksi</p>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan filter lowongan, tahapan, atau kata kunci pencarian.</p>
          </div>
        ) : (
          data.map((row, idx) => {
            const name =
              row.student?.name ?? row.studentAlumni?.user?.fullName ?? "Pelamar";
            const nis = row.student?.nis ?? row.studentAlumni?.nis ?? "-";
            const majorName = row.student?.majorName ?? row.studentAlumni?.major?.name ?? "-";
            const stageName = row.currentStage?.name ?? row.stageHistories?.[0]?.selectionStage?.name ?? "-";
            const statusName = row.status?.name ?? row.status?.code ?? "-";
            const stageBadge = resolveStageBadge(statusName, row.status?.code ?? undefined);
            const { label, attendedAt } = resolveAttendanceForItem(row);
            const attendanceBadge = resolveAttendanceBadge(label);
            const time = formatTime(attendedAt);
            const initial = name.charAt(0).toUpperCase();

            return (
              <Card
                key={String(row.id)}
                className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xs flex flex-col gap-3 [--card-spacing:0px] py-3.5 ring-0"
              >
                <CardContent className="flex items-center gap-3 p-0">
                  <Avatar className="h-9 w-9 rounded-full border border-purple-100 shrink-0">
                    <AvatarImage src={getAvatarUrl(name)} alt={name} className="rounded-full" />
                    <AvatarFallback className="rounded-full font-bold text-xs bg-purple-50 text-purple-700">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 text-sm truncate">{name}</div>
                    <div className="text-xs text-slate-500 font-mono">NIS: {nis}</div>
                  </div>
                  <Badge variant="outline" className="text-xs font-bold text-slate-400 border-none bg-transparent p-0 shadow-none">
                    #{numberStartIndex + idx}
                  </Badge>
                </CardContent>

                <CardContent className="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-slate-100 p-0">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Jurusan & Status</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1 truncate">
                      <GraduationCap className="h-3 w-3 text-purple-600 shrink-0" />
                      <span className="truncate">{majorName}</span>
                    </span>
                    <Badge variant="outline" className={`w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold border shadow-none ${stageBadge.className}`}>
                      {stageBadge.label}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Absensi</span>
                    <Badge variant="outline" className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold border shadow-none ${attendanceBadge.className}`}>
                      {attendanceBadge.label}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock3 className="h-3 w-3 text-slate-400" />
                      {attendedAt ? time : "-"}
                    </span>
                  </div>
                </CardContent>

                <CardContent className="flex flex-col gap-1 pt-2.5 border-t border-slate-100 p-0">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tahap Saat Ini</span>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{stageName}</div>
                      <Badge variant="outline" className={`mt-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border shadow-none ${stageBadge.className}`}>
                        {stageBadge.label}
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateStatus?.(row)}
                      className="h-8 rounded-lg border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Update
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </CardContent>

      <div className="hidden md:flex w-full flex-col">
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          showNumbering={false}
          className="rounded-none border-none shadow-none"
          emptyMessage="Tidak ada data seleksi rekrutmen"
          emptyDescription="Belum ada pelamar yang terdaftar untuk filter yang dipilih."
          emptyIcon={<Users className="h-8 w-8 text-slate-400" />}
          getRowId={(row) => String(row.id)}
        />
      </div>

      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={[10, 25, 50, 100]}
        role="admin"
      />
    </Card>
  );
}
