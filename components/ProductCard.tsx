"use client";

import { memo } from "react";
import { Star } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { MatchHighlight } from "@/components/MatchHighlight";
import { WhyMatched } from "@/components/WhyMatched";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { getMatchIndicesForField } from "@/lib/search";
import type { Product, SearchResult } from "@/types/product";

interface ProductCardProps {
  product: Product;
  searchResult?: SearchResult;
  onSelect?: (product: Product) => void;
}

export const ProductCard = memo(function ProductCard({
  product,
  searchResult,
  onSelect,
}: ProductCardProps) {
  const titleIndices = searchResult
    ? getMatchIndicesForField(searchResult.matches, "title")
    : [];
  const descIndices = searchResult
    ? getMatchIndicesForField(searchResult.matches, "description")
    : [];

  return (
    <article
      onClick={onSelect ? () => onSelect(product) : undefined}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(product);
              }
            }
          : undefined
      }
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-shadow duration-300 hover:shadow-md${
        onSelect ? " cursor-pointer" : ""
      }`}
    >
      <div
        className="relative w-full overflow-hidden bg-muted"
        style={{ height: 192 }}
      >
        {product.image ? (
          <ProductImage
            src={product.image}
            alt={product.title}
            productId={product.id}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
        {!product.inStock && (
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 bg-background/90 backdrop-blur-sm"
          >
            Out of stock
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-muted-foreground">
            {product.category}
          </p>
          {product.rating != null && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-foreground">
          <MatchHighlight text={product.title} indices={titleIndices} />
        </h3>

        <p className="text-lg font-medium tracking-tight text-foreground">
          {formatPrice(product.price)}
        </p>

        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span>{product.brand}</span>
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted/60 px-2 py-0.5 capitalize"
            >
              {tag}
            </span>
          ))}
        </div>

        {product.description && searchResult && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            <MatchHighlight
              text={product.description}
              indices={descIndices}
            />
          </p>
        )}

        {searchResult && (
          <div className="mt-auto border-t border-border/50 pt-3">
            <WhyMatched matches={searchResult.matches} compact />
          </div>
        )}
      </div>
    </article>
  );
});
