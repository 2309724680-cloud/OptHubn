import Link from "next/link";
import { MockSolution } from "@/lib/mock-data";

const STATUS_CONFIG = {
  published: { label: "已发布", className: "bg-tertiary/10 text-tertiary" },
  draft: { label: "草稿", className: "bg-secondary/10 text-secondary" },
  archived: { label: "已归档", className: "bg-outline/10 text-outline" },
};

const QUANT_COLOR: Record<string, string> = {
  INT8: "bg-primary/10 text-primary",
  FP16: "bg-secondary/10 text-secondary",
  INT4: "bg-tertiary/10 text-tertiary",
};

interface Props {
  solutions: MockSolution[];
  modelId: string;
}

export default function SolutionsList({ solutions, modelId }: Props) {
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
          <h2 className="font-headline font-bold text-on-surface">推理方案</h2>
          <span className="text-sm text-on-surface-variant font-label ml-1">
            ({solutions.length})
          </span>
        </div>
        <Link
          href={`/solutions/new?modelId=${modelId}`}
          className="flex items-center gap-1 text-sm text-primary hover:opacity-70 transition-opacity font-label font-semibold"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          新建方案
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {solutions.map((sol) => {
          const statusCfg = STATUS_CONFIG[sol.status];
          const quantCls = QUANT_COLOR[sol.quantization] ?? "bg-outline/10 text-outline";
          return (
            <div
              key={sol.id}
              className="bg-surface-container-low rounded-2xl p-5 hover:bg-surface-container transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-headline font-bold text-on-surface">
                      {sol.name}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold font-label ${statusCfg.className}`}>
                      {statusCfg.label}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold font-label ${quantCls}`}>
                      {sol.quantization}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-on-surface-variant flex-wrap font-label">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">memory</span>
                      {sol.device}
                    </span>
                    <span>{sol.targetFramework}</span>
                    <span>{sol.version}</span>
                    <span>{sol.powerMode}模式</span>
                  </div>
                </div>
                <Link
                  href={`/solutions/${sol.id}`}
                  className="shrink-0 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </Link>
              </div>

              {(sol.latencyP50Ms || sol.throughput || sol.memoryPeakMb) && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {sol.latencyP50Ms && (
                    <div className="bg-surface-container-lowest rounded-xl p-3 text-center">
                      <p className="text-xl font-headline font-extrabold text-primary">
                        {sol.latencyP50Ms}
                        <span className="text-xs font-label font-normal text-on-surface-variant ml-0.5">ms</span>
                      </p>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mt-1 font-label">
                        P50 延迟
                      </p>
                    </div>
                  )}
                  {sol.throughput && (
                    <div className="bg-surface-container-lowest rounded-xl p-3 text-center">
                      <p className="text-xl font-headline font-extrabold text-secondary">
                        {sol.throughput}
                        <span className="text-xs font-label font-normal text-on-surface-variant ml-0.5">fps</span>
                      </p>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mt-1 font-label">
                        吞吐量
                      </p>
                    </div>
                  )}
                  {sol.memoryPeakMb && (
                    <div className="bg-surface-container-lowest rounded-xl p-3 text-center">
                      <p className="text-xl font-headline font-extrabold text-tertiary">
                        {sol.memoryPeakMb}
                        <span className="text-xs font-label font-normal text-on-surface-variant ml-0.5">MB</span>
                      </p>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mt-1 font-label">
                        峰值内存
                      </p>
                    </div>
                  )}
                </div>
              )}

              <p className="mt-3 text-right text-[11px] text-on-surface-variant font-label">
                更新于 {sol.updatedAt}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
