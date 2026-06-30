import Fuse, { type FuseResult, type IFuseOptions } from "fuse.js";
import type { Product, SearchResult, FieldMatch } from "@/types/product";
import { FIELD_LABELS } from "@/types/product";

const FUSE_OPTIONS: IFuseOptions<Product> = {
  includeScore: true,
  includeMatches: true,
  threshold: 0.38,
  distance: 100,
  minMatchCharLength: 2,
  ignoreLocation: true,
  keys: [
    { name: "title", weight: 0.35 },
    { name: "category", weight: 0.2 },
    { name: "tags", weight: 0.2 },
    { name: "brand", weight: 0.15 },
    { name: "description", weight: 0.1 },
  ],
};

let fuseInstance: Fuse<Product> | null = null;

export function getFuseIndex(products: Product[]): Fuse<Product> {
  if (!fuseInstance) {
    fuseInstance = new Fuse(products, FUSE_OPTIONS);
  }
  return fuseInstance;
}

function mapMatches(result: FuseResult<Product>): FieldMatch[] {
  if (!result.matches?.length) return [];

  const seen = new Set<string>();
  const matches: FieldMatch[] = [];

  for (const match of result.matches) {
    const field = match.key ?? "unknown";
    if (seen.has(field)) continue;
    seen.add(field);

    matches.push({
      field,
      label: FIELD_LABELS[field] ?? field,
      indices: match.indices ?? [],
      snippet: typeof match.value === "string" ? match.value : undefined,
    });
  }

  return matches;
}

export function searchProducts(
  products: Product[],
  query: string
): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const fuse = getFuseIndex(products);
  const results = fuse.search(trimmed);

  return results.map((result) => ({
    product: result.item,
    score: result.score ?? 1,
    matches: mapMatches(result),
  }));
}

export function getMatchIndicesForField(
  matches: FieldMatch[],
  field: string
): readonly [number, number][] {
  return matches.find((m) => m.field === field)?.indices ?? [];
}
