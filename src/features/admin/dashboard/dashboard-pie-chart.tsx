import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import type { DepartmentDistribution } from "./dashboard.types";

export interface DashboardPieChartProps {
  data: DepartmentDistribution[];
  totalPlaced: number;
}

const DEPARTMENT_COLORS: Record<string, { bgClass: string; hex: string }> = {
  TIK: { bgClass: "bg-purple-600", hex: "#7c3aed" },
  MESIN: { bgClass: "bg-rose-500", hex: "#f43f5e" },
  OTOMOTIF: { bgClass: "bg-sky-500", hex: "#0ea5e9" },
  ELEKTRO: { bgClass: "bg-emerald-500", hex: "#10b981" },
};

const FALLBACK_COLORS = [
  { bgClass: "bg-amber-500", hex: "#f59e0b" },
  { bgClass: "bg-indigo-500", hex: "#6366f1" },
  { bgClass: "bg-pink-500", hex: "#ec4899" },
  { bgClass: "bg-teal-500", hex: "#14b8a6" },
];

function getDepartmentColor(code: string, index: number = 0) {
  const normalized = code.toUpperCase();
  if (DEPARTMENT_COLORS[normalized]) {
    return DEPARTMENT_COLORS[normalized];
  }
  return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

interface PieTooltipPayload {
  payload: DepartmentDistribution & { fillColor?: string };
}

interface CustomPieTooltipProps {
  active?: boolean;
  payload?: PieTooltipPayload[];
}

function CustomPieTooltip({ active, payload }: CustomPieTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;
  const isEmpty = item.code === "-";
  const color = getDepartmentColor(item.code);

  return (
    <div
      className={cn(
        "relative z-50 rounded-xl px-3 py-2 text-white shadow-xl pointer-events-none transition-all duration-150 border border-white/20",
        isEmpty ? "bg-slate-700" : color.bgClass
      )}
    >
      <p className="text-xs font-bold text-white tracking-tight">
        {isEmpty ? "Belum Ada Data" : item.name}
      </p>
      <p className="text-xs font-medium text-white/90 mt-0.5">
        {isEmpty ? "Belum ada data penempatan" : `${item.count} kandidat (${item.percentage}%)`}
      </p>
    </div>
  );
}

export function DashboardPieChart({ data, totalPlaced }: DashboardPieChartProps) {
  const chartData = data.filter((item) => item.count > 0);
  const displayData =
    chartData.length > 0
      ? chartData
      : [
          {
            name: "Belum Ada Data",
            code: "-",
            count: 1,
            percentage: 100,
            fillColor: "#e2e8f0",
          },
        ];

  return (
    <div className="flex flex-col h-full justify-between gap-4">
      <div className="relative h-56 w-full flex items-center justify-center">
        {/* Center count & label placed behind the chart/tooltip */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center z-0">
          <span className="text-2xl font-black text-slate-800 leading-none">
            {totalPlaced.toLocaleString("id-ID")}
          </span>
          <span className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
            Diterima
          </span>
        </div>

        <ResponsiveContainer width="100%" height="100%" className="relative z-10">
          <PieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="count"
              stroke="transparent"
            >
              {displayData.map((entry, index) => {
                const color = "fillColor" in entry && entry.fillColor
                  ? entry.fillColor
                  : getDepartmentColor(entry.code, index).hex;
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Pie>
            <Tooltip
              content={<CustomPieTooltip />}
              wrapperStyle={{ zIndex: 50, pointerEvents: "none" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 place-items-center">
        {data.map((dept, index) => {
          const color = getDepartmentColor(dept.code, index);
          return (
            <div
              key={dept.code}
              className="flex items-center justify-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors w-full text-center"
            >
              <span
                className={cn("h-2.5 w-2.5 rounded-full shrink-0", color.bgClass)}
              />
              <div className="flex flex-col items-start min-w-0">
                <span className="text-xs font-semibold text-slate-700 truncate max-w-full" title={dept.name}>
                  {dept.code}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {dept.count} ({dept.percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
