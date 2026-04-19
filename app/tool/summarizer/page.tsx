"use client";

import { useState } from "react";

export default function SummarizerPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  function handleSubmit() {
    if (!input.trim()) return;
    setResult("Summary result will appear here.");
  }

  return (
    <>
      <section className="space-y-1 pt-4">
        <h2 className="text-3xl font-headline font-bold tracking-tight text-on-surface">
          文本摘要
        </h2>
        <p className="text-on-surface-variant text-sm font-medium">
          粘贴文本，生成简洁摘要
        </p>
      </section>

      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="在此粘贴或输入需要摘要的文本..."
          rows={8}
          className="w-full bg-surface-container-high rounded-lg px-4 py-3 text-on-surface text-sm font-body placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/40 transition-shadow resize-none"
        />

        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl text-sm transition-transform duration-200 hover:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
        >
          生成摘要
        </button>
      </div>

      {result && (
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_8px_24px_-4px_rgba(25,28,30,0.06)] space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <span className="text-xs font-bold font-label tracking-wider uppercase">摘要结果</span>
          </div>
          <p className="text-on-surface text-sm leading-relaxed">{result}</p>
        </div>
      )}
    </>
  );
}
