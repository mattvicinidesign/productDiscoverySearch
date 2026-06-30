"use client";

import { Star } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice } from "@/lib/utils";
import { getSaleInfo } from "@/lib/homepage";
import type { Product } from "@/types/product";

interface MediumProductTileProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export function MediumProductTile({ product, onSelect }: MediumProductTileProps) {
  const sale = getSaleInfo(product);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(product)}
      className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div
        className="relative w-full overflow-hidden bg-muted"
        style={{ height: 176 }}
      >
        {product.image ? (
          <ProductImage
            src={product.image}
            alt={product.title}
            productId={product.id}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        {sale.onSale && (
          <span className="absolute left-2 top-2 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-semibold text-white">
            {sale.percentOff}% off
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground group-hover:underline">
          {product.title}
        </p>
        <p className="text-base font-semibold text-foreground">
          {formatPrice(product.price)}
        </p>
        {product.rating != null && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)}
          </span>
        )}
      </div>
    </button>
  );
}
