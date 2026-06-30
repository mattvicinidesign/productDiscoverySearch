export interface Product {
  id: number;
  title: string;
  brand: string;
  category: string;
  tags: string[];
  price: number | null;
  rating: number | null;
  reviews: number;
  inStock: boolean;
  releasedAt: string;
  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  description: string | null;
}

export type SortOption =
  | "best-match"
  | "price-asc"
  | "price-desc"
  | "alphabetical"
  | "newest";

export interface FilterState {
  categories: string[];
  brands: string[];
  tags: string[];
  inStock: boolean | null;
  priceMin: number | null;
  priceMax: number | null;
}

export const DEFAULT_FILTERS: FilterState = {
  categories: [],
  brands: [],
  tags: [],
  inStock: null,
  priceMin: null,
  priceMax: null,
};

export interface FieldMatch {
  field: string;
  label: string;
  indices: readonly [number, number][];
  snippet?: string;
}

export interface SearchResult {
  product: Product;
  score: number;
  matches: FieldMatch[];
}

export interface FilterOptions {
  categories: string[];
  brands: string[];
  tags: string[];
  priceRange: { min: number; max: number };
  materialTags: string[];
}

export const FIELD_LABELS: Record<string, string> = {
  title: "Product Name",
  category: "Category",
  tags: "Tags",
  brand: "Brand",
  description: "Description",
};
