# @modelsfree/types

TypeScript types and Zod schemas for ModelsFree.

## Installation

```bash
pnpm add @modelsfree/types
```

## Usage

```typescript
import {
  // Tier system
  Tier,
  TierSchema,
  TIER_ORDER,
  TIER_LETTER_MAP,
  
  // Providers
  ProviderKey,
  ProviderConfig,
  
  // Models
  Model,
  ModelTuple,
  
  // Results
  PingResult,
  ModelResult,
  Verdict,
  
  // Validation
  parseSweScore,
  parseCtx,
  normalizeModel,
} from '@modelsfree/types'
```

## Types

### Tier

Model quality tier based on SWE-bench Verified scores.

```typescript
type Tier = 'S+' | 'S' | 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'C'
```

- **S+**: Elite (73%+ SWE-bench)
- **S**: Excellent (65-72%)
- **A+**: Great (55-64%)
- **A**: Good (45-54%)
- **A-**: Good (35-44%)
- **B+**: Decent (25-34%)
- **B**: Basic (15-24%)
- **C**: Entry (<15%)

### ProviderKey

Supported API providers.

```typescript
type ProviderKey =
  | 'nvidia'
  | 'groq'
  | 'cerebras'
  | 'sambanova'
  | 'openrouter'
  | 'codestral'
  | 'hyperbolic'
  | 'scaleway'
  | 'googleai'
```

### Model

Normalized model object.

```typescript
interface Model {
  id: string          // Model identifier
  label: string       // Display name
  tier: Tier          // Quality tier
  sweScore: number    // SWE-bench score (0-100)
  ctx: number         // Context window in thousands
  ctxRaw: string      // Original context string
  providerKey: ProviderKey
}
```

### ModelTuple

Legacy tuple format for backward compatibility.

```typescript
type ModelTuple = [string, string, Tier, string, string]
// [modelId, label, tier, sweScore, ctx]
```

### PingResult

Single ping measurement.

```typescript
interface PingResult {
  ms: number | 'TIMEOUT'
  code: string  // HTTP status code
}
```

### Verdict

Model health verdict.

```typescript
type Verdict =
  | 'Perfect'     // <400ms avg
  | 'Normal'      // 400-999ms
  | 'Slow'        // 1000-2999ms
  | 'Very Slow'   // 3000-4999ms
  | 'Overloaded'  // HTTP 429
  | 'Unstable'    // Timeout with prior success
  | 'Not Active'  // Timeout without prior success
  | 'Pending'     // No successful pings yet
```

## Validation

All types include Zod schemas for runtime validation:

```typescript
import { TierSchema, ModelSchema, PingResultSchema } from '@modelsfree/types'

// Parse and validate
const tier = TierSchema.parse('S+')  // 'S+'
const model = ModelSchema.parse(data)

// Safe parse (returns result object)
const result = TierSchema.safeParse('X')
if (!result.success) {
  console.log(result.error.errors)
}
```

## Utility Functions

### parseSweScore(score: string): number

Parse SWE-bench score string to number.

```typescript
parseSweScore('73.1%')  // 73.1
parseSweScore('N/A')    // 0
```

### parseCtx(ctx: string): number

Parse context window string to thousands of tokens.

```typescript
parseCtx('128k')  // 128
parseCtx('1m')    // 1000
parseCtx('2000')  // 2
```

### normalizeModel(tuple, providerKey): Model

Convert legacy tuple to normalized Model object.

```typescript
normalizeModel(['model-id', 'Label', 'S', '73.1%', '128k'], 'nvidia')
// { id: 'model-id', label: 'Label', tier: 'S', sweScore: 73.1, ctx: 128, ctxRaw: '128k', providerKey: 'nvidia' }
```

## Provider Metadata

```typescript
import { PROVIDER_METADATA } from '@modelsfree/types'

PROVIDER_METADATA.nvidia
// {
//   key: 'nvidia',
//   name: 'NVIDIA NIM',
//   url: 'https://build.nvidia.com/explore/discover/models',
//   envVarName: 'NVIDIA_API_KEY',
//   keyPrefix: 'nvapi-'
// }
```

## License

MIT
