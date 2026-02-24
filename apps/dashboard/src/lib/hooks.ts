'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MODELS, providers } from '@modelsfree/providers'
import type { Tier, ProviderKey } from '@modelsfree/types'
import { TIER_ORDER_CONST } from '@modelsfree/core'

// ═══════════════════════════════════════════════════════════════════════════════
// QUERY KEYS
// ═══════════════════════════════════════════════════════════════════════════════

export const queryKeys = {
  all: ['models'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (filters: ModelFilters) => [...queryKeys.lists(), filters] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
  stats: () => [...queryKeys.all, 'stats'] as const,
  providers: () => ['providers'] as const,
}

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ModelFilters {
  search?: string
  tier?: Tier | null
  provider?: ProviderKey | null
}

export interface ModelSort {
  sortBy: 'name' | 'tier' | 'swe' | 'ctx'
  sortDir: 'asc' | 'desc'
}

export interface ModelStats {
  totalModels: number
  totalProviders: number
  topTierCount: number
  avgSweScore: number
  tierDistribution: Record<Tier, number>
}

export type ModelData = typeof MODELS[0]

// ═══════════════════════════════════════════════════════════════════════════════
// DATA ACCESS FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get all models (static data, no fetch needed)
 */
function getAllModels(): Promise<ModelData[]> {
  // Simulate async for consistency with future API
  return Promise.resolve(MODELS)
}

/**
 * Filter models based on search and filters
 */
function filterModels(
  models: ModelData[],
  filters: ModelFilters
): ModelData[] {
  return models.filter(([modelId, label, tier, , , providerKey]) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      if (
        !modelId.toLowerCase().includes(searchLower) &&
        !label.toLowerCase().includes(searchLower)
      ) {
        return false
      }
    }
    
    // Tier filter
    if (filters.tier && tier !== filters.tier) {
      return false
    }
    
    // Provider filter
    if (filters.provider && providerKey !== filters.provider) {
      return false
    }
    
    return true
  })
}

/**
 * Sort models
 */
function sortModels(
  models: ModelData[],
  sort: ModelSort
): ModelData[] {
  return [...models].sort((a, b) => {
    let cmp = 0
    
    switch (sort.sortBy) {
      case 'name':
        cmp = a[1].localeCompare(b[1])
        break
      case 'tier':
        cmp = TIER_ORDER_CONST.indexOf(a[2] as Tier) - TIER_ORDER_CONST.indexOf(b[2] as Tier)
        break
      case 'swe': {
        const aScore = parseFloat(a[3].replace('%', '')) || 0
        const bScore = parseFloat(b[3].replace('%', '')) || 0
        cmp = bScore - aScore // Higher is better
        break
      }
      case 'ctx': {
        const parseCtx = (ctx: string) => {
          const str = ctx.toLowerCase()
          if (str.includes('m')) return parseFloat(str) * 1000
          if (str.includes('k')) return parseFloat(str)
          return 0
        }
        cmp = parseCtx(b[4]) - parseCtx(a[4]) // Larger is better
        break
      }
    }
    
    return sort.sortDir === 'asc' ? cmp : -cmp
  })
}

/**
 * Calculate statistics
 */
function calculateStats(models: ModelData[]): ModelStats {
  const tierDistribution: Record<Tier, number> = {
    'S+': 0, 'S': 0, 'A+': 0, 'A': 0, 'A-': 0, 'B+': 0, 'B': 0, 'B-': 0, 'C+': 0, 'C': 0, 'D': 0,
  }
  
  let totalSweScore = 0
  let validScores = 0
  
  for (const [, , tier, sweScore] of models) {
    tierDistribution[tier as Tier]++
    
    const score = parseFloat(sweScore.replace('%', ''))
    if (!isNaN(score)) {
      totalSweScore += score
      validScores++
    }
  }
  
  return {
    totalModels: models.length,
    totalProviders: Object.keys(providers).length,
    topTierCount: models.filter(([, , tier]) => tier === 'S+' || tier === 'S').length,
    avgSweScore: validScores > 0 ? totalSweScore / validScores : 0,
    tierDistribution,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// REACT QUERY HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hook to get all models
 */
export function useModels() {
  return useQuery({
    queryKey: queryKeys.all,
    queryFn: getAllModels,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  })
}

/**
 * Hook to get filtered and sorted models
 */
export function useFilteredModels(
  filters: ModelFilters,
  sort: ModelSort
) {
  return useQuery({
    queryKey: queryKeys.list(filters),
    queryFn: async () => {
      const models = await getAllModels()
      const filtered = filterModels(models, filters)
      return sortModels(filtered, sort)
    },
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to get a single model by ID
 */
export function useModel(modelId: string | null) {
  return useQuery({
    queryKey: queryKeys.detail(modelId ?? ''),
    queryFn: async () => {
      if (!modelId) return null
      const models = await getAllModels()
      return models.find(([id]) => id === modelId) ?? null
    },
    enabled: !!modelId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to get model statistics
 */
export function useModelStats() {
  return useQuery({
    queryKey: queryKeys.stats(),
    queryFn: async () => {
      const models = await getAllModels()
      return calculateStats(models)
    },
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to get providers list
 */
export function useProviders() {
  return useQuery({
    queryKey: queryKeys.providers(),
    queryFn: () => Promise.resolve(providers),
    staleTime: Infinity, // Static data, never stale
  })
}

/**
 * Hook to get models by provider
 */
export function useModelsByProvider(providerKey: ProviderKey | null) {
  return useQuery({
    queryKey: [...queryKeys.all, 'provider', providerKey],
    queryFn: async () => {
      if (!providerKey) return []
      const models = await getAllModels()
      return models.filter(([, , , , , pk]) => pk === providerKey)
    },
    enabled: !!providerKey,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to get models by tier
 */
export function useModelsByTier(tier: Tier | null) {
  return useQuery({
    queryKey: [...queryKeys.all, 'tier', tier],
    queryFn: async () => {
      if (!tier) return []
      const models = await getAllModels()
      return models.filter(([, , t]) => t === tier)
    },
    enabled: !!tier,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to search models
 */
export function useSearchModels(query: string) {
  return useQuery({
    queryKey: [...queryKeys.all, 'search', query],
    queryFn: async () => {
      if (!query.trim()) return []
      const models = await getAllModels()
      const normalizedQuery = query.toLowerCase().trim()
      return models.filter(([modelId, label]) => 
        modelId.toLowerCase().includes(normalizedQuery) ||
        label.toLowerCase().includes(normalizedQuery)
      )
    },
    enabled: query.trim().length > 0,
    staleTime: 5 * 60 * 1000,
  })
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hook to compare two models
 */
export function useCompareModels(modelId1: string | null, modelId2: string | null) {
  const model1 = useModel(modelId1)
  const model2 = useModel(modelId2)
  
  return {
    model1: model1.data,
    model2: model2.data,
    isLoading: model1.isLoading || model2.isLoading,
    error: model1.error || model2.error,
  }
}

/**
 * Hook to prefetch models
 */
export function usePrefetchModels() {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.all,
      queryFn: getAllModels,
      staleTime: 5 * 60 * 1000,
    })
  }
}

/**
 * Hook to invalidate model cache
 */
export function useInvalidateModels() {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.all })
  }
}
