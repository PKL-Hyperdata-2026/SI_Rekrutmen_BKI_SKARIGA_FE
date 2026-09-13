import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  CalendarClock,
  Download,
  Search,
  AlertCircle,
  PartyPopper,
  Info,
  Building2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ApplicationDetailStepper } from "./application-detail-stepper";
import type { StudentJobApplication } from "../lamaran.schema";
import { downloadPlacementLetter } from "../utils/placement-letter";

interface ApplicationCardProps {
  application: StudentJobApplication;
  onOpenInstruction?: (application: StudentJobApplication) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onOpenInstruction,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const companyName = application.vacancy?.companyName || "-";
  const rawDate = application.appliedAt || application.createdAt;
  const appliedDateFormatted = rawDate
    ? new Date(rawDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  // Status mapping
  const statusCode = application.status?.code || "in_progress";
  const isAccepted =
    statusCode === "accepted" ||
    application.selectionResult?.decision === "diterima";
  const isRejected =
    statusCode === "rejected" ||
    application.selectionResult?.decision === "tidak_diterima";

  // Data penempatan terdeteksi jika sudah ada surat penempatan resmi atau jadwal mulai kerja
  const hasPlacement = Boolean(
    application.selectionResult?.letterUrl ||
    application.placement?.startDate ||
    application.currentStage?.order === 5
  );

  let currentStageOrder = 1;
  const stageOrder = application.currentStage?.order;
  const currentStageName = application.currentStage?.name || (isAccepted ? (hasPlacement ? "Penempatan" : "Diterima") : "Pendaftaran");

  if (isAccepted) {
    currentStageOrder = hasPlacement ? 5 : 4;
  } else if (stageOrder && stageOrder >= 1 && stageOrder <= 5) {
    currentStageOrder = stageOrder;
  } else if (application.currentStage?.scheduledAt || application.currentStage?.agendaName) {
    currentStageOrder = 3;
  } else if (statusCode === "in_progress") {
    currentStageOrder = 2;
  } else {
    currentStageOrder = 1;
  }

  return (
    <Card className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:px-5 sm:py-3.5 shadow-xs hover:shadow-sm transition-all duration-200 gap-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          {application.vacancy?.companyLogo ? (
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-slate-200/80 p-1.5 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
              <img
                src={application.vacancy.companyLogo}
                alt={companyName}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#0284C7] shrink-0 shadow-xs">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          )}

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug truncate">
                {application.vacancy?.title || "-"}
              </h3>

              {isAccepted ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#0284C7] text-white shadow-xs">
                  Diterima Kerja
                </span>
              ) : isRejected ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#E11D48] text-white shadow-xs">
                  Tidak Lolos
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-purple-600 text-purple-600 bg-transparent">
                  Dalam Proses
                </span>
              )}

              <span
                className={cn(
                  "inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded-full border",
                  isAccepted
                    ? "bg-sky-50 text-[#0284C7] border-sky-200"
                    : isRejected
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                )}
              >
                Tahap {currentStageOrder}/5 : {isAccepted ? (hasPlacement ? "Penempatan" : "Diterima Kerja") : currentStageOrder === 3 ? "Tes" : currentStageName}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-normal flex-wrap">
              <span className="font-semibold text-slate-700">
                {companyName}
              </span>
              <span>•</span>
              <span>Tgl Melamar : {appliedDateFormatted}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end shrink-0 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0284C7] cursor-pointer select-none transition-colors group"
          >
            <span className="font-bold">{isExpanded ? "Tutup Detail" : "Lihat Detail"}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-slate-500 group-hover:text-[#0284C7] transition-transform duration-300 ease-in-out",
                isExpanded && "rotate-180"
              )}
            />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out overflow-hidden",
          isExpanded
            ? "grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-slate-100"
            : "grid-rows-[0fr] opacity-0 mt-0 pt-0 border-t-0"
        )}
      >
        <div className="overflow-hidden space-y-2">
          <ApplicationDetailStepper
            currentStageOrder={currentStageOrder}
            statusCode={statusCode}
          />
          {isAccepted ? (
            hasPlacement ? (
              (() => {
                const placementDateRaw = application.placement?.startDate;
                const placementSchedule = placementDateRaw
                  ? new Date(placementDateRaw).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : null;
                const placementNotes = application.placement?.notes;

                const renderPlacementContent = () => {
                  if (placementSchedule) {
                    return (
                      <span>
                        Jadwal mulai kerja :{" "}
                        <strong className="font-bold text-slate-800">{placementSchedule}</strong>
                        {placementNotes && (
                          <span className="block text-slate-500 mt-0.5">{placementNotes}</span>
                        )}
                      </span>
                    );
                  }

                  if (placementNotes) {
                    return <span>{placementNotes}</span>;
                  }

                  return (
                    <span>
                      Selamat atas kelulusan seleksi kerja! Informasi penempatan kerja akan disampaikan oleh pihak perusahaan atau panitia BKK.
                    </span>
                  );
                };

                return (
                  <div className="rounded-2xl border border-[#0284C7] bg-sky-50/10 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <PartyPopper className="h-4.5 w-4.5 text-[#0284C7] shrink-0 mt-0.5" />
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-[#0284C7] leading-tight">
                          Selamat! Kamu Resmi Diterima Bekerja
                        </h4>
                        <p className="text-[11px] text-slate-600">
                          {renderPlacementContent()}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="bg-[#0284C7] hover:bg-[#0369A1] text-white font-medium text-[11px] sm:text-xs px-3.5 py-1.5 rounded-full shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all shrink-0 self-end sm:self-center"
                      onClick={() => downloadPlacementLetter(application)}
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Unduh Surat Penempatan</span>
                    </button>
                  </div>
                );
              })()
            ) : (
              <div className="rounded-2xl border border-[#0284C7]/80 bg-sky-50/15 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <PartyPopper className="h-4.5 w-4.5 text-[#0284C7] shrink-0 mt-0.5" />
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-[#0284C7] leading-tight">
                      Tahap 4 : Diterima (Lolos Seleksi Penerimaan)
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Selamat! Kamu dinyatakan lolos seleksi penerimaan. Menunggu penerbitan surat penempatan resmi dari panitia BKK atau HRD.
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1.5 bg-sky-100 text-[#0284C7] font-semibold text-[11px] rounded-full shrink-0 self-end sm:self-center select-none">
                  Menunggu Surat Penempatan
                </span>
              </div>
            )
          ) : isRejected ? (
            <div className="rounded-2xl border border-[#E11D48]/70 bg-rose-50/15 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <AlertCircle className="h-4.5 w-4.5 text-[#E11D48] shrink-0 mt-0.5" />
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[#E11D48] leading-tight">
                    Mohon Maaf, Kamu Belum Lolos Seleksi
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    {application.notes || "Belum memenuhi kualifikasi seleksi pada tahap ini. Tetap semangat!"}
                  </p>
                </div>
              </div>

              <Link
                to="/student/lowongan"
                className="bg-[#E11D48] hover:bg-[#BE123C] text-white font-medium text-[11px] sm:text-xs px-3.5 py-1.5 rounded-full shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all shrink-0 self-end sm:self-center"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Cari Lowongan Lain</span>
              </Link>
            </div>
          ) : (
            (() => {
              const scheduledAt = application.currentStage?.scheduledAt;
              const location = application.currentStage?.location;
              const agendaName = application.currentStage?.agendaName || application.currentStage?.name;
              const isTestStage = currentStageOrder === 3;
              const hasTestSchedule = Boolean(isTestStage && (scheduledAt || agendaName || location));
              let defaultMessage = "Menunggu jadwal pelaksanaan dari panitia seleksi.";
              let stageHeaderTitle = `Tahap ${currentStageOrder} : ${currentStageName}`;

              if (currentStageOrder === 1) {
                stageHeaderTitle = "Tahap 1 : Pendaftaran";
                defaultMessage = "Berkas lamaran telah berhasil dikirim ke sistem. Menunggu verifikasi berkas awal oleh panitia BKK.";
              } else if (currentStageOrder === 2) {
                stageHeaderTitle = "Tahap 2 : Seleksi Administrasi";
                defaultMessage = "Berkas portofolio dan kelengkapan dokumen sedang dalam proses verifikasi dan penilaian administrasi.";
              } else if (currentStageOrder === 3) {
                stageHeaderTitle = `Tahap 3 : ${agendaName || "Tes Seleksi"}`;
              }

              return (
                <div className="rounded-2xl border border-[#4F46E5]/70 bg-indigo-50/15 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <Info className="h-4.5 w-4.5 text-[#4F46E5] shrink-0 mt-0.5" />
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#4F46E5] leading-tight">
                        {stageHeaderTitle}
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        {isTestStage && scheduledAt ? (
                          <span>
                            <strong>Jadwal:</strong>{" "}
                            {new Date(scheduledAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            WIB
                            {location ? ` • ${location}` : ""}
                          </span>
                        ) : isTestStage && application.notes ? (
                          <span>
                            <strong>Informasi:</strong> {application.notes}
                          </span>
                        ) : (
                          <span>{defaultMessage}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {onOpenInstruction && hasTestSchedule && (
                    <button
                      type="button"
                      className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium text-[11px] sm:text-xs px-3.5 py-1.5 rounded-full shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all shrink-0 self-end sm:self-center"
                      onClick={() => onOpenInstruction(application)}
                    >
                      <CalendarClock className="h-3.5 w-3.5" />
                      <span>Detail Jadwal</span>
                    </button>
                  )}
                </div>
              );
            })()
          )}
        </div>
      </div>
    </Card>
  );
};
