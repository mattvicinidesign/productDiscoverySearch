"use client";

import { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { MediumProductTile } from "@/components/MediumProductTile";
import { MiniProductTile } from "@/components/MiniProductTile";
import {
  getExploreProducts,
  getPromoAds,
  getRecentProducts,
  getRecommendedProducts,
  type PromoAd,
} from "@/lib/homepage";
import type { Product } from "@/types/product";

interface HomepageProps {
  onProductSelect: (product: Product) => void;
  onCategorySelect: (category: string) => void;
  onAdSelect: (ad: PromoAd) => void;
}

export function Homepage({
  onProductSelect,
  onCategorySelect,
  onAdSelect,
}: HomepageProps) {
  const ads = useMemo(() => getPromoAds(), []);
  const recommended = useMemo(() => getRecommendedProducts(8), []);
  const recent = useMemo(() => getRecentProducts(8), []);
  const explore = useMemo(() => getExploreProducts(12), []);

  return (
    <div className="space-y-8 pb-10">
      <FeaturedCarousel ads={ads} onAdSelect={onAdSelect} />

      <section aria-label="Recommended for you">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Recommended for you
            </h2>
            <p className="text-sm text-muted-foreground">
              Based on ratings and shopper activity
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {recommended.map((product) => (
            <MediumProductTile
              key={product.id}
              product={product}
              onSelect={onProductSelect}
            />
          ))}
        </div>
      </section>

      <section aria-label="New arrivals">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              New arrivals
            </h2>
            <p className="text-sm text-muted-foreground">
              Recently added to the collection
            </p>
          </div>
          <button
            type="button"
            onClick={() => onCategorySelect("Furniture")}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground"
          >
            See more
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {recent.map((product) => (
            <MediumProductTile
              key={product.id}
              product={product}
              onSelect={onProductSelect}
            />
          ))}
        </div>
      </section>

      <section aria-label="More to explore">
        <div className="mb-4">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            More to explore
          </h2>
          <p className="text-sm text-muted-foreground">
            Quick picks across every department
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6">
          {explore.map((product) => (
            <MiniProductTile
              key={product.id}
              product={product}
              onSelect={onProductSelect}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
