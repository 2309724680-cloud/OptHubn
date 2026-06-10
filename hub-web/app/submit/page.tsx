"use client";

import { useState } from "react";
import Link from "next/link";

const steps = [
  { label: "Basic Info", icon: "info" },
  { label: "Image Config", icon: "settings_input_component" },
  { label: "Confirm", icon: "verified" },
];

const inputCls = "w-full bg-surface-container-low rounded-lg py-3.5 px-4 font-body text-sm text-on-surface placeholder:text-outline/50 outline-none focus:ring-2 focus:ring-secondary transition-shadow";
const labelCls = "block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2";

function genTaskId() {
  return "task_" + Math.random().toString(36).slice(2, 13);
}

export default function SubmitPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [taskId] = useState(genTaskId);
  const [form, setForm] = useState({
    baseModel: "Whisper-Large-v3 (Optimized for NPU)",
    solutionName: "",
    versionTag: "",
    source: "registry",
    registryUrl: "",
    isPublic: true,
    telemetry: false,
  });

  function update(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-16 flex flex-col items-center text-center space-y-8">
        <div className="w-24 h-24 rounded-full bg-tertiary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <div className="space-y-2">
          <h2 className="font-headline font-extrabold text-3xl text-on-surface">任务已提交</h2>
          <p className="text-on-surface-variant">您的基准测试任务已进入队列，预计 <span className="font-bold text-primary">5–8 分钟</span>完成。</p>
        </div>
        <div className="w-full bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6 space-y-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">任务 ID</span>
            <code className="font-mono text-sm text-secondary bg-secondary/10 px-3 py-1 rounded-lg">{taskId}</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">模型</span>
            <span className="text-sm font-semibold text-on-surface">{form.baseModel.split(" (")[0]}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">状态</span>
            <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded text-[10px] font-extrabold tracking-wide">QUEUED</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">预计完成</span>
            <span className="text-sm text-on-surface-variant">约 420 秒</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/leaderboard">
            <button className="flex items-center gap-2 gradient-primary text-white px-6 py-3 rounded-xl font-headline font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-[20px]">leaderboard</span>
              查看排行榜
            </button>
          </Link>
          <button
            onClick={() => { setSubmitted(false); setStep(0); }}
            className="flex items-center gap-2 border border-outline-variant/30 text-on-surface px-6 py-3 rounded-xl font-headline font-bold hover:bg-surface-container-low transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">add_chart</span>
            再提交一个
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <section className="mb-8 pt-2">
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-3">
          Submit Solution
        </h2>
        <p className="font-body text-lg text-on-surface-variant mb-8 max-w-xl leading-loose">
          Deploy your optimized AI models to our high-performance NPU cluster in three simple steps.
        </p>

        {/* Steps */}
        <div className="flex items-center">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => setStep(i)}
                className={`flex items-center gap-3 transition-opacity ${i !== step ? "opacity-40" : ""}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                  i === step ? "bg-secondary text-on-secondary shadow-secondary/20" : "bg-surface-container-highest text-on-surface-variant"
                }`}>
                  <span className="material-symbols-outlined text-sm" style={i === step ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                    {s.icon}
                  </span>
                </div>
                {i === step && (
                  <span className="font-headline font-bold text-sm text-primary hidden sm:block">
                    {s.label}
                  </span>
                )}
              </button>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px bg-surface-container-highest mx-4 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Model Identification */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-secondary">model_training</span>
              <h3 className="font-headline text-lg font-bold text-primary">Model Identification</h3>
            </div>
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Base Model Template</label>
                <select
                  value={form.baseModel}
                  onChange={(e) => update("baseModel", e.target.value)}
                  className={inputCls}
                >
                  <option>Whisper-Large-v3 (Optimized for NPU)</option>
                  <option>Llama-3-8B-Instruct</option>
                  <option>Stable-Diffusion-XL-Turbo</option>
                  <option>Custom Model Architecture</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Solution Name</label>
                  <input
                    value={form.solutionName}
                    onChange={(e) => update("solutionName", e.target.value)}
                    className={inputCls}
                    placeholder="e.g., Ultra-Fast Transcription"
                  />
                </div>
                <div>
                  <label className={labelCls}>Version Tag</label>
                  <input
                    value={form.versionTag}
                    onChange={(e) => update("versionTag", e.target.value)}
                    className={inputCls}
                    placeholder="v1.0.4-alpha"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Deployment Source */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-secondary">cloud_upload</span>
              <h3 className="font-headline text-lg font-bold text-primary">Deployment Source</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {[
                { val: "registry", icon: "database", title: "Registry Address", desc: "Pull image from Docker Hub or Private Registry" },
                { val: "upload", icon: "upload_file", title: "Upload Docker Image", desc: "Directly upload .tar or .gz image files" },
              ].map(({ val, icon, title, desc }) => (
                <label key={val} className={`relative flex flex-col p-5 border-2 rounded-xl cursor-pointer transition-all ${
                  form.source === val ? "border-secondary bg-secondary/5" : "border-transparent bg-surface-container-low hover:bg-surface-container-high"
                }`}>
                  <input type="radio" name="source" checked={form.source === val} onChange={() => update("source", val)} className="absolute top-4 right-4 accent-secondary" />
                  <span
                    className={`material-symbols-outlined mb-2 ${form.source === val ? "text-secondary" : "text-on-surface-variant"}`}
                    style={form.source === val ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {icon}
                  </span>
                  <span className="font-headline font-semibold text-base text-primary mb-1">{title}</span>
                  <span className="font-body text-sm text-on-surface-variant leading-relaxed">{desc}</span>
                </label>
              ))}
            </div>
            <div>
              <label className={labelCls}>Registry URL</label>
              <input
                value={form.registryUrl}
                onChange={(e) => update("registryUrl", e.target.value)}
                className={inputCls}
                placeholder="registry.hub.docker.com/username/repo:tag"
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Access Policy */}
          <div className="bg-primary-container rounded-2xl p-6 md:p-8 shadow-lg shadow-primary/10">
            <h3 className="font-headline text-lg font-bold mb-6 text-white">Access Policy</h3>
            <div className="space-y-5">
              {[
                { key: "isPublic", icon: "public", label: "Public access", sub: "Listed in Global Hub" },
                { key: "telemetry", icon: "analytics", label: "Enable Telemetry", sub: "Performance monitoring" },
              ].map(({ key, icon, label, sub }) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-primary-container">{icon}</span>
                    <div>
                      <p className="font-headline font-semibold text-sm text-white">{label}</p>
                      <p className="font-label text-[10px] text-white/60 uppercase tracking-wide">{sub}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => update(key, !form[key as keyof typeof form])}
                    className={`w-11 h-6 rounded-full relative flex-shrink-0 transition-colors ${form[key as keyof typeof form] ? "bg-secondary" : "bg-surface-variant/40"}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form[key as keyof typeof form] ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Deploy Button */}
          <button
            onClick={() => {
              if (step < steps.length - 1) {
                setStep(step + 1);
              } else {
                setSubmitted(true);
              }
            }}
            className="w-full py-4 bg-secondary text-on-secondary font-headline font-bold text-base rounded-xl shadow-lg shadow-secondary/30 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">rocket_launch</span>
            {step < steps.length - 1 ? "Next Step" : "Deploy to NPU Cluster"}
          </button>
        </div>
      </div>
    </div>
  );
}
