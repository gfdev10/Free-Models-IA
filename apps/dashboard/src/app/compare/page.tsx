'use client'

import { useState } from 'react'
import { MODELS, providers } from '@modelsfree/providers'
import { TIER_ORDER_CONST } from '@modelsfree/core'
import type { Tier, ProviderKey } from '@modelsfree/types'
import { ArrowLeftRight, Plus, X } from 'lucide-react'

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

// Model Selector Component
function ModelSelector({
  selectedModel,
  onSelect,
  excludeIds
}: {
  selectedModel: typeof MODELS[0] | null
  onSelect: (model: typeof MODELS[0] | null) => void
  excludeIds: string[]
}) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  
  const filteredModels = MODELS.filter(([modelId]) => {
    if (excludeIds.includes(modelId)) return false
    if (search) {
      const searchLower = search.toLowerCase()
      return modelId.toLowerCase().includes(searchLower)
    }
    return true
  }).slice(0, 50)
  
  return (
    <div className="relative">
      {selectedModel ? (
        <div className="p-3 sm:p-4 rounded-lg border bg-card">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base sm:text-lg truncate">{selectedModel[1]}</h3>
              <p className="text-xs text-muted-foreground font-mono mt-1 truncate">{selectedModel[0]}</p>
            </div>
            <button
              onClick={() => onSelect(null)}
              className="p-1 hover:bg-muted rounded flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tier</span>
              <TierBadge tier={selectedModel[2] as Tier} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">SWE Score</span>
              <span className="font-mono">{selectedModel[3]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Context</span>
              <span>{selectedModel[4]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Provider</span>
              <span className="truncate ml-2">{providers[selectedModel[5] as ProviderKey]?.name}</span>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-6 sm:p-8 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-6 w-6 sm:h-8 sm:w-8 mb-2" />
          <span className="text-sm sm:text-base">Select a model to compare</span>
        </button>
      )}
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10 bg-background/80" 
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-x-4 top-20 sm:absolute sm:inset-x-0 sm:top-full sm:left-0 sm:right-0 mt-2 p-3 sm:p-4 bg-background border rounded-lg shadow-lg z-20 max-h-[70vh] sm:max-h-96 overflow-auto">
            <input
              type="text"
              placeholder="Search models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded border bg-background mb-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              autoFocus
            />
            <div className="space-y-1">
              {filteredModels.map(([modelId, label, tier, sweScore, ctx, providerKey]) => (
                <button
                  key={`${providerKey}-${modelId}`}
                  onClick={() => {
                    onSelect([modelId, label, tier, sweScore, ctx, providerKey])
                    setIsOpen(false)
                    setSearch('')
                  }}
                  className="w-full text-left p-2 rounded hover:bg-muted flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-sm truncate block">{label}</span>
                    <span className="text-xs text-muted-foreground truncate block">
                      {providers[providerKey as ProviderKey]?.name}
                    </span>
                  </div>
                  <TierBadge tier={tier as Tier} />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Comparison Row Component
function ComparisonRow({
  label,
  value1,
  value2,
  highlight = 'higher'
}: {
  label: string
  value1: string | number
  value2: string | number
  highlight?: 'higher' | 'lower' | 'none'
}) {
  const isBetter = (v1: string | number, v2: string | number) => {
    if (typeof v1 === 'number' && typeof v2 === 'number') {
      return highlight === 'higher' ? v1 > v2 : v1 < v2
    }
    return false
  }
  
  const v1Better = highlight !== 'none' && isBetter(value1, value2)
  const v2Better = highlight !== 'none' && isBetter(value2, value1)
  
  return (
    <div className="grid grid-cols-3 items-center py-2 sm:py-3 border-b last:border-0 text-sm sm:text-base">
      <div className={`text-right pr-2 sm:pr-4 ${v1Better ? 'text-green-500 font-medium' : ''}`}>
        {value1}
      </div>
      <div className="text-center text-xs sm:text-sm text-muted-foreground">{label}</div>
      <div className={`text-left pl-2 sm:pl-4 ${v2Better ? 'text-green-500 font-medium' : ''}`}>
        {value2}
      </div>
    </div>
  )
}

export default function ComparePage() {
  const [model1, setModel1] = useState<typeof MODELS[0] | null>(null)
  const [model2, setModel2] = useState<typeof MODELS[0] | null>(null)
  
  const parseSwe = (score: string) => parseFloat(score.replace('%', '')) || 0
  const parseCtx = (ctx: string) => {
    const str = ctx.toLowerCase()
    if (str.includes('m')) return parseFloat(str) * 1000
    if (str.includes('k')) return parseFloat(str)
    return 0
  }
  
  const tierRank = (tier: string) => TIER_ORDER_CONST.indexOf(tier as Tier)
  
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Model Comparison</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Compare models side by side to find the best fit
        </p>
      </div>
      
      {/* Model Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Model A</h2>
          <ModelSelector
            selectedModel={model1}
            onSelect={setModel1}
            excludeIds={model2 ? [model2[0]] : []}
          />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Model B</h2>
          <ModelSelector
            selectedModel={model2}
            onSelect={setModel2}
            excludeIds={model1 ? [model1[0]] : []}
          />
        </div>
      </div>
      
      {/* Comparison Table */}
      {model1 && model2 && (
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="p-3 sm:p-4 border-b bg-muted/50">
            <div className="grid grid-cols-3 items-center">
              <div className="text-right font-semibold text-sm sm:text-base truncate pr-2">{model1[1]}</div>
              <div className="text-center">
                <ArrowLeftRight className="h-4 w-4 sm:h-5 sm:w-5 mx-auto text-muted-foreground" />
              </div>
              <div className="text-left font-semibold text-sm sm:text-base truncate pl-2">{model2[1]}</div>
            </div>
          </div>
          <div className="p-3 sm:p-4">
            <ComparisonRow
              label="Tier"
              value1={model1[2]}
              value2={model2[2]}
              highlight="none"
            />
            <ComparisonRow
              label="SWE Score"
              value1={model1[3]}
              value2={model2[3]}
              highlight="higher"
            />
            <ComparisonRow
              label="Context Window"
              value1={model1[4]}
              value2={model2[4]}
              highlight="higher"
            />
            <ComparisonRow
              label="Provider"
              value1={providers[model1[5] as ProviderKey]?.name || model1[5]}
              value2={providers[model2[5] as ProviderKey]?.name || model2[5]}
              highlight="none"
            />
          </div>
        </div>
      )}
      
      {/* Quick Compare Suggestions */}
      {!model1 && !model2 && (
        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Compare Suggestions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => {
                setModel1(MODELS.find(m => m[1] === 'DeepSeek V3.2') || null)
                setModel2(MODELS.find(m => m[1] === 'GLM 5') || null)
              }}
              className="p-3 sm:p-4 rounded-lg border hover:bg-muted transition-colors text-left"
            >
              <div className="font-medium text-sm sm:text-base">Top S+ Models</div>
              <div className="text-xs sm:text-sm text-muted-foreground">DeepSeek V3.2 vs GLM 5</div>
            </button>
            <button
              onClick={() => {
                setModel1(MODELS.find(m => m[1] === 'Llama 3.3 70B' && m[5] === 'nvidia') || null)
                setModel2(MODELS.find(m => m[1] === 'Llama 3.3 70B' && m[5] === 'groq') || null)
              }}
              className="p-3 sm:p-4 rounded-lg border hover:bg-muted transition-colors text-left"
            >
              <div className="font-medium text-sm sm:text-base">Same Model, Different Provider</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Llama 3.3 70B: NIM vs Groq</div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
