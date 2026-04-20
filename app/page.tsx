import { npuStats, exploreCategories, recentModels } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-primary text-white p-8 md:p-16">
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary-container font-label text-xs font-bold tracking-widest uppercase border border-secondary/30">
              Intelligence Architect
            </span>
            <h1 className="font-headline font-extrabold text-4xl md:text-6xl tracking-tight leading-tight">
              Precision Performance <br />
              <span className="text-secondary-container">Engineered.</span>
            </h1>
            <p className="text-surface-variant font-medium text-lg max-w-md">
              Comprehensive benchmarking for NPU-accelerated hardware across the modern AI landscape.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: npuStats.models, label: "Models" },
              { value: npuStats.solutions, label: "Solutions" },
              { value: npuStats.tests.toLocaleString(), label: "Tests" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-primary-container p-6 rounded-2xl border-l-4 border-secondary">
                <div className="text-secondary-container font-headline font-black text-3xl">{value}</div>
                <div className="text-surface-variant font-label text-xs font-semibold uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full pointer-events-none" />
      </section>

      {/* Explore Directions */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-headline font-extrabold text-3xl text-primary tracking-tight">Explore Directions</h2>
            <p className="text-on-surface-variant font-medium mt-1">Navigate by specialized intelligence domains.</p>
          </div>
          <a href="/models" className="hidden md:flex items-center gap-2 text-secondary font-bold text-sm group">
            View All
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {exploreCategories.map((cat) => {
            const isDark = cat.variant === "dark";
            return (
              <div
                key={cat.id}
                className={`group relative overflow-hidden h-44 md:h-48 rounded-3xl p-6 transition-all hover:shadow-2xl cursor-pointer ${
                  isDark
                    ? "bg-primary-container hover:shadow-primary/10"
                    : "bg-surface-container-lowest border border-transparent hover:border-secondary/20 hover:shadow-primary/5"
                }`}
              >
                <div className="flex flex-col h-full justify-between relative z-10">
                  <span
                    className={`material-symbols-outlined text-4xl ${isDark ? "text-secondary-container" : "text-secondary"}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {cat.icon}
                  </span>
                  <div>
                    <h3 className={`font-headline font-bold text-xl ${isDark ? "text-white" : "text-primary"}`}>{cat.label}</h3>
                    <p className={`text-sm font-medium ${isDark ? "text-surface-variant" : "text-on-surface-variant"}`}>{cat.description}</p>
                  </div>
                </div>
                {isDark && <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/10 blur-2xl rounded-full" />}
                {!isDark && <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-surface-container rounded-full group-hover:scale-150 transition-transform duration-500 opacity-30" />}
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Completions */}
      <section className="space-y-6 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-extrabold text-3xl text-primary tracking-tight">Recent Completions</h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-surface-container-high text-primary hover:bg-secondary hover:text-white transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="p-2 rounded-full bg-surface-container-high text-primary hover:bg-secondary hover:text-white transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {recentModels.map((model) => (
            <div key={model.id} className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col group">
              <div className="h-48 relative overflow-hidden">
                <img
                  src={model.imageUrl}
                  alt={model.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-secondary-container text-on-secondary-container font-label text-[10px] font-bold rounded-full">
                  QUANT: {model.quant}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="text-white/60 font-label text-xs uppercase tracking-widest font-bold">{model.category}</span>
                  <h4 className="text-white font-headline font-bold text-xl">{model.name}</h4>
                </div>
              </div>
              <div className="p-6 space-y-5 flex-grow">
                <div className="flex justify-between items-center pb-4 border-b border-surface-variant/30">
                  <div>
                    <span className="text-on-surface-variant font-label text-[10px] uppercase font-bold tracking-tighter">{model.metric1Label}</span>
                    <p className="text-primary font-headline font-extrabold text-lg">{model.metric1Value}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-on-surface-variant font-label text-[10px] uppercase font-bold tracking-tighter">{model.metric2Label}</span>
                    <p className="text-secondary font-headline font-extrabold text-lg">{model.metric2Value}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-tertiary-container text-sm">{model.detail1Icon}</span>
                    <span className="text-sm font-medium text-on-surface">{model.detail1Text}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-tertiary-container text-sm">{model.detail2Icon}</span>
                    <span className="text-sm font-medium text-on-surface">{model.detail2Text}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <button className="w-full py-3 bg-primary-container text-on-primary-container font-bold rounded-xl hover:opacity-90 transition-opacity">
                  Full Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAB */}
      <div className="fixed bottom-24 right-6 z-40 md:bottom-8">
        <a href="/submit">
          <button className="flex items-center gap-2 bg-secondary text-white px-6 py-4 rounded-full shadow-2xl shadow-secondary/40 hover:scale-105 active:scale-95 transition-all">
            <span className="material-symbols-outlined">add_circle</span>
            <span className="font-headline font-bold">New Benchmark</span>
          </button>
        </a>
      </div>
    </>
  );
}
