"use client";

import type { HardwareBenchmark, ThroughputPoint } from "@/lib/mock-data";

// ── Shared helpers ──────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// ── HardwareBarChart ────────────────────────────────────────────────────────

export function HardwareBarChart({
  data,
  unit,
}: {
  data: HardwareBenchmark[];
  unit: string;
}) {
  const rows = data
    .filter((d) => d.hardware !== "CPU Baseline")
    .map((d) => ({
      label: d.hardware.replace("NPU-", "").replace(" Gen-", "-G").replace(" 2024", "'24"),
      value: d.throughput,
    }));

  const max = Math.max(...rows.map((r) => r.value)) * 1.15;

  return (
    <div className="w-full space-y-2.5 pt-2">
      {rows.map((r) => {
        const pct = clamp((r.value / max) * 100, 2, 100);
        return (
          <div key={r.label} className="flex items-center gap-3 group">
            <span className="text-[11px] text-on-surface-variant font-body w-16 shrink-0 text-right">
              {r.label}
            </span>
            <div className="flex-1 h-7 bg-surface-container-low rounded-lg overflow-hidden relative">
              <div
                className="h-full rounded-lg bg-primary transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-on-surface-variant">
                {r.value} {unit}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── SpeedupBarChart ─────────────────────────────────────────────────────────

export function SpeedupBarChart({ data }: { data: HardwareBenchmark[] }) {
  const rows = data
    .filter((d) => d.hardware !== "CPU Baseline")
    .map((d) => ({
      label: d.hardware.replace("NPU-", "").replace(" Gen-", "-G").replace(" 2024", "'24"),
      value: d.speedupVsCpu,
    }));

  const max = Math.max(...rows.map((r) => r.value)) * 1.15;

  return (
    <div className="w-full space-y-2.5 pt-2">
      {rows.map((r) => {
        const pct = clamp((r.value / max) * 100, 2, 100);
        return (
          <div key={r.label} className="flex items-center gap-3 group">
            <span className="text-[11px] text-on-surface-variant font-body w-16 shrink-0 text-right">
              {r.label}
            </span>
            <div className="flex-1 h-7 bg-surface-container-low rounded-lg overflow-hidden relative">
              <div
                className="h-full rounded-lg bg-secondary transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-on-surface-variant">
                {r.value}x
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── ThroughputAreaChart (SVG polyline) ──────────────────────────────────────

export function ThroughputAreaChart({ data }: { data: ThroughputPoint[] }) {
  const W = 400;
  const H = 160;
  const PL = 8;
  const PR = 8;
  const PT = 8;
  const PB = 24;

  const values = data.map((d) => d.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values) * 1.05;

  const xStep = (W - PL - PR) / Math.max(data.length - 1, 1);

  function px(i: number) {
    return PL + i * xStep;
  }
  function py(v: number) {
    return PT + ((H - PT - PB) * (1 - (v - minV) / (maxV - minV)));
  }

  const pts = data.map((d, i) => `${px(i)},${py(d.value)}`).join(" ");
  const areaPath =
    `M ${px(0)},${py(data[0].value)} ` +
    data.slice(1).map((d, i) => `L ${px(i + 1)},${py(d.value)}`).join(" ") +
    ` L ${px(data.length - 1)},${H - PB} L ${px(0)},${H - PB} Z`;

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: 180 }}
        preserveAspectRatio="none"
      >
        {/* grid lines */}
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={PL} y1={PT + (H - PT - PB) * (1 - t)}
            x2={W - PR} y2={PT + (H - PT - PB) * (1 - t)}
            stroke="#e3bdc3" strokeOpacity={0.5} strokeWidth={1}
          />
        ))}

        {/* area fill */}
        <defs>
          <linearGradient id="tpGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#942cb0" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#942cb0" stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#tpGrad)" />

        {/* line */}
        <polyline
          points={pts}
          fill="none"
          stroke="#942cb0"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* dots */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={px(i)} cy={py(d.value)}
            r={4} fill="#942cb0" stroke="#fff" strokeWidth={1.5}
          />
        ))}

        {/* x-axis labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={px(i)} y={H - 4}
            textAnchor="middle"
            fontSize={10}
            fill="#5a4044"
            fontFamily="Inter"
          >
            {d.date}
          </text>
        ))}
      </svg>
    </div>
  );
}
