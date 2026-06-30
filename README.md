# Discover — Product Discovery Search

A product discovery experience for browsing and searching ~4,000 home goods. This is a search UX take-home — not an ecommerce store. There is no cart, checkout, or product detail page. The goal is to help someone find the right product quickly and understand *why* results appear.

## What I Built

**Homepage** — promotional carousel, recommended/new-arrival product grids, and a dense “more to explore” section to support browsing without typing.

**Header & search** — Amazon-style layout with a department dropdown beside the search bar, curated collection shortcuts (Best Sellers, New Arrivals, Trending, etc.), and a search dropdown with recently viewed thumbnails, recent searches (with per-item remove), and popular query chips.

**Search & results** — instant fuzzy search across title, category, tags, brand, and description. Results show match highlighting and a “Why it matched” breakdown. Filters (category, brand, tags/materials, stock, price) compose with search in real time. Sort options include best match, price, alphabetical, and newest.

**Persistence** — recent searches and recently viewed products stored in `localStorage`.

**Stack** — Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui, Fuse.js. No backend; data loads from `data/items.json`.

## Run locally

```bash
npm install
npm run dev:clean
```

Open [http://localhost:3000](http://localhost:3000).

If the page is blank, the dev cache likely corrupted — run `npm run dev:clean` again.

## Deploy to Vercel

Import the repo and deploy with default settings (Framework: **Next.js**). The app lives at the repository root.

---

## Decisions & Why

### Client-side Fuse.js instead of a search API

With ~4,000 items, a client-side index is fast enough (<50ms) and keeps the project self-contained — no server, no API keys, no deployment complexity. Fuse.js gives fuzzy matching, field weighting, and match metadata out of the box. That metadata powers both substring highlighting and the “Why it matched” labels, which would be harder to replicate with a simple `includes()` filter.

Field weights reflect discovery intent: title matters most, then category and tags, then brand, then description.

### Debounced + deferred search

Running Fuse across 4,000 products and re-rendering the full results grid on every keystroke made typing feel laggy. Search is debounced (~120ms) and deferred so the input stays responsive while results update shortly after. Skeleton cards show during the brief pending state instead of flashing unrelated products.

### Tags as “materials”

The dataset has no `material` field. Tags contain values like `linen`, `walnut`, `oak`, and `handwoven`, so the filter sidebar surfaces the most common material-like tags rather than inventing a field that doesn’t exist.

### Two navigation layers: departments vs. collections

The **department dropdown** next to search scopes queries to a category (Bath, Furniture, Kitchen, etc.) — useful when the user knows *where* to look.

The **subheader collections** (Best Sellers, Under $100, Walnut, etc.) are curated discovery paths — useful when the user is browsing by intent, not taxonomy. These use scoring rules over the dataset (e.g. best sellers by rating × review volume, sustainable by natural-material keywords).

Keeping both mirrors how real retailers separate “shop by room” from “shop by story.”

### Search explainability as a differentiator

Most product search UIs are a black box. Surfacing which field matched (and highlighting the substring) helps users refine queries when results feel wrong — especially important for fuzzy search where typos and partial matches are intentional.

### Graceful handling of missing data

~164 products have no price, ~183 have no image, and some image URLs point to a dead host (`cdn.catalog.example`). Prices render as “Price unavailable,” missing images show a placeholder, and broken URLs fall back to picsum placeholders — the UI never assumes complete data.

### Homepage before search

The assignment is about discovery, not just search. The homepage gives entry points for users who aren’t sure what to type: editorial ads, social-proof grids, and a dense explore section. Search and filters take over once the user has intent.

### No product detail page

Scope is findability, not conversion. Clicking a product fills the search bar and scopes to its department so the user stays in the discovery flow rather than navigating away to a PDP.

---

## Tradeoffs

| Decision | Why |
|----------|-----|
| Client-side search | Right-sized for 4k items; zero infra |
| No URL state for filters/query | Faster to ship; would add shareable links next |
| Curated collections over ML | Deterministic rules are debuggable and sufficient for a take-home |
| Light mode only | Keeps visual system simple and consistent |
| Memoized cards, no grid animations | Animating hundreds of cards on every keystroke killed performance |

## What I’d Build Next

1. URL state for shareable search + filter links
2. Faceted counts next to filter options (“Furniture (124)”)
3. Query autocomplete from title/category/tag prefixes
4. Search analytics — zero-result queries, popular terms
5. Product detail drawer for quick preview without leaving results

## Project Structure

```
app/                  # Next.js App Router
components/           # UI (Header, SearchBar, ProductGrid, Homepage, etc.)
  ui/                 # shadcn primitives
hooks/                # useDiscovery, useRecentlyViewed, useDebouncedValue
lib/                  # search, filters, products, collections, homepage
types/                # Product, FilterState, SearchResult
data/                 # items.json (~4,000 products)
public/ads/           # Homepage carousel creatives
```

## License

MIT
