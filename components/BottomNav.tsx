"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页", icon: "home" },
  { href: "/models", label: "模型库", icon: "model_training" },
  { href: "/leaderboard", label: "排行榜", icon: "leaderboard" },
  { href: "/submit", label: "提交", icon: "add_chart" },
  { href: "/profile", label: "我的", icon: "person" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-white/95 backdrop-blur-md border-t border-[#881E55]/10 px-2 py-2">
      <div className="grid grid-cols-5 gap-0">
        {navItems.map(({ href, label, icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all active:scale-90 duration-200 ${
                active
                  ? "text-[#881E55]"
                  : "text-slate-400 hover:text-[#881E55]"
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {icon}
              </span>
              <span className="text-[9px] font-semibold mt-0.5 leading-none font-body">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
