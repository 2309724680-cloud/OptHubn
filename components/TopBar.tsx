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
      <header className="fixed top-0 w-full z-50 h-16 bg-white/95 backdrop-blur-md border-b border-[#881E55]/15 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-[#881E55] rounded-full flex items-center justify-center text-white font-bold text-xl font-headline select-none">
              N
            </div>
            <span className="text-base font-semibold text-slate-900 font-headline hidden sm:block">
              NPU Bench
            </span>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className={`text-sm font-medium pb-0.5 transition-colors ${
                  isActive(href)
                    ? "text-[#881E55] border-b-2 border-[#881E55]"
                    : "text-slate-600 hover:text-[#881E55] border-b-2 border-transparent"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Search + Auth */}
          <div className="flex items-center gap-3 ml-auto">
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex items-center border border-[#e27dbe] rounded-full px-4 py-1.5 gap-2 focus-within:border-[#881E55] transition-colors bg-white"
            >
              <span className="material-symbols-outlined text-[#881E55] text-[18px]">search</span>
              <input
                className="bg-transparent border-none focus:outline-none text-sm w-40 font-body text-slate-700 placeholder:text-slate-400"
                placeholder="搜索模型..."
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
              {searchVal && (
                <button
                  type="button"
                  onClick={() => setSearchVal("")}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </form>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-[#881E55]/20 hover:border-[#881E55]/40 hover:bg-[#881E55]/5 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-[#881E55] text-white flex items-center justify-center text-sm font-bold font-headline">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="hidden md:block font-headline font-semibold text-sm text-slate-800">
                    {user.name}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-slate-500">expand_more</span>
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="font-bold text-sm text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <a
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#881E55]">person</span>
                      个人主页
                    </a>
                    <a
                      href="/account"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#881E55]">manage_accounts</span>
                      账号管理
                    </a>
                    <button
                      onClick={() => { logout(); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAuth(true)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium text-[#881E55] border border-[#881E55]/30 hover:border-[#881E55] hover:bg-[#881E55]/5 transition-all"
                >
                  登录
                </button>
                <button
                  onClick={() => setShowAuth(true)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium text-white bg-[#881E55] hover:bg-[#6d1844] transition-all"
                >
                  注册
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
