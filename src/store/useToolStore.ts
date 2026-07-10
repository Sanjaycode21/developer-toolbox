import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ToolHistoryItem {
  slug: string;
  timestamp: number;
}

interface ToolState {
  favorites: string[];
  history: ToolHistoryItem[];
  addFavorite: (slug: string) => void;
  removeFavorite: (slug: string) => void;
  addToHistory: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
}

const HISTORY_LIMIT = 10; // Keep only the last 10 unique tools in history

export const useToolStore = create<ToolState>()(
  persist(
    (set, get) => ({
      favorites: [],
      history: [],

      addFavorite: (slug: string) =>
        set((state) => ({
          favorites: Array.from(new Set([...state.favorites, slug])), // Ensure uniqueness
        })),

      removeFavorite: (slug: string) =>
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav !== slug),
        })),

      addToHistory: (slug: string) =>
        set((state) => {
          const newHistory = state.history.filter((item) => item.slug !== slug); // Remove old entry if exists
          newHistory.unshift({ slug, timestamp: Date.now() }); // Add to the beginning
          return {
            history: newHistory.slice(0, HISTORY_LIMIT), // Keep only the latest N items
          };
        }),

      isFavorite: (slug: string) => get().favorites.includes(slug),
    }),
    {
      name: 'devforge-tool-storage', // unique name for localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);