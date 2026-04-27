import Link from "next/link";
import { MockSolution } from "@/lib/mock-data";

const STATUS_CONFIG = {
  published: { label: "已发布", className: "bg-green-500/15 text-green-400" },
  draft: { label: "草稿", className: "bg-yellow-500/15 text-yellow-400" },
  archived: { label: "已归档", className: "bg-zinc-500/15 text-zinc-400" },
};

const QUANT_COLOR: Record<string, string> = {
  INT8: "bg-blue-500/15 text-blue-400",
  FP16: "bg-purple-500/15 text-purple-400",
  INT4: "bg-orange-500/15 text-orange-400",
};

interface Props {
  solutions: MockSolution[];
  modelId: string;
}

export default function SolutionsList({ solutions, modelId }: Props) {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">
            tune
          </span>
          推理方案
          <span className="text-sm font-normal text-white/40 ml-1">
            ({solutions.length})
          </span>
        </h2>
        <Link
          href={`/solutions/new?modelId=${modelId}`}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <span className="material-symbols-outlined text-base">add</span>
          新建方案
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {solutions.map((sol) => {
          const statusCfg = STATUS_CONFIG[sol.status];
          const quantCls = QUANT_COLOR[sol.quantization] ?? "bg-zinc-500/15 text-zinc-400";
          return (
            <div
              key={sol.id}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 hover:bg-white/[0.06] transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-white truncate">
                      {sol.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.className}`}
                    >
                      {statusCfg.label}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${quantCls}`}
                    >
                      {sol.quantization}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-white/40 flex-wrap">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">memory</span>
                      {sol.device}
                    </span>
                    <span>{sol.targetFramework}</span>
                    <span>{sol.version}</span>
                    <span>{sol.powerMode}模式</span>
                  </div>
                </div>
                <Link
                  href={`/solutions/${sol.id}`}
                  className="shrink-0 text-white/40 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    chevron_right
                  </span>
                </Link>
              </div>

              {(sol.latencyP50Ms || sol.throughput || sol.memoryPeakMb) && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {sol.latencyP50Ms && (
                    <div className="bg-white/[0.03] rounded-xl p-2 text-center">
                      <div className="text-sm font-semibold text-white">
                        {sol.latencyP50Ms}
                        <span className="text-xs font-normal text-white/40 ml-0.5">ms</span>
                      </div>
                      <div className="text-xs text-white/40 mt-0.5">P50 延迟</div>
                    </div>
                  )}
                  {sol.throughput && (
                    <div className="bg-white/[0.03] rounded-xl p-2 text-center">
                      <div className="text-sm font-semibold text-white">
                        {sol.throughput}
                        <span className="text-xs font-normal text-white/40 ml-0.5">fps</span>
                      </div>
                      <div className="text-xs text-white/40 mt-0.5">吞吐量</div>
                    </div>
                  )}
                  {sol.memoryPeakMb && (
                    <div className="bg-white/[0.03] rounded-xl p-2 text-center">
                      <div className="text-sm font-semibold text-white">
                        {sol.memoryPeakMb}
                        <span className="text-xs font-normal text-white/40 ml-0.5">MB</span>
                      </div>
                      <div className="text-xs text-white/40 mt-0.5">峰值内存</div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-2 text-right text-xs text-white/25">
                更新于 {sol.updatedAt}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
