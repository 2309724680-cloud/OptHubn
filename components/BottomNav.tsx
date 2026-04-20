"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: "home_storage" },
  { href: "/models", label: "Models", icon: "model_training" },
  { href: "/submit", label: "Submit", icon: "add_chart" },
  { href: "/profile", label: "Profile", icon: "person_search" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-[#f8f9fb]/80 backdrop-blur-xl shadow-[0_-4px_24px_0_rgba(62,1,44,0.06)] rounded-t-2xl">
      {navItems.map(({ href, label, icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all active:scale-90 duration-300 ${
              isActive
                ? "text-secondary bg-secondary/10"
                : "text-primary/60 hover:text-secondary"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {icon}
            </span>
            <span className="font-label text-[10px] font-bold uppercase tracking-widest mt-0.5">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
