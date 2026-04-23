"use client";

import { useState, useEffect } from "react";
import { profileSettingsGrid } from "@/lib/mock-data";
import { useAuth } from "@/lib/use-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LANGUAGES = [
  { code: "zh-CN", label: "简体中文" },
  { code: "en-US", label: "English (US)" },
  { code: "ja-JP", label: "日本語" },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("zh-CN");
  const [showLang, setShowLang] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const stored = localStorage.getItem("npuhub_prefs");
    if (stored) {
      const prefs = JSON.parse(stored);
      setDarkMode(prefs.darkMode ?? false);
      setLang(prefs.lang ?? "zh-CN");
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.push("/");
  }, [hydrated, user, router]);

  function savePrefs(newDark: boolean, newLang: string) {
    localStorage.setItem("npuhub_prefs", JSON.stringify({ darkMode: newDark, lang: newLang }));
    document.documentElement.classList.toggle("dark", newDark);
  }

  function toggleDark() {
    const next = !darkMode;
    setDarkMode(next);
    savePrefs(next, lang);
  }

  function selectLang(code: string) {
    setLang(code);
    setShowLang(false);
    savePrefs(darkMode, code);
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (!hydrated || !user) return null;

  // 从用户名首字母生成头像背景色
  const initial = user.name[0]?.toUpperCase() ?? "U";

  return (
    <>
      {/* Hero */}
      <section className="pt-2 flex flex-col items-center text-center space-y-4">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center ring-4 ring-primary/10 shadow-lg">
            <span className="font-headline font-black text-5xl text-white">{initial}</span>
          </div>
          <Link href="/account">
            <button className="absolute -bottom-2 -right-2 bg-secondary text-on-secondary p-2 rounded-lg shadow-lg active:scale-90 transition-transform">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </Link>
        </div>
        <div>
          <h2 className="font-headline font-extrabold text-3xl tracking-tight text-on-surface mb-1">{user.name}</h2>
          <p className="text-on-surface-variant text-sm font-body">{user.email}</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-surface-container-low rounded-lg text-center">
            <span className="block font-bold text-secondary">—</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60 font-label">Submitted</span>
          </div>
          <div className="px-4 py-2 bg-surface-container-low rounded-lg text-center">
            <span className="block font-bold text-secondary">—</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60 font-label">Benchmarks</span>
          </div>
        </div>
      </section>

      {/* Settings Grid */}
      <div className="grid grid-cols-2 gap-4">
        {profileSettingsGrid.map((item) => (
          <Link key={item.id} href={item.href ?? "/account"}>
            <button className="w-full bg-surface-container-lowest p-6 rounded-xl text-left hover:bg-surface-container-low group cursor-pointer transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-secondary/10 text-secondary">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-headline font-bold text-on-surface text-sm">{item.label}</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">{item.description}</p>
                </div>
                <span className="material-symbols-outlined ml-auto text-outline opacity-40 group-hover:opacity-100 transition-opacity flex-shrink-0">chevron_right</span>
              </div>
            </button>
          </Link>
        ))}
      </div>

      {/* System Preferences */}
      <section>
        <h4 className="font-headline font-extrabold text-xs uppercase tracking-widest text-secondary mb-4">系统偏好设置</h4>
        <div className="space-y-2">
          {/* Dark Mode */}
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant" style={darkMode ? { fontVariationSettings: "'FILL' 1" } : undefined}>dark_mode</span>
              <div>
                <span className="font-medium text-sm">深色外观</span>
                <p className="text-[10px] text-on-surface-variant mt-0.5">{darkMode ? "已开启" : "已关闭"}</p>
              </div>
            </div>
            <button
              onClick={toggleDark}
              className={`w-11 h-6 rounded-full relative flex-shrink-0 transition-colors ${darkMode ? "bg-secondary" : "bg-outline-variant/40"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>

          {/* Language */}
          <div className="relative">
            <button
              onClick={() => setShowLang(!showLang)}
              className="w-full flex items-center justify-between p-4 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">language</span>
                <div className="text-left">
                  <span className="font-medium text-sm block">界面语言</span>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">{LANGUAGES.find(l => l.code === lang)?.label}</p>
                </div>
              </div>
              <span className={`material-symbols-outlined text-[18px] text-secondary transition-transform ${showLang ? "rotate-180" : ""}`}>expand_more</span>
            </button>
            {showLang && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/20 overflow-hidden z-10">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => selectLang(l.code)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-surface-container-low ${lang === l.code ? "text-primary font-bold" : "text-on-surface"}`}
                  >
                    {l.label}
                    {lang === l.code && <span className="material-symbols-outlined text-primary text-[18px]">check</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Logout */}
      <div className="pb-4">
        <button
          onClick={handleLogout}
          className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold rounded-xl shadow-[0_8px_24px_-4px_rgba(62,1,44,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <span className="material-symbols-outlined">logout</span>
          退出登录
        </button>
      </div>
    </>
  );
}
