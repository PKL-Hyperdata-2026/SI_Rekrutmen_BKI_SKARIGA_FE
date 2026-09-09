import { PieChart, Briefcase, Store, GraduationCap, Search, Sparkles } from "lucide-react";
import { SectionCard } from "@/components/custom";

interface TracerStatItem {
  id: string;
  label: string;
  percentage: number;
  icon: React.ReactNode;
  barColorClass: string;
}

const STATS_ITEMS: TracerStatItem[] = [
  {
    id: "bekerja",
    label: "Bekerja",
    percentage: 65,
    icon: <Briefcase className="h-3.5 w-3.5 text-primary" />,
    barColorClass: "bg-primary",
  },
  {
    id: "wirausaha",
    label: "Wirausaha",
    percentage: 42,
    icon: <Store className="h-3.5 w-3.5 text-emerald-600" />,
    barColorClass: "bg-emerald-500",
  },
  {
    id: "lanjut_studi",
    label: "Lanjut Studi",
    percentage: 80,
    icon: <GraduationCap className="h-3.5 w-3.5 text-purple-600" />,
    barColorClass: "bg-purple-600",
  },
  {
    id: "mencari_pekerjaan",
    label: "Mencari Pekerjaan",
    percentage: 15,
    icon: <Search className="h-3.5 w-3.5 text-rose-600" />,
    barColorClass: "bg-rose-500",
  },
];

export function TracerStatsSidebar() {
  return (
    <div className="flex flex-col gap-4">
      {/* Sebaran Keterserapan Alumni */}
      <SectionCard
        className="rounded-xl p-4 sm:p-5 shadow-xs border border-slate-100/90 flex flex-col"
        headerClassName="pb-3 sm:pb-3.5 border-b border-slate-100 mb-4 sm:mb-5"
        title={
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-primary stroke-2" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
              Sebaran Keterserapan Alumni
            </h2>
          </div>
        }
      >
        <div className="space-y-4">
          {STATS_ITEMS.map((item) => (
            <div key={item.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <span>{item.percentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${item.barColorClass}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Mengapa Tracer Studi Penting? */}
      <div className="rounded-xl p-4 sm:p-5 bg-slate-900 border border-slate-800 text-white shadow-xs flex flex-col gap-3 relative overflow-hidden">
        <div className="h-9 w-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
          <Sparkles className="h-4 w-4 text-white" />
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Mengapa Tracer Studi Penting?
          </h3>
          <p className="text-xs leading-relaxed text-slate-300 font-normal">
            Data yang dikirimkan akan membantu SKARIGA menjalin kerja sama baru
            dengan perusahaan terkemuka serta membuka peluang rekomendasi karir
            lanjutan bagi alumni.
          </p>
        </div>
      </div>
    </div>
  );
}
