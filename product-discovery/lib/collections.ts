import { products } from "@/lib/products";
import type { Product } from "@/types/product";

export type CollectionId =
  | "best-sellers"
  | "new-arrivals"
  | "trending"
  | "sustainable"
  | "under-100"
  | "staff-picks"
  | "walnut"
  | "small-spaces";

export interface Collection {
  id: CollectionId;
  label: string;
}

export const SUBHEADER_COLLECTIONS: Collection[] = [
  { id: "best-sellers", label: "Best Sellers" },
  { id: "new-arrivals", label: "New Arrivals" },
  { id: "trending", label: "Trending" },
  { id: "sustainable", label: "Sustainable" },
  { id: "under-100", label: "Under $100" },
  { id: "staff-picks", label: "Staff Picks" },
  { id: "walnut", label: "Walnut" },
  { id: "small-spaces", label: "Small Spaces" },
];

const SUSTAINABLE_KEYWORDS = [
  "linen",
  "bamboo",
  "rattan",
  "handwoven",
  "oak",
  "cotton",
  "wool",
  "terracotta",
  "ceramic",
];

function productText(product: Product): string {
  return [
    product.title,
    product.description ?? "",
    ...product.tags,
  ]
    .join(" ")
    .toLowerCase();
}

function matchesKeywords(product: Product, keywords: string[]): boolean {
  const text = productText(product);
  return keywords.some((kw) => text.includes(kw));
}

function scoreBestSeller(product: Product): number {
  return (product.rating ?? 0) * Math.log10(product.reviews + 1);
}

function scoreTrending(product: Product): number {
  const recency =
    new Date(product.releasedAt).getTime() / (1000 * 60 * 60 * 24 * 365);
  return scoreBestSeller(product) + recency * 0.15;
}

function scoreStaffPick(product: Product): number {
  const rating = product.rating ?? 0;
  const reviews = product.reviews;
  const inStockBoost = product.inStock ? 1 : 0;
  return rating * 2 + Math.log10(reviews + 1) + inStockBoost;
}

export function getCollectionLabel(id: CollectionId): string {
  return SUBHEADER_COLLECTIONS.find((c) => c.id === id)?.label ?? id;
}

export function filterByCollection(
  items: Product[],
  collectionId: CollectionId
): Product[] {
  const inStock = items.filter((p) => p.inStock);

  switch (collectionId) {
    case "best-sellers":
      return [...inStock]
        .filter((p) => p.reviews >= 50)
        .sort((a, b) => scoreBestSeller(b) - scoreBestSeller(a));

    case "new-arrivals":
      return [...inStock].sort(
        (a, b) =>
          new Date(b.releasedAt).getTime() - new Date(a.releasedAt).getTime()
      );

    case "trending":
      return [...inStock]
        .filter((p) => p.reviews >= 20)
        .sort((a, b) => scoreTrending(b) - scoreTrending(a));

    case "sustainable":
      return inStock.filter((p) =>
        matchesKeywords(p, SUSTAINABLE_KEYWORDS)
      );

    case "under-100":
      return inStock.filter((p) => p.price != null && p.price < 100);

    case "staff-picks":
      return [...inStock]
        .filter((p) => (p.rating ?? 0) >= 4.2 && p.reviews >= 30)
        .sort((a, b) => scoreStaffPick(b) - scoreStaffPick(a));

    case "walnut":
      return inStock.filter((p) => matchesKeywords(p, ["walnut"]));

    case "small-spaces":
      return inStock.filter((p) =>
        matchesKeywords(p, ["compact", "small", "folding", "stackable"])
      );

    default:
      return inStock;
  }
}

export function getCollectionProducts(
  collectionId: CollectionId,
  department: string | null
): Product[] {
  const pool = department
    ? products.filter((p) => p.category === department)
    : products;
  return filterByCollection(pool, collectionId);
}
