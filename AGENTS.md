# Agent Instructions

## Project Overview

This is a **dashboard-only** project for discovering and comparing free coding LLM models. The project uses a monorepo architecture with pnpm workspaces.

**Current Stats:**
- **132 models** from **10 providers**
- Providers: NVIDIA NIM, Groq, Cerebras, SambaNova, OpenRouter, Codestral, Google AI, Mistral AI, Fireworks AI, Hyperbolic

## Architecture

```
modelsfree/
├── packages/
│   ├── types/              # TypeScript types & Zod schemas
│   ├── core/               # Pure business logic (metrics, sorting, filtering)
│   └── providers/          # Provider definitions & model data
└── apps/
    └── dashboard/          # Next.js web dashboard
```

### Package Dependencies

```
@modelsfree/types     ← (no dependencies)
        ↓
@modelsfree/core      ← depends on @modelsfree/types
        ↓
@modelsfree/providers ← depends on @modelsfree/types, @modelsfree/core
        ↓
@modelsfree/dashboard ← depends on all packages
```

## Development Workflow

### Starting the Dashboard

```bash
# Install dependencies
pnpm install

# Start development server (port 3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Testing & Quality

```bash
# Build all packages (required before testing)
pnpm build

# Type check
pnpm lint
```

## Post-Feature Testing

After completing any feature or fix, the agent MUST:

1. Run `pnpm build` to verify all packages compile
2. Run `pnpm dev` to verify the dashboard starts without errors
3. Test the feature in the browser at `http://localhost:3000`
4. Only then consider the task complete

## Packages

| Package | Description |
|---------|-------------|
| `@modelsfree/types` | TypeScript types, Zod schemas, tier/verdict definitions |
| `@modelsfree/core` | Pure business logic: metrics, sorting, filtering, ping logic |
| `@modelsfree/providers` | Provider configurations, model data (132 models), API metadata |

## Dashboard Stack

- **Next.js 15** — App Router
- **TypeScript** — Strict typing
- **Tailwind CSS** — Styling with dark/light theme support
- **shadcn/ui** — UI components
- **TanStack Query** — Data fetching
- **Zod** — Runtime validation
- **next-themes** — Theme management

## Dashboard Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Stats, top models, tier distribution |
| Explorer | `/explorer` | Browse all models with filters |
| Compare | `/compare` | Side-by-side model comparison |
| Settings | `/settings` | API key configuration and testing |

## Tier System

Models are ranked by coding performance:

| Tier | Description | Color |
|------|-------------|-------|
| S+ | Elite frontier | green-600 |
| S | Excellent | green-500 |
| A+ | Great | lime-500 |
| A | Good | yellow-600 |
| A- | Above average | orange-600 |
| B+ | Average | red-500 |
| B | Below average | red-600 |
| B- | Poor | red-700 |
| C+ | Very poor | red-800 |
| C | Minimal | red-900 |
| D | Not recommended | red-950 |

## Environment Variables

The dashboard requires API keys stored in `apps/dashboard/.env.local`:

```bash
NVIDIA_API_KEY=...
OPENROUTER_API_KEY=...
GROQ_API_KEY=...
CEREBRAS_API_KEY=...
SAMBANOVA_API_KEY=...
CODESTRAL_API_KEY=...
GOOGLE_API_KEY=...
MISTRAL_API_KEY=...
FIREWORKS_API_KEY=...
HYPERBOLIC_API_KEY=...
```

Copy `.env.example` to `.env.local` and fill in your keys.

## Changelog (MANDATORY)

**⚠️ CRITICAL:** After every dev session (feature, fix, refactor), add a succinct entry to `CHANGELOG.md` BEFORE pushing:

- Use the current version from `package.json`
- Add under the matching version header (or create a new one if the version was bumped)
- List changes under `### Added`, `### Fixed`, or `### Changed` as appropriate
- Keep entries short — one line per change is enough
- Include ALL changes made during the session
- Update CHANGELOG.md BEFORE committing and pushing

## Key Files

| File | Purpose |
|------|---------|
| `packages/types/src/index.ts` | All TypeScript types and Zod schemas |
| `packages/core/src/index.ts` | Business logic functions |
| `packages/core/src/data-service.ts` | Data fetching and normalization |
| `packages/providers/src/index.ts` | Model data and provider configs |
| `apps/dashboard/src/app/layout.tsx` | Root layout with theme provider |
| `apps/dashboard/src/app/page.tsx` | Home page |
| `apps/dashboard/src/app/explorer/page.tsx` | Model explorer |
| `apps/dashboard/src/app/compare/page.tsx` | Model comparison |
| `apps/dashboard/src/app/settings/page.tsx` | API key settings |
| `apps/dashboard/src/app/api/ping/route.ts` | Ping endpoint for testing API keys |
