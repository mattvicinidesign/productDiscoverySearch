import type { SortOption } from "@/types/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "best-match", label: "Best Match" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "alphabetical", label: "Alphabetical" },
  { value: "newest", label: "Newest" },
];

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  hasSearch: boolean;
}

export function SortDropdown({ value, onChange, hasSearch }: SortDropdownProps) {
  const options = hasSearch
    ? SORT_OPTIONS
    : SORT_OPTIONS.filter((opt) => opt.value !== "best-match");

  const displayValue = !hasSearch && value === "best-match" ? "newest" : value;

  return (
    <Select
      value={displayValue}
      onValueChange={(v) => onChange(v as SortOption)}
    >
      <SelectTrigger
        className="w-[180px] border-border/60 bg-background"
        aria-label="Sort results"
      >
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
