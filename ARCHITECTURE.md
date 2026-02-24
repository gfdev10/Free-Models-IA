# Architecture Overview

## Project Structure

```
modelsfree/
├── packages/
│   ├── types/              # TypeScript types & Zod schemas
│   │   ├── src/
│   │   │   └── index.ts    # All types, schemas, constants
│   │   └── package.json
│   │
│   ├── core/               # Pure business logic
│   │   ├── src/
│   │   │   ├── index.ts        # Main exports, sorting, filtering
│   │   │   └── data-service.ts # Data fetching, normalization
│   │   └── package.json
│   │
│   └── providers/          # Provider definitions & model data
│       ├── src/
│       │   └── index.ts    # MODELS array, providers config
│       └── package.json
│
└── apps/
    └── dashboard/          # Next.js web dashboard
        ├── src/
        │   ├── app/
        │   │   ├── layout.tsx       # Root layout
        │   │   ├── page.tsx         # Home page
        │   │   ├── explorer/        # Model explorer
        │   │   ├── compare/         # Model comparison
        │   │   ├── settings/        # API key management
        │   │   └── api/             # API routes
        │   ├── components/          # React components
        │   └── lib/                 # Utilities, hooks
        └── package.json
```

## Package Dependencies

```
@modelsfree/types     ← (no dependencies)
        ↓
@modelsfree/core      ← depends on @modelsfree/types
        ↓
@modelsfree/providers ← depends on @modelsfree/types, @modelsfree/core
        ↓
@modelsfree/dashboard ← depends on all packages
```

## Key Design Decisions

### 1. Monorepo Architecture

**Why monorepo?**
- Shared types and logic between packages
- Single source of truth for model data
- Easier to maintain and test
- Better developer experience

**Why pnpm workspaces?**
- Efficient disk space usage (symlinks)
- Fast installs
- Strict dependency resolution
- Good monorepo support

### 2. Package Separation

**@modelsfree/types**
- Zero dependencies (except Zod)
- Contains all TypeScript types and Zod schemas
- Defines tier system, verdicts, provider keys
- Can be used by any package without circular dependencies

**@modelsfree/core**
- Pure business logic (no Node.js specifics)
- Sorting, filtering, metrics calculations
- Ping logic with injectable fetcher
- Re-export types for convenience

**@modelsfree/providers**
- Model data as simple tuples (performance)
- Provider configurations and metadata
- API endpoint definitions
- Free tier limits

**@modelsfree/dashboard**
- Next.js App Router
- Server components where possible
- Client components for interactivity
- API routes for ping testing

### 3. Data Model

**Model Tuple Format:**
```typescript
type ModelTuple = [
  string,    // modelId - unique identifier
  string,    // label - display name
  Tier,      // tier - S+, S, A+, A, A-, B+, B, B-, C+, C, D
  string,    // sweScore - SWE-bench score
  string,    // ctx - context window
  ProviderKey // provider - which provider offers this model
]
```

**Why tuples?**
- Memory efficient (no object overhead)
- Fast iteration and filtering
- Easy to serialize/deserialize
- Compatible with CLI origins

### 4. Tier System

Models are ranked by coding performance using SWE-bench and other benchmarks:

| Tier | Description | Criteria |
|------|-------------|----------|
| S+ | Elite frontier | Top 1% performers |
| S | Excellent | Top 5% performers |
| A+ | Great | Top 10% performers |
| A | Good | Top 20% performers |
| A- | Above average | Top 30% performers |
| B+ | Average | Top 50% performers |
| B | Below average | Top 70% performers |
| B- | Poor | Top 85% performers |
| C+ | Very poor | Top 95% performers |
| C | Minimal | Functional but limited |
| D | Not recommended | Significant limitations |

### 5. Theme System

- Uses `next-themes` for theme management
- Dark mode by default
- System preference detection
- CSS variables for colors (Tailwind)
- No flash on page load

### 6. API Key Management

- Keys stored in `.env.local` (gitignored)
- `.env.example` provided as template
- Keys tested via `/api/ping` endpoint
- Per-provider status display

## Future Scalability

### Potential Additions

1. **Public API**
   - Add `apps/api` with REST/GraphQL
   - Rate limiting, authentication
   - Use existing core logic

2. **Database**
   - Add `packages/db` with Prisma
   - Store user preferences, favorites
   - Cache model data

3. **CLI Tool**
   - Add `apps/cli` using core package
   - Same logic as dashboard
   - Terminal-based interface

4. **Browser Extension**
   - Add `apps/extension`
   - Quick model lookup
   - Use types and core packages

5. **Mobile App**
   - Add `apps/mobile` with React Native
   - Reuse types and core logic
   - Share provider data

### SaaS Evolution

**Phase 1: Free Dashboard (Current)**
- Model discovery and comparison
- API key testing
- Community resource

**Phase 2: User Accounts**
- Save favorites
- Custom model lists
- Usage analytics

**Phase 3: Premium Features**
- Advanced benchmarks
- Custom comparisons
- API access

**Phase 4: Enterprise**
- Team management
- Custom model hosting
- SLA guarantees

## Performance Considerations

1. **Static Generation**
   - Home, Explorer, Compare pages are static
   - No database queries at runtime
   - Fast page loads

2. **Bundle Size**
   - Tree-shaking enabled
   - Minimal client-side JS
   - Lazy loading where possible

3. **Caching**
   - Model data cached in memory
   - API responses cached
   - Static assets with long cache headers

## Security

1. **API Keys**
   - Never committed to git
   - Stored in `.env.local`
   - Only used server-side

2. **No Backend Database**
   - No user data to protect
   - No authentication required
   - Simple deployment

3. **Content Security**
   - No user-generated content
   - No XSS vectors
   - Static content only
