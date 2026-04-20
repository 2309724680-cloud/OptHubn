"use client";

import { useState } from "react";
import { useAuth } from "@/lib/use-auth";
import AuthModal from "@/components/AuthModal";

export default function TopBar() {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-[#f8f9fb]/90 backdrop-blur-xl shadow-sm shadow-primary/5">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">analytics</span>
          <span className="font-headline font-black text-xl tracking-tighter text-primary">NPU HUB</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="/" className="font-headline font-semibold text-secondary hover:opacity-80 transition-opacity">Home</a>
          <a href="/models" className="font-headline font-semibold text-primary-container hover:opacity-80 transition-opacity">Models</a>
          <a href="/submit" className="font-headline font-semibold text-primary-container hover:opacity-80 transition-opacity">Submit</a>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-sm font-bold font-headline">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="font-headline font-semibold text-sm text-primary">{user.name}</span>
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
              className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-on-secondary rounded-full font-headline font-bold text-sm hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
              登录 / 注册
            </button>
          )}
        </nav>

        <div className="md:hidden flex items-center gap-3">
          {user ? (
            <button onClick={() => setShowMenu(!showMenu)} className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-sm font-bold font-headline">
              {user.name[0].toUpperCase()}
            </button>
          ) : (
            <button onClick={() => setShowAuth(true)}>
              <span className="material-symbols-outlined text-primary">account_circle</span>
            </button>
          )}
          <span className="material-symbols-outlined text-primary">menu</span>
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
