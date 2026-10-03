import React from "react";
import studentWomanImg from "@/assets/wedok.png";

export interface DashboardHeroProps {
  greetingTime: string;
  firstName: string;
  totalVacancies: number;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  greetingTime,
  firstName,
  totalVacancies,
}) => {
  return (
    <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-r from-sidebar-gradient-to via-sidebar-strip to-sidebar-gradient-from text-white shadow-xs border border-white/10 shrink-0 min-h-40 sm:min-h-44 lg:min-h-46 flex items-center overflow-visible mt-1 sm:mt-2">
      {/* Content Container */}
      <div className="relative z-10 w-full px-6 sm:px-8 py-5 sm:py-6 pr-28 sm:pr-44 md:pr-52 lg:pr-60">
        <div className="space-y-1.5 sm:space-y-2 max-w-sm sm:max-w-md">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {greetingTime}, {firstName}!
          </h1>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            Ada <strong className="font-bold text-white">{totalVacancies > 0 ? totalVacancies : 2} Lowongan Kerja Baru</strong> minggu ini. Pastikan berkas E-Portofolio kamu sudah lengkap sebelum mengikuti tes.
          </p>
        </div>
      </div>

      {/* Woman Illustration: Proportionately sized and subtly popping out, matching user refinement */}
      <div className="hidden sm:block absolute right-6 md:right-10 lg:right-14 -top-5 sm:-top-6 md:-top-7 bottom-0 h-[calc(100%+20px)] sm:h-[calc(100%+24px)] md:h-[calc(100%+28px)] w-auto pointer-events-none select-none z-20">
        <img
          src={studentWomanImg}
          alt="Mahasiswi SKARIGA"
          className="h-full w-auto object-contain object-bottom drop-shadow-xl"
        />
      </div>
    </div>
  );
};
