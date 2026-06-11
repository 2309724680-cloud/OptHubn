"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSubmissions, type Submission } from "@/lib/submissions";

const STATUS_MAP: Record<Submission["status"], { label: string; cls: string }> = {
  QUEUED: { label: "排队中", cls: "bg-amber-50 text-amber-600 border-amber-200" },
  RUNNING: { label: "运行中", cls: "bg-blue-50 text-blue-600 border-blue-200" },
  PASSED: { label: "已通过", cls: "bg-green-50 text-green-600 border-green-200" },
  FAILED: { label: "失败", cls: "bg-red-50 text-red-600 border-red-200" },
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setSubmissions(getSubmissions());
  }, []);

  if (!hydrated) return null;

  return (
    <div className="space-y-6 pb-8">
      <section className="pt-2 space-y-1">
        <h2 className="font-headline font-extrabold text-3xl text-primary tracking-tight">我的提交</h2>
        <p className="font-body text-sm text-on-surface-variant">查看您提交的所有基准测试任务。</p>
      </section>

      {submissions.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant space-y-4">
          <span className="material-symbols-outlined text-5xl block">inbox</span>
          <p className="text-sm font-medium">暂无提交记录</p>
          <Link href="/submit">
            <button className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-xl font-headline font-bold hover:opacity-90 transition-all">
              <span className="material-symbols-outlined text-[18px]">add_chart</span>
              提交新测试
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => {
            const st = STATUS_MAP[s.status];
            return (
              <div
                key={s.id}
                className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="material-symbols-outlined text-secondary text-[24px]">model_training</span>
                    <div className="min-w-0">
                      <h3 className="font-headline font-bold text-on-surface text-sm truncate">
                        {s.solutionName || s.baseModel.split(" (")[0]}
                      </h3>
                      <p className="text-[11px] text-on-surface-variant font-label uppercase tracking-wider truncate">
                        {s.versionTag || "—"} · {s.source === "registry" ? "Registry" : "Upload"}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide border flex-shrink-0 ${st.cls}`}>
                    {st.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-on-surface-variant font-label uppercase tracking-wider">Task ID</span>
                    <code className="block text-on-surface font-mono text-[10px] mt-0.5 truncate">{s.id}</code>
                  </div>
                  <div>
                    <span className="text-on-surface-variant font-label uppercase tracking-wider">提交时间</span>
                    <p className="text-on-surface font-medium mt-0.5">
                      {new Date(s.submittedAt).toLocaleString("zh-CN", {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-on-surface-variant font-label uppercase tracking-wider">基础模型</span>
                    <p className="text-on-surface font-medium mt-0.5 truncate">{s.baseModel.split(" (")[0]}</p>
                  </div>
                  <div>
                    <span className="text-on-surface-variant font-label uppercase tracking-wider">可见性</span>
                    <p className="text-on-surface font-medium mt-0.5">{s.isPublic ? "公开" : "私有"}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {submissions.length > 0 && (
        <div className="flex justify-center pt-4">
          <Link href="/submit">
            <button className="flex items-center gap-2 gradient-primary text-white px-6 py-3 rounded-xl font-headline font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-[20px]">add_chart</span>
              提交新测试
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
