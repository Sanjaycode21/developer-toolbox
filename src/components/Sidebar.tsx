"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { tools, toolsByCategory } from "@/lib/tools";
import {
  Code, Star, History, Palette, Layers, Settings, Terminal, Hash, Shield, FileText, Binary, Calendar, Sparkles, Clock, Key, Search
} from 'lucide-react';

// Map tool slugs to Lucide icons
const iconMap: { [key: string]: React.ElementType } = {
  "favorites": Star,
  "history": History,
  "json-formatter": Code,
  "base64-encoder-decoder": Binary,
  "color-picker": Palette,
  "regex-tester-generator": Search,
  "unix-timestamp-epoch-converter": Clock, // Add the new tool's icon
  // Placeholder icons for future tools (if not already present)
  "jwt-decoder": Key,
  "css-shadow-gradient-generator": Layers,
  "uuid-password-generator": Sparkles,
  "case-converter": FileText,
  "lorem-ipsum-generator": FileText,
};

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col overflow-y-auto">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
          DevForge
        </Link>
      </div>

      <div className="flex-1">
        {Object.entries(toolsByCategory()).map(([category, categoryTools]) => (
          <div key={category} className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-4">
              {category}
            </h3>
            <nav>
              {categoryTools.map((tool) => {
                const IconComponent = iconMap[tool.slug];
                return (
                  <Link
                    key={tool.slug}
                    href={tool.path}
                    className={clsx(
                      "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive(tool.path)
                        ? "bg-indigo-500 text-white"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                    )}
                  >
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                    <span>{tool.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <Link
          href="/settings"
          className={clsx(
            "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            isActive("/settings")
              ? "bg-indigo-500 text-white"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          )}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;