"use client";

import { PromoBanner } from "@/components/PromoBanner";
import { SearchBar } from "@/components/SearchBar";
import type { RecentlyViewedItem } from "@/hooks/useRecentlyViewed";
import {
  SUBHEADER_COLLECTIONS,
  type CollectionId,
} from "@/lib/collections";

interface HeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
  onClearSearch: () => void;
  onSearchSubmit: (value: string) => void;
  onSuggestionSelect: (term: string) => void;
  department: string | null;
  onDepartmentChange: (department: string | null) => void;
  departments: string[];
  collection: CollectionId | null;
  onCollectionSelect: (collection: CollectionId) => void;
  onGoHome: () => void;
  recentSearches: string[];
  onRemoveRecent: (term: string) => void;
  onClearRecent: () => void;
  recentlyViewed: RecentlyViewedItem[];
  onRecentlyViewedSelect: (item: RecentlyViewedItem) => void;
  onRemoveRecentlyViewed: (id: number) => void;
}

export function Header({
  query,
  onQueryChange,
  onClearSearch,
  onSearchSubmit,
  onSuggestionSelect,
  department,
  onDepartmentChange,
  departments,
  collection,
  onCollectionSelect,
  onGoHome,
  recentSearches,
  onRemoveRecent,
  onClearRecent,
  recentlyViewed,
  onRecentlyViewedSelect,
  onRemoveRecentlyViewed,
}: HeaderProps) {
  return (
    <div className="sticky top-0 z-40">
      <PromoBanner />

      <header className="border-b border-border bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center gap-3 sm:gap-4 lg:h-16">
          <button
            type="button"
            onClick={onGoHome}
            className="flex shrink-0 items-center gap-2"
            aria-label="Discover home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
              <span className="text-sm font-bold">D</span>
            </div>
            <span className="hidden text-sm font-semibold tracking-tight text-foreground sm:inline">
              Discover
            </span>
          </button>

          <div className="min-w-0 flex-1">
            <SearchBar
              value={query}
              onChange={onQueryChange}
              onClear={onClearSearch}
              onSubmit={onSearchSubmit}
              department={department}
              onDepartmentChange={onDepartmentChange}
              departments={departments}
              recentSearches={recentSearches}
              onRemoveRecent={onRemoveRecent}
              onClearRecent={onClearRecent}
              onSuggestionSelect={onSuggestionSelect}
              recentlyViewed={recentlyViewed}
              onRecentlyViewedSelect={onRecentlyViewedSelect}
              onRemoveRecentlyViewed={onRemoveRecentlyViewed}
            />
          </div>

          <p className="hidden shrink-0 text-xs text-muted-foreground lg:block">
            4,000 home goods
          </p>
        </div>

        <nav
          className="-mx-4 flex gap-1 overflow-x-auto border-t border-border/60 px-4 py-2 scrollbar-none sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          aria-label="Collections"
        >
          {SUBHEADER_COLLECTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onCollectionSelect(item.id)}
              className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors sm:text-sm ${
                collection === item.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
    </div>
  );
}
