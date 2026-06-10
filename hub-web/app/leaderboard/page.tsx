"use client";

import { useState } from "react";
import { allModels } from "@/lib/mock-data";

const hardwareList = ["全部硬件", "NPU-X1 Gen2", "NPU-V2 Gen-4", "EDGE-NPU X1", "R-SERIES 2024"];
const categoryList = ["全部分类", "Audio Recognition", "Generative Vision", "Large Language", "Object Detection", "Multimodal"];
const metricList = [
  { key: "throughput", label: "吞吐量" },
  { key: "latency", label: "延迟" },
  { key: "speedup", label: "加速比" },
  { key: "power", label: "功耗效率" },
];

interface LeaderRow {
  rank: number;
  id: string;
  name: string;
  category: string;
  quant: string;
  hardware: string;
  latencyMs: number;
  throughput: number;
  throughputUnit: string;
  speedup: number;
  powerW: number;
  status: "PASSED" | "FAILED" | "RUNNING";
}

function buildRows(hardware: string, category: string, metric: string): LeaderRow[] {
  const rows: LeaderRow[] = [];

  for (const model of allModels) {
    if (!model.hardwareBenchmarks) continue;
    if (category !== "全部分类" && model.category !== category) continue;

    for (const hw of model.hardwareBenchmarks) {
      if (hw.hardware === "CPU Baseline") continue;
      if (hardware !== "全部硬件" && hw.hardware !== hardware) continue;

      rows.push({
        rank: 0,
        id: model.id,
        name: model.name,
        category: model.category,
        quant: model.quant,
        hardware: hw.hardware,
        latencyMs: hw.latencyMs,
        throughput: hw.throughput,
        throughputUnit: hw.throughputUnit,
        speedup: hw.speedupVsCpu,
        powerW: hw.powerW,
        status: hw.status,
      });
    }
  }

  rows.sort((a, b) => {
    if (metric === "throughput") return b.throughput - a.throughput;
    if (metric === "latency") return a.latencyMs - b.latencyMs;
    if (metric === "speedup") return b.speedup - a.speedup;
    if (metric === "power") return b.throughput / b.powerW - a.throughput / a.powerW;
    return 0;
  });

  rows.forEach((r, i) => { r.rank = i + 1; });
  return rows;
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400 text-white font-extrabold text-sm shadow-md">
        1
      </span>
    );
  if (rank === 2)
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-slate-700 font-extrabold text-sm shadow">
        2
      </span>
    );
  if (rank === 3)
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-600 text-white font-extrabold text-sm shadow">
        3
      </span>
    );
  return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container text-on-surface-variant font-bold text-sm">
      {rank}
    </span>
  );
}

