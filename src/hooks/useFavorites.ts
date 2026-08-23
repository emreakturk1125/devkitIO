import { useState, useCallback } from 'react';
import { readStorage, writeStorage } from '@/services/storage/storage';

const MAX_FAVORITES = 20;

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    return readStorage<string[]>('favorites', []);
  });

  const toggleFavorite = useCallback((toolId: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [toolId, ...prev].slice(0, MAX_FAVORITES);
      writeStorage('favorites', next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (toolId: string) => favoriteIds.includes(toolId),
    [favoriteIds]
  );

  return { favoriteIds, toggleFavorite, isFavorite };
}
