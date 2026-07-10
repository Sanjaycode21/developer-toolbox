'use client';

import { useToolStore } from "@/store/useToolStore";
import { tools } from "@/lib/tools";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useToolStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const favoritedTools = isClient
    ? tools.filter(tool => favorites.includes(tool.slug))
    : [];

  return (
    <div className="flex flex-col h-full">
      <div className="pb-6 border-b border-slate-800 mb-8">
        <h2 className="text-3xl font-bold text-slate-100">Your Favorites</h2>
        <p className="mt-2 text-slate-400 text-sm">Quick access to your most-used tools.</p>
      </div>

      {isClient && favoritedTools.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-slate-500">
          <StarIcon className="h-16 w-16 mb-4 text-slate-700" />
          <p className="text-lg">No favorites yet!</p>
          <p className="text-sm mt-2">Click the star icon on any tool page to add it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritedTools.map((tool) => (
            <div key={tool.slug} className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-100">{tool.name}</h3>
                <p className="text-sm text-slate-400 mt-2">{tool.category}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Link href={tool.path} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
                  Go to tool &rarr;
                </Link>
                <button
                  onClick={() => removeFavorite(tool.slug)}
                  className="p-2 rounded-full text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 transition-colors"
                  aria-label="Remove from favorites"
                >
                  <StarIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}