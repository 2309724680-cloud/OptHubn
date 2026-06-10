"use client";

import { useState } from "react";
import { useAuth } from "@/lib/use-auth";

interface Props {
  onClose: () => void;
}

export default function AuthModal({ onClose }: Props) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("请填写所有字段"); return; }
    if (tab === "register" && !name) { setError("请输入用户名"); return; }
    if (password.length < 6) { setError("密码至少 6 位"); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const err = tab === "login" ? login(email, password) : register(name, email, password);
    setLoading(false);

    if (err) { setError(err); return; }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      <div className="relative w-full max-w-sm bg-surface-container-lowest rounded-3xl shadow-2xl shadow-primary/20 overflow-hidden">
        {/* Header */}
        <div className="bg-primary p-6 pb-8 relative overflow-hidden">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary-container">analytics</span>
            <span className="font-headline font-black tracking-tighter text-white">NPU HUB</span>
          </div>
          <p className="text-surface-variant text-sm">
            {tab === "login" ? "登录你的账户" : "创建新账户"}
          </p>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary/20 blur-2xl rounded-full" />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-outline-variant/20 -mt-px">
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); }}
              className={`flex-1 py-3 font-headline font-bold text-sm transition-colors ${
                tab === t
                  ? "text-secondary border-b-2 border-secondary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {t === "login" ? "登录" : "注册"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {tab === "register" && (
            <div>
              <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
                用户名
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-on-surface text-sm outline-none focus:ring-2 focus:ring-secondary transition-shadow"
                placeholder="你的昵称"
              />
            </div>
          )}
          <div>
            <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-on-surface text-sm outline-none focus:ring-2 focus:ring-secondary transition-shadow"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-on-surface text-sm outline-none focus:ring-2 focus:ring-secondary transition-shadow"
              placeholder="至少 6 位"
            />
          </div>

          {error && (
            <p className="text-xs text-error font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-secondary text-on-secondary font-headline font-bold rounded-xl shadow-lg shadow-secondary/30 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
            )}
            {tab === "login" ? "登录" : "注册"}
          </button>

          <p className="text-center text-xs text-on-surface-variant">
            {tab === "login" ? "没有账号？" : "已有账号？"}
            <button type="button" onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); }} className="text-secondary font-semibold ml-1">
              {tab === "login" ? "注册" : "登录"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
