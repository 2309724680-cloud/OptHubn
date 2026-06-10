"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { allModels } from "@/lib/mock-data";

const CATEGORIES = [
  { key: "All", label: "全部" },
  { key: "Audio Recognition", label: "语音识别" },
  { key: "Generative Vision", label: "生成视觉" },
  { key: "Large Language", label: "大语言模型" },
  { key: "Object Detection", label: "目标检测" },
  { key: "Multimodal", label: "多模态" },
  { key: "Embodied AI", label: "具身智能" },
];

const QUANTS = ["全部", "INT4", "INT8", "FP16"];
const QUANT_MAP: Record<string, string> = { "全部": "All", "INT4": "INT4", "INT8": "INT8", "FP16": "FP16" };

const SORT_OPTIONS = [
  { key: "default", label: "默认排序" },
  { key: "latency_asc", label: "延迟最低" },
  { key: "throughput_desc", label: "吞吐最高" },
  { key: "speedup_desc", label: "加速比最高" },
];

function sortModels(models: typeof allModels, sortKey: string) {
  if (sortKey === "default") return models;
  return [...models].sort((a, b) => {
    if (sortKey === "latency_asc") {
      const av = parseFloat(a.metric1Value);
      const bv = parseFloat(b.metric1Value);
      return av - bv;
    }
    if (sortKey === "throughput_desc") {
      const av = parseFloat(a.metric2Value);
      const bv = parseFloat(b.metric2Value);
      return bv - av;
    }
    if (sortKey === "speedup_desc") {
      const av = a.hardwareBenchmarks?.reduce((mx, h) => Math.max(mx, h.speedupVsCpu), 0) ?? 0;
      const bv = b.hardwareBenchmarks?.reduce((mx, h) => Math.max(mx, h.speedupVsCpu), 0) ?? 0;
      return bv - av;
    }
    return 0;
  });
}

function ModelsContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState("All");
  const [quant, setQuant] = useState("全部");
  const [sort, setSort] = useState("default");
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    const quantKey = QUANT_MAP[quant];
    const base = allModels.filter((m) => {
      const q = search.toLowerCase();
      return (
        (q === "" || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)) &&
        (category === "All" || m.category === category) &&
        (quantKey === "All" || m.quant === quantKey)
      );
    });
    return sortModels(base, sort);
  }, [search, category, quant, sort]);

  const currentSortLabel = SORT_OPTIONS.find(s => s.key === sort)?.label ?? "默认排序";

  return (
    <>
      <section className="pt-2 space-y-1">
        <h2 className="font-headline font-extrabold text-3xl text-primary tracking-tight">模型库</h2>
        <p className="font-body text-sm text-on-surface-variant">浏览并对比 NPU 优化模型的推理性能。</p>
      </section>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]" translate="no" aria-hidden="true">search</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-surface-container-low rounded-2xl border-none font-body text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/30"
          placeholder="搜索模型名称、分类..."
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Filters + Sort */}
      <div className="space-y-3">
        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors font-label ${
                category === key
                  ? "bg-primary text-on-primary shadow-md"
                  : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Quant + Sort row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            {QUANTS.map((q) => (
              <button
                key={q}
                onClick={() => setQuant(q)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors font-label ${
                  quant === q
                    ? "bg-secondary text-on-secondary"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors border border-outline-variant/20"
            >
              <span className="material-symbols-outlined text-[15px]">sort</span>
              {currentSortLabel}
              <span className={`material-symbols-outlined text-[14px] transition-transform ${showSort ? "rotate-180" : ""}`}>expand_more</span>
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-1 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/20 overflow-hidden z-20 min-w-[130px]">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => { setSort(opt.key); setShowSort(false); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-xs transition-colors hover:bg-surface-container-low ${sort === opt.key ? "text-primary font-bold" : "text-on-surface"}`}
                  >
                    {opt.label}
                    {sort === opt.key && <span className="material-symbols-outlined text-primary text-[15px]">check</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-on-surface-variant font-label uppercase tracking-widest">
          共 {filtered.length} 个模型
        </p>
        <div className="space-y-3">
          {filtered.map((model, i) => {
            const iconColor = model.iconBg.includes("secondary") ? "text-secondary"
              : model.iconBg.includes("tertiary") ? "text-tertiary"
              : "text-primary";
            return (
              <Link key={model.id} href={`/models/${model.id}`} className="block group">
                <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border border-transparent hover:border-primary/10">
                  <div className="flex items-center gap-4 p-4">
                    {/* Rank */}
                    <span className="font-headline font-black text-xl text-outline/25 w-7 flex-shrink-0 text-center">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${model.iconBg}`}>
                      <span
                        className={`material-symbols-outlined text-xl ${iconColor}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >{model.iconName}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-headline font-bold text-on-surface truncate group-hover:text-primary transition-colors text-sm">
                          {model.name}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 bg-secondary/10 text-secondary font-label font-bold rounded-full flex-shrink-0">
                          {model.quant}
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant font-label uppercase tracking-wider">
                        {CATEGORIES.find(c => c.key === model.category)?.label ?? model.category}
                      </p>
                      {/* Mobile metrics */}
                      <div className="flex gap-4 mt-1.5 sm:hidden">
                        <span className="text-[11px] font-bold text-primary">{model.metric1Value}</span>
                        <span className="text-[11px] text-on-surface-variant">{model.metric1Label}</span>
                        <span className="text-[11px] font-bold text-secondary">{model.metric2Value}</span>
                        <span className="text-[11px] text-on-surface-variant">{model.metric2Label}</span>
                      </div>
                    </div>

                    {/* Desktop metrics */}
                    <div className="hidden sm:flex gap-6 text-right flex-shrink-0 items-center">
                      <div>
                        <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-tighter">{model.metric1Label}</p>
                        <p className="font-headline font-extrabold text-primary">{model.metric1Value}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-tighter">{model.metric2Label}</p>
                        <p className="font-headline font-extrabold text-secondary">{model.metric2Value}</p>
                      </div>
                      <span className="material-symbols-outlined text-outline opacity-0 group-hover:opacity-100 transition-opacity">
                        chevron_right
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-on-surface-variant space-y-4">
              <span className="material-symbols-outlined text-4xl block">search_off</span>
              <p className="text-sm font-medium">未找到匹配的模型</p>
              <button
                onClick={() => { setSearch(""); setCategory("All"); setQuant("全部"); setSort("default"); }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold hover:bg-primary/20 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
                清除所有筛选
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function ModelsPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-on-surface-variant">加载中...</div>}>
      <ModelsContent />
    </Suspense>
  );
}
