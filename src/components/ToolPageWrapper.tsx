'use client';

import { useToolStore } from "@/store/useToolStore";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

interface ToolPageWrapperProps {
  children: React.ReactNode;
  toolSlug: string;
  toolName: string;
  description?: string;
}

export default function ToolPageWrapper({ children, toolSlug, toolName, description }: ToolPageWrapperProps) {
  const { isFavorite, addFavorite, removeFavorite } = useToolStore();
  const [isClient, setIsClient] = useState(false);

  // Hydration fix for Zustand with localStorage
  useEffect(() => {
    setIsClient(true);
  }, []);

  const favorited = isClient ? isFavorite(toolSlug) : false;

  const toggleFavorite = () => {
    if (favorited) {
      removeFavorite(toolSlug);
    } else {
      addFavorite(toolSlug);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">{toolName}</h2>
          {description && <p className="mt-2 text-slate-400 text-sm">{description}</p>}
        </div>
        {isClient && ( // Only render favorite button on client side
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full transition-colors duration-200
              ${favorited
                ? "text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
              }`}
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          >
            {favorited ? (
              <StarSolidIcon className="h-6 w-6" />
            ) : (
              <StarOutlineIcon className="h-6 w-6" />
            )}
          </button>
        )}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

export { ToolPageWrapper };