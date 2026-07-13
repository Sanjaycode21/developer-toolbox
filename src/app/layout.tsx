import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar"; // Import the new Sidebar component
import { Toaster } from 'react-hot-toast'; // Import Toaster

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
        <Sidebar /> {/* Use the new Sidebar component */}

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
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#334155', // slate-700
              color: '#f8fafc', // slate-50
              fontSize: '0.875rem', // text-sm
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem', // rounded-lg
              border: '1px solid #475569', // slate-600
            },
            iconTheme: {
              primary: '#6366f1', // indigo-500
              secondary: '#f8fafc', // slate-50
            },
          }}
        />
      </body>
    </html>
  );
}