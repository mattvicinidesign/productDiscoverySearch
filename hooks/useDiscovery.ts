"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { filterByCollection, type CollectionId } from "@/lib/collections";
import { applyFilters, sortProducts } from "@/lib/filters";
import { products, getFilterOptions } from "@/lib/products";
import { searchProducts } from "@/lib/search";
import {
  DEFAULT_FILTERS,
  type FilterState,
  type Product,
  type SearchResult,
  type SortOption,
} from "@/types/product";

const RECENT_SEARCHES_KEY = "discovery-recent-searches";
const MAX_RECENT = 8;
const SEARCH_DEBOUNCE_MS = 120;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {
      setRecentSearches([]);
    }
  }, []);

  const addRecentSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((s) => s !== trimmed)].slice(
        0,
        MAX_RECENT
      );
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // ignore
    }
  }, []);

  const removeRecentSearch = useCallback((term: string) => {
    setRecentSearches((prev) => {
      const next = prev.filter((s) => s !== term);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return {
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    removeRecentSearch,
  };
}

export interface UseDiscoveryReturn {
  query: string;
  setQuery: (query: string) => void;
  department: string | null;
  setDepartment: (department: string | null) => void;
  collection: CollectionId | null;
  setCollection: (collection: CollectionId | null) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  sort: SortOption;
  setSort: (sort: SortOption) => void;
  results: SearchResult[];
  displayedProducts: Product[];
  matchMap: Map<number, SearchResult>;
  totalCount: number;
  isSearching: boolean;
  filterOptions: ReturnType<typeof getFilterOptions>;
  clearFilters: () => void;
  clearSearch: () => void;
}

export function useDiscovery(): UseDiscoveryReturn {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState<string | null>(null);
  const [collection, setCollection] = useState<CollectionId | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>("best-match");

  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);
  const searchQuery = useDeferredValue(debouncedQuery);

  const filterOptions = useMemo(() => getFilterOptions(), []);

  const isPendingSearch =
    query.trim() !== "" && query.trim() !== searchQuery.trim();

  const searchResults = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return [];
    const results = searchProducts(products, trimmed);
    if (!department) return results;
    return results.filter((r) => r.product.category === department);
  }, [searchQuery, department]);

  const matchMap = useMemo(() => {
    const map = new Map<number, SearchResult>();
    for (const result of searchResults) {
      map.set(result.product.id, result);
    }
    return map;
  }, [searchResults]);

  const filteredAndSorted = useMemo(() => {
    const trimmed = searchQuery.trim();

    if (isPendingSearch) return [];

    if (trimmed) {
      const filtered = applyFilters(searchResults, filters);
      const productIds = new Set(filtered.map((p) => p.id));

      const ordered = searchResults
        .filter((r) => productIds.has(r.product.id))
        .map((r) => r.product);

      if (sort === "best-match") return ordered;
      return sortProducts(ordered, sort, trimmed);
    }

    const pool = (() => {
      if (collection) {
        const curated = filterByCollection(
          department
            ? products.filter((p) => p.category === department)
            : products,
          collection
        );
        return curated;
      }
      return department
        ? products.filter((p) => p.category === department)
        : products;
    })();
    const filtered = applyFilters(pool, filters);
    return sortProducts(
      filtered,
      sort === "best-match" ? "newest" : sort,
      trimmed
    );
  }, [
    searchQuery,
    department,
    collection,
    searchResults,
    filters,
    sort,
    isPendingSearch,
  ]);

  const isSearching =
    isPendingSearch || query.trim() !== debouncedQuery.trim();

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
  }, []);

  return {
    query,
    setQuery,
    department,
    setDepartment,
    collection,
    setCollection,
    filters,
    setFilters,
    sort,
    setSort,
    results: searchResults,
    displayedProducts: filteredAndSorted,
    matchMap,
    totalCount: filteredAndSorted.length,
    isSearching,
    filterOptions,
    clearFilters,
    clearSearch,
  };
}
