/**
 * @file packages/core/src/index.ts
 * @description Core business logic for ModelsFree.
 *
 * This module contains ALL the pure business logic extracted from the CLI,
 * making it reusable across CLI, dashboard, and future API.
 *
 * Key principles:
 * - No dependencies on Node.js specifics (fs, process, etc.)
 * - No UI/presentation logic (chalk, console, etc.)
 * - All functions are pure and testable
 * - HTTP operations are abstracted via injectable fetcher
 */

import type {
  Model,
  ModelResult,
  ModelTuple,
  PingResult,
  ProviderKey,
  SortColumn,
  SortDirection,
  Tier,
  Verdict,
  TIER_ORDER,
  VERDICT_ORDER,
  TIER_LETTER_MAP,
} from '@modelsfree/types'

// Re-export types for convenience
export type {
  Model,
  ModelResult,
  ModelTuple,
  PingResult,
  ProviderKey,
  SortColumn,
  SortDirection,
  Tier,
  Verdict,
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const TIER_ORDER_CONST: Tier[] = ['S+', 'S', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D']

export const VERDICT_ORDER_CONST: Verdict[] = [
  'Perfect',
  'Normal',
  'Slow',
  'Very Slow',
  'Overloaded',
  'Unstable',
  'Not Active',
  'Pending',
]

export const TIER_LETTER_MAP_CONST: Record<string, Tier[]> = {
  'S': ['S+', 'S'],
  'A': ['A+', 'A', 'A-'],
  'B': ['B+', 'B'],
  'C': ['C'],
}

export const DEFAULT_PING_TIMEOUT = 15_000 // 15 seconds
export const DEFAULT_PING_INTERVAL = 2_000 // 2 seconds

// ═══════════════════════════════════════════════════════════════════════════════
// LATENCY CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate average latency from successful pings only.
 * Failed pings (timeouts, 429s, 500s) are excluded.
 * Returns Infinity when no successful pings exist.
 */
export function getAvg(result: ModelResult): number {
  const successfulPings = (result.pings || []).filter((p) => p.code === '200')
  if (successfulPings.length === 0) return Infinity

  const totalMs = successfulPings.reduce((sum, p) => {
    return sum + (typeof p.ms === 'number' ? p.ms : 0)
  }, 0)

  return Math.round(totalMs / successfulPings.length)
}

/**
 * Calculate uptime percentage (successful pings / total pings).
 * Returns 0 when no pings have been made.
 */
export function getUptime(result: ModelResult): number {
  if (result.pings.length === 0) return 0
  const successful = result.pings.filter((p) => p.code === '200').length
  return Math.round((successful / result.pings.length) * 100)
}

/**
 * Determine verdict based on average latency and status.
 */
export function getVerdict(result: ModelResult): Verdict {
  const avg = getAvg(result)
  const wasUpBefore =
    result.pings.length > 0 && result.pings.some((p) => p.code === '200')

  if (result.httpCode === '429') return 'Overloaded'
  if (
    (result.status === 'timeout' || result.status === 'down') &&
    wasUpBefore
  )
    return 'Unstable'
  if (result.status === 'timeout' || result.status === 'down')
    return 'Not Active'
  if (avg === Infinity) return 'Pending'
  if (avg < 400) return 'Perfect'
  if (avg < 1000) return 'Normal'
  if (avg < 3000) return 'Slow'
  if (avg < 5000) return 'Very Slow'
  return 'Unstable'
}

// ═══════════════════════════════════════════════════════════════════════════════
// SORTING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Parse SWE score string to number.
 */
function parseSwe(score: string): number {
  if (!score || score === '—') return 0
  const num = parseFloat(score.replace('%', ''))
  return isNaN(num) ? 0 : num
}

/**
 * Parse context string to number (in thousands).
 */
function parseCtx(ctx: string): number {
  if (!ctx || ctx === '—') return 0
  const str = ctx.toLowerCase()
  if (str.includes('m')) {
    const num = parseFloat(str.replace('m', ''))
    return num * 1000
  }
  if (str.includes('k')) {
    const num = parseFloat(str.replace('k', ''))
    return num
  }
  return 0
}

/**
 * Sort results by any column.
 * Returns a NEW array (does not mutate original).
 */
export function sortResults(
  results: ModelResult[],
  sortColumn: SortColumn,
  sortDirection: SortDirection
): ModelResult[] {
  return [...results].sort((a, b) => {
    let cmp = 0

    switch (sortColumn) {
      case 'rank':
        cmp = a.idx - b.idx
        break

      case 'tier':
        cmp =
          TIER_ORDER_CONST.indexOf(a.tier) - TIER_ORDER_CONST.indexOf(b.tier)
        break

      case 'origin':
        cmp = (a.providerKey ?? 'nvidia').localeCompare(
          b.providerKey ?? 'nvidia'
        )
        break

      case 'model':
        cmp = a.label.localeCompare(b.label)
        break

      case 'ping': {
        const aLast =
          a.pings.length > 0 ? a.pings[a.pings.length - 1] : null
        const bLast =
          b.pings.length > 0 ? b.pings[b.pings.length - 1] : null
        const aPing =
          aLast?.code === '200' && typeof aLast.ms === 'number'
            ? aLast.ms
            : Infinity
        const bPing =
          bLast?.code === '200' && typeof bLast.ms === 'number'
            ? bLast.ms
            : Infinity
        cmp = aPing - bPing
        break
      }

      case 'avg':
        cmp = getAvg(a) - getAvg(b)
        break

      case 'swe':
        cmp = parseSwe(a.sweScore) - parseSwe(b.sweScore)
        break

      case 'ctx':
        cmp = parseCtx(a.ctx) - parseCtx(b.ctx)
        break

      case 'condition':
        cmp = a.status.localeCompare(b.status)
        break

      case 'verdict': {
        const aVerdict = getVerdict(a)
        const bVerdict = getVerdict(b)
        cmp =
          VERDICT_ORDER_CONST.indexOf(aVerdict) -
          VERDICT_ORDER_CONST.indexOf(bVerdict)
        break
      }

      case 'uptime':
        cmp = getUptime(a) - getUptime(b)
        break
    }

    return sortDirection === 'asc' ? cmp : -cmp
  })
}

// ═══════════════════════════════════════════════════════════════════════════════
// FILTERING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Filter results by tier letter (S/A/B/C).
 * Returns null if the tier letter is invalid.
 */
export function filterByTier(
  results: ModelResult[],
  tierLetter: string
): ModelResult[] | null {
  const letter = tierLetter.toUpperCase()
  const allowed = TIER_LETTER_MAP_CONST[letter]
  if (!allowed) return null
  return results.filter((r) => allowed.includes(r.tier))
}

/**
 * Filter results by provider key.
 */
export function filterByProvider(
  results: ModelResult[],
  providerKey: ProviderKey
): ModelResult[] {
  return results.filter((r) => r.providerKey === providerKey)
}

// ═══════════════════════════════════════════════════════════════════════════════
// BEST MODEL SELECTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Find the best model from results.
 * Priority: status (up first) → avg latency (lower) → uptime (higher)
 */
export function findBestModel(results: ModelResult[]): ModelResult | null {
  const sorted = [...results].sort((a, b) => {
    const avgA = getAvg(a)
    const avgB = getAvg(b)
    const uptimeA = getUptime(a)
    const uptimeB = getUptime(b)

    // Priority 1: Up models first
    if (a.status === 'up' && b.status !== 'up') return -1
    if (a.status !== 'up' && b.status === 'up') return 1

    // Priority 2: Lower avg latency
    if (avgA !== avgB) return avgA - avgB

    // Priority 3: Higher uptime
    return uptimeB - uptimeA
  })

  return sorted.length > 0 ? sorted[0] : null
}

// ═══════════════════════════════════════════════════════════════════════════════
// PING ABSTRACTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * HTTP fetcher interface - abstracts fetch for testability.
 */
export type HttpFetcher = (
  url: string,
  options: {
    method: string
    headers: Record<string, string>
    body: string
    signal?: AbortSignal
  }
) => Promise<{ status: number }>

/**
 * Ping options.
 */
export interface PingOptions {
  apiKey?: string | null
  modelId: string
  url: string
  timeout?: number
  fetcher?: HttpFetcher
}

/**
 * Ping result with timing.
 */
export interface PingResponse {
  code: string
  ms: number | 'TIMEOUT'
}

/**
 * Perform a ping to check model availability.
 * Uses injected fetcher for testability.
 */
export async function ping(options: PingOptions): Promise<PingResponse> {
  const { apiKey, modelId, url, timeout = DEFAULT_PING_TIMEOUT, fetcher } = options

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  const t0 = performance.now()

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`
    }

    const body = JSON.stringify({
      model: modelId,
      messages: [{ role: 'user', content: 'hi' }],
      max_tokens: 1,
    })

    // Use injected fetcher or default fetch
    const fetchFn = fetcher || fetch
    const resp = await fetchFn(url, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal,
    })

    return {
      code: String(resp.status),
      ms: Math.round(performance.now() - t0),
    }
  } catch (err) {
    const isTimeout =
      err instanceof Error &&
      (err.name === 'AbortError' || err.message.includes('abort'))
    return {
      code: isTimeout ? '000' : 'ERR',
      ms: isTimeout ? 'TIMEOUT' : Math.round(performance.now() - t0),
    }
  } finally {
    clearTimeout(timer)
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLI ARGUMENT PARSING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Parsed CLI arguments.
 */
export interface ParsedArgs {
  apiKey: string | null
  bestMode: boolean
  fiableMode: boolean
  openCodeMode: boolean
  openCodeDesktopMode: boolean
  tierFilter: string | null
}

/**
 * Parse process.argv into structured flags.
 */
export function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2)
  let apiKey: string | null = null
  const flags: string[] = []

  // Find --tier and its value
  const tierIdx = args.findIndex((a) => a.toLowerCase() === '--tier')
  const tierValueIdx =
    tierIdx !== -1 && args[tierIdx + 1] && !args[tierIdx + 1].startsWith('--')
      ? tierIdx + 1
      : -1

  for (const [i, arg] of args.entries()) {
    if (arg.startsWith('--')) {
      flags.push(arg.toLowerCase())
    } else if (i === tierValueIdx) {
      // Skip - this is the --tier value
    } else if (!apiKey) {
      apiKey = arg
    }
  }

  const bestMode = flags.includes('--best')
  const fiableMode = flags.includes('--fiable')
  const openCodeMode = flags.includes('--opencode')
  const openCodeDesktopMode = flags.includes('--opencode-desktop')

  const tierFilter =
    tierValueIdx !== -1 ? args[tierValueIdx].toUpperCase() : null

  return {
    apiKey,
    bestMode,
    fiableMode,
    openCodeMode,
    openCodeDesktopMode,
    tierFilter,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODEL DATA HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create a ModelResult from a ModelTuple.
 */
export function createModelResult(
  tuple: ModelTuple,
  providerKey: ProviderKey,
  idx: number
): ModelResult {
  const [modelId, label, tier, sweScore, ctx] = tuple
  return {
    idx,
    modelId,
    label,
    tier,
    sweScore,
    ctx,
    providerKey,
    status: 'pending',
    pings: [],
    httpCode: null,
    hidden: false,
  }
}

/**
 * Create ModelResults from a map of sources.
 */
export function createResultsFromSources(
  sourcesMap: Record<ProviderKey, { models: ModelTuple[] }>,
  enabledProviders?: ProviderKey[]
): ModelResult[] {
  const results: ModelResult[] = []
  let idx = 1

  const entries = Object.entries(sourcesMap) as [ProviderKey, { models: ModelTuple[] }][]
  
  for (const [providerKey, source] of entries) {
    // Skip disabled providers if filter is set
    if (enabledProviders && !enabledProviders.includes(providerKey)) {
      continue
    }

    for (const tuple of source.models) {
      results.push(createModelResult(tuple, providerKey, idx))
      idx++
    }
  }

  return results
}
