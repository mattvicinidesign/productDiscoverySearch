import type { Product } from "@/types/product";

/** Broken placeholder host in the dataset — swap to picsum. */
export function resolveProductImageUrl(
  image: string | null | undefined,
  productId?: number
): string | null {
  if (!image) return null;
  if (image.includes("cdn.catalog.example") && productId != null) {
    return `https://picsum.photos/seed/cat${productId}/500/320`;
  }
  return image;
}

export function getProductImage(product: Product): string | null {
  return resolveProductImageUrl(product.image, product.id);
}
