import { MODELS, sources, providers } from '@modelsfree/providers'
import { TIER_ORDER_CONST } from '@modelsfree/core'
import type { Tier, ProviderKey } from '@modelsfree/types'
import { 
  Cpu, 
  Zap, 
  TrendingUp, 
  Globe,
  Star,
  Database
} from 'lucide-react'
import Link from 'next/link'

// Stats Card Component
function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon,
  trend 
}: { 
  title: string
  value: string | number
  description: string
  icon: React.ComponentType<{ className?: string }>
  trend?: string
}) {
  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</span>
        </div>
        {trend && (
          <span className="text-xs text-green-500 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            {trend}
          </span>
        )}
      </div>
      <div className="mt-2 sm:mt-3">
        <span className="text-2xl sm:text-3xl font-bold">{value}</span>
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  )
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

// Provider Card Component
function ProviderCard({ 
  providerKey, 
  modelCount 
}: { 
  providerKey: ProviderKey
  modelCount: number 
}) {
  const provider = providers[providerKey]
  
  return (
    <div className="rounded-lg border bg-card p-3 sm:p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm sm:text-base truncate">{provider.name}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{modelCount} models</p>
        </div>
        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
      </div>
      <div className="mt-2 sm:mt-3">
        <code className="text-xs bg-muted px-2 py-1 rounded truncate block">{provider.envVarName}</code>
      </div>
    </div>
  )
}

// Top Models Card (mobile-friendly)
function TopModelsCard({ model }: { model: typeof MODELS[0] }) {
  const [modelId, label, tier, sweScore, ctx, providerKey] = model
  
  return (
    <div className="rounded-lg border bg-card p-3 sm:p-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm sm:text-base truncate">{label}</p>
          <p className="text-xs text-muted-foreground font-mono truncate">{modelId}</p>
        </div>
        <TierBadge tier={tier as Tier} />
      </div>
      <div className="mt-2 flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
        <span className="font-mono">{sweScore}</span>
        <span>•</span>
        <span>{ctx}</span>
        <span>•</span>
        <span className="truncate">{providers[providerKey as ProviderKey]?.name || providerKey}</span>
      </div>
    </div>
  )
}

// Top Models Table (desktop)
function TopModelsTable() {
  const topModels = MODELS.filter(([, , tier]) => tier === 'S+' || tier === 'S')
    .slice(0, 10)
  
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-base sm:text-lg font-semibold flex items-center">
          <Star className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-500" />
          Top Tier Models
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-medium">Model</th>
              <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-medium">Tier</th>
              <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-medium hidden sm:table-cell">SWE Score</th>
              <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-medium hidden md:table-cell">Context</th>
              <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-medium hidden sm:table-cell">Provider</th>
            </tr>
          </thead>
          <tbody>
            {topModels.map(([modelId, label, tier, sweScore, ctx, providerKey]) => (
              <tr key={modelId} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-2 sm:p-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{label}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate">{modelId}</p>
                  </div>
                </td>
                <td className="p-2 sm:p-3"><TierBadge tier={tier as Tier} /></td>
                <td className="p-2 sm:p-3 font-mono text-sm hidden sm:table-cell">{sweScore}</td>
                <td className="p-2 sm:p-3 text-sm hidden md:table-cell">{ctx}</td>
                <td className="p-2 sm:p-3 hidden sm:table-cell">
                  <span className="text-xs sm:text-sm text-muted-foreground truncate block">
                    {providers[providerKey as ProviderKey]?.name || providerKey}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Top Models Grid (mobile)
function TopModelsGrid() {
  const topModels = MODELS.filter(([, , tier]) => tier === 'S+' || tier === 'S')
    .slice(0, 6)
  
  return (
    <div className="space-y-3">
      {topModels.map((model) => (
        <TopModelsCard key={model[0]} model={model} />
      ))}
    </div>
  )
}

// Tier Distribution
function TierDistribution() {
  const tierCounts = TIER_ORDER_CONST.reduce((acc, tier) => {
    acc[tier] = MODELS.filter(([, , t]) => t === tier).length
    return acc
  }, {} as Record<Tier, number>)
  
  const total = MODELS.length
  
  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
        <Database className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
        Tier Distribution
      </h2>
      <div className="space-y-2 sm:space-y-3">
        {TIER_ORDER_CONST.map((tier) => {
          const count = tierCounts[tier]
          const percentage = ((count / total) * 100).toFixed(1)
          
          return (
            <div key={tier} className="flex items-center space-x-2 sm:space-x-3">
              <TierBadge tier={tier} />
              <div className="flex-1 min-w-0">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-muted-foreground w-14 sm:w-16 text-right flex-shrink-0">
                {count} ({percentage}%)
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function HomePage() {
  const totalModels = MODELS.length
  const totalProviders = Object.keys(providers).length
  const topTierCount = MODELS.filter(([, , tier]) => tier === 'S+' || tier === 'S').length
  const avgSweScore = (MODELS.reduce((sum, [, , , score]) => {
    const num = parseFloat(score.replace('%', ''))
    return sum + (isNaN(num) ? 0 : num)
  }, 0) / totalModels).toFixed(1)
  
  const providerModelCounts = Object.keys(providers).reduce((acc, key) => {
    acc[key as ProviderKey] = MODELS.filter(([, , , , , pk]) => pk === key).length
    return acc
  }, {} as Record<ProviderKey, number>)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="text-center py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          ModelsFree
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
          Find the fastest coding LLM models — ping free models from multiple providers, 
          pick the best one for OpenCode, Cursor, or any AI coding assistant.
        </p>
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
          <Link 
            href="/explorer"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-center"
          >
            Explore Models
          </Link>
          <Link 
            href="/compare"
            className="px-6 py-3 border rounded-lg font-medium hover:bg-muted transition-colors text-center"
          >
            Compare Models
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Models"
          value={totalModels}
          description="Across all providers"
          icon={Cpu}
          trend="+5 this month"
        />
        <StatCard
          title="Providers"
          value={totalProviders}
          description="API endpoints available"
          icon={Globe}
        />
        <StatCard
          title="Top Tier (S+/S)"
          value={topTierCount}
          description="Elite frontier coders"
          icon={Star}
        />
        <StatCard
          title="Avg SWE Score"
          value={`${avgSweScore}%`}
          description="SWE-bench Verified"
          icon={Zap}
        />
      </div>

      {/* Providers Grid */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Providers</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Object.keys(providers).map((key) => (
            <ProviderCard 
              key={key} 
              providerKey={key as ProviderKey}
              modelCount={providerModelCounts[key as ProviderKey]}
            />
          ))}
        </div>
      </div>

      {/* Two Column Layout - Desktop / Single Column - Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          {/* Show grid on mobile, table on desktop */}
          <div className="lg:hidden">
            <div className="rounded-lg border bg-card shadow-sm mb-3">
              <div className="p-4 border-b">
                <h2 className="text-base font-semibold flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  Top Tier Models
                </h2>
              </div>
            </div>
            <TopModelsGrid />
          </div>
          <div className="hidden lg:block">
            <TopModelsTable />
          </div>
        </div>
        <div>
          <TierDistribution />
        </div>
      </div>
    </div>
  )
}
