"use client";

import { FilterContent } from "@/components/FilterContent";
import type { FilterOptions, FilterState } from "@/types/product";

interface FilterSidebarProps {
  filters: FilterState;
  onChange: React.Dispatch<React.SetStateAction<FilterState>>;
  options: FilterOptions;
  onClear: () => void;
}

export function FilterSidebar({
  filters,
  onChange,
  options,
  onClear,
}: FilterSidebarProps) {
  return (
    <aside
      className="hidden w-64 shrink-0 lg:block"
      aria-label="Product filters"
    >
      <div className="sticky top-[8.5rem] rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <FilterContent
          filters={filters}
          onChange={onChange}
          options={options}
          onClear={onClear}
        />
      </div>
    </aside>
  );
}
