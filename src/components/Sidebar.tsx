'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toolsByCategory, tools, Tool } from "@/lib/tools";
import { useToolStore } from "@/store/useToolStore";
import { useEffect, useState } from "react";
import { StarIcon as StarOutlineIcon, ClockIcon, HomeIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

// Helper component for individual sidebar links
function SidebarLink({ tool, onClick }: { tool: Tool; onClick: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === tool.path;

  return (
    <Link
      href={tool.path}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors
        ${isActive
          ? "bg-slate-800 text-indigo-400 hover:bg-slate-800/80"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
        }`}
    >
      <span>{tool.name}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { favorites, history, addToHistory } = useToolStore();
  const [isMounted, setIsMounted] = useState(false);

  // Hydration fix for Zustand with localStorage
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter and map favorited tools
  const favoritedTools = isMounted ? tools.filter(tool => favorites.includes(tool.slug)) : [];
  // Filter and map recent tools, ensuring uniqueness and order
  const recentTools = isMounted
    ? history
        .map(item => tools.find(tool => tool.slug === item.slug))
        .filter((tool): tool is Tool => tool !== undefined)
        .slice(0, 5) // Show last 5 unique tools
    : [];

  return (
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
            <Link href="/" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors
              ${pathname === "/"
                ? "bg-slate-800 text-indigo-400 hover:bg-slate-800/80"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <HomeIcon className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link href="/tools/favorites" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors
              ${pathname === "/tools/favorites"
                ? "bg-slate-800 text-indigo-400 hover:bg-slate-800/80"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <StarOutlineIcon className="h-4 w-4" />
              <span>All Favorites</span>
            </Link>
            <Link href="/tools/history" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors
              ${pathname === "/tools/history"
                ? "bg-slate-800 text-indigo-400 hover:bg-slate-800/80"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <ClockIcon className="h-4 w-4" />
              <span>Full History</span>
            </Link>
          </div>
        </div>

        {/* Favorites Section */}
        {isMounted && favoritedTools.length > 0 && (
          <div>
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <StarSolidIcon className="h-3 w-3 text-yellow-400" /> Favorites
            </span>
            <div className="mt-2 space-y-1">
              {favoritedTools.map((tool) => (
                <SidebarLink
                  key={tool.slug}
                  tool={tool}
                  onClick={() => addToHistory(tool.slug)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent Tools Section */}
        {isMounted && recentTools.length > 0 && (
          <div>
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <ClockIcon className="h-3 w-3 text-blue-400" /> Recent Tools
            </span>
            <div className="mt-2 space-y-1">
              {recentTools.map((tool) => (
                <SidebarLink
                  key={tool.slug}
                  tool={tool}
                  onClick={() => addToHistory(tool.slug)}
                />
              ))}
            </div>
          </div>
        )}


        {Object.entries(toolsByCategory).map(([category, categoryTools]) => (
          <div key={category}>
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{category}</span>
            <div className="mt-2 space-y-1">
              {categoryTools.map((tool) => (
                <SidebarLink
                  key={tool.slug}
                  tool={tool}
                  onClick={() => addToHistory(tool.slug)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 text-center">
        <span className="text-[10px] text-slate-600">v1.0.0 (Day 10)</span>
      </div>
    </aside>
  );
}