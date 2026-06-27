"use client";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "livetv_favourites";

export function useFavourites() {
  const [favourites, setFavourites] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavourites(new Set(JSON.parse(stored)));
    } catch {}
  }, []);

  const toggle = useCallback((key: string) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  const isFav = useCallback(
    (key: string) => favourites.has(key),
    [favourites]
  );

  return { favourites, toggle, isFav };
}
