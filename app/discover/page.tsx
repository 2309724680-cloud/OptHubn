"use client";

import { useState, useMemo } from "react";
import { getAllTools } from "@/lib/tools-registry";
import ToolCard from "@/components/ToolCard";

const ALL_TOOLS = getAllTools();
const CATEGORIES = ["全部", ...Array.from(new Set(ALL_TOOLS.map((t) => t.category)))];
const ALL_TAGS = Array.from(new Set(ALL_TOOLS.flatMap((t) => t.tags)));

const CATEGORY_ICONS: Record<string, string> = {
  全部: "auto_awesome",
  Writing: "edit_note",
  Design: "palette",
  Code: "code",
  Productivity: "speed",
};

function SectionHeader({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span
        className="material-symbols-outlined text-[20px] text-tertiary"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
      <h3 className="font-headline font-bold text-on-surface">{label}</h3>
    </div>
  );
}

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("全部");
  const [activeTag, setActiveTag] = useState("");

  const isFiltering = query !== "" || activeCategory !== "全部" || activeTag !== "";

  const filtered = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const q = query.toLowerCase();
      const matchesQuery =
        q === "" ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some((t) => t.includes(q));
      const matchesCategory = activeCategory === "全部" || tool.category === activeCategory;
      const matchesTag = activeTag === "" || tool.tags.includes(activeTag);
      return matchesQuery && matchesCategory && matchesTag;
    });
  }, [query, activeCategory, activeTag]);

  const trending = useMemo(
    () => [...ALL_TOOLS].sort((a, b) => b.usage - a.usage),
    []
  );
  const topRated = useMemo(
    () => [...ALL_TOOLS].sort((a, b) => b.rating - a.rating),
    []
  );
  const newTools = useMemo(() => ALL_TOOLS.filter((t) => t.isNew), []);

  function clearFilters() {
    setQuery("");
    setActiveCategory("全部");
    setActiveTag("");
  }

  return (
    <>
      {/* Hero + Search */}
      <section className="pt-4">
        <h2 className="font-headline font-extrabold text-4xl mb-6 text-on-surface tracking-tight">
          探索<span className="text-primary">工具生态。</span>
        </h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline">search</span>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-surface-container-low rounded-xl border-none outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all font-body text-on-surface placeholder:text-outline/60"
            placeholder="搜索工具名称、标签..."
            type="text"
          />
        </div>
      </section>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-6 px-6 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full font-label text-sm font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-primary text-on-primary shadow-md"
                  : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {CATEGORY_ICONS[cat] ?? "category"}
              </span>
              {cat}
            </button>
          );
        })}
      </div>

      {/* Tag Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-6 px-6 scrollbar-none">
        {ALL_TAGS.map((tag) => {
          const isActive = activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setActiveTag(isActive ? "" : tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-tertiary/20 text-tertiary font-bold"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              #{tag}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isFiltering ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-on-surface-variant">
              找到 {filtered.length} 个工具
            </span>
            <button onClick={clearFilters} className="text-xs text-primary font-semibold">
              清除筛选
            </button>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-3 block">search_off</span>
              <p className="text-sm font-medium">未找到相关工具</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <section>
            <SectionHeader icon="local_fire_department" label="热门工具" />
            <div className="grid grid-cols-2 gap-3">
              {trending.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeader icon="star" label="好评最高" />
            <div className="grid grid-cols-2 gap-3">
              {topRated.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>

          {newTools.length > 0 && (
            <section>
              <SectionHeader icon="new_releases" label="最新上线" />
              <div className="grid grid-cols-2 gap-3">
                {newTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
}
