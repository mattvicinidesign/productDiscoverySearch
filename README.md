# Discover — Product Discovery Search

A production-quality product discovery experience built as a take-home assignment. The focus is on **search UX and product decisions**, not ecommerce checkout flows.

Browse and search ~4,000 home goods products entirely client-side from a static JSON dataset.

## Run locally

```bash
npm install
npm run dev:clean
```

Open [http://localhost:3000](http://localhost:3000).

If the page is blank, the dev cache likely corrupted — run `npm run dev:clean` again.

## Deploy to Vercel

Import the GitHub repo and deploy with default settings (Framework: **Next.js**). No root directory override needed — the app lives at the repository root.

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
- Debounced + deferred search so typing stays responsive
- 4,000 items search in <50ms on typical hardware

## UX Decisions

### Search-first layout
Amazon-style header with department dropdown, search suggestions (recent searches + recently viewed), and curated collection filters.

### Keyboard shortcuts
- `/` — focus search from anywhere
- `Esc` — clear search and blur

### Match explainability
Every search result shows **why it matched** (Product Name, Category, Tags, etc.) using Fuse.js match metadata.

### Highlighting
Matching substrings in titles and descriptions are subtly highlighted.

### Auto-generated filters
Filters are derived from the dataset at runtime — no "Apply" button.

### Responsive
- **Desktop** — sticky filter sidebar, 4-column grid
- **Tablet** — 2–3 columns
- **Mobile** — filter drawer

## Project Structure

```
app/                  # Next.js App Router
components/           # UI components
  ui/                 # shadcn primitives
hooks/                # useDiscovery, recent searches
lib/                  # search, filters, products, collections
types/                # Product, FilterState, SearchResult
data/                 # items.json
public/ads/           # Homepage carousel creatives
```

## License

MIT
