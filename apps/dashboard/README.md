# @modelsfree/dashboard

Modern web dashboard for exploring and comparing free coding LLM models.

## Tech Stack

- **Next.js 15** - App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **TanStack Query** - Data fetching and caching
- **Zod** - Runtime validation

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Pages

### Home (`/`)

- Total models count
- Provider grid with model counts
- Top tier models table
- Tier distribution chart
- Quick stats (avg SWE score, top tier count)

### Explorer (`/explorer`)

- Full model list with search
- Filter by tier
- Filter by provider
- Sort by name, tier, SWE score, context
- Responsive table view

### Compare (`/compare`)

- Side-by-side model comparison
- Select models from dropdown
- Compare all key metrics

## Data Layer

The dashboard uses TanStack Query for data fetching with built-in caching:

```typescript
import { useModels, useModelStats, useFilteredModels } from '@/lib/hooks'

// Get all models
const { data: models, isLoading } = useModels()

// Get statistics
const { data: stats } = useModelStats()

// Get filtered models
const { data } = useFilteredModels(
  { search: 'claude', tier: 'S' },
  { sortBy: 'tier', sortDir: 'asc' }
)
```

## Theme

Dark mode is enabled by default with system preference detection:

```typescript
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()
// theme: 'dark' | 'light' | 'system'
```

## Project Structure

```
apps/dashboard/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with providers
│   │   ├── page.tsx        # Home page
│   │   ├── explorer/       # Explorer page
│   │   └── compare/        # Compare page
│   ├── components/
│   │   └── theme-provider.tsx
│   └── lib/
│       ├── hooks.ts        # TanStack Query hooks
│       └── query-provider.tsx
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Environment Variables

No environment variables required for static data. The dashboard uses bundled model data from `@modelsfree/providers`.

## Deployment

The dashboard can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **Docker**
- **Self-hosted**

```bash
# Build for production
pnpm build

# Export as static site (optional)
# Add `output: 'export'` to next.config.js
```

## License

MIT
