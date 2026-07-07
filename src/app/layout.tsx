import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevForge — The Ultimate Developer Toolbox",
  description: "A comprehensive, high-performance web suite of essential developer utilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full dark`}>
      <body className="min-h-full bg-slate-950 text-slate-100 font-sans flex antialiased">
        {/* Sidebar Container */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-md flex flex-col fixed h-screen z-20">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              DF
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">DevForge</h1>
              <span className="text-[10px] text-slate-500 font-medium">DEVELOPER TOOLBOX</span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">General</span>
              <div className="mt-2 space-y-1">
                <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-slate-800 text-indigo-400 hover:bg-slate-800/80 transition-colors">
                  <span>Dashboard</span>
                </Link>
              </div>
            </div>

            <div>
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Text & Formatting</span>
              <div className="mt-2 space-y-1">
                <Link href="/tools/json-formatter" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-lg transition-colors">
                  <span>JSON Formatter</span>
                </Link>
                <Link href="/tools/base64-encoder-decoder" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-lg transition-colors">
                  <span>Base64 Encoder/Decoder</span>
                </Link>
              </div>
            </div>

            <div>
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Design & Graphics</span>

            <div>
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Automated Daily</span>
              <div className="mt-2 space-y-1">
                <Link href="/tools/day-3-implement-jwt-decoder-tool" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-lg transition-colors">
                  <span>Day 3</span>
                </Link>
              </div>
            </div>
              <div className="mt-2 space-y-1">
                <Link href="/tools/color-picker" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-lg transition-colors">
                  <span>Color Picker</span>
                </Link>
              </div>
            </div>
          </nav>

          <div className="p-4 border-t border-slate-800 text-center">
            <span className="text-[10px] text-slate-600">v1.0.0 (Day 1 Base Version)</span>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="pl-64 flex-1 flex flex-col min-h-screen">
          <header className="h-16 border-b border-slate-800 bg-slate-900/20 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4 w-96">
              <input
                type="text"
                placeholder="Search tools... (Cmd + K)"
                className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:outline-none rounded-lg px-4 py-1.5 text-xs text-slate-300 placeholder-slate-500 transition-colors"
                disabled
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-slate-400 font-medium">All Systems Operational</span>
            </div>
          </header>

          <main className="flex-1 p-8 bg-slate-950">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
