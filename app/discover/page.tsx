"use client";

import { useState } from "react";
import { discoverCategories, discoverItems, featuredProject } from "@/lib/mock-data";

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("All Results");
  const [query, setQuery] = useState("");

  const filtered = discoverItems.filter(
    (item) =>
      (activeCategory === "All Results" || item.category.includes(activeCategory)) &&
      (query === "" || item.title.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <>
      {/* Hero + Search */}
      <section className="pt-4">
        <h2 className="font-headline font-extrabold text-4xl mb-6 text-on-surface tracking-tight">
          Explore the <span className="text-primary">Ecosystem.</span>
        </h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline">search</span>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-surface-container-low rounded-xl border-none outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all font-body text-on-surface placeholder:text-outline/60"
            placeholder="Search services, items or spaces..."
            type="text"
          />
        </div>
      </section>

      {/* Category Chips */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-6 px-6 scrollbar-none">
        {discoverCategories.map(({ label, icon }) => {
          const isActive = activeCategory === label;
          return (
            <button
              key={label}
              onClick={() => setActiveCategory(label)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full font-label text-sm font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-primary-container text-on-primary-container shadow-md"
                  : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {icon}
              </span>
              {label}
            </button>
          );
        })}
      </div>

      {/* Featured Card */}
      <div className="group relative overflow-hidden rounded-xl bg-surface-container-lowest">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={featuredProject.imageUrl}
            alt={featuredProject.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
          <span className="font-label text-white/70 text-xs mb-2 tracking-widest uppercase">
            {featuredProject.label}
          </span>
          <h3 className="font-headline text-xl text-white font-bold mb-1">{featuredProject.title}</h3>
          <p className="font-body text-white/80 text-sm">{featuredProject.description}</p>
        </div>
      </div>

      {/* Premium CTA Card */}
      <div className="bg-surface-container-low rounded-xl p-6 flex flex-col justify-between border border-outline-variant/10">
        <div>
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              workspace_premium
            </span>
          </div>
          <h3 className="font-headline text-xl font-bold mb-2">Premium Consultation</h3>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed">
            Book a 1-on-1 session with our architectural leads for structural planning.
          </p>
        </div>
        <button className="mt-6 py-3 w-full bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-semibold shadow-lg shadow-primary/20 active:scale-95 transition-all">
          Schedule Now
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group bg-surface-container-lowest rounded-xl overflow-hidden flex gap-4 items-center p-4 shadow-[0_8px_24px_-4px_rgba(25,28,30,0.04)] cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-headline font-bold text-on-surface">{item.title}</h4>
                <span className="text-primary font-bold text-sm">{item.price}</span>
              </div>
              <p className="text-xs text-on-surface-variant font-label uppercase tracking-wider mb-2">
                {item.category}
              </p>
              <div className="flex items-center gap-1 text-tertiary">
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="text-xs font-bold">
                  {item.rating} ({item.reviews} reviews)
                </span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-3 block">search_off</span>
            <p className="text-sm font-medium">No results found</p>
          </div>
        )}
      </div>

      {/* Promo Banner */}
      <div className="p-6 rounded-xl bg-secondary-container relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-headline text-xl font-bold text-on-secondary-fixed mb-2">
            Sustainable Living
          </h3>
          <p className="font-body text-on-secondary-fixed-variant text-sm mb-4">
            Our new collection of zero-impact materials is here. Build the future without the footprint.
          </p>
          <button className="bg-surface-container-lowest text-primary px-6 py-2 rounded-full font-bold text-sm hover:bg-surface transition-colors">
            Learn More
          </button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-primary/10 -skew-x-12 transform translate-x-10" />
      </div>
    </>
  );
}
