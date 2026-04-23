import { npuStats, exploreCategories, recentRuns } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16 npu-grid-dot">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase bg-[#881E55]/10 text-[#881E55] rounded-full mb-6">
              High Performance Inference
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline text-slate-900 leading-tight mb-6">
              NPU 推理
              <br />
              <span className="text-[#881E55]">基准测试平台</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
              深度洞察 AI 推理性能。通过跨架构硬件分析、多维度加速指标及学术级精度校验，为您的深度学习模型寻找最优部署方案。
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="/submit">
                <button className="gradient-primary text-white px-7 py-3 rounded-full font-semibold text-sm shadow-lg hover:opacity-90 active:scale-95 transition-all">
                  开始测试
                </button>
              </a>
              <a href="/docs">
                <button className="border border-[#881E55]/30 text-[#881E55] px-7 py-3 rounded-full font-semibold text-sm hover:bg-[#881E55]/5 transition-all">
                  查看文档
                </button>
              </a>
            </div>
          </div>
        </div>
        {/* Decorative blob */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#881E55]/5 rounded-full blur-[100px] -z-0 pointer-events-none" />
      </section>

      {/* Stats bar */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-slate-100">
            <div className="py-8 flex flex-col items-center text-center">
              <span className="text-3xl md:text-4xl font-bold font-headline text-[#881E55] tabular-nums">
                {npuStats.models.toLocaleString()}
              </span>
              <span className="text-sm text-slate-500 mt-1">收录模型</span>
            </div>
            <div className="py-8 flex flex-col items-center text-center">
              <span className="text-3xl md:text-4xl font-bold font-headline text-slate-900 tabular-nums">
                {npuStats.tests.toLocaleString()}
              </span>
              <span className="text-sm text-slate-500 mt-1">测试运行次数</span>
            </div>
            <div className="py-8 flex flex-col items-center text-center">
              <span className="text-3xl md:text-4xl font-bold font-headline text-[#D14AA4] tabular-nums">
                {npuStats.solutions.toLocaleString()}
              </span>
              <span className="text-sm text-slate-500 mt-1">硬件配置方案</span>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Directions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-headline text-slate-900 mb-2">探索方向</h2>
              <p className="text-slate-500 text-sm">按垂直领域深度测评，精准对比不同算法在专用硬件上的吞吐表现。</p>
            </div>
            <a
              href="/models"
              className="hidden md:flex items-center gap-1 text-sm font-semibold text-[#881E55] hover:gap-2 transition-all"
            >
              查看全部
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {exploreCategories.map((cat) => (
              <a key={cat.id} href={`/models?cat=${cat.id}`}>
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-[#881E55]/20 transition-all duration-200 group cursor-pointer h-full">
                  {/* Top accent stripe */}
                  <div className="h-1.5 bg-gradient-to-r from-[#881E55] to-[#D14AA4]" />
                  <div className="p-5">
                    <div className="w-10 h-10 bg-[#881E55]/10 rounded-xl flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-[#881E55] text-xl">{cat.icon}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1.5 font-headline">{cat.label}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">{cat.description}</p>
                    <span className="inline-block px-2 py-0.5 bg-[#881E55]/8 text-[#881E55] text-[10px] font-bold rounded-full">
                      {cat.modelCount} 个模型
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Completions */}
      <section className="py-16 bg-[#fcf9f8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-headline text-slate-900 mb-2">近期评测完成</h2>
              <p className="text-slate-500 text-sm">最新提交的基准测试结果</p>
            </div>
            <a
              href="/leaderboard"
              className="hidden md:flex items-center gap-1 text-sm font-semibold text-[#881E55] hover:gap-2 transition-all"
            >
              排行榜
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>

          <div className="space-y-3">
            {recentRuns.map((run) => (
              <div
                key={run.id}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-sm hover:border-[#881E55]/15 transition-all"
              >
                {/* Top stripe */}
                <div className="h-1 bg-gradient-to-r from-[#881E55] to-[#D14AA4]" />
                <div className="px-5 py-4 flex flex-wrap items-center gap-4">
                  {/* Icon + name */}
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <div className={`w-10 h-10 ${run.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                      <span
                        className={`material-symbols-outlined ${run.iconColor} text-xl`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {run.iconName}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm font-headline">{run.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {run.category} · {run.precision}
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex gap-8 flex-1 justify-center">
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 mb-0.5">延迟</p>
                      <p className="text-sm font-bold text-slate-800">{run.latency}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 mb-0.5">吞吐量</p>
                      <p className="text-sm font-bold text-[#881E55]">{run.throughput}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 mb-0.5">加速比</p>
                      <p className="text-sm font-bold text-[#D14AA4]">{run.speedup}</p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold">
                      {run.status}
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-medium">
                      {run.hardware}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAB */}
      <div className="fixed bottom-24 right-5 z-40 md:bottom-8">
        <a href="/submit">
          <button className="flex items-center gap-2 gradient-primary text-white px-5 py-3.5 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all text-sm font-semibold">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            新建评测
          </button>
        </a>
      </div>
    </>
  );
}
