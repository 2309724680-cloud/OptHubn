"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/discover", label: "Discover", icon: "explore" },
  { href: "/messages", label: "Messages", icon: "chat" },
  { href: "/profile", label: "Profile", icon: "person" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl rounded-t-[1.5rem] shadow-[0_-8px_24px_-4px_rgba(25,28,30,0.06)] flex justify-around items-center px-4 pb-8 pt-3">
      {navItems.map(({ href, label, icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 active:scale-90 ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-slate-400 hover:bg-slate-50"
            }`}
          >
            <span
              className="material-symbols-outlined mb-1"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {icon}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.05em]">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
