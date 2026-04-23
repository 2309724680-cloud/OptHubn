"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { allModels } from "@/lib/mock-data";

const CATEGORIES = ["All", "Audio Recognition", "Generative Vision", "Large Language", "Object Detection", "Multimodal", "Embodied AI"];
const QUANTS = ["All", "INT4", "INT8", "FP16"];

export default function ModelsPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState("All");
  const [quant, setQuant] = useState("All");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  const filtered = useMemo(() =>
    allModels.filter((m) => {
      const q = search.toLowerCase();
      return (
        (q === "" || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)) &&
        (category === "All" || m.category === category) &&
        (quant === "All" || m.quant === quant)
      );
    }), [search, category, quant]);

  return (
    <>
      <section className="pt-2 space-y-1">
        <h2 className="font-headline font-extrabold text-3xl text-primary tracking-tight">Model Leaderboard</h2>
        <p className="font-body text-sm text-on-surface-variant">Browse and compare NPU-optimized models.</p>
      </section>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]" translate="no" aria-hidden="true">search</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-surface-container-low rounded-2xl border-none font-body text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/30"
          placeholder="Search models, categories..."
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

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors font-label ${
                category === cat
                  ? "bg-primary text-on-primary shadow-md"
                  : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
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
      </div>

      {/* Results */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-on-surface-variant font-label uppercase tracking-widest">
          {filtered.length} Models
        </p>
        <div className="space-y-4">
          {filtered.map((model, i) => (
            <Link key={model.id} href={`/models/${model.id}`} className="block">
              <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer hover:border-primary/10 border border-transparent">
                <div className="flex items-stretch">
                  <div className="w-2 bg-secondary flex-shrink-0 group-hover:bg-primary transition-colors" />
                  <div className="flex items-center gap-4 p-4 flex-1">
                    <span className="font-headline font-black text-2xl text-outline/30 w-8 flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className={`w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center ${model.iconBg}`}>
                      <span
                        className={`material-symbols-outlined text-2xl ${
                          model.iconBg.includes("secondary") ? "text-secondary" :
                          model.iconBg.includes("tertiary") ? "text-tertiary" :
                          "text-primary"
                        }`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >{model.iconName}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-headline font-bold text-on-surface truncate group-hover:text-primary transition-colors">{model.name}</h4>
                        <span className="text-[10px] px-2 py-0.5 bg-secondary-container/20 text-secondary font-label font-bold rounded-full flex-shrink-0">
                          {model.quant}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant font-label uppercase tracking-wider">{model.category}</p>
                      <div className="flex gap-3 mt-1.5">
                        {model.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] text-on-surface-variant">#{tag}</span>
                        ))}
                      </div>
                    </div>
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
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-on-surface-variant space-y-4">
              <span className="material-symbols-outlined text-4xl block">search_off</span>
              <p className="text-sm font-medium">未找到匹配的模型</p>
              <button
                onClick={() => { setSearch(""); setCategory("All"); setQuant("All"); }}
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
