"use client";

import { resolveProductImageUrl } from "@/lib/images";

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  productId?: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}

export function ProductImage({
  src,
  alt,
  productId,
  className,
  style,
  priority = false,
}: ProductImageProps) {
  const resolved = resolveProductImageUrl(src, productId);
  if (!resolved) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        ...style,
      }}
    />
  );
}
