import type { FilterState, Product, SortOption } from "@/types/product";
import type { SearchResult } from "@/types/product";

export function applyFilters(
  items: Product[] | SearchResult[],
  filters: FilterState
): Product[] {
  const getProduct = (item: Product | SearchResult): Product =>
    "product" in item ? item.product : item;

  return items
    .map(getProduct)
    .filter((product) => {
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.category)
      ) {
        return false;
      }

      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }

      if (filters.tags.length > 0) {
        const hasTag = filters.tags.some((tag) => product.tags.includes(tag));
        if (!hasTag) return false;
      }

      if (filters.inStock !== null && product.inStock !== filters.inStock) {
        return false;
      }

      if (filters.priceMin != null && product.price != null && product.price < filters.priceMin) {
        return false;
      }

      if (filters.priceMax != null && product.price != null && product.price > filters.priceMax) {
        return false;
      }

      if (
        (filters.priceMin != null || filters.priceMax != null) &&
        product.price == null
      ) {
        return false;
      }

      return true;
    });
}

export function sortProducts(
  items: Product[],
  sort: SortOption,
  searchQuery: string
): Product[] {
  const sorted = [...items];

  switch (sort) {
    case "best-match":
      if (searchQuery.trim()) return sorted;
      return sorted.sort(
        (a, b) => new Date(b.releasedAt).getTime() - new Date(a.releasedAt).getTime()
      );
    case "price-asc":
      return sorted.sort((a, b) => {
        if (a.price == null && b.price == null) return 0;
        if (a.price == null) return 1;
        if (b.price == null) return -1;
        return a.price - b.price;
      });
    case "price-desc":
      return sorted.sort((a, b) => {
        if (a.price == null && b.price == null) return 0;
        if (a.price == null) return 1;
        if (b.price == null) return -1;
        return b.price - a.price;
      });
    case "alphabetical":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.releasedAt).getTime() - new Date(a.releasedAt).getTime()
      );
    default:
      return sorted;
  }
}

export function countActiveFilters(filters: FilterState): number {
  let count = 0;
  if (filters.categories.length) count++;
  if (filters.brands.length) count++;
  if (filters.tags.length) count++;
  if (filters.inStock !== null) count++;
  if (filters.priceMin != null || filters.priceMax != null) count++;
  return count;
}

export function hasActiveFilters(filters: FilterState): boolean {
  return countActiveFilters(filters) > 0;
}
