/**
 * @file packages/core/src/data-service.ts
 * @description Data service with caching, validation, and error handling.
 *
 * This module provides a robust data layer for accessing model data:
 * - In-memory caching with TTL
 * - Runtime validation with Zod schemas
 * - Fallback mechanisms for failed fetches
 * - Error handling and logging
 */

import { z } from 'zod'
import type { Tier, ProviderKey } from '@modelsfree/types'
import { TierSchema, ProviderKeySchema } from '@modelsfree/types'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Model tuple with provider key: [modelId, label, tier, sweScore, ctx, providerKey]
 */
export type ModelTupleWithProvider = [string, string, Tier, string, string, ProviderKey]

/**
 * Model tuple without provider key: [modelId, label, tier, sweScore, ctx]
 */
export type ModelTupleBasic = [string, string, Tier, string, string]

// ═══════════════════════════════════════════════════════════════════════════════
// CACHE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

/**
 * Simple in-memory cache with TTL support.
 */
export class DataCache {
  private cache = new Map<string, CacheEntry<unknown>>()
  private defaultTtl: number

  constructor(defaultTtlMs: number = 5 * 60 * 1000) { // 5 minutes default
    this.defaultTtl = defaultTtlMs
  }

  /**
   * Get a value from cache if not expired.
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Set a value in cache with optional TTL.
   */
  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTtl,
    })
  }

  /**
   * Delete a specific key from cache.
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear all cache entries.
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache statistics.
   */
  stats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}

// Global cache instance
export const globalCache = new DataCache()

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Validation result type.
 */
export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; errors: string[] }

/**
 * Validate an array of model tuples with provider.
 */
export function validateModelTuples(data: unknown[]): ValidationResult<ModelTupleWithProvider[]> {
  const errors: string[] = []
  const validModels: ModelTupleWithProvider[] = []

  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (!Array.isArray(item)) {
      errors.push(`Index ${i}: Expected array, got ${typeof item}`)
      continue
    }
    if (item.length < 5) {
      errors.push(`Index ${i}: Expected at least 5 elements, got ${item.length}`)
      continue
    }
    
    const [modelId, label, tier, sweScore, ctx, providerKey] = item
    
    // Validate tier
    const tierResult = TierSchema.safeParse(tier)
    if (!tierResult.success) {
      errors.push(`Index ${i}: Invalid tier "${tier}"`)
      continue
    }
    
    // Validate provider key if present
    if (providerKey !== undefined) {
      const providerResult = ProviderKeySchema.safeParse(providerKey)
      if (!providerResult.success) {
        errors.push(`Index ${i}: Invalid provider key "${providerKey}"`)
        continue
      }
    }
    
    validModels.push([modelId, label, tier, sweScore, ctx, providerKey || 'nvidia'] as ModelTupleWithProvider)
  }

  if (errors.length > 0) {
    return { success: false, errors }
  }
  return { success: true, data: validModels }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Data source interface for fetching model data.
 */
export interface ModelDataSource {
  getModels(): Promise<ModelTupleWithProvider[]>
  getProviders(): Promise<ProviderKey[]>
}

/**
 * Static data source (uses bundled data).
 */
export class StaticDataSource implements ModelDataSource {
  private models: ModelTupleWithProvider[]
  private providerKeys: ProviderKey[]

  constructor(
    models: ModelTupleWithProvider[],
    providerKeys: ProviderKey[]
  ) {
    this.models = models
    this.providerKeys = providerKeys
  }

  async getModels(): Promise<ModelTupleWithProvider[]> {
    return this.models
  }

  async getProviders(): Promise<ProviderKey[]> {
    return this.providerKeys
  }
}

/**
 * Data service configuration.
 */
export interface DataServiceConfig {
  cache?: DataCache
  cacheTtl?: number
  enableValidation?: boolean
  fallbackData?: ModelTupleWithProvider[]
}

/**
 * Data service for accessing model data with caching and validation.
 */
export class DataService {
  private cache: DataCache
  private cacheTtl: number
  private enableValidation: boolean
  private fallbackData: ModelTupleWithProvider[]
  private source: ModelDataSource | null = null

  constructor(config: DataServiceConfig = {}) {
    this.cache = config.cache ?? globalCache
    this.cacheTtl = config.cacheTtl ?? 5 * 60 * 1000
    this.enableValidation = config.enableValidation ?? true
    this.fallbackData = config.fallbackData ?? []
  }

  /**
   * Set the data source.
   */
  setSource(source: ModelDataSource): void {
    this.source = source
  }

  /**
   * Get all models with caching.
   */
  async getModels(): Promise<ModelTupleWithProvider[]> {
    const cacheKey = 'models:all'
    
    // Check cache first
    const cached = this.cache.get<ModelTupleWithProvider[]>(cacheKey)
    if (cached) {
      return cached
    }

    // Fetch from source
    try {
      if (!this.source) {
        throw new Error('No data source configured')
      }

      const models = await this.source.getModels()

      // Validate if enabled
      if (this.enableValidation) {
        const result = validateModelTuples(models)
        if (!result.success) {
          console.warn('Model validation errors:', result.errors)
          // Continue with unvalidated data rather than failing
        }
      }

      // Cache the result
      this.cache.set(cacheKey, models, this.cacheTtl)
      return models
    } catch (error) {
      console.error('Failed to fetch models:', error)
      
      // Return fallback data if available
      if (this.fallbackData.length > 0) {
        return this.fallbackData
      }
      
      throw error
    }
  }

