import type { Metadata } from "next";
import { Public_Sans, Inter } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "NPU Bench",
  description: "深圳河套学院 · 昇腾算力平台 — NPU 推理基准测试平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${publicSans.variable} ${inter.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white font-body text-on-surface antialiased overflow-x-hidden min-h-screen">
        <TopBar />
        <main className="pt-16 pb-28 px-4 md:px-6 max-w-7xl mx-auto space-y-10">
          {children}
        </main>
        <footer className="w-full bg-white border-t border-slate-100 hidden md:block">
          <div className="max-w-[1280px] mx-auto px-12 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-900">NPU Bench</span>
              <span className="text-[12px] text-slate-400">© 2024 深圳河套学院 · 昇腾算力平台 版权所有</span>
            </div>
            <div className="flex items-center gap-8">
              {["隐私政策", "服务条款", "联系我们", "学术引用"].map((label) => (
                <a key={label} href="/docs" className="text-[12px] text-slate-500 hover:text-primary transition-colors">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </footer>
        <BottomNav />
      </body>
    </html>
  );
}
