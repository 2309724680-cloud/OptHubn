import { npuStats, exploreCategories, recentRuns } from "@/lib/mock-data";

const heroImageUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDLKgqfoBh1hnRNMUBeU-GIWa9AO9VbWDxr9paUZNTZTa992aDAhT6r2YNtSYmSx5W2PzfZmjcMK6-epReH3Z4zskVJw4PV56gG47FyFSjMrjPb0pLWy-3rt-oqMO8uxD_QKeeFadWO2WFdZCb6O7ou-DmNRdSBqucyUerJ1k_fAZddv0nI7BuLbU0vOeaCXmQm6Faf03aNiDxlptJnNv9pP0pi0BlahMdYIuJfzS9BL8h-bDtMtqyFLd9hhzf94YB-PV8qS1FpMBZS";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-24 hero-glow -mx-8 px-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="z-10 space-y-8">
            <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase bg-secondary-fixed-dim text-on-secondary-fixed rounded-lg font-label">
              High Performance Inference
            </span>
            <h1 className="text-display-large md:text-headline-large font-headline font-extrabold text-on-surface leading-tight tracking-tight">
              NPU 推理
              <br />
              <span className="text-primary">基准测试平台</span>
            </h1>
            <p className="text-body-large md:text-body-medium text-on-surface-variant leading-relaxed max-w-lg">
              深度洞察 AI 推理性能。通过跨架构硬件分析、多维度加速指标及学术级精度校验，为您的深度学习模型寻找最优部署方案。
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/submit">
                <button className="gradient-primary text-white px-8 py-4 rounded-xl font-headline font-bold text-title-medium shadow-xl hover:opacity-90 active:scale-95 transition-all">
                  开始测试
                </button>
              </a>
              <a href="/docs">
                <button className="border border-outline-variant/30 text-on-surface px-8 py-4 rounded-xl font-headline font-bold text-title-medium hover:bg-surface-container-low transition-all">
                  查看文档
                </button>
              </a>
            </div>
          </div>

          {/* Hero image — desktop only */}
          <div className="relative hidden lg:block">
            <div className="glass-card p-8 rounded-[2rem] border border-white/20 shadow-xl transform rotate-2">
              <img
                src={heroImageUrl}
                alt="Futuristic NPU microchip with glowing circuit traces"
                className="rounded-2xl w-full h-auto object-cover aspect-square"
              />
              <div className="absolute -bottom-6 -left-6 glass-card p-6 rounded-2xl shadow-xl border border-white/30 backdrop-blur-3xl">
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-secondary text-3xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    monitoring
                  </span>
                  <div>
                    <p className="text-note uppercase tracking-wider text-on-surface-variant font-bold">
                      Inference Speedup
                    </p>
                    <p className="text-headline-medium font-headline font-extrabold text-primary">+342%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] -z-10" />
          </div>
        </div>
      </section>

      {/* Stats — overlaps hero with negative margin */}
      <section className="-mx-4 md:-mx-6 -mt-12 relative z-20">
        <div className="bg-surface-container-lowest grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant/10 rounded-[2rem] shadow-[0_32px_64px_rgba(39,23,26,0.04)]">
          <div className="p-10 flex flex-col items-center text-center">
            <span className="text-on-surface-variant font-headline font-semibold mb-2">Total Runs</span>
            <span className="text-5xl font-headline font-extrabold text-secondary tracking-tighter">12,842</span>
            <span className="text-xs text-tertiary mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              +12% this week
            </span>
          </div>
          <div className="p-10 flex flex-col items-center text-center">
            <span className="text-on-surface-variant font-headline font-semibold mb-2">Model Count</span>
            <span className="text-5xl font-headline font-extrabold text-on-surface tracking-tighter">
              {npuStats.models}
            </span>
            <span className="text-xs text-on-surface-variant mt-2">Active across all categories</span>
          </div>
          <div className="p-10 flex flex-col items-center text-center">
            <span className="text-on-surface-variant font-headline font-semibold mb-2">Test Scenarios</span>
            <span className="text-5xl font-headline font-extrabold text-primary tracking-tighter">1,204</span>
            <span className="text-xs text-on-surface-variant mt-2">Validated HW architectures</span>
          </div>
        </div>
      </section>

      {/* Explore Directions */}
      <section className="py-8 space-y-0">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-headline font-extrabold text-on-surface mb-4">探索方向</h2>
            <p className="text-on-surface-variant max-w-md">
              按垂直领域深度测评，精准对比不同算法在专用硬件上的吞吐表现。
            </p>
          </div>
          <a
            href="/models"
            className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all"
          >
            查看全部模型库
            <span className="material-symbols-outlined">arrow_forward</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {exploreCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-surface-container-low p-8 rounded-3xl hover:bg-surface-container-lowest hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden"
            >
              <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6 text-primary">
                <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
              </div>
              <h3 className="text-xl font-headline font-bold text-on-surface mb-3">{cat.label}</h3>
              <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">{cat.description}</p>
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold rounded-lg">
                  {cat.modelCount} MODELS
                </span>
                <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Completions */}
      <section className="space-y-0 -mx-4 md:-mx-6 bg-surface-container-low/30 px-4 md:px-6 py-16">
        <h2 className="text-4xl font-headline font-extrabold text-on-surface mb-12">近期评测完成</h2>
        <div className="space-y-4">
          {recentRuns.map((run) => (
            <div
              key={run.id}
              className="bg-surface-container-lowest p-6 rounded-2xl flex flex-wrap items-center justify-between group hover:shadow-lg transition-all border border-transparent hover:border-primary/10"
            >
              {/* Model info */}
              <div className="flex items-center gap-6 min-w-[300px]">
                <div className={`w-12 h-12 ${run.iconBg} rounded-xl flex items-center justify-center`}>
                  <span
                    className={`material-symbols-outlined ${run.iconColor}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >{run.iconName}</span>
                </div>
                <div>
                  <h4 className="text-lg font-headline font-bold text-on-surface">{run.name}</h4>
                  <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest mt-1">
                    {run.category} · {run.precision}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex gap-12 items-center flex-1 justify-center px-12 py-2">
                <div className="text-center">
                  <p className="text-xs text-on-surface-variant mb-1">Latency</p>
                  <p className="text-lg font-bold text-on-surface">{run.latency}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-on-surface-variant mb-1">Throughput</p>
                  <p className="text-lg font-bold text-secondary">{run.throughput}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-on-surface-variant mb-1">Speedup vs CPU</p>
                  <p className="text-lg font-bold text-tertiary">{run.speedup}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded text-[10px] font-extrabold">
                  {run.status}
                </span>
                <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded text-[10px] font-bold">
                  {run.hardware}
                </span>
                <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
                  open_in_new
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAB */}
      <div className="fixed bottom-24 right-6 z-40 md:bottom-8">
        <a href="/submit">
          <button className="flex items-center gap-2 gradient-primary text-white px-6 py-4 rounded-full shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
            <span className="material-symbols-outlined">add_circle</span>
            <span className="font-headline font-bold">New Benchmark</span>
          </button>
        </a>
      </div>
    </>
  );
}
