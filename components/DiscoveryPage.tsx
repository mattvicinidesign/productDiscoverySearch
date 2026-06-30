"use client";

import { useCallback, startTransition } from "react";
import { Header } from "@/components/Header";
import { Homepage } from "@/components/Homepage";
import { FilterSidebar } from "@/components/FilterSidebar";
import { FilterDrawer } from "@/components/FilterDrawer";
import { SortDropdown } from "@/components/SortDropdown";
import { ResultCount } from "@/components/ResultCount";
import { ProductGrid } from "@/components/ProductGrid";
import { useDiscovery, useRecentSearches } from "@/hooks/useDiscovery";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { hasActiveFilters } from "@/lib/filters";
import { getCollectionLabel, type CollectionId } from "@/lib/collections";
import { products } from "@/lib/products";
import type { Product } from "@/types/product";
import type { PromoAd } from "@/lib/homepage";
import type { RecentlyViewedItem } from "@/hooks/useRecentlyViewed";

export function DiscoveryPage() {
  const {
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
    displayedProducts,
    matchMap,
    totalCount,
    isSearching,
    filterOptions,
    clearFilters,
    clearSearch,
  } = useDiscovery();

  const { recentSearches, addRecentSearch, clearRecentSearches, removeRecentSearch } =
    useRecentSearches();

  const { recentlyViewed, addRecentlyViewed, removeRecentlyViewed } =
    useRecentlyViewed();

  const handleQueryChange = useCallback(
    (value: string) => {
      startTransition(() => setQuery(value));
    },
    [setQuery]
  );

  const handleSearchSelect = useCallback(
    (term: string) => {
      setQuery(term);
      addRecentSearch(term);
    },
    [setQuery, addRecentSearch]
  );

  const handleSearchSubmit = useCallback(
    (term: string) => {
      if (term.trim()) addRecentSearch(term);
    },
    [addRecentSearch]
  );

  const handleProductSelect = useCallback(
    (product: Product) => {
      setQuery(product.title);
      setDepartment(product.category);
      addRecentSearch(product.title);
      addRecentlyViewed(product);
    },
    [setQuery, setDepartment, addRecentSearch, addRecentlyViewed]
  );

  const handleRecentlyViewedSelect = useCallback(
    (item: RecentlyViewedItem) => {
      const product = products.find((p) => p.id === item.id);
      if (product) {
        handleProductSelect(product);
      } else {
        setQuery(item.title);
        setDepartment(item.category);
        addRecentSearch(item.title);
      }
    },
    [handleProductSelect, setQuery, setDepartment, addRecentSearch]
  );

  const handleCategorySelect = useCallback(
    (category: string) => {
      setDepartment(category);
      setCollection(null);
      clearSearch();
    },
    [setDepartment, setCollection, clearSearch]
  );

  const handleAdSelect = useCallback(
    (ad: PromoAd) => {
      setCollection(null);
      if (ad.department) setDepartment(ad.department);
      if (ad.searchQuery) setQuery(ad.searchQuery);
      else clearSearch();
    },
    [setDepartment, setQuery, setCollection, clearSearch]
  );

  const handleCollectionSelect = useCallback(
    (id: CollectionId) => {
      setCollection(id);
      clearSearch();
    },
    [setCollection, clearSearch]
  );

  const handleGoHome = useCallback(() => {
    clearSearch();
    setDepartment(null);
    setCollection(null);
  }, [clearSearch, setDepartment, setCollection]);

  const showHomepage = !query.trim() && !department && !collection;

  return (
    <div className="min-h-screen bg-background">
      <Header
        query={query}
        onQueryChange={handleQueryChange}
        onClearSearch={clearSearch}
        onSearchSubmit={handleSearchSubmit}
        onSuggestionSelect={handleSearchSelect}
        department={department}
        onDepartmentChange={setDepartment}
        departments={filterOptions.categories}
        collection={collection}
        onCollectionSelect={handleCollectionSelect}
        onGoHome={handleGoHome}
        recentSearches={recentSearches}
        onRemoveRecent={removeRecentSearch}
        onClearRecent={clearRecentSearches}
        recentlyViewed={recentlyViewed}
        onRecentlyViewedSelect={handleRecentlyViewedSelect}
        onRemoveRecentlyViewed={removeRecentlyViewed}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {showHomepage && (
          <Homepage
            onProductSelect={handleProductSelect}
            onCategorySelect={handleCategorySelect}
            onAdSelect={handleAdSelect}
          />
        )}

        {!showHomepage && (
          <div className="mt-6 flex gap-8">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              options={filterOptions}
              onClear={clearFilters}
            />

            <div className="min-w-0 flex-1">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FilterDrawer
                    filters={filters}
                    onChange={setFilters}
                    options={filterOptions}
                    onClear={clearFilters}
                  />
                  <ResultCount
                    count={totalCount}
                    query={query}
                    isLoading={isSearching}
                  />
                  {collection && !query && (
                    <span className="text-sm text-muted-foreground">
                      in{" "}
                      <span className="font-medium text-foreground">
                        {getCollectionLabel(collection)}
                      </span>
                    </span>
                  )}
                  {department && !query && !collection && (
                    <span className="text-sm text-muted-foreground">
                      in{" "}
                      <span className="font-medium text-foreground">
                        {department}
                      </span>
                    </span>
                  )}
                </div>
                <SortDropdown
                  value={sort}
                  onChange={setSort}
                  hasSearch={Boolean(query.trim())}
                />
              </div>

              <ProductGrid
                products={displayedProducts}
                matchMap={matchMap}
                isLoading={isSearching && displayedProducts.length === 0}
                query={query}
                hasFilters={hasActiveFilters(filters)}
                onClearFilters={clearFilters}
                onSuggestedSearch={handleSearchSelect}
                onProductSelect={handleProductSelect}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
