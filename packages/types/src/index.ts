/**
 * @file packages/types/src/index.ts
 * @description Core types and Zod schemas for ModelsFree.
 *
 * This module defines all TypeScript types and runtime validation schemas
 * for the entire application. It serves as the single source of truth for
 * data contracts across CLI, dashboard, and future API.
 */

import { z } from 'zod'

// ═══════════════════════════════════════════════════════════════════════════════
// TIER SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * All valid tier values, ordered from best to worst.
 * Based on SWE-bench Verified scores.
 */
export const TierSchema = z.enum(['S+', 'S', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D'])
export type Tier = z.infer<typeof TierSchema>

export const TIER_ORDER: Tier[] = ['S+', 'S', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D']

/**
 * Maps a tier letter (used in CLI --tier flag) to the full tier strings it includes.
 */
export const TIER_LETTER_MAP: Record<string, Tier[]> = {
  'S': ['S+', 'S'],
  'A': ['A+', 'A', 'A-'],
  'B': ['B+', 'B', 'B-'],
  'C': ['C+', 'C'],
  'D': ['D'],
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Supported provider keys.
 */
export const ProviderKeySchema = z.enum([
  'nvidia',
  'groq',
  'cerebras',
  'sambanova',
  'openrouter',
  'codestral',
  'googleai',
  'mistral',
])
export type ProviderKey = z.infer<typeof ProviderKeySchema>

/**
 * Provider configuration (API endpoint, display name, etc.)
 */
export const ProviderConfigSchema = z.object({
  key: ProviderKeySchema,
  name: z.string(),
  url: z.string().url(),
  envVarName: z.string(),
  keyPrefix: z.string().optional(),
  hint: z.string().optional(),
})
export type ProviderConfig = z.infer<typeof ProviderConfigSchema>

// ═══════════════════════════════════════════════════════════════════════════════
// MODEL TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Raw model data as stored in sources.js (tuple format for backward compat).
 * This is the legacy format: [modelId, label, tier, sweScore, ctx]
 */
export const ModelTupleSchema = z.tuple([
  z.string(), // modelId
  z.string(), // label
  TierSchema, // tier
  z.string(), // sweScore (e.g., "73.1%")
  z.string(), // ctx (e.g., "128k")
])
export type ModelTuple = z.infer<typeof ModelTupleSchema>

/**
 * Normalized model object with proper typing.
 * This is the preferred format for internal use.
 */
export const ModelSchema = z.object({
  id: z.string(),
  label: z.string(),
  tier: TierSchema,
  sweScore: z.number().min(0).max(100),
  ctx: z.number(), // in thousands of tokens (128k = 128)
  ctxRaw: z.string(), // original string (e.g., "128k")
  providerKey: ProviderKeySchema,
})
export type Model = z.infer<typeof ModelSchema>

/**
 * Source definition (provider + models).
 */
export const SourceSchema = z.object({
  key: ProviderKeySchema,
  name: z.string(),
  url: z.string().url(),
  models: z.array(ModelTupleSchema),
})
export type Source = z.infer<typeof SourceSchema>

// ═══════════════════════════════════════════════════════════════════════════════
// PING & RESULT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Single ping result.
 */
export const PingResultSchema = z.object({
  ms: z.union([z.number(), z.literal('TIMEOUT')]),
  code: z.string(), // HTTP status code as string ('200', '429', '000' for timeout)
})
export type PingResult = z.infer<typeof PingResultSchema>

/**
 * Model status in the ping loop.
 */
export const ModelStatusSchema = z.enum(['pending', 'up', 'down', 'timeout', 'noauth'])
export type ModelStatus = z.infer<typeof ModelStatusSchema>

/**
 * Verdict based on average latency.
 */
export const VerdictSchema = z.enum([
  'Perfect',
  'Normal',
  'Slow',
  'Very Slow',
  'Overloaded',
  'Unstable',
  'Not Active',
  'Pending',
])
export type Verdict = z.infer<typeof VerdictSchema>

export const VERDICT_ORDER: Verdict[] = [
  'Perfect',
  'Normal',
  'Slow',
  'Very Slow',
  'Overloaded',
  'Unstable',
  'Not Active',
  'Pending',
]

/**
 * Full model result with ping history.
 */
export const ModelResultSchema = z.object({
  idx: z.number(),
  modelId: z.string(),
  label: z.string(),
  tier: TierSchema,
  sweScore: z.string(),
  ctx: z.string(),
  providerKey: ProviderKeySchema,
  status: ModelStatusSchema,
  pings: z.array(PingResultSchema),
  httpCode: z.string().nullable(),
  hidden: z.boolean().optional(),
})
export type ModelResult = z.infer<typeof ModelResultSchema>

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIG TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Application configuration stored in ~/.modelsfree.json
 */
export const AppConfigSchema = z.object({
  apiKeys: z.record(ProviderKeySchema, z.string()),
  providers: z.record(
    ProviderKeySchema,
    z.object({
      enabled: z.boolean(),
    })
  ),
})
export type AppConfig = z.infer<typeof AppConfigSchema>

// ═══════════════════════════════════════════════════════════════════════════════
// SORT & FILTER TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export const SortColumnSchema = z.enum([
  'rank',
  'tier',
  'origin',
  'model',
  'ping',
  'avg',
  'swe',
  'ctx',
  'condition',
  'verdict',
  'uptime',
])
export type SortColumn = z.infer<typeof SortColumnSchema>

export const SortDirectionSchema = z.enum(['asc', 'desc'])
export type SortDirection = z.infer<typeof SortDirectionSchema>

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS FOR TYPE CONVERSION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Parse SWE score string (e.g., "73.1%") to number.
 */
export function parseSweScore(score: string): number {
  if (!score || score === '—') return 0
  const num = parseFloat(score.replace('%', ''))
  return isNaN(num) ? 0 : num
}

/**
 * Parse context string (e.g., "128k", "1m") to number (in thousands).
 */
export function parseCtx(ctx: string): number {
  if (!ctx || ctx === '—') return 0
  const str = ctx.toLowerCase()
  if (str.includes('m')) {
    const num = parseFloat(str.replace('m', ''))
    return num * 1000 // 1m = 1000k
  }
  if (str.includes('k')) {
    const num = parseFloat(str.replace('k', ''))
    return num
  }
  return 0
}

/**
 * Convert a ModelTuple to a normalized Model object.
 */
export function normalizeModel(tuple: ModelTuple, providerKey: ProviderKey): Model {
  const [id, label, tier, sweScore, ctxRaw] = tuple
  return {
    id,
    label,
    tier,
    sweScore: parseSweScore(sweScore),
    ctx: parseCtx(ctxRaw),
    ctxRaw,
    providerKey,
  }
}

/**
 * Provider metadata for display and configuration.
 */
export const PROVIDER_METADATA: Record<ProviderKey, {
  name: string
  url: string
  envVarName: string
  keyPrefix?: string
  hint?: string
}> = {
  nvidia: {
    name: 'NIM',
    url: 'https://integrate.api.nvidia.com/v1/chat/completions',
    envVarName: 'NVIDIA_API_KEY',
    keyPrefix: 'nvapi-',
    hint: 'Profile → API Keys → Generate',
  },
  groq: {
    name: 'Groq',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    envVarName: 'GROQ_API_KEY',
    keyPrefix: 'gsk_',
    hint: 'API Keys → Create API Key',
  },
  cerebras: {
    name: 'Cerebras',
    url: 'https://api.cerebras.ai/v1/chat/completions',
    envVarName: 'CEREBRAS_API_KEY',
    keyPrefix: 'csk_ / cauth_',
    hint: 'API Keys → Create',
  },
  sambanova: {
    name: 'SambaNova',
    url: 'https://api.sambanova.ai/v1/chat/completions',
    envVarName: 'SAMBANOVA_API_KEY',
    keyPrefix: 'sn-',
    hint: 'API Keys → Create ($5 free trial, 3 months)',
  },
  openrouter: {
    name: 'OpenRouter',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    envVarName: 'OPENROUTER_API_KEY',
    keyPrefix: 'sk-or-',
    hint: 'API Keys → Create key (50 free req/day)',
  },
  codestral: {
    name: 'Codestral',
    url: 'https://codestral.mistral.ai/v1/chat/completions',
    envVarName: 'CODESTRAL_API_KEY',
    keyPrefix: 'csk-',
    hint: 'API Keys → Create key (30 req/min, phone required)',
  },
  googleai: {
    name: 'Google AI',
    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    envVarName: 'GOOGLE_API_KEY',
    keyPrefix: 'AIza',
    hint: 'Get API key (free Gemma models, 14.4K req/day)',
  },
  mistral: {
    name: 'Mistral AI',
    url: 'https://api.mistral.ai/v1/chat/completions',
    envVarName: 'MISTRAL_API_KEY',
    keyPrefix: '',
    hint: 'La Plateforme → API Keys (free tier available)',
  },
}
