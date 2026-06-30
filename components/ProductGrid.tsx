"use client";

import { ProductCard } from "@/components/ProductCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { EmptyState } from "@/components/EmptyState";
import type { Product, SearchResult } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  matchMap: Map<number, SearchResult>;
  isLoading: boolean;
  query: string;
  hasFilters: boolean;
  onClearFilters: () => void;
  onSuggestedSearch: (term: string) => void;
  onProductSelect?: (product: Product) => void;
}

export function ProductGrid({
  products,
  matchMap,
  isLoading,
  query,
  hasFilters,
  onClearFilters,
  onSuggestedSearch,
  onProductSelect,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        query={query}
        hasFilters={hasFilters}
        onClearFilters={onClearFilters}
        onSuggestedSearch={onSuggestedSearch}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          searchResult={matchMap.get(product.id)}
          onSelect={onProductSelect}
        />
      ))}
    </div>
  );
}
