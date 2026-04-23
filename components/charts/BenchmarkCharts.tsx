"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import type { HardwareBenchmark, ThroughputPoint } from "@/lib/mock-data";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-headline font-bold text-primary">
          {p.value} {p.name}
        </p>
      ))}
    </div>
  );
}

function AreaTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-headline font-bold text-secondary">{payload[0].value}</p>
    </div>
  );
}

export function HardwareBarChart({
  data,
  unit,
}: {
  data: HardwareBenchmark[];
  unit: string;
}) {
  const chartData = data
    .filter((d) => d.hardware !== "CPU Baseline")
    .map((d) => ({
      hardware: d.hardware.replace("NPU-", "").replace(" Gen-", "-G").replace(" 2024", "'24"),
      throughput: d.throughput,
      speedup: d.speedupVsCpu,
    }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
        <CartesianGrid vertical={false} stroke="#e3bdc3" strokeOpacity={0.4} />
        <XAxis
          dataKey="hardware"
          tick={{ fontSize: 11, fill: "#5a4044", fontFamily: "Inter" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#5a4044", fontFamily: "Inter" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#fff0f1" }} />
        <Bar dataKey="throughput" name={unit} fill="#b0004a" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SpeedupBarChart({ data }: { data: HardwareBenchmark[] }) {
  const chartData = data
    .filter((d) => d.hardware !== "CPU Baseline")
    .map((d) => ({
      hardware: d.hardware.replace("NPU-", "").replace(" Gen-", "-G").replace(" 2024", "'24"),
      speedup: d.speedupVsCpu,
    }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
        <CartesianGrid vertical={false} stroke="#e3bdc3" strokeOpacity={0.4} />
        <XAxis
          dataKey="hardware"
          tick={{ fontSize: 11, fill: "#5a4044", fontFamily: "Inter" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#5a4044", fontFamily: "Inter" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#fff0f1" }} />
        <Bar dataKey="speedup" name="x vs CPU" fill="#942cb0" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ThroughputAreaChart({ data }: { data: ThroughputPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
        <defs>
          <linearGradient id="throughputGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#942cb0" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#942cb0" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#e3bdc3" strokeOpacity={0.4} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#5a4044", fontFamily: "Inter" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#5a4044", fontFamily: "Inter" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<AreaTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#942cb0"
          strokeWidth={2.5}
          fill="url(#throughputGrad)"
          dot={{ fill: "#942cb0", r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#b0004a" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
