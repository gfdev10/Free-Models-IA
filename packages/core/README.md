# @modelsfree/core

Pure business logic for ModelsFree. This package contains all the core functionality for pinging, calculating metrics, sorting, and filtering models.

## Installation

```bash
pnpm add @modelsfree/core
```

## Usage

```typescript
import {
  // Ping
  ping,
  createHttpFetcher,
  
  // Metrics
  getAvg,
  getVerdict,
  getUptime,
  
  // Sorting & Filtering
  sortResults,
  filterByTier,
  filterByProvider,
  findBestModel,
  
  // CLI
  parseArgs,
  
  // Helpers
  createModelResult,
  createResultsFromSources,
  TIER_ORDER_CONST,
} from '@modelsfree/core'
```

## Functions

### ping(model, apiKey, fetcher?)

Execute HTTP ping to a model endpoint.

```typescript
import { ping, createHttpFetcher } from '@modelsfree/core'

const fetcher = createHttpFetcher()
const result = await ping(model, 'your-api-key', fetcher)
// { ms: 150, code: '200' }
```

**Injectable fetcher for testing:**

```typescript
const mockFetcher = async () => ({ ms: 100, code: '200' })
const result = await ping(model, 'key', mockFetcher)
```

### getAvg(result)

Calculate average latency from ping history.

```typescript
getAvg(result)  // Average latency in ms, or Infinity if no successful pings
```

### getVerdict(result)

Determine model health verdict.

```typescript
getVerdict(result)
// 'Perfect' | 'Normal' | 'Slow' | 'Very Slow' | 'Overloaded' | 'Unstable' | 'Not Active' | 'Pending'
```

### getUptime(result)

Calculate uptime percentage.

```typescript
getUptime(result)  // 0-100
```

### sortResults(results, column, direction)

Sort model results.

```typescript
sortResults(results, 'tier', 'asc')
sortResults(results, 'avg', 'desc')
```

**Sort columns:** `'rank' | 'tier' | 'origin' | 'model' | 'ping' | 'swe' | 'ctx' | 'avg' | 'verdict' | 'uptime' | 'condition'`

### filterByTier(results, tier)

Filter results by tier letter.

```typescript
filterByTier(results, 'S')  // Returns S+ and S models
filterByTier(results, 'A')  // Returns A+, A, A- models
```

### filterByProvider(results, providerKey)

Filter results by provider.

```typescript
filterByProvider(results, 'nvidia')
```

### findBestModel(results)

Find the best available model.

```typescript
const best = findBestModel(results)
// Prefers: up > fastest avg > highest uptime
```

### parseArgs(args)

Parse CLI arguments.

```typescript
const parsed = parseArgs(['node', 'script', '--best', '--tier', 'S'])
// {
//   apiKey: null,
//   showBest: true,
//   showFiable: false,
//   showOpencode: false,
//   showOpenclaw: false,
//   showOpencodeDesktop: false,
//   tierFilter: 'S'
// }
```

### createModelResult(...)

Create a ModelResult object from model data.

```typescript
const result = createModelResult(
  'model-id',
  'Model Label',
  'S',
  '73.1%',
  '128k',
  'nvidia',
  [{ ms: 100, code: '200' }]
)
```

## Data Service

The `DataService` class provides caching and validation for model data:

```typescript
import { DataService, StaticDataSource, getDataService } from '@modelsfree/core'

// Using singleton
const service = getDataService()

// Or create custom instance
const source = new StaticDataSource(models, providerKeys)
const service = new DataService({
  cacheTtl: 5 * 60 * 1000,  // 5 minutes
  enableValidation: true,
})
service.setSource(source)

// Get data
const models = await service.getModels()
const stats = await service.getStats()
const filtered = await service.getModelsByTier('S')
const search = await service.searchModels('claude')
```

## Constants

```typescript
import { TIER_ORDER_CONST } from '@modelsfree/core'

TIER_ORDER_CONST  // ['S+', 'S', 'A+', 'A', 'A-', 'B+', 'B', 'C']
```

## Error Handling

```typescript
import { DataError, DataErrorCodes, createErrorResponse } from '@modelsfree/core'

try {
  await service.getModels()
} catch (error) {
  if (error instanceof DataError) {
    console.log(error.code)  // 'NO_SOURCE', 'FETCH_FAILED', etc.
  }
  
  const response = createErrorResponse(error)
  // { success: false, error: { message: '...', code: '...' } }
}
```

## License

MIT
