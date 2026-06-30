# Discover — Product Discovery Search

A production-quality product discovery experience built as a take-home assignment. The focus is on **search UX and product decisions**, not ecommerce checkout flows.

Browse and search ~4,000 home goods products entirely client-side from a static JSON dataset.

## Live Demo

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Radix primitives) |
| Search | Fuse.js |
| Animation | Framer Motion (subtle) |
| Icons | Lucide React |

No backend. All data loads from `data/items.json`.

## Dataset

After inspecting the source data, these fields drive the experience:

| Field | Usage |
|-------|-------|
| `title` | Primary search target (highest weight) |
| `category` | Search + filter (10 categories) |
| `tags` | Search + filter — acts as materials/attributes (no dedicated `material` field) |
| `brand` | Search + filter (16 brands) |
| `description` | Search + match highlighting |
| `price` | Filter + sort (164 items missing price — handled gracefully) |
| `inStock` | Availability filter |
| `releasedAt` | "Newest" sort |
| `rating`, `reviews` | Card metadata |
| `image` | Lazy-loaded product images (183 missing — placeholder shown) |

Missing values are normalized at load time rather than assumed away.

## Search Architecture

```
User types → Fuse.js fuzzy index → weighted multi-field matches
                ↓
         Filter pipeline (category, brand, tags, stock, price)
                ↓
              Sort (best match / price / alpha / newest)
                ↓
         Results with match explainability + highlighting
```

### Fuse.js Configuration

Fuse.js was chosen because:

- **Client-side** — no server required for 4k items; search feels instant
- **Fuzzy matching** — typo tolerance and partial word matching out of the box
- **Match metadata** — `includeMatches` powers "Why it matched" and text highlighting
- **Weighted fields** — reflects product discovery intent (title > category > tags > brand > description)

```ts
threshold: 0.38    // balanced typo tolerance
ignoreLocation: true  // match anywhere in field
keys: title (0.35), category (0.2), tags (0.2), brand (0.15), description (0.1)
```

### Performance

- Fuse index built once and memoized
- `useMemo` for search, filter, and sort pipelines
- 4,000 items search in <50ms on typical hardware — virtualization not needed

## UX Decisions

### Search-first layout
Large centered hero search with popular chips and recent searches (localStorage). No submit button — results update on every keystroke.

### Keyboard shortcuts
- `/` — focus search from anywhere
- `Esc` — clear search and blur

### Match explainability
Every search result shows **why it matched** (Product Name, Category, Tags, etc.) using Fuse.js match metadata. This reduces the "black box" feeling of search.

### Highlighting
Matching substrings in titles and descriptions are subtly highlighted — enough to scan, not enough to distract.

### Auto-generated filters
Filters are derived from the dataset at runtime:
- Category, Brand (checkboxes)
- Tags & Materials (top material-like tags from the `tags` field)
- Availability (segmented control)
- Price range (dual-thumb slider from actual min/max)

No "Apply" button — filters compose instantly with search.

### Empty states
Instead of a bare "No results", users see actionable suggestions, suggested searches, and a clear-filters action when relevant.

### Responsive
- **Desktop** — sticky filter sidebar, 4-column grid
- **Tablet** — 2–3 columns
- **Mobile** — filter drawer, sticky toolbar, secondary search bar

## Tradeoffs

| Decision | Rationale |
|----------|-----------|
| Client-side Fuse.js vs server search | Assignment scope; 4k items is well within client performance |
| Tags as "materials" | Dataset has no `material` field — tags contain linen, velvet, oak, etc. |
| No product detail page | Scope is discovery, not ecommerce |
| Static JSON import | Simplest data loading; enables build-time bundling |
| Subtle animations only | Motion supports hierarchy, not decoration |

## What Would Be Built Next

1. **Search analytics** — track zero-result queries, popular terms, filter usage
2. **Query suggestions** — autocomplete from title/category/tag prefixes
3. **Faceted result counts** — show "(24)" next to each filter option
4. **URL state** — shareable search + filter links (`?q=linen&category=Textiles`)
5. **Product detail drawer** — quick preview without leaving search context
6. **Image fallbacks** — generated placeholders by category

## Future Scalability

For production at scale, migrate to a dedicated search engine:

| Service | When |
|---------|------|
| **Algolia** | Managed, great DX, instant faceting — best for <1M records with budget |
| **Typesense** | Open-source Algolia alternative, self-hostable |
| **Elasticsearch** | Large catalogs, complex aggregations, existing infra |

The current architecture maps cleanly: Fuse field weights → index field boosts, filter sidebar → facets, match metadata → highlighting snippets. The UI layer would remain largely unchanged.

## Project Structure

```
app/                  # Next.js App Router
components/           # UI components
  ui/                 # shadcn primitives
hooks/                # useDiscovery, recent searches
lib/                  # search, filters, products, utils
types/                # Product, FilterState, SearchResult
data/                 # items.json
```

## License

MIT
