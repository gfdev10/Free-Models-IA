# @modelsfree/providers

Provider definitions and model data for ModelsFree. This package contains all supported API providers and their available models.

## Installation

```bash
pnpm add @modelsfree/providers
```

## Usage

```typescript
import {
  // All models as flat array
  MODELS,
  
  # Models grouped by provider
  sources,
  
  // Provider configurations
  providers,
  
  // Individual provider model arrays
  nvidiaNim,
  groqModels,
  cerebrasModels,
  sambanovaModels,
  openrouterModels,
  codestralModels,
  scalewayModels,
  googleaiModels,
} from '@modelsfree/providers'
```

## Data Structures

### MODELS

Flat array of all models with provider key.

```typescript
// [modelId, label, tier, sweScore, ctx, providerKey]
MODELS[0]  // ['meta/llama-3.1-8b-instruct', 'Llama 3.1 8B', 'A-', '35.0%', '128k', 'nvidia']
```

### sources

Map of provider sources (backward compatible with original `sources.js`).

```typescript
sources.nvidia  // { key: 'nvidia', name: 'NVIDIA NIM', url: '...', models: [...] }
```

### providers

Provider configurations map.

```typescript
providers.nvidia
// {
//   key: 'nvidia',
//   name: 'NVIDIA NIM',
//   url: 'https://build.nvidia.com/explore/discover/models',
//   envVarName: 'NVIDIA_API_KEY',
//   keyPrefix: 'nvapi-'
// }
```

## Supported Providers

| Provider | Key | Env Variable | Key Prefix |
|----------|-----|--------------|------------|
| NVIDIA NIM | `nvidia` | `NVIDIA_API_KEY` | `nvapi-` |
| Groq | `groq` | `GROQ_API_KEY` | `gsk_` |
| Cerebras | `cerebras` | `CEREBRAS_API_KEY` | - |
| SambaNova | `sambanova` | `SAMBANOVA_API_KEY` | - |
| OpenRouter | `openrouter` | `OPENROUTER_API_KEY` | `sk-or-` |
| Codestral | `codestral` | `CODESTRAL_API_KEY` | - |
| Scaleway | `scaleway` | `SCALEWAY_API_KEY` | - |
| Google AI | `googleai` | `GOOGLE_API_KEY` | - |

## Model Data Format

Each model is a 6-element tuple:

```typescript
type ModelTupleWithProvider = [
  string,  // modelId - API model identifier
  string,  // label - Display name
  Tier,    // tier - Quality tier (S+, S, A+, A, A-, B+, B, C)
  string,  // sweScore - SWE-bench score (e.g., "73.1%")
  string,  // ctx - Context window (e.g., "128k", "1m")
  ProviderKey,  // providerKey - Provider identifier
]
```

## Example: Get Models by Provider

```typescript
import { MODELS, providers } from '@modelsfree/providers'

// Filter by provider
const nvidiaModels = MODELS.filter(([, , , , , pk]) => pk === 'nvidia')

// Count models per provider
const counts = Object.keys(providers).reduce((acc, key) => {
  acc[key] = MODELS.filter(([, , , , , pk]) => pk === key).length
  return acc
}, {} as Record<string, number>)
```

## Example: Get Top Tier Models

```typescript
import { MODELS } from '@modelsfree/providers'

const topModels = MODELS.filter(([, , tier]) => tier === 'S+' || tier === 'S')
```

## Example: Search Models

```typescript
import { MODELS } from '@modelsfree/providers'

const search = (query: string) => {
  const q = query.toLowerCase()
  return MODELS.filter(([id, label]) => 
    id.toLowerCase().includes(q) || 
    label.toLowerCase().includes(q)
  )
}
```

## Updating Model Data

Model data is maintained in individual provider arrays within `src/index.ts`. To add or update models:

1. Find the appropriate provider array (e.g., `nvidiaNim`)
2. Add or update the model tuple
3. Ensure the tier is correct based on SWE-bench scores
4. Run tests to verify data integrity

## License

MIT
