import { Check } from "lucide-react";
import type { FieldMatch } from "@/types/product";

interface WhyMatchedProps {
  matches: FieldMatch[];
  compact?: boolean;
}

export function WhyMatched({ matches, compact = false }: WhyMatchedProps) {
  if (!matches.length) return null;

  return (
    <div
      className={compact ? "space-y-1" : "space-y-1.5"}
      aria-label="Why this product matched"
    >
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Why it matched
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {matches.map((match) => (
          <li
            key={match.field}
            className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground"
          >
            <Check className="h-3 w-3 text-emerald-600" aria-hidden />
            {match.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
