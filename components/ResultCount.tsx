interface ResultCountProps {
  count: number;
  query: string;
  isLoading?: boolean;
}

export function ResultCount({ count, query, isLoading }: ResultCountProps) {
  const label = count === 1 ? "product" : "products";

  return (
    <p
      className="text-sm text-muted-foreground"
      aria-live="polite"
      aria-atomic="true"
    >
      {isLoading ? (
        "Searching..."
      ) : query ? (
        <>
          <span className="font-medium text-foreground">{count.toLocaleString()}</span>{" "}
          {label} for &ldquo;{query}&rdquo;
        </>
      ) : (
        <>
          <span className="font-medium text-foreground">{count.toLocaleString()}</span>{" "}
          {label}
        </>
      )}
    </p>
  );
}
