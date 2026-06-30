"use client";

import { useCallback, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { countActiveFilters } from "@/lib/filters";
import type { FilterOptions, FilterState } from "@/types/product";

interface FilterContentProps {
  filters: FilterState;
  onChange: React.Dispatch<React.SetStateAction<FilterState>>;
  options: FilterOptions;
  onClear: () => void;
}

function toggleArrayItem(arr: string[], item: string): string[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

export function FilterContent({
  filters,
  onChange,
  options,
  onClear,
}: FilterContentProps) {
  const { priceRange } = options;
  const [sliderValue, setSliderValue] = useState<[number, number]>([
    filters.priceMin ?? priceRange.min,
    filters.priceMax ?? priceRange.max,
  ]);

  useEffect(() => {
    setSliderValue([
      filters.priceMin ?? priceRange.min,
      filters.priceMax ?? priceRange.max,
    ]);
  }, [filters.priceMin, filters.priceMax, priceRange.min, priceRange.max]);

  const handlePriceChange = useCallback(
    (value: number[]) => {
      const [min, max] = value as [number, number];
      setSliderValue([min, max]);
      onChange((prev) => ({
        ...prev,
        priceMin: min <= priceRange.min ? null : min,
        priceMax: max >= priceRange.max ? null : max,
      }));
    },
    [onChange, priceRange.min, priceRange.max]
  );

  const activeCount = countActiveFilters(filters);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Filters</h2>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-8 text-xs text-muted-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      <section>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Category
        </h3>
        <div className="space-y-2.5">
          {options.categories.map((category) => (
            <div key={category} className="flex items-center gap-2.5">
              <Checkbox
                id={`cat-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={() =>
                  onChange((prev) => ({
                    ...prev,
                    categories: toggleArrayItem(prev.categories, category),
                  }))
                }
              />
              <Label
                htmlFor={`cat-${category}`}
                className="cursor-pointer font-normal text-foreground"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Brand
        </h3>
        <div className="max-h-48 space-y-2.5 overflow-y-auto pr-1">
          {options.brands.map((brand) => (
            <div key={brand} className="flex items-center gap-2.5">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={() =>
                  onChange((prev) => ({
                    ...prev,
                    brands: toggleArrayItem(prev.brands, brand),
                  }))
                }
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="cursor-pointer font-normal text-foreground"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Tags &amp; Materials
        </h3>
        <div className="flex flex-wrap gap-2">
          {options.materialTags.map((tag) => {
            const selected = filters.tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  onChange((prev) => ({
                    ...prev,
                    tags: toggleArrayItem(prev.tags, tag),
                  }))
                }
                className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${
                  selected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/30"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Availability
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { value: null, label: "All" },
            { value: true, label: "In stock" },
            { value: false, label: "Out of stock" },
          ].map((option) => {
            const selected = filters.inStock === option.value;
            return (
              <button
                key={String(option.value)}
                type="button"
                onClick={() =>
                  onChange((prev) => ({ ...prev, inStock: option.value }))
                }
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  selected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/30"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </section>

      <Separator />

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Price Range
          </h3>
          <span className="text-xs text-muted-foreground">
            {formatPrice(sliderValue[0])} – {formatPrice(sliderValue[1])}
          </span>
        </div>
        <Slider
          min={priceRange.min}
          max={priceRange.max}
          step={10}
          value={sliderValue}
          onValueChange={handlePriceChange}
          aria-label="Price range"
        />
      </section>
    </div>
  );
}
