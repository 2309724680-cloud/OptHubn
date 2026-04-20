"use client";

import { useState } from "react";

const steps = [
  { label: "Basic Info", icon: "info" },
  { label: "Image Config", icon: "settings_input_component" },
  { label: "Confirm", icon: "verified" },
];

export default function SubmitPage() {
  const [step, setStep] = useState(0);
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

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <section className="mb-8 pt-2">
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-3">
          Submit Solution
        </h2>
        <p className="text-on-surface-variant text-lg mb-8 max-w-xl">
          Deploy your optimized AI models to our high-performance NPU cluster in three simple steps.
        </p>

        {/* Steps */}
        <div className="flex items-center gap-0">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => setStep(i)}
                className={`flex items-center gap-3 ${i !== step ? "opacity-50" : ""}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                  i === step ? "bg-secondary text-on-secondary shadow-secondary/20" : "bg-surface-container-highest text-on-surface-variant"
                }`}>
                  <span className="material-symbols-outlined text-sm" style={i === step ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                    {s.icon}
                  </span>
                </div>
                <span className={`font-headline font-bold hidden sm:block ${i === step ? "text-primary" : "text-on-surface-variant"}`}>
                  {s.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-surface-container-highest mx-4 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Model Identification */}
          <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-secondary">model_training</span>
              <h3 className="font-headline text-xl font-bold text-primary">Model Identification</h3>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  Base Model Template
                </label>
                <select
                  value={form.baseModel}
                  onChange={(e) => update("baseModel", e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-lg py-4 px-4 focus:ring-2 focus:ring-secondary text-primary font-medium outline-none"
                >
                  <option>Whisper-Large-v3 (Optimized for NPU)</option>
                  <option>Llama-3-8B-Instruct</option>
                  <option>Stable-Diffusion-XL-Turbo</option>
                  <option>Custom Model Architecture</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Solution Name
                  </label>
                  <input
                    value={form.solutionName}
                    onChange={(e) => update("solutionName", e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-lg py-4 px-4 focus:ring-2 focus:ring-secondary outline-none"
                    placeholder="e.g., Ultra-Fast Transcription"
                  />
                </div>
                <div>
                  <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Version Tag
                  </label>
                  <input
                    value={form.versionTag}
                    onChange={(e) => update("versionTag", e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-lg py-4 px-4 focus:ring-2 focus:ring-secondary outline-none"
                    placeholder="v1.0.4-alpha"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Deployment Source */}
          <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-secondary">cloud_upload</span>
              <h3 className="font-headline text-xl font-bold text-primary">Deployment Source</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <label className={`relative flex flex-col p-5 border-2 rounded-xl cursor-pointer ${
                form.source === "registry" ? "border-secondary bg-secondary/5" : "border-transparent bg-surface-container-low hover:bg-surface-container-high"
              }`}>
                <input type="radio" name="source" checked={form.source === "registry"} onChange={() => update("source", "registry")} className="absolute top-4 right-4 accent-secondary" />
                <span className="material-symbols-outlined mb-2 text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>database</span>
                <span className="font-bold text-primary mb-1">Registry Address</span>
                <span className="text-xs text-on-surface-variant">Pull image from Docker Hub or Private Registry</span>
              </label>
              <label className={`relative flex flex-col p-5 border-2 rounded-xl cursor-pointer ${
                form.source === "upload" ? "border-secondary bg-secondary/5" : "border-transparent bg-surface-container-low hover:bg-surface-container-high"
              }`}>
                <input type="radio" name="source" checked={form.source === "upload"} onChange={() => update("source", "upload")} className="absolute top-4 right-4 accent-secondary" />
                <span className="material-symbols-outlined mb-2 text-on-surface-variant">upload_file</span>
                <span className="font-bold text-primary mb-1">Upload Docker Image</span>
                <span className="text-xs text-on-surface-variant">Directly upload .tar or .gz image files</span>
              </label>
            </div>
            <div>
              <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Registry URL</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">link</span>
                <input
                  value={form.registryUrl}
                  onChange={(e) => update("registryUrl", e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-lg py-4 pl-12 pr-4 focus:ring-2 focus:ring-secondary outline-none"
                  placeholder="registry.hub.docker.com/username/repo:tag"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Access Policy */}
          <div className="bg-primary-container text-on-primary-container rounded-xl p-6 md:p-8 shadow-lg shadow-primary/10">
            <h3 className="font-headline text-xl font-bold mb-6 text-white">Access Policy</h3>
            <div className="space-y-6">
              {[
                { key: "isPublic", icon: "public", label: "Public access", sub: "Listed in Global Hub" },
                { key: "telemetry", icon: "analytics", label: "Enable Telemetry", sub: "Performance monitoring" },
              ].map(({ key, icon, label, sub }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">{icon}</span>
                    <div>
                      <p className="font-bold text-sm">{label}</p>
                      <p className="text-[10px] opacity-70 uppercase tracking-tighter">{sub}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => update(key, !form[key as keyof typeof form])}
                    className={`w-11 h-6 rounded-full relative transition-colors ${form[key as keyof typeof form] ? "bg-secondary" : "bg-surface-variant"}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form[key as keyof typeof form] ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={() => setStep(Math.min(step + 1, steps.length - 1))}
            className="w-full py-4 bg-secondary text-on-secondary font-headline font-bold rounded-xl shadow-lg shadow-secondary/30 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">rocket_launch</span>
            {step < steps.length - 1 ? "Next Step" : "Deploy to NPU Cluster"}
          </button>
        </div>
      </div>
    </div>
  );
}
