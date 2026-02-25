'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { MODELS, providers } from '@modelsfree/providers'
import { TIER_ORDER_CONST } from '@modelsfree/core'
import type { Tier, ProviderKey } from '@modelsfree/types'
import { Search, Filter, X, ChevronDown, SlidersHorizontal, Activity, Pause, Play, Check, AlertCircle, RefreshCw } from 'lucide-react'

// Model ping status type
interface ModelPingStatus {
  status: 'idle' | 'pending' | 'success' | 'error'
  latency?: number
  message?: string
  lastChecked?: number
}

// Tier Badge Component
function TierBadge({ tier }: { tier: Tier }) {
  const colors: Record<Tier, string> = {
    'S+': 'bg-tier-s-plus/20 text-tier-s-plus border-tier-s-plus/30',
    'S': 'bg-tier-s/20 text-tier-s border-tier-s/30',
    'A+': 'bg-tier-a-plus/20 text-tier-a-plus border-tier-a-plus/30',
    'A': 'bg-tier-a/20 text-tier-a border-tier-a/30',
    'A-': 'bg-tier-a-minus/20 text-tier-a-minus border-tier-a-minus/30',
    'B+': 'bg-tier-b-plus/20 text-tier-b-plus border-tier-b-plus/30',
    'B': 'bg-tier-b/20 text-tier-b border-tier-b/30',
    'B-': 'bg-tier-b-minus/20 text-tier-b-minus border-tier-b-minus/30',
    'C+': 'bg-tier-c-plus/20 text-tier-c-plus border-tier-c-plus/30',
    'C': 'bg-tier-c/20 text-tier-c border-tier-c/30',
    'D': 'bg-tier-d/20 text-tier-d border-tier-d/30',
  }
  
  return (
    <span className={`px-1.5 sm:px-2 py-0.5 rounded text-xs font-bold border ${colors[tier]}`}>
      {tier}
    </span>
  )
}