function StatusChip({ status }: { status: "PASSED" | "FAILED" | "RUNNING" }) {
  const cls =
    status === "PASSED"
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
      : status === "FAILED"
      ? "bg-red-50 text-red-600 border border-red-200"
      : "bg-amber-50 text-amber-600 border border-amber-200";
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide ${cls}`}>
      {status}
    </span>
  );
}

export default function LeaderboardPage() {
  const [hardware, setHardware] = useState("全部硬件");
  const [category, setCategory] = useState("全部分类");
  const [metric, setMetric] = useState("throughput");

  const rows = buildRows(hardware, category, metric);
  const top3 = rows.slice(0, 3);

  const activeMetric = metricList.find((m) => m.key === metric)!;

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-on-surface-variant font-semibold">
          <span className="material-symbols-outlined text-base">leaderboard</span>
          排行榜
        </div>
        <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">
          推理性能<span className="text-primary">排行榜</span>
        </h1>
        <p className="text-on-surface-variant max-w-2xl">
          跨架构硬件推理基准排名。筛选硬件平台与模型分类，按吞吐量、延迟、加速比或功耗效率排序。
        </p>
      </div>

      {/* Podium — top 3 */}
      {top3.length >= 3 && (
        <section className="grid grid-cols-3 gap-4">
          {/* 2nd */}
          <div className="bg-surface-container-low rounded-3xl p-6 flex flex-col items-center text-center order-1 mt-8">
            <span className="text-4xl mb-2">🥈</span>
            <p className="font-headline font-bold text-on-surface text-sm leading-tight">{top3[1].name}</p>
            <p className="text-xs text-on-surface-variant mt-1">{top3[1].hardware}</p>
            <p className="text-2xl font-extrabold text-secondary mt-3">
              {metric === "throughput"
                ? `${top3[1].throughput} ${top3[1].throughputUnit}`
                : metric === "latency"
                ? `${top3[1].latencyMs}ms`
                : metric === "speedup"
                ? `${top3[1].speedup}x`
                : `${(top3[1].throughput / top3[1].powerW).toFixed(2)} TOPS/W`}
            </p>
          </div>
          {/* 1st */}
          <div className="bg-gradient-to-b from-primary/10 to-surface-container-low rounded-3xl p-6 flex flex-col items-center text-center order-2 ring-2 ring-primary/30">
            <span className="text-5xl mb-2">🥇</span>
            <p className="font-headline font-bold text-on-surface text-sm leading-tight">{top3[0].name}</p>
            <p className="text-xs text-on-surface-variant mt-1">{top3[0].hardware}</p>
            <p className="text-3xl font-extrabold text-primary mt-3">
              {metric === "throughput"
                ? `${top3[0].throughput} ${top3[0].throughputUnit}`
                : metric === "latency"
                ? `${top3[0].latencyMs}ms`
                : metric === "speedup"
                ? `${top3[0].speedup}x`
                : `${(top3[0].throughput / top3[0].powerW).toFixed(2)} TOPS/W`}
            </p>
            <span className="mt-2 px-3 py-0.5 bg-primary text-on-primary text-[10px] font-extrabold rounded-full">
              BEST
            </span>
          </div>
          {/* 3rd */}
          <div className="bg-surface-container-low rounded-3xl p-6 flex flex-col items-center text-center order-3 mt-8">
            <span className="text-4xl mb-2">🥉</span>
            <p className="font-headline font-bold text-on-surface text-sm leading-tight">{top3[2].name}</p>
            <p className="text-xs text-on-surface-variant mt-1">{top3[2].hardware}</p>
            <p className="text-2xl font-extrabold text-on-surface mt-3">
              {metric === "throughput"
                ? `${top3[2].throughput} ${top3[2].throughputUnit}`
                : metric === "latency"
                ? `${top3[2].latencyMs}ms`
                : metric === "speedup"
                ? `${top3[2].speedup}x`
                : `${(top3[2].throughput / top3[2].powerW).toFixed(2)} TOPS/W`}
            </p>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="bg-surface-container-lowest rounded-2xl p-6 flex flex-wrap gap-6 items-end shadow-sm border border-outline-variant/10">
        {/* Metric selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">排序指标</label>
          <div className="flex gap-2">
            {metricList.map((m) => (
              <button
                key={m.key}
                onClick={() => setMetric(m.key)}
                className={`px-4 py-2 rounded-xl text-sm font-headline font-bold transition-all ${
                  metric === m.key
                    ? "gradient-primary text-white shadow-md"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hardware filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">硬件平台</label>
          <select
            value={hardware}
            onChange={(e) => setHardware(e.target.value)}
            className="px-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/20 text-sm font-headline text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
          >
            {hardwareList.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </div>

        {/* Category filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">模型分类</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/20 text-sm font-headline text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
          >
            {categoryList.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <p className="text-xs text-on-surface-variant ml-auto self-center">
          共 <span className="font-bold text-on-surface">{rows.length}</span> 条结果
        </p>
      </section>

      {/* Table */}
      <section className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
        {/* Table header */}
        <div className="grid grid-cols-[48px_1fr_120px_110px_120px_100px_90px_80px] gap-0 px-6 py-3 bg-surface-container border-b border-outline-variant/10 text-xs font-extrabold text-on-surface-variant uppercase tracking-widest">
          <span>#</span>
          <span>模型</span>
          <span>硬件</span>
          <span>
            {activeMetric.label}
            <span className="material-symbols-outlined text-[14px] text-primary ml-1">arrow_downward</span>
          </span>
          <span>延迟</span>
          <span>加速比</span>
          <span>功耗</span>
          <span>状态</span>
        </div>

        {rows.length === 0 ? (
          <div className="py-20 text-center text-on-surface-variant space-y-4">
            <span className="material-symbols-outlined text-5xl block">filter_alt_off</span>
            <p>暂无匹配数据</p>
            <button
              onClick={() => { setHardware("全部硬件"); setCategory("全部分类"); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold hover:bg-primary/20 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
              清除筛选条件
            </button>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {rows.map((row) => (
              <a
                key={`${row.id}-${row.hardware}`}
                href={`/models/${row.id}`}
                className="grid grid-cols-[48px_1fr_120px_110px_120px_100px_90px_80px] gap-0 px-6 py-4 items-center hover:bg-surface-container-low transition-colors group"
              >
                <RankBadge rank={row.rank} />

                <div className="min-w-0 pr-4">
                  <p className="font-headline font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                    {row.name}
                  </p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold mt-0.5">
                    {row.category} · {row.quant}
                  </p>
                </div>

                <span className="text-xs font-semibold text-on-surface-variant bg-surface-container px-2 py-1 rounded-lg w-fit">
                  {row.hardware}
                </span>

                <span className="font-headline font-bold text-primary text-base">
                  {metric === "throughput"
                    ? `${row.throughput} ${row.throughputUnit}`
                    : metric === "latency"
                    ? `${row.latencyMs}ms`
                    : metric === "speedup"
                    ? `${row.speedup}x`
                    : `${(row.throughput / row.powerW).toFixed(2)} T/W`}
                </span>

                <span className="text-sm text-on-surface">{row.latencyMs}ms</span>

                <span className="text-sm font-semibold text-secondary">{row.speedup}x</span>

                <span className="text-sm text-on-surface-variant">{row.powerW}W</span>

                <StatusChip status={row.status} />
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Legend */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: "speed", label: "低延迟", desc: "< 50ms 端到端推理", color: "text-primary" },
          { icon: "bolt", label: "高吞吐", desc: "> 100 FPS / tok/s", color: "text-secondary" },
          { icon: "eco", label: "高能效", desc: "> 5 TOPS/W", color: "text-tertiary" },
          { icon: "verified", label: "官方验证", desc: "平台实测认证结果", color: "text-primary" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-surface-container-lowest rounded-2xl p-5 flex gap-4 items-start border border-outline-variant/10"
          >
            <span className={`material-symbols-outlined text-2xl ${item.color}`}>{item.icon}</span>
            <div>
              <p className="font-headline font-bold text-on-surface text-sm">{item.label}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
