"use client";

import { useState, useMemo } from "react";
import { allModels } from "@/lib/mock-data";

const CATEGORIES = ["All", "Audio Recognition", "Generative Vision", "Large Language", "Object Detection", "Multimodal"];
const QUANTS = ["All", "INT4", "INT8", "FP16"];

export default function ModelsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [quant, setQuant] = useState("All");

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
      <section className="pt-2 space-y-2">
        <h2 className="font-headline font-extrabold text-3xl text-primary tracking-tight">Model Leaderboard</h2>
        <p className="text-on-surface-variant">Browse and compare NPU-optimized models.</p>
      </section>

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
            <div key={model.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
              <div className="flex items-stretch">
                <div className="w-2 bg-secondary flex-shrink-0" />
                <div className="flex items-center gap-4 p-4 flex-1">
                  <span className="font-headline font-black text-2xl text-outline/30 w-8 flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={model.imageUrl} alt={model.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-headline font-bold text-on-surface truncate">{model.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 bg-secondary-container/20 text-secondary font-label font-bold rounded-full flex-shrink-0">
                        {model.quant}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant font-label uppercase tracking-wider">{model.category}</p>
                    <div className="flex gap-3 mt-1.5">
                      {model.tags.map((tag) => (
                        <span key={tag} className="text-[10px] text-on-surface-variant">#{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="hidden sm:flex gap-6 text-right flex-shrink-0">
                    <div>
                      <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-tighter">{model.metric1Label}</p>
                      <p className="font-headline font-extrabold text-primary">{model.metric1Value}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-tighter">{model.metric2Label}</p>
                      <p className="font-headline font-extrabold text-secondary">{model.metric2Value}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-3 block">search_off</span>
              <p className="text-sm font-medium">No models found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
