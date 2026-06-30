"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/types/product";

const RECENTLY_VIEWED_KEY = "discovery-recently-viewed";
const MAX_VIEWED = 12;

export interface RecentlyViewedItem {
  id: number;
  title: string;
  image: string | null;
  category: string;
}

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (stored) setRecentlyViewed(JSON.parse(stored));
    } catch {
      setRecentlyViewed([]);
    }
  }, []);

  const addRecentlyViewed = useCallback((product: Product) => {
    const item: RecentlyViewedItem = {
      id: product.id,
      title: product.title,
      image: product.image,
      category: product.category,
    };

    setRecentlyViewed((prev) => {
      const next = [
        item,
        ...prev.filter((p) => p.id !== product.id),
      ].slice(0, MAX_VIEWED);
      try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const removeRecentlyViewed = useCallback((id: number) => {
    setRecentlyViewed((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { recentlyViewed, addRecentlyViewed, removeRecentlyViewed };
}
