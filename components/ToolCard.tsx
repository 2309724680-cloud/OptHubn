import Link from "next/link";
import { Tool } from "@/lib/tools-registry";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tool/${tool.id}`}
      className="group flex flex-col bg-surface-container-lowest rounded-2xl p-4 shadow-[0_4px_16px_-2px_rgba(25,28,30,0.06)] hover:shadow-[0_8px_24px_-4px_rgba(25,28,30,0.10)] transition-all duration-200 active:scale-[0.98]"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span
            className="material-symbols-outlined text-primary text-[22px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {tool.icon}
          </span>
        </div>
        {tool.isNew && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary font-bold tracking-wide uppercase">
            New
          </span>
        )}
      </div>

      <h4 className="font-headline font-bold text-on-surface mb-1 text-sm">{tool.name}</h4>
      <p className="text-xs text-on-surface-variant font-body leading-relaxed mb-3 flex-1">
        {tool.description}
      </p>

      <div className="flex items-center gap-3 text-xs text-on-surface-variant mb-3">
        <span className="flex items-center gap-1">
          <span
            className="material-symbols-outlined text-[13px] text-tertiary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="font-bold text-on-surface">{tool.rating.toFixed(1)}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">bolt</span>
          {tool.usage.toLocaleString()}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tool.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
