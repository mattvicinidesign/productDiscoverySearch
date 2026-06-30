"use client";

import { SlidersHorizontal } from "lucide-react";
import { FilterContent } from "@/components/FilterContent";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { countActiveFilters } from "@/lib/filters";
import type { FilterOptions, FilterState } from "@/types/product";

interface FilterDrawerProps {
  filters: FilterState;
  onChange: React.Dispatch<React.SetStateAction<FilterState>>;
  options: FilterOptions;
  onClear: () => void;
}

export function FilterDrawer({
  filters,
  onChange,
  options,
  onClear,
}: FilterDrawerProps) {
  const activeCount = countActiveFilters(filters);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] text-background">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <FilterContent
          filters={filters}
          onChange={onChange}
          options={options}
          onClear={onClear}
        />
      </SheetContent>
    </Sheet>
  );
}
