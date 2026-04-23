"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/use-auth";
import AuthModal from "@/components/AuthModal";

export default function TopBar() {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: "/", label: "首页" },
    { href: "/models", label: "模型库" },
    { href: "/leaderboard", label: "排行榜" },
    { href: "/docs", label: "文档" },
  ];

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchVal.trim();
    if (q) router.push(`/models?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#fff8f7]/80 backdrop-blur-2xl shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center h-20">
          {/* Logo + Nav */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
              <span className="text-xl font-extrabold tracking-tighter text-primary font-headline">
                NPU Benchmark Hub
              </span>
            </a>
            <nav className="hidden md:flex gap-6 font-headline font-semibold tracking-tight">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className={`pb-1 transition-colors ${
                    isActive(href)
                      ? "text-primary border-b-2 border-primary"
                      : "text-on-surface-variant hover:text-secondary border-b-2 border-transparent"
                  }`}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Search + Auth */}
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-full gap-2 focus-within:ring-2 focus-within:ring-primary-container transition-all">
              <span className="material-symbols-outlined text-outline text-lg">search</span>
              <input
                className="bg-transparent border-none focus:outline-none text-sm w-48 font-body text-on-surface placeholder:text-outline"
                placeholder="搜索模型、指标..."
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
              {searchVal && (
                <button type="button" onClick={() => setSearchVal("")} className="text-outline hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </form>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-sm font-bold font-headline">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="hidden md:block font-headline font-semibold text-sm text-on-surface">
                    {user.name}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">expand_more</span>
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-surface-container-lowest rounded-xl shadow-xl shadow-primary/10 border border-outline-variant/20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-outline-variant/10">
                      <p className="font-bold text-sm text-on-surface truncate">{user.name}</p>
                      <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                    </div>
                    <a href="/profile" className="flex items-center gap-2 px-4 py-3 text-sm text-on-surface hover:bg-surface-container-low transition-colors">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      个人主页
                    </a>
                    <a href="/account" className="flex items-center gap-2 px-4 py-3 text-sm text-on-surface hover:bg-surface-container-low transition-colors">
                      <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                      账号管理
                    </a>
                    <button
                      onClick={() => { logout(); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-error hover:bg-error-container/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="px-6 py-2 rounded-full font-headline font-bold text-primary hover:bg-rose-50/50 transition-all duration-300 active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
