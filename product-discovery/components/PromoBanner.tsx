"use client";

import { Sparkles } from "lucide-react";

export function PromoBanner() {
  return (
    <div
      className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400"
      role="banner"
      aria-label="Special offer"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.12),transparent_40%)]" />

      <div className="relative mx-auto flex h-8 max-w-7xl items-center justify-center gap-2 px-4 sm:px-6 lg:px-8">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-white/90" aria-hidden />
        <p className="truncate text-center text-xs font-semibold tracking-wide text-white sm:text-[13px]">
          <span className="hidden sm:inline">Special offer — </span>
          Free shipping on orders over $75
          <span className="mx-2 hidden text-white/70 sm:inline">·</span>
          <span className="hidden font-bold sm:inline">Code: DISCOVER20</span>
        </p>
        <button
          type="button"
          className="ml-1 hidden shrink-0 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white transition-colors hover:bg-white/30 sm:inline-block"
        >
          Shop now
        </button>
      </div>
    </div>
  );
}
