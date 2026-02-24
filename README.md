<p align="center">
  <img src="https://img.shields.io/badge/models-132-76b900?logo=nvidia" alt="models count">
  <img src="https://img.shields.io/badge/providers-10-blue" alt="providers count">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/npm/l/modelsfree?color=76b900" alt="license">
</p>

<h1 align="center">ModelsFree</h1>

<p align="center">
  <strong>Dashboard for discovering and comparing free coding LLM models</strong><br>
  <sub>Explore 132 models from 10 providers — NVIDIA NIM, Groq, Cerebras, SambaNova, OpenRouter, Codestral, Google AI, Mistral AI, Fireworks AI, and Hyperbolic</sub>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-providers">Providers</a> •
  <a href="#-api-keys">API Keys</a>
</p>

---

## ✨ Features

### Dashboard
- **📊 Model Explorer** — Browse all 132 models with search and filters
- **📈 Statistics** — View tier distribution and provider metrics
- **⚖️ Model Comparison** — Compare models side-by-side
- **🔑 API Key Management** — Configure and test provider keys
- **🌙 Dark/Light Theme** — Toggle between themes
- **📱 Responsive Design** — Works on desktop and mobile

### Data
- **🎯 Coding-focused** — Only LLM models optimized for code generation
- **🌐 Multi-provider** — 10 providers with free tiers or credits
- **🏷 Tier System** — Models ranked S+, S, A+, A, A-, B+, B, B-, C+, C, D
- **📏 Context Windows** — From 4K to 10M tokens
- **🆓 Free Limits** — Clear info on free tier limits per model

---

## 🏗️ Architecture

This project uses a **modular monorepo architecture** with pnpm workspaces:

```
modelsfree/
├── packages/
│   ├── types/              # TypeScript types & Zod schemas
│   ├── core/               # Pure business logic
│   └── providers/          # Provider definitions & model data
└── apps/
    └── dashboard/          # Next.js web dashboard
```

### Packages

| Package | Description |
|---------|-------------|
| `@modelsfree/types` | TypeScript types and Zod schemas for runtime validation |
| `@modelsfree/core` | Pure business logic: metrics, sorting, filtering |
| `@modelsfree/providers` | Provider configurations and model data (132 models) |

### Dashboard Stack

- **Next.js 15** — App Router
- **TypeScript** — Strict typing
- **Tailwind CSS** — Styling
- **shadcn/ui** — UI components
- **TanStack Query** — Data fetching
- **Zod** — Runtime validation

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/gfdev10/Free-Models-IA.git
cd Free-Models-IA

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The dashboard will be available at `http://localhost:3000`

### Build for Production

```bash
pnpm build
pnpm start
```

---

## 🌐 Providers

| Provider | Models | Free Tier | API Key |
|----------|--------|-----------|---------|
| **NVIDIA NIM** | 44 | Free API, rate limits | [Get Key](https://build.nvidia.com) |
| **Groq** | 11 | Free tier, fast inference | [Get Key](https://console.groq.com/keys) |
| **Cerebras** | 4 | Free credits | [Get Key](https://cloud.cerebras.ai) |
| **SambaNova** | 12 | $5 free trial | [Get Key](https://cloud.sambanova.ai/apis) |
| **OpenRouter** | 26 | 50 free req/day | [Get Key](https://openrouter.ai/settings/keys) |
| **Codestral** | 1 | 30 req/min | [Get Key](https://codestral.mistral.ai) |
| **Google AI** | 6 | 14.4K req/day | [Get Key](https://aistudio.google.com/apikey) |
| **Mistral AI** | 8 | Free tier available | [Get Key](https://console.mistral.ai) |
| **Fireworks AI** | 7 | $6 free credit | [Get Key](https://fireworks.ai/api-keys) |
| **Hyperbolic** | 13 | $1 free credit | [Get Key](https://app.hyperbolic.xyz/settings) |

---

## 🔑 API Keys

API keys are stored locally in `.env.local` and are never sent to any server except the respective provider APIs.

### Setting Up Keys

1. Open the dashboard at `http://localhost:3000`
2. Go to **Settings**
3. Click **Add** next to a provider
4. Paste your API key
5. Click **Test All Keys** to verify

### Environment Variables

Create a `.env.local` file in `apps/dashboard/`:

```env
NVIDIA_API_KEY=nvapi-xxx
GROQ_API_KEY=gsk_xxx
CEREBRAS_API_KEY=csk-xxx
SAMBANOVA_API_KEY=xxx
OPENROUTER_API_KEY=sk-or-xxx
CODESTRAL_API_KEY=xxx
GOOGLE_API_KEY=AIzaxxx
MISTRAL_API_KEY=xxx
FIREWORKS_API_KEY=fw_xxx
HYPERBOLIC_API_KEY=sk_live_xxx
```

---

## 📊 Model Tiers

Models are ranked by SWE-bench Verified score:

| Tier | Score Range | Description |
|------|-------------|-------------|
| **S+** | ≥70% | Elite frontier coders |
| **S** | 60-70% | Top-tier models |
| **A+** | 50-60% | Excellent performance |
| **A** | 40-50% | Great for most tasks |
| **A-** | 35-40% | Good performance |
| **B+** | 30-35% | Solid coding ability |
| **B** | 20-30% | Adequate for simple tasks |
| **B-** | 15-20% | Basic coding |
| **C+** | 10-15% | Limited capability |
| **C** | 5-10% | Minimal coding |
| **D** | <5% | Not recommended |

---

## 📁 Project Structure

```
modelsfree/
├── packages/
│   ├── types/
│   │   ├── src/
│   │   │   └── index.ts      # All TypeScript types & Zod schemas
│   │   └── package.json
│   ├── core/
│   │   ├── src/
│   │   │   └── index.ts      # Business logic (sorting, filtering, metrics)
│   │   └── package.json
│   └── providers/
│       ├── src/
│       │   └── index.ts      # Provider configs & model definitions
│       └── package.json
├── apps/
│   └── dashboard/
│       ├── src/
│       │   ├── app/          # Next.js App Router pages
│       │   ├── components/   # React components
│       │   └── lib/          # Utilities
│       ├── public/
│       └── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
└── package.json
```

---

## 🛠️ Development

### Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build all packages and dashboard
pnpm build

# Run tests
pnpm test

# Type check
pnpm lint
```

### Adding a New Provider

1. Add provider key to `packages/types/src/index.ts`:
```typescript
export const ProviderKeySchema = z.enum([
  'nvidia', 'groq', ..., 'newprovider'
])
```

2. Add provider config to `packages/providers/src/index.ts`:
```typescript
export const newproviderModels: ModelTuple[] = [
  ['model-id', 'Model Name', 'A', '45.0%', '128k'],
]
```

3. Update dashboard settings page with new API key field

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<p align="center">
  Made with ❤️ by <a href="https://gfdev.vercel.app">gfdev</a>
</p>
