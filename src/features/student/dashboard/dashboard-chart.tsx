import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface MonthlyTrendData {
  month: string;
  lowongan: number;
  melamar: number;
}

export interface DashboardChartProps {
  data?: MonthlyTrendData[];
  isLoading?: boolean;
}

const defaultChartData: MonthlyTrendData[] = [
  { month: "Jun", lowongan: 7, melamar: 3 },
  { month: "Jul", lowongan: 3, melamar: 5 },
  { month: "Aug", lowongan: 4, melamar: 8 },
  { month: "Sept", lowongan: 5, melamar: 4 },
  { month: "Oct", lowongan: 8, melamar: 5 },
  { month: "Nov", lowongan: 0, melamar: 0 },
];

export const DashboardChart: React.FC<DashboardChartProps> = ({
  data = defaultChartData,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card className="rounded-2xl sm:rounded-3xl border border-slate-100 bg-white p-4 sm:p-5 shadow-2xs h-full flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-44 rounded" />
            <Skeleton className="h-3 w-56 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>
        <Skeleton className="flex-1 w-full rounded-xl min-h-45" />
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl sm:rounded-3xl border border-slate-100/90 bg-white p-4 sm:p-5 shadow-2xs h-full flex flex-col justify-between">
      {/* Header with Title and Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2.5 shrink-0">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug">
            Grafik Lowongan Kerja & Lamaran
          </h2>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Tren lowongan dan lamaran 6 bulan terakhir
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 self-start sm:self-center">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400 inline-block shadow-2xs" />
            <span className="text-xs text-slate-600 font-medium">Lowongan Kerja</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-400 inline-block shadow-2xs" />
            <span className="text-xs text-slate-600 font-medium">Melamar</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 min-h-45 w-full min-w-0 -ml-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 12, right: 10, left: -14, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorLowongan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="colorMelamar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              dy={6}
            />

            <YAxis
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              dx={-4}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                return (
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-100 shadow-lg p-2.5 text-xs space-y-1">
                    <p className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-1">
                      {label}
                    </p>
                    {payload.map((entry, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 text-xs"
                      >
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <span
                            className={
                              entry.name === "Lowongan Kerja"
                                ? "h-1.5 w-1.5 rounded-full bg-rose-400"
                                : "h-1.5 w-1.5 rounded-full bg-blue-400"
                            }
                          />
                          {entry.name}:
                        </span>
                        <span className="font-bold text-slate-900">
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />

            <Area
              type="monotone"
              dataKey="lowongan"
              name="Lowongan Kerja"
              stroke="#f87171"
              strokeWidth={2}
              fill="url(#colorLowongan)"
              dot={{ r: 3, fill: "#ffffff", stroke: "#f87171", strokeWidth: 1.5 }}
              activeDot={{ r: 4.5, fill: "#f87171", stroke: "#ffffff", strokeWidth: 2 }}
            />

            <Area
              type="monotone"
              dataKey="melamar"
              name="Melamar"
              stroke="#60a5fa"
              strokeWidth={2}
              fill="url(#colorMelamar)"
              dot={{ r: 3, fill: "#ffffff", stroke: "#60a5fa", strokeWidth: 1.5 }}
              activeDot={{ r: 4.5, fill: "#60a5fa", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
