"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { SearchSuggestions } from "@/components/SearchSuggestions";
import type { RecentlyViewedItem } from "@/hooks/useRecentlyViewed";
import { cn } from "@/lib/utils";

const ALL_DEPARTMENTS = "All Departments";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSubmit?: (value: string) => void;
  department: string | null;
  onDepartmentChange: (department: string | null) => void;
  departments: string[];
  recentSearches: string[];
  onRemoveRecent: (term: string) => void;
  onClearRecent: () => void;
  onSuggestionSelect: (term: string) => void;
  recentlyViewed: RecentlyViewedItem[];
  onRecentlyViewedSelect: (item: RecentlyViewedItem) => void;
  onRemoveRecentlyViewed: (id: number) => void;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  onSubmit,
  department,
  onDepartmentChange,
  departments,
  recentSearches,
  onRemoveRecent,
  onClearRecent,
  onSuggestionSelect,
  recentlyViewed,
  onRecentlyViewedSelect,
  onRemoveRecentlyViewed,
  className,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const showSuggestions = isOpen && !inputValue.trim();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = useCallback(
    (next: string) => {
      setInputValue(next);
      onChange(next);
    },
    [onChange]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (e.key === "/" && !isInput) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }

      if (e.key === "Escape") {
        if (document.activeElement === inputRef.current || isOpen) {
          e.preventDefault();
          setIsOpen(false);
          if (document.activeElement === inputRef.current) {
            handleChange("");
            onClear();
            inputRef.current?.blur();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClear, isOpen, handleChange]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionSelect = (term: string) => {
    onSuggestionSelect(term);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleRecentlyViewedSelect = (item: RecentlyViewedItem) => {
    onRecentlyViewedSelect(item);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    handleChange("");
    onClear();
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="flex w-full items-stretch">
        <label className="sr-only" htmlFor="department-select">
          Department
        </label>
        <select
          id="department-select"
          value={department ?? ALL_DEPARTMENTS}
          onChange={(e) => {
            const val = e.target.value;
            onDepartmentChange(val === ALL_DEPARTMENTS ? null : val);
          }}
          className="h-10 shrink-0 cursor-pointer rounded-l-lg border border-r-0 border-zinc-300 bg-zinc-100 px-2 text-xs font-medium text-zinc-900 outline-none transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-blue-500 sm:px-3 sm:text-sm"
          aria-label="Select department"
        >
          <option value={ALL_DEPARTMENTS}>All</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <div className="relative min-w-0 flex-1">
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={showSuggestions}
            aria-controls="search-suggestions"
            aria-label="Search products"
            placeholder="Search furniture, lighting, decor..."
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && onSubmit) onSubmit(inputValue);
            }}
            className="h-10 w-full border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSubmit?.(inputValue)}
          className="flex h-10 shrink-0 items-center justify-center rounded-r-lg bg-blue-600 px-3 text-white transition-colors hover:bg-blue-500 sm:px-4"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      {showSuggestions && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[min(70vh,520px)] overflow-y-auto rounded-xl border border-border bg-card p-4 shadow-lg"
        >
          <SearchSuggestions
            onSelect={handleSuggestionSelect}
            recentSearches={recentSearches}
            onRemoveRecent={onRemoveRecent}
            onClearRecent={onClearRecent}
            recentlyViewed={recentlyViewed}
            onRecentlyViewedSelect={handleRecentlyViewedSelect}
            onRemoveRecentlyViewed={onRemoveRecentlyViewed}
          />
        </div>
      )}
    </div>
  );
}
