'use client';

import { useToolStore } from "@/store/useToolStore";
import { getToolBySlug } from "@/lib/tools";
import Link from "next/link";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function HistoryPage() {
  const { history } = useToolStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fullHistory = isClient
    ? history
        .map(item => ({
          tool: getToolBySlug(item.slug),
          timestamp: item.timestamp,
        }))
        .filter((item): item is { tool: NonNullable<ReturnType<typeof getToolBySlug>>; timestamp: number } => item.tool !== undefined)
        .sort((a, b) => b.timestamp - a.timestamp) // Sort by most recent first
    : [];

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Or use a more specific format
  };

  return (
    <div className="flex flex-col h-full">
      <div className="pb-6 border-b border-slate-800 mb-8">
        <h2 className="text-3xl font-bold text-slate-100">Usage History</h2>
        <p className="mt-2 text-slate-400 text-sm">A chronological list of tools you&apos;ve used recently.</p>
      </div>

      {isClient && fullHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-slate-500">
          <ClockIcon className="h-16 w-16 mb-4 text-slate-700" />
          <p className="text-lg">Your history is empty!</p>
          <p className="text-sm mt-2">Start using tools to see them appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fullHistory.map((item, index) => (
            <div key={`${item.tool.slug}-${item.timestamp}-${index}`} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
              <div>
                <Link href={item.tool.path} className="text-lg font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  {item.tool.name}
                </Link>
                <p className="text-sm text-slate-500 mt-1">Used: {formatTimestamp(item.timestamp)}</p>
              </div>
              <span className="text-xs text-slate-600 px-3 py-1 bg-slate-800 rounded-full">{item.tool.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}