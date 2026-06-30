import { products } from "@/lib/products";
import type { Product } from "@/types/product";

export interface HomepageSection {
  title: string;
  subtitle?: string;
  products: Product[];
}

export interface PromoAd {
  id: string;
  image: string;
  alt: string;
  department: string | null;
  searchQuery?: string;
  /** Pre-designed creative — no text overlay */
  creative?: boolean;
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  cta?: string;
}

export interface FeaturedItem {
  product: Product;
  badge: string;
  percentOff?: number;
  compareAtPrice?: number;
}

const categoryAvgCache = new Map<string, number>();

function getCategoryAvgPrice(category: string): number {
  if (categoryAvgCache.has(category)) return categoryAvgCache.get(category)!;
  const prices = products
    .filter((p) => p.category === category && p.price != null)
    .map((p) => p.price!);
  const avg = prices.length
    ? prices.reduce((sum, p) => sum + p, 0) / prices.length
    : 0;
  categoryAvgCache.set(category, avg);
  return avg;
}

export function getSaleInfo(product: Product): {
  onSale: boolean;
  percentOff: number;
  compareAtPrice: number | null;
} {
  if (product.price == null) {
    return { onSale: false, percentOff: 0, compareAtPrice: null };
  }

  const avg = getCategoryAvgPrice(product.category);
  if (avg > 0 && product.price < avg * 0.78) {
    return {
      onSale: true,
      percentOff: Math.min(Math.round((1 - product.price / avg) * 100), 45),
      compareAtPrice: Math.round(avg),
    };
  }

  return { onSale: false, percentOff: 0, compareAtPrice: null };
}

function pickWithImages(
  items: Product[],
  count: number,
  seen = new Set<number>()
): Product[] {
  const result: Product[] = [];
  for (const item of items) {
    if (result.length >= count) break;
    if (!item.image || !item.inStock || seen.has(item.id)) continue;
    seen.add(item.id);
    result.push(item);
  }
  return result;
}

export function getFeaturedCarouselItems(count = 6): FeaturedItem[] {
  const seen = new Set<number>();
  const onSale = products
    .filter((p) => p.inStock && p.image && p.price != null)
    .map((product) => ({ product, sale: getSaleInfo(product) }))
    .filter(({ sale }) => sale.onSale)
    .sort((a, b) => b.sale.percentOff - a.sale.percentOff);

  const prioritized = products
    .filter((p) => p.inStock && p.image && p.rating != null && p.reviews >= 200)
    .sort((a, b) => (b.rating ?? 0) * b.reviews - (a.rating ?? 0) * a.reviews);

  const featured: FeaturedItem[] = [];

  for (const { product, sale } of onSale) {
    if (featured.length >= Math.ceil(count * 0.6)) break;
    if (seen.has(product.id)) continue;
    seen.add(product.id);
    featured.push({
      product,
      badge: "On sale",
      percentOff: sale.percentOff,
      compareAtPrice: sale.compareAtPrice ?? undefined,
    });
  }

  for (const product of prioritized) {
    if (featured.length >= count) break;
    if (seen.has(product.id)) continue;
    seen.add(product.id);
    featured.push({
      product,
      badge: "Top pick",
    });
  }

  return featured;
}

const PROMO_ADS: PromoAd[] = [
  {
    id: "home-essentials",
    image: "/ads/home-essentials.png",
    alt: "Thoughtfully curated home essentials",
    department: "Decor",
    creative: true,
  },
  {
    id: "furniture-quality",
    image: "/ads/furniture-quality.png",
    alt: "Beautiful pieces, built to last",
    department: "Furniture",
    creative: true,
  },
  {
    id: "best-sellers",
    image: "/ads/best-sellers.png",
    alt: "Elevate every corner of your home",
    department: null,
    searchQuery: "furniture",
    creative: true,
  },
  {
    id: "new-arrivals",
    image: "/ads/new-arrivals.png",
    alt: "Designed for real life — shop new arrivals",
    department: null,
    creative: true,
  },
];

export function getPromoAds(): PromoAd[] {
  return PROMO_ADS;
}

export function getRecommendedProducts(count = 8): Product[] {
  const scored = products
    .filter((p) => p.inStock && p.image)
    .sort((a, b) => {
      const scoreA = (a.rating ?? 3) * Math.log10(a.reviews + 1);
      const scoreB = (b.rating ?? 3) * Math.log10(b.reviews + 1);
      return scoreB - scoreA;
    });
  return pickWithImages(scored, count);
}

export function getRecentProducts(count = 8): Product[] {
  const sorted = [...products].sort(
    (a, b) => new Date(b.releasedAt).getTime() - new Date(a.releasedAt).getTime()
  );
  return pickWithImages(sorted, count);
}

export function getExploreProducts(count = 12): Product[] {
  const pool = products.filter((p) => p.inStock && p.image);
  const shuffled = [...pool].sort((a, b) => ((a.id * 7) % 13) - ((b.id * 7) % 13));
  return pickWithImages(shuffled, count);
}
