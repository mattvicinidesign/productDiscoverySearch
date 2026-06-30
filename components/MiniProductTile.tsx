"use client";

import { ProductImage } from "@/components/ProductImage";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

interface MiniProductTileProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export function MiniProductTile({ product, onSelect }: MiniProductTileProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(product)}
      className="group flex flex-col text-left"
    >
      <div
        className="relative w-full overflow-hidden rounded-lg border border-border/50 bg-muted"
        style={{ height: 112 }}
      >
        {product.image ? (
          <ProductImage
            src={product.image}
            alt={product.title}
            productId={product.id}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
            —
          </div>
        )}
      </div>
      <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-foreground group-hover:underline">
        {product.title}
      </p>
      <p className="mt-0.5 text-xs font-semibold text-foreground">
        {formatPrice(product.price)}
      </p>
    </button>
  );
}
