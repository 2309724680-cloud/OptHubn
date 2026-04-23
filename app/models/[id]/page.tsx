"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { allModels } from "@/lib/mock-data";
import {
  HardwareBarChart,
  SpeedupBarChart,
  ThroughputAreaChart,
} from "@/components/charts/BenchmarkCharts";

export default function ModelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const model = allModels.find((m) => m.id === id);
  if (!model) notFound();

  const bestRun = model.hardwareBenchmarks?.reduce((best, curr) =>
    curr.speedupVsCpu > best.speedupVsCpu ? curr : best
  );
  const passedCount = model.hardwareBenchmarks?.filter((h) => h.status === "PASSED").length ?? 0;
  const totalCount = model.hardwareBenchmarks?.length ?? 0;

  return (
    <div className="space-y-8 pb-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-on-surface-variant font-label pt-2">
        <Link href="/models" className="hover:text-primary transition-colors">
          Models
        </Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-semibold truncate">{model.name}</span>
      </nav>

      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left: image */}
        <div className="lg:col-span-2">
          <div className="relative rounded-3xl overflow-hidden aspect-square shadow-[0_32px_64px_rgba(39,23,26,0.08)]">
            <img
              src={model.imageUrl}
              alt={model.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <span className="text-white/70 text-xs font-label uppercase tracking-widest font-bold">
                {model.category}
              </span>
              <h1 className="text-white font-headline font-extrabold text-2xl mt-1">{model.name}</h1>
            </div>
          </div>
        </div>

        {/* Right: meta */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-primary text-on-primary text-xs font-bold rounded-full font-label">
              {model.quant}
            </span>
            {model.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed text-xs font-bold rounded-full font-label"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          {model.description && (
            <p className="text-on-surface-variant font-body leading-relaxed">{model.description}</p>
          )}

          {/* Quick stats row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface-container-low rounded-2xl p-4 text-center">
              <p className="text-2xl font-headline font-extrabold text-primary">{model.metric1Value}</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mt-1 font-label">
                {model.metric1Label}
              </p>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-4 text-center">
              <p className="text-2xl font-headline font-extrabold text-secondary">{model.metric2Value}</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mt-1 font-label">
                {model.metric2Label}
              </p>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-4 text-center">
              <p className="text-2xl font-headline font-extrabold text-tertiary">
                {bestRun ? `${bestRun.speedupVsCpu}x` : "—"}
              </p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mt-1 font-label">
                Best Speedup
              </p>
            </div>
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { icon: "hub", label: "Framework", value: model.framework },
              { icon: "account_tree", label: "Topology", value: model.topology },
              { icon: "person", label: "Submitter", value: model.submitter },
              { icon: "event", label: "Submit Date", value: model.submitDate },
              { icon: "sell", label: "Version", value: model.version },
              { icon: "verified_user", label: "License", value: model.license },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-2">
                <span className="material-symbols-outlined text-outline text-[18px] mt-0.5 flex-shrink-0">{icon}</span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label">
                    {label}
                  </p>
                  <p className="text-on-surface font-medium truncate">{value ?? "—"}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Validation badge */}
          <div className="flex items-center gap-3 bg-tertiary-container/20 rounded-xl px-4 py-3">
            <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <div>
              <p className="text-sm font-headline font-bold text-on-surface">
                {passedCount}/{totalCount} Hardware Platforms Validated
              </p>
              <p className="text-xs text-on-surface-variant">All tests reproducible via NPU Benchmark CLI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Charts row */}
      {model.hardwareBenchmarks && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary text-[20px]">speed</span>
              <h2 className="font-headline font-bold text-on-surface">Throughput by Hardware</h2>
            </div>
            <p className="text-xs text-on-surface-variant mb-5 font-label">
              {model.hardwareBenchmarks[0].throughputUnit} · excluding CPU baseline
            </p>
            <HardwareBarChart
              data={model.hardwareBenchmarks}
              unit={model.hardwareBenchmarks[0].throughputUnit}
            />
          </div>

          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-secondary text-[20px]">rocket_launch</span>
              <h2 className="font-headline font-bold text-on-surface">Speedup vs CPU Baseline</h2>
            </div>
            <p className="text-xs text-on-surface-variant mb-5 font-label">
              Higher is better · CPU baseline = 1.0x
            </p>
            <SpeedupBarChart data={model.hardwareBenchmarks} />
          </div>
        </section>
      )}

      {/* Throughput trend */}
      {model.throughputHistory && (
        <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">monitoring</span>
              <h2 className="font-headline font-bold text-on-surface">Throughput Trend</h2>
            </div>
            <span className="text-xs font-bold text-tertiary font-label">
              +{Math.round(
                ((model.throughputHistory.at(-1)!.value - model.throughputHistory[0].value) /
                  model.throughputHistory[0].value) *
                  100
              )}% over 6 months
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mb-5 font-label">
            Best hardware · {model.hardwareBenchmarks?.[0]?.throughputUnit ?? ""} · last 6 submissions
          </p>
          <ThroughputAreaChart data={model.throughputHistory} />
        </section>
      )}

      {/* Hardware comparison table */}
      {model.hardwareBenchmarks && (
        <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm overflow-x-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary text-[20px]">table_chart</span>
            <h2 className="font-headline font-bold text-on-surface">Full Hardware Comparison</h2>
          </div>
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-outline-variant/20">
                {["Hardware", "Latency", "Throughput", "Speedup vs CPU", "Power", "Status"].map((h) => (
                  <th
                    key={h}
                    className="text-left pb-3 pr-6 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {model.hardwareBenchmarks.map((hw) => (
                <tr key={hw.hardware} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 pr-6">
                    <span className="font-headline font-bold text-on-surface">{hw.hardware}</span>
                  </td>
                  <td className="py-4 pr-6 font-label text-on-surface">{hw.latencyMs} ms</td>
                  <td className="py-4 pr-6 font-label font-bold text-secondary">
                    {hw.throughput} {hw.throughputUnit}
                  </td>
                  <td className="py-4 pr-6">
                    <span
                      className={`font-headline font-extrabold ${
                        hw.hardware === "CPU Baseline" ? "text-outline" : "text-tertiary"
                      }`}
                    >
                      {hw.speedupVsCpu}x
                    </span>
                  </td>
                  <td className="py-4 pr-6 font-label text-on-surface-variant">{hw.powerW} W</td>
                  <td className="py-4">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-extrabold font-label ${
                        hw.status === "PASSED"
                          ? "bg-tertiary-container text-on-tertiary-container"
                          : hw.status === "FAILED"
                          ? "bg-error-container text-on-error-container"
                          : "bg-secondary-fixed text-on-secondary-fixed"
                      }`}
                    >
                      {hw.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Accuracy metrics */}
      {model.accuracyMetrics && (
        <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-secondary text-[20px]">analytics</span>
            <h2 className="font-headline font-bold text-on-surface">Accuracy & Efficiency Report</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {model.accuracyMetrics.map((metric) => (
              <div key={metric.name} className="bg-surface-container-low rounded-2xl p-5">
                <p className="text-2xl font-headline font-extrabold text-on-surface mb-1">{metric.value}</p>
                {metric.delta && (
                  <p
                    className={`text-xs font-bold font-label mb-2 ${
                      metric.positive ? "text-tertiary" : "text-on-surface-variant"
                    }`}
                  >
                    {metric.delta} vs FP32 baseline
                  </p>
                )}
                <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label leading-tight">
                  {metric.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA row */}
      <section className="flex flex-wrap gap-4">
        <Link href="/submit">
          <button className="flex items-center gap-2 gradient-primary text-white px-6 py-3 rounded-xl font-headline font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[20px]">add_chart</span>
            Submit New Run
          </button>
        </Link>
        <button className="flex items-center gap-2 border border-outline-variant/30 text-on-surface px-6 py-3 rounded-xl font-headline font-bold hover:bg-surface-container-low transition-all">
          <span className="material-symbols-outlined text-[20px]">download</span>
          Export Report
        </button>
        <button className="flex items-center gap-2 border border-outline-variant/30 text-on-surface px-6 py-3 rounded-xl font-headline font-bold hover:bg-surface-container-low transition-all">
          <span className="material-symbols-outlined text-[20px]">share</span>
          Share
        </button>
      </section>
    </div>
  );
}
