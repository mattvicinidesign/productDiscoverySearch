"use client";

import { Clock, Eye, TrendingUp, X } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import { POPULAR_SEARCHES } from "@/lib/products";
import type { RecentlyViewedItem } from "@/hooks/useRecentlyViewed";

interface SearchSuggestionsProps {
  onSelect: (term: string) => void;
  recentSearches: string[];
  onRemoveRecent: (term: string) => void;
  onClearRecent: () => void;
  recentlyViewed: RecentlyViewedItem[];
  onRecentlyViewedSelect: (item: RecentlyViewedItem) => void;
  onRemoveRecentlyViewed: (id: number) => void;
}

export function SearchSuggestions({
  onSelect,
  recentSearches,
  onRemoveRecent,
  onClearRecent,
  recentlyViewed,
  onRecentlyViewedSelect,
  onRemoveRecentlyViewed,
}: SearchSuggestionsProps) {
  return (
    <div className="space-y-4">
      {recentlyViewed.length > 0 && (
        <section aria-label="Recently viewed">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Eye className="h-3.5 w-3.5" />
            Recently viewed
          </div>
          <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
            {recentlyViewed.map((item) => (
              <div key={item.id} className="group relative w-[88px] shrink-0">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onRecentlyViewedSelect(item)}
                  className="w-full text-left"
                >
                  <div
                    className="relative overflow-hidden rounded-lg border border-border/60 bg-muted"
                    style={{ width: 88, height: 88 }}
                  >
                    {item.image ? (
                      <ProductImage
                        src={item.image}
                        alt={item.title}
                        productId={item.id}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                        —
                      </div>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-foreground group-hover:underline">
                    {item.title}
                  </p>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onRemoveRecentlyViewed(item.id)}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                  aria-label={`Remove ${item.title} from recently viewed`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {recentSearches.length > 0 && (
        <section aria-label="Recent searches">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Recent searches
            </div>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={onClearRecent}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear all
            </button>
          </div>
          <ul className="divide-y divide-border/60 rounded-lg border border-border/60">
            {recentSearches.map((term) => (
              <li key={term} className="flex items-center gap-1">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSelect(term)}
                  className="min-w-0 flex-1 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted/50"
                >
                  <span className="line-clamp-1">{term}</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onRemoveRecent(term)}
                  className="mr-2 shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={`Remove ${term} from recent searches`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-label="Popular searches">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <TrendingUp className="h-3.5 w-3.5" />
          Popular
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((term) => (
            <Button
              key={term}
              variant="secondary"
              size="sm"
              className="rounded-full"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(term)}
            >
              {term}
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
