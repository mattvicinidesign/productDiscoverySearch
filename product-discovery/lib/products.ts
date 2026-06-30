import items from "@/data/items.json";
import { resolveProductImageUrl } from "@/lib/images";
import type { FilterOptions, Product } from "@/types/product";

const MATERIAL_KEYWORDS = new Set([
  "rattan",
  "linen",
  "leather",
  "velvet",
  "bamboo",
  "oak",
  "terracotta",
  "ceramic",
  "marble",
  "wool",
  "cotton",
  "metal",
  "glass",
  "wood",
  "brass",
  "copper",
  "stone",
  "concrete",
  "handwoven",
  "brushed",
]);

function normalizeProduct(raw: (typeof items)[number]): Product {
  return {
    id: raw.id,
    title: raw.title ?? "Untitled Product",
    brand: raw.brand ?? "Unknown Brand",
    category: raw.category ?? "Uncategorized",
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    price: typeof raw.price === "number" && !Number.isNaN(raw.price) ? raw.price : null,
    rating: typeof raw.rating === "number" && !Number.isNaN(raw.rating) ? raw.rating : null,
    reviews: raw.reviews ?? 0,
    inStock: Boolean(raw.inStock),
    releasedAt: raw.releasedAt ?? "",
    image: resolveProductImageUrl(raw.image, raw.id),
    imageWidth: raw.imageWidth ?? null,
    imageHeight: raw.imageHeight ?? null,
    description: raw.description ?? null,
  };
}

export const products: Product[] = (items as (typeof items)[number][]).map(normalizeProduct);

export function getFilterOptions(): FilterOptions {
  const categories = new Set<string>();
  const brands = new Set<string>();
  const tagCounts = new Map<string, number>();
  const prices: number[] = [];

  for (const product of products) {
    categories.add(product.category);
    brands.add(product.brand);
    for (const tag of product.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
    if (product.price != null) prices.push(product.price);
  }

  const sortedTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);

  const materialTags = sortedTags.filter(
    (tag) => MATERIAL_KEYWORDS.has(tag) || tag.includes(" ")
  );

  return {
    categories: [...categories].sort(),
    brands: [...brands].sort(),
    tags: sortedTags,
    materialTags: materialTags.slice(0, 20),
    priceRange: {
      min: prices.length ? Math.floor(Math.min(...prices)) : 0,
      max: prices.length ? Math.ceil(Math.max(...prices)) : 1000,
    },
  };
}

export const POPULAR_SEARCHES = [
  "linen textiles",
  "outdoor furniture",
  "wall art",
  "kitchen decor",
  "lighting",
  "storage",
  "velvet",
  "handwoven",
];

export const SUGGESTED_SEARCHES = [
  "decor",
  "furniture",
  "bath",
  "office",
  "terracotta",
  "compact",
];