// Filter Button Component
function FilterButton({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
        active 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted hover:bg-muted/80'
      }`}
    >
      {children}
    </button>
  )
}

// Dropdown Filter Component
function DropdownFilter<T extends string>({
  label,
  options,
  value,
  onChange,
  allLabel = 'All'
}: {
  label: string
  options: { value: T; label: string }[]
  value: T | null
  onChange: (value: T | null) => void
  allLabel?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border bg-background hover:bg-muted transition-colors text-xs sm:text-sm"
      >
        <span className="text-muted-foreground">{label}:</span>
        <span className="font-medium truncate max-w-[80px] sm:max-w-none">
          {value ? options.find(o => o.value === value)?.label : allLabel}
        </span>
        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 py-1 bg-background border rounded-lg shadow-lg z-20 min-w-[140px] sm:min-w-[150px] max-h-[50vh] overflow-y-auto">
            <button
              onClick={() => {
                onChange(null)
                setIsOpen(false)
              }}
              className={`w-full text-left px-3 py-1.5 text-xs sm:text-sm hover:bg-muted ${
                !value ? 'bg-muted' : ''
              }`}
            >
              {allLabel}
            </button>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-1.5 text-xs sm:text-sm hover:bg-muted ${
                  value === option.value ? 'bg-muted' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Model Card for mobile
function ModelCard({ 
  model, 
  pingStatus 
}: { 
  model: typeof MODELS[0]
  pingStatus?: ModelPingStatus
}) {
  const [modelId, label, tier, sweScore, ctx, providerKey] = model
  
  return (
    <div className="rounded-lg border bg-card p-3 hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm truncate">{label}</p>
          <p className="text-xs text-muted-foreground font-mono truncate">{modelId}</p>
        </div>
        <div className="flex items-center gap-2">
          {pingStatus && pingStatus.status !== 'idle' && (
            <StatusIndicator status={pingStatus} />
          )}
          <TierBadge tier={tier as Tier} />
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="font-mono">{sweScore}</span>
        <span>•</span>
        <span>{ctx}</span>
        <span>•</span>
        <span className="truncate">{providers[providerKey as ProviderKey]?.name || providerKey}</span>
      </div>
    </div>
  )
}

// Status Indicator Component
function StatusIndicator({ status }: { status: ModelPingStatus }) {
  if (status.status === 'pending') {
    return <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
  }
  if (status.status === 'success') {
    return (
      <div className="flex items-center gap-1 text-green-500">
        <Check className="h-4 w-4" />
        {status.latency && <span className="text-xs">{status.latency}ms</span>}
      </div>
    )
  }
  if (status.status === 'error') {
    return (
      <div className="flex items-center gap-1 text-red-500" title={status.message}>
        <AlertCircle className="h-4 w-4" />
      </div>
    )
  }
  return null
}

export default function ExplorerPage() {
  // Filter state
  const [search, setSearch] = useState('')
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<ProviderKey | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'tier' | 'swe' | 'ctx'>('tier')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [showFilters, setShowFilters] = useState(false)
  
  // Model ping monitoring state
  const [liveMonitoring, setLiveMonitoring] = useState(false)
  const [pingStatuses, setPingStatuses] = useState<Record<string, ModelPingStatus>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const MONITORING_INTERVAL = 30 // Fixed 30 seconds interval
  
  // Filter options
  const tierOptions = TIER_ORDER_CONST.map(tier => ({ value: tier, label: tier }))
  const providerOptions = Object.keys(providers).map(key => ({
    value: key as ProviderKey,
    label: providers[key as ProviderKey].name
  }))
  
  // Filtered and sorted models
  const filteredModels = useMemo(() => {
    let result = MODELS.filter(([modelId, label, tier, , , providerKey]) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        if (
          !modelId.toLowerCase().includes(searchLower) &&
          !label.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }
      
      // Tier filter
      if (selectedTier && tier !== selectedTier) {
        return false
      }
      
      // Provider filter
      if (selectedProvider && providerKey !== selectedProvider) {
        return false
      }
      
      return true
    })
    
    // Sort
    result.sort((a, b) => {
      let cmp = 0
      
      switch (sortBy) {
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
      
      return sortDir === 'asc' ? cmp : -cmp
    })
    
    return result
  }, [search, selectedTier, selectedProvider, sortBy, sortDir])
  
  // Get API keys from localStorage
  const getApiKey = useCallback((providerKey: string): string | null => {
    if (typeof window === 'undefined') return null
    const envVarName = providers[providerKey as ProviderKey]?.envVarName
    if (!envVarName) return null
    return localStorage.getItem(envVarName)
  }, [])
  
  // Ping a single model
  const pingModel = useCallback(async (modelId: string, providerKey: string) => {
    const key = `${providerKey}-${modelId}`
    
    // Set pending status
    setPingStatuses(prev => ({
      ...prev,
      [key]: { status: 'pending' }
    }))
    
    const apiKey = getApiKey(providerKey)
    if (!apiKey) {
      setPingStatuses(prev => ({
        ...prev,
        [key]: { status: 'error', message: 'No API key' }
      }))
      return
    }
    
    try {
      const res = await fetch('/api/ping-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          provider: providerKey, 
          model: modelId, 
          apiKey 
        }),
      })
      const data = await res.json()
      
      setPingStatuses(prev => ({
        ...prev,
        [key]: {
          status: data.success ? 'success' : 'error',
          latency: data.latency,
          message: data.message,
          lastChecked: Date.now()
        }
      }))
    } catch {
      setPingStatuses(prev => ({
        ...prev,
        [key]: { status: 'error', message: 'Network error' }
      }))
    }
  }, [getApiKey])
  
  // Live monitoring effect - ping all models simultaneously
  useEffect(() => {
    if (liveMonitoring && filteredModels.length > 0) {
      // Ping all models simultaneously
      const pingAllSimultaneously = async () => {
        const promises = filteredModels.map(([modelId, , , , , providerKey]) => 
          pingModel(modelId, providerKey)
        )
        await Promise.all(promises)
      }
      
      pingAllSimultaneously()
      
      // Schedule next batch
      intervalRef.current = setTimeout(() => {
        // Force re-render to trigger next batch
        setCurrentIndex((prev) => prev + 1)
      }, MONITORING_INTERVAL * 1000)
    } else {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
        intervalRef.current = null
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [liveMonitoring, filteredModels, pingModel, currentIndex])
  
  const toggleLiveMonitoring = () => {
    if (liveMonitoring) {
      setLiveMonitoring(false)
    } else {
      setCurrentIndex(0)
      setLiveMonitoring(true)
    }
  }
  
  // Clear all filters
  const clearFilters = () => {
    setSearch('')
    setSelectedTier(null)
    setSelectedProvider(null)
  }
  
  const hasActiveFilters = search || selectedTier || selectedProvider

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Model Explorer</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Browse and filter {MODELS.length} models from {Object.keys(providers).length} providers
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="space-y-3 sm:space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search models..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center justify-center gap-2 w-full py-2 rounded-lg border bg-background hover:bg-muted transition-colors text-sm"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters & Sort</span>
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </button>
        
        {/* Filter Row - Desktop always visible, Mobile toggle */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-3`}>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-muted-foreground">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Filters:</span>
            </div>
            
            <DropdownFilter
              label="Tier"
              options={tierOptions}
              value={selectedTier}
              onChange={setSelectedTier}
            />
            
            <DropdownFilter
              label="Provider"
              options={providerOptions}
              value={selectedProvider}
              onChange={setSelectedProvider}
            />
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center space-x-1"
              >
                <X className="h-3 w-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
          
          {/* Sort Options */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs sm:text-sm text-muted-foreground">Sort:</span>
            {(['tier', 'swe', 'ctx', 'name'] as const).map((option) => (
              <FilterButton
                key={option}
                active={sortBy === option}
                onClick={() => {
                  if (sortBy === option) {
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
                  } else {
                    setSortBy(option)
                    setSortDir('asc')
                  }
                }}
              >
                {option === 'swe' ? 'SWE' : option === 'ctx' ? 'Ctx' : option.charAt(0).toUpperCase() + option.slice(1)}
                {sortBy === option && (sortDir === 'asc' ? ' ↑' : ' ↓')}
              </FilterButton>
            ))}
          </div>
        </div>
      </div>
      
      {/* Results Count and Live Monitoring Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs sm:text-sm text-muted-foreground">
          Showing {filteredModels.length} of {MODELS.length} models
        </div>
        
        {/* Live Monitoring Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLiveMonitoring}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
              liveMonitoring 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            {liveMonitoring ? (
              <>
                <Pause className="h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Live Ping
              </>
            )}
          </button>
          
          {liveMonitoring && (
            <div className="flex items-center gap-1 text-sm text-green-500">
              <Activity className="h-4 w-4 animate-pulse" />
              <span>
                Pinging all {filteredModels.length} models simultaneously
                {selectedProvider && ` (${providers[selectedProvider]?.name})`}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Models Grid - Mobile */}
      <div className="md:hidden space-y-2">
        {filteredModels.map(([modelId, , , , , providerKey]) => {
          const key = `${providerKey}-${modelId}`
          return (
            <ModelCard 
              key={key} 
              model={MODELS.find(m => m[0] === modelId && m[5] === providerKey)!} 
              pingStatus={pingStatuses[key]}
            />
          )
        })}
        {filteredModels.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No models found matching your filters
          </div>
        )}
      </div>
      
      {/* Models Table - Desktop */}
      <div className="hidden md:block rounded-lg border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 text-sm font-medium">Model</th>
                <th className="text-left p-3 text-sm font-medium">Tier</th>
                <th className="text-left p-3 text-sm font-medium">SWE Score</th>
                <th className="text-left p-3 text-sm font-medium">Context</th>
                <th className="text-left p-3 text-sm font-medium">Provider</th>
                <th className="text-left p-3 text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredModels.map(([modelId, label, tier, sweScore, ctx, providerKey]) => {
                const key = `${providerKey}-${modelId}`
                const status = pingStatuses[key]
                return (
                  <tr 
                    key={key} 
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{label}</p>
                        <p className="text-xs text-muted-foreground font-mono truncate">{modelId}</p>
                      </div>
                    </td>
                    <td className="p-3"><TierBadge tier={tier as Tier} /></td>
                    <td className="p-3 font-mono text-sm">{sweScore}</td>
                    <td className="p-3 text-sm">{ctx}</td>
                    <td className="p-3">
                      <span className="text-sm truncate block">
                        {providers[providerKey as ProviderKey]?.name || providerKey}
                      </span>
                    </td>
                    <td className="p-3">
                      {status && status.status !== 'idle' && (
                        <StatusIndicator status={status} />
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {filteredModels.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No models found matching your filters
          </div>
        )}
      </div>
    </div>
  )
}
