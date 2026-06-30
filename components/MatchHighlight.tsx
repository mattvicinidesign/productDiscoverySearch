import { cn } from "@/lib/utils";

interface MatchHighlightProps {
  text: string;
  indices: readonly [number, number][];
  className?: string;
}

export function MatchHighlight({
  text,
  indices,
  className,
}: MatchHighlightProps) {
  if (!indices.length) {
    return <span className={className}>{text}</span>;
  }

  const sorted = [...indices].sort((a, b) => a[0] - b[0]);
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  sorted.forEach(([start, end], i) => {
    if (start > cursor) {
      parts.push(
        <span key={`t-${i}`}>{text.slice(cursor, start)}</span>
      );
    }
    parts.push(
      <mark
        key={`m-${i}`}
        className="rounded-sm bg-amber-100/80 px-0.5 text-inherit"
      >
        {text.slice(start, end + 1)}
      </mark>
    );
    cursor = end + 1;
  });

  if (cursor < text.length) {
    parts.push(<span key="tail">{text.slice(cursor)}</span>);
  }

  return <span className={cn(className)}>{parts}</span>;
}
