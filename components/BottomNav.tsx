"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页", icon: "home_storage" },
  { href: "/models", label: "模型库", icon: "model_training" },
  { href: "/leaderboard", label: "排行榜", icon: "leaderboard" },
  { href: "/submit", label: "提交", icon: "add_chart" },
  { href: "/docs", label: "文档", icon: "menu_book" },
  { href: "/profile", label: "我的", icon: "person_search" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-[#f8f9fb]/90 backdrop-blur-xl shadow-[0_-4px_24px_0_rgba(62,1,44,0.06)] rounded-t-2xl px-2 py-2">
      <div className="grid grid-cols-6 gap-0">
        {navItems.map(({ href, label, icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all active:scale-90 duration-200 ${
                isActive
                  ? "text-secondary bg-secondary/10"
                  : "text-primary/60 hover:text-secondary"
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {icon}
              </span>
              <span className="font-label text-[9px] font-bold uppercase tracking-wider mt-0.5 leading-none">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
