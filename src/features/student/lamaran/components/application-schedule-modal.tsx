import React from "react";
import { Modal } from "@/components/custom/modal";
import { Building2, ExternalLink } from "lucide-react";
import type { StudentJobApplication } from "../lamaran.schema";
import { useApplicationScheduleModal } from "../hooks/useApplicationScheduleModal";

export interface ApplicationScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: StudentJobApplication | null;
}

export const ApplicationScheduleModal: React.FC<ApplicationScheduleModalProps> = ({
  open,
  onOpenChange,
  application,
}) => {
  const {
    handleOpenChange,
    jobTitle,
    companyName,
    agendaName,
    location,
    scheduledDateFormatted,
    scheduledTimeFormatted,
    optionalDescription,
    isLink,
  } = useApplicationScheduleModal({ open, onOpenChange, application });

  if (!application) return null;

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      variant="student"
      headerStyle="gradient"
      size="sm"
      title="Detail Jadwal Tes"
      description="Informasi agenda dan jadwal pelaksanaan seleksi rekrutmen."
      footer={null}
    >
      <div className="space-y-4 py-1 text-slate-700">
        <div className="rounded-2xl border-2 border-sky-400/80 bg-sky-50/25 p-4 sm:p-4.5 flex items-center gap-3.5 shadow-2xs">
          <div className="w-11 h-11 rounded-xl bg-white border border-sky-200/90 shadow-xs flex items-center justify-center text-[#0284C7] shrink-0">
            <Building2 className="h-5 w-5 text-[#0284C7]" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug truncate">
              {jobTitle}
            </h4>
            <p className="text-xs sm:text-[13px] font-semibold text-[#0284C7] mt-0.5 leading-tight truncate">
              {companyName}
            </p>
          </div>
        </div>

        <div className="space-y-3.5 px-0.5">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Agenda Tes
            </span>
            <p className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
              {agendaName}
            </p>
          </div>

          <div className="border-b border-slate-100" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Tanggal Pelaksanaan
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                {scheduledDateFormatted}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Waktu Mulai
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#0284C7] mt-0.5 leading-snug">
                {scheduledTimeFormatted || "-"}
              </p>
            </div>
          </div>

          <div className="border-b border-slate-100" />
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Lokasi / Link Tes
            </span>
            <div className="mt-0.5">
              {isLink ? (
                <a
                  href={location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-bold text-[#0284C7] hover:underline inline-flex items-center gap-1.5 break-all"
                >
                  <span>{location}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              ) : (
                <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug break-words">
                  {location}
                </p>
              )}
            </div>
          </div>

          {optionalDescription && (
            <>
              <div className="border-b border-slate-100" />
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Deskripsi / Catatan
                </span>
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {optionalDescription}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
