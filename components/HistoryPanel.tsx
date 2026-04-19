"use client";

import { useHistory } from "@/lib/use-history";
import { getAllTools } from "@/lib/tools-registry";
import { useRouter } from "next/navigation";

const toolMap = Object.fromEntries(getAllTools().map((t) => [t.id, t]));

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "刚刚";
  if (m < 60) return `${m}分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}小时前`;
  return `${Math.floor(h / 24)}天前`;
}

export default function HistoryPanel() {
  const { history, clearHistory } = useHistory();
  const router = useRouter();
  const recent = history.slice(0, 10);

  if (recent.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-headline font-extrabold text-xs uppercase tracking-widest text-primary">
          使用历史
        </h4>
        <button
          onClick={clearHistory}
          className="text-xs text-on-surface-variant font-medium hover:text-error transition-colors"
        >
          清空
        </button>
      </div>
      <div className="space-y-2">
        {recent.map((item) => {
          const tool = toolMap[item.toolId];
          return (
            <button
              key={item.id}
              onClick={() =>
                router.push(`/tool/${item.toolId}?input=${encodeURIComponent(item.input)}`)
              }
              className="w-full text-left bg-surface-container-lowest rounded-xl p-4 flex items-start gap-3 hover:bg-surface-container-low transition-colors active:scale-[0.99]"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span
                  className="material-symbols-outlined text-primary text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {tool?.icon ?? "history"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-xs font-bold text-on-surface font-headline truncate">
                    {item.toolName}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-label whitespace-nowrap flex-shrink-0">
                    {formatTime(item.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant truncate">{item.input}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
