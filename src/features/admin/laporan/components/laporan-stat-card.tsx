import { FileDown } from "lucide-react";

interface LaporanStatCardProps {
  label: string;
  value: string | number;
  sublabel: string;
  accentColor?: string;
}

export function LaporanStatCard({
  label,
  value,
  sublabel,
  accentColor = "text-slate-900",
}: LaporanStatCardProps) {
  return (
    <div className="relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-slate-600">
          {label}
        </span>
        <FileDown className="h-4 w-4 shrink-0 text-slate-400" />
      </div>

      <div className="mt-2.5">
        <p className={`text-xl font-bold tracking-tight ${accentColor}`}>
          {value}
        </p>
        <p className="mt-1 text-[11px] font-normal text-slate-400">
          {sublabel}
        </p>
      </div>
    </div>
  );
}

