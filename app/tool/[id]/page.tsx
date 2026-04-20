"use client";

import { useState } from "react";
import { useParams, useSearchParams, notFound } from "next/navigation";
import { getTool } from "@/lib/tools-registry";
import { useHistory } from "@/lib/use-history";

export default function ToolPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const tool = getTool(id);

  if (!tool) notFound();

  const prefill = searchParams.get("input") ?? "";
  const [input, setInput] = useState(prefill);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addHistory } = useHistory();

  async function handleSubmit() {
    if (!input.trim() || !tool) return;
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await fetch(`/api/tools/${tool.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setOutput(data.output);
      addHistory({ toolId: tool.id, toolName: tool.name, input, output: data.output });
    } catch {
      setError("请求失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="space-y-1 pt-4">
        <h2 className="text-3xl font-headline font-bold tracking-tight text-on-surface">
          {tool.name}
        </h2>
        <p className="text-on-surface-variant text-sm font-medium">{tool.description}</p>
      </section>

      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={tool.placeholder}
          rows={8}
          className="w-full bg-surface-container-high rounded-lg px-4 py-3 text-on-surface text-sm font-body placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/40 transition-shadow resize-none"
        />

        <button
          onClick={handleSubmit}
          disabled={!input.trim() || loading}
          className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl text-sm transition-transform duration-200 hover:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="material-symbols-outlined text-base animate-spin">
              progress_activity
            </span>
          )}
          {loading ? "生成中..." : tool.inputLabel}
        </button>
      </div>

      {error && <p className="text-sm text-error font-medium">{error}</p>}

      {output && (
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_8px_24px_-4px_rgba(25,28,30,0.06)] space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <span
              className="material-symbols-outlined text-base"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {tool.icon}
            </span>
            <span className="text-xs font-bold font-label tracking-wider uppercase">
              {tool.outputLabel}
            </span>
          </div>
          <p className="text-on-surface text-sm leading-relaxed whitespace-pre-wrap">{output}</p>
        </div>
      )}
    </>
  );
}
