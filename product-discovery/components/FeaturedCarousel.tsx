"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PromoAd } from "@/lib/homepage";

interface FeaturedCarouselProps {
  ads: PromoAd[];
  onAdSelect?: (ad: PromoAd) => void;
}

export function FeaturedCarousel({ ads, onAdSelect }: FeaturedCarouselProps) {
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (next: number) => {
      if (!ads.length) return;
      setIndex((next + ads.length) % ads.length);
    },
    [ads.length]
  );

  useEffect(() => {
    if (ads.length <= 1) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % ads.length),
      6000
    );
    return () => clearInterval(timer);
  }, [ads.length]);

  if (!ads.length) return null;

  const current = ads[index];

  return (
    <section
      className="relative isolate overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
      aria-label="Promotional offers"
      style={{ maxWidth: "100%" }}
    >
      <button
        type="button"
        onClick={() => onAdSelect?.(current)}
        className="relative block w-full overflow-hidden"
        style={{ height: 350 }}
        aria-label={current.alt}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.image}
          alt={current.alt}
          width={1280}
          height={350}
          style={{
            display: "block",
            width: "100%",
            height: 350,
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </button>

      {ads.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-zinc-900 shadow-md transition-colors hover:bg-white"
            aria-label="Previous advertisement"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-zinc-900 shadow-md transition-colors hover:bg-white"
            aria-label="Next advertisement"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {ads.map((ad, i) => (
              <button
                key={ad.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-white shadow-sm"
                    : "w-1.5 bg-white/60 shadow-sm"
                }`}
                aria-label={`Go to advertisement ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