  /**
   * Get models filtered by provider.
   */
  async getModelsByProvider(providerKey: ProviderKey): Promise<ModelTupleWithProvider[]> {
    const cacheKey = `models:provider:${providerKey}`
    
    const cached = this.cache.get<ModelTupleWithProvider[]>(cacheKey)
    if (cached) {
      return cached
    }

    const allModels = await this.getModels()
    const filtered = allModels.filter(([, , , , , pk]) => pk === providerKey)
    
    this.cache.set(cacheKey, filtered, this.cacheTtl)
    return filtered
  }

  /**
   * Get models filtered by tier.
   */
  async getModelsByTier(tier: Tier): Promise<ModelTupleWithProvider[]> {
    const cacheKey = `models:tier:${tier}`
    
    const cached = this.cache.get<ModelTupleWithProvider[]>(cacheKey)
    if (cached) {
      return cached
    }

    const allModels = await this.getModels()
    const filtered = allModels.filter(([, , t]) => t === tier)
    
    this.cache.set(cacheKey, filtered, this.cacheTtl)
    return filtered
  }

  /**
   * Search models by name or ID.
   */
  async searchModels(query: string): Promise<ModelTupleWithProvider[]> {
    const normalizedQuery = query.toLowerCase().trim()
    
    if (!normalizedQuery) {
      return this.getModels()
    }

    const allModels = await this.getModels()
    return allModels.filter(([modelId, label]) => 
      modelId.toLowerCase().includes(normalizedQuery) ||
      label.toLowerCase().includes(normalizedQuery)
    )
  }

  /**
   * Get a single model by ID.
   */
  async getModelById(modelId: string): Promise<ModelTupleWithProvider | null> {
    const allModels = await this.getModels()
    return allModels.find(([id]) => id === modelId) ?? null
  }

  /**
   * Get available providers.
   */
  async getProviders(): Promise<ProviderKey[]> {
    const cacheKey = 'providers:all'
    
    const cached = this.cache.get<ProviderKey[]>(cacheKey)
    if (cached) {
      return cached
    }

    if (this.source) {
      const providers = await this.source.getProviders()
      this.cache.set(cacheKey, providers, this.cacheTtl)
      return providers
    }

    // Fallback: extract from models
    const models = await this.getModels()
    const providerSet = new Set<ProviderKey>()
    for (const [, , , , , pk] of models) {
      if (pk) providerSet.add(pk)
    }
    const providers = Array.from(providerSet)
    this.cache.set(cacheKey, providers, this.cacheTtl)
    return providers
  }

  /**
   * Get statistics about the data.
   */
  async getStats(): Promise<{
    totalModels: number
    totalProviders: number
    tierDistribution: Record<Tier, number>
    avgSweScore: number
  }> {
    const models = await this.getModels()
    const providers = await this.getProviders()
    
    const tierDistribution: Record<Tier, number> = {
      'S+': 0, 'S': 0, 'A+': 0, 'A': 0, 'A-': 0, 'B+': 0, 'B': 0, 'B-': 0, 'C+': 0, 'C': 0, 'D': 0,
    }
    
    let totalSweScore = 0
    let validScores = 0
    
    for (const [, , tier, sweScore] of models) {
      tierDistribution[tier]++
      
      const score = parseFloat(sweScore.replace('%', ''))
      if (!isNaN(score)) {
        totalSweScore += score
        validScores++
      }
    }
    
    return {
      totalModels: models.length,
      totalProviders: providers.length,
      tierDistribution,
      avgSweScore: validScores > 0 ? totalSweScore / validScores : 0,
    }
  }

  /**
   * Clear all cached data.
   */
  clearCache(): void {
    this.cache.clear()
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Custom error class for data-related errors.
 */
export class DataError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: Error
  ) {
    super(message)
    this.name = 'DataError'
  }
}

/**
 * Error codes for data operations.
 */
export const DataErrorCodes = {
  NO_SOURCE: 'NO_SOURCE',
  FETCH_FAILED: 'FETCH_FAILED',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  NOT_FOUND: 'NOT_FOUND',
  CACHE_ERROR: 'CACHE_ERROR',
} as const

/**
 * Create a standardized error response.
 */
export function createErrorResponse(error: unknown): {
  success: false
  error: {
    message: string
    code: string
  }
} {
  if (error instanceof DataError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
      },
    }
  }
  
  if (error instanceof Error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: 'UNKNOWN',
      },
    }
  }
  
  return {
    success: false,
    error: {
      message: 'An unknown error occurred',
      code: 'UNKNOWN',
    },
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Global data service instance.
 */
let globalDataService: DataService | null = null

/**
 * Get or create the global data service.
 */
export function getDataService(): DataService {
  if (!globalDataService) {
    globalDataService = new DataService()
  }
  return globalDataService
}

/**
 * Initialize the global data service with a source.
 */
export function initializeDataService(source: ModelDataSource, config?: DataServiceConfig): DataService {
  globalDataService = new DataService(config)
  globalDataService.setSource(source)
  return globalDataService
}
