import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUGGESTED_SEARCHES } from "@/lib/products";

interface EmptyStateProps {
  query: string;
  hasFilters: boolean;
  onClearFilters: () => void;
  onSuggestedSearch: (term: string) => void;
}

export function EmptyState({
  query,
  hasFilters,
  onClearFilters,
  onSuggestedSearch,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
        <SearchX className="h-6 w-6 text-muted-foreground" aria-hidden />
      </div>

      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        No products matched your search
      </h2>

      {query && (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          We couldn&apos;t find anything for &ldquo;{query}&rdquo;. Try adjusting
          your search or filters.
        </p>
      )}

      <div className="mt-8 max-w-sm space-y-2 text-left text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Suggestions</p>
        <ul className="list-inside list-disc space-y-1">
          <li>Check spelling</li>
          {hasFilters && <li>Remove or broaden filters</li>}
          <li>Try a broader term</li>
        </ul>
      </div>

      {hasFilters && (
        <Button
          variant="outline"
          className="mt-6"
          onClick={onClearFilters}
        >
          Clear all filters
        </Button>
      )}

      <div className="mt-10 w-full max-w-lg">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Try searching for
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTED_SEARCHES.map((term) => (
            <Button
              key={term}
              variant="secondary"
              size="sm"
              className="rounded-full"
              onClick={() => onSuggestedSearch(term)}
            >
              {term}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
