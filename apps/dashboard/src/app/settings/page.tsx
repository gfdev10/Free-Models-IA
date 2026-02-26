'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Key, Eye, EyeOff, Check, X, ExternalLink, RefreshCw, Zap, AlertCircle, HelpCircle, Activity, Pause, Play } from 'lucide-react'

// Provider metadata for display
const PROVIDER_INFO: Record<string, { name: string; url: string; envVar: string; keyPrefix?: string; hint?: string }> = {
  NVIDIA_API_KEY: {
    name: 'NVIDIA NIM',
    url: 'https://build.nvidia.com',
    envVar: 'NVIDIA_API_KEY',
    keyPrefix: 'nvapi-'
  },
  GROQ_API_KEY: {
    name: 'Groq',
    url: 'https://console.groq.com/keys',
    envVar: 'GROQ_API_KEY',
    keyPrefix: 'gsk_'
  },
  CEREBRAS_API_KEY: {
    name: 'Cerebras',
    url: 'https://cloud.cerebras.ai',
    envVar: 'CEREBRAS_API_KEY'
  },
  SAMBANOVA_API_KEY: {
    name: 'SambaNova',
    url: 'https://cloud.sambanova.ai/apis',
    envVar: 'SAMBANOVA_API_KEY'
  },
  OPENROUTER_API_KEY: {
    name: 'OpenRouter',
    url: 'https://openrouter.ai/settings/keys',
    envVar: 'OPENROUTER_API_KEY',
    keyPrefix: 'sk-or-'
  },
  CODESTRAL_API_KEY: {
    name: 'Codestral',
    url: 'https://codestral.mistral.ai',
    envVar: 'CODESTRAL_API_KEY'
  },
  GOOGLE_API_KEY: {
    name: 'Google AI',
    url: 'https://aistudio.google.com/apikey',
    envVar: 'GOOGLE_API_KEY'
  },
  MISTRAL_API_KEY: {
    name: 'Mistral AI',
    url: 'https://console.mistral.ai',
    envVar: 'MISTRAL_API_KEY'
  },
  SCALEWAY_API_KEY: {
    name: 'Scaleway',
    url: 'https://console.scaleway.com/iam/api-keys',
    envVar: 'SCALEWAY_API_KEY'
  },
}

interface KeyStatus {
  set: boolean
  preview: string
}

interface PingResult {
  provider: string
  status: 'success' | 'error' | 'pending'
  latency?: number
  message?: string
}

// Provider Card Component for mobile
function ProviderCard({
  keyName,
  info,
  status,
  isEditing,
  inputValue,
  setInputValue,
  showValue,
  setShowValue,
  saving,
  onEdit,
  onSave,
  onCancel,
  onDelete
}: {
  keyName: string
  info: typeof PROVIDER_INFO[string]
  status: KeyStatus | undefined
  isEditing: boolean
  inputValue: string
  setInputValue: (v: string) => void
  showValue: boolean
  setShowValue: (v: boolean) => void
  saving: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onDelete: () => void
}) {
  const isConfigured = status?.set

  return (
    <div className="rounded-lg border bg-card p-3 sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm sm:text-base">{info.name}</span>
            {info.hint && (
              <div className="group relative">
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {info.hint}
                </div>
              </div>
            )}
            {isConfigured ? (
              <span className="flex items-center gap-1 text-xs text-green-500">
                <Check className="h-3 w-3" />
                Configured
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <X className="h-3 w-3" />
                Not set
              </span>
            )}
          </div>
          {isConfigured && !isEditing && (
            <p className="text-xs text-muted-foreground font-mono truncate">{status?.preview}</p>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="mt-3 space-y-2">
          <div className="relative">
            <input
              type={showValue ? 'text' : 'password'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={info.keyPrefix ? `Enter key (starts with ${info.keyPrefix})` : 'Enter API key'}
              className="w-full px-3 py-2 pr-10 text-sm border rounded-md bg-background"
            />
            <button
              type="button"
              onClick={() => setShowValue(!showValue)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onSave}
              disabled={saving || !inputValue.trim()}
              className="flex-1 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={onCancel}
              disabled={saving}
              className="px-3 py-1.5 text-sm border rounded-md hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 px-3 py-1.5 text-sm border rounded-md hover:bg-muted"
          >
            {isConfigured ? 'Update' : 'Add Key'}
          </button>
          {isConfigured && (
            <button
              onClick={onDelete}
              className="px-3 py-1.5 text-sm border border-red-500/30 text-red-500 rounded-md hover:bg-red-500/10"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Provider Row Component for desktop
function ProviderRow({
  keyName,
  info,
  status,
  isEditing,
  inputValue,
  setInputValue,
  showValue,
  setShowValue,
  saving,
  onEdit,
  onSave,
  onCancel,
  onDelete
}: {
  keyName: string
  info: typeof PROVIDER_INFO[string]
  status: KeyStatus | undefined
  isEditing: boolean
  inputValue: string
  setInputValue: (v: string) => void
  showValue: boolean
  setShowValue: (v: boolean) => void
  saving: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onDelete: () => void
}) {
  const isConfigured = status?.set

  return (
    <tr className="border-b">
      <td className="p-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">{info.name}</span>
          {info.hint && (
            <div className="group relative">
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {info.hint}
              </div>
            </div>
          )}
          {isConfigured ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <X className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </td>
      <td className="p-3">
        {isEditing ? (
          <div className="relative">
            <input
              type={showValue ? 'text' : 'password'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={info.keyPrefix ? `Starts with ${info.keyPrefix}` : 'Enter API key'}
              className="w-full px-3 py-1.5 pr-10 text-sm border rounded-md bg-background font-mono"
            />
            <button
              type="button"
              onClick={() => setShowValue(!showValue)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground font-mono">
            {isConfigured ? status?.preview : '—'}
          </span>
        )}
      </td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                disabled={saving || !inputValue.trim()}
                className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={onCancel}
                disabled={saving}
                className="px-3 py-1.5 text-sm border rounded-md hover:bg-muted"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="px-3 py-1.5 text-sm border rounded-md hover:bg-muted"
              >
                {isConfigured ? 'Update' : 'Add'}
              </button>
              {isConfigured && (
                <button
                  onClick={onDelete}
                  className="px-3 py-1.5 text-sm border border-red-500/30 text-red-500 rounded-md hover:bg-red-500/10"
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function SettingsPage() {
  const [keys, setKeys] = useState<Record<string, KeyStatus>>({})
  const [loading, setLoading] = useState(true)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [showValue, setShowValue] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [pinging, setPinging] = useState(false)
  const [pingResults, setPingResults] = useState<PingResult[]>([])

  // Live monitoring state
  const [liveMonitoring, setLiveMonitoring] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const MONITORING_INTERVAL = 30 // Fixed 30 seconds interval

  // Load keys from localStorage on mount
  useEffect(() => {
    loadKeys()
  }, [])

  const loadKeys = () => {
    setLoading(true)
    const loadedKeys: Record<string, KeyStatus> = {}

    for (const keyName of Object.keys(PROVIDER_INFO)) {
      const value = localStorage.getItem(keyName)
      loadedKeys[keyName] = {
        set: !!value,
        preview: value ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}` : '',
      }
    }

    setKeys(loadedKeys)
    setLoading(false)
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const saveKey = async (keyName: string) => {
    if (!inputValue.trim()) return

    setSaving(true)
    try {
      localStorage.setItem(keyName, inputValue.trim())
      showMessage('success', 'API key saved')
      setEditingKey(null)
      setInputValue('')
      loadKeys()
    } catch {
      showMessage('error', 'Failed to save API key')
    }
    setSaving(false)
  }

  const deleteKey = async (keyName: string) => {
    try {
      localStorage.removeItem(keyName)
      showMessage('success', 'API key deleted')
      loadKeys()
    } catch {
      showMessage('error', 'Failed to delete API key')
    }
  }

  const handlePing = useCallback(async () => {
    setPinging(true)
    setPingResults([])

    const providers = Object.keys(PROVIDER_INFO)
    const results: PingResult[] = []

    for (const keyName of providers) {
      const status = keys[keyName]
      const info = PROVIDER_INFO[keyName]

      if (!status?.set) {
        results.push({
          provider: info.name,
          status: 'error',
          message: 'No API key'
        })
        setPingResults([...results])
        continue
      }

      // Get the API key from localStorage
      const apiKey = localStorage.getItem(keyName)
      if (!apiKey) {
        results.push({
          provider: info.name,
          status: 'error',
          message: 'API key not found'
        })
        setPingResults([...results])
        continue
      }

      results.push({
        provider: info.name,
        status: 'pending'
      })
      setPingResults([...results])

      try {
        const res = await fetch('/api/ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: keyName, apiKey }),
        })
        const data = await res.json()

        results[results.length - 1] = {
          provider: info.name,
          status: data.success ? 'success' : 'error',
          latency: data.latency,
          message: data.message
        }
      } catch {
        results[results.length - 1] = {
          provider: info.name,
          status: 'error',
          message: 'Ping failed'
        }
      }
      setPingResults([...results])
    }

    setPinging(false)
  }, [keys])

  // Live monitoring effect
  useEffect(() => {
    if (liveMonitoring) {
      // Run immediately
      handlePing()
      // Then run at interval
      intervalRef.current = setInterval(handlePing, MONITORING_INTERVAL * 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [liveMonitoring, handlePing])

  const toggleLiveMonitoring = () => {
    if (liveMonitoring) {
      setLiveMonitoring(false)
    } else {
      setLiveMonitoring(true)
    }
  }

  const startEditing = (keyName: string) => {
    setEditingKey(keyName)
    setInputValue('')
    setShowValue(false)
  }

  const cancelEditing = () => {
    setEditingKey(null)
    setInputValue('')
    setShowValue(false)
  }

  const providerEntries = Object.entries(PROVIDER_INFO)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">API Keys</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Configure your API keys to test provider connectivity. Keys are stored in your browser only.
        </p>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
          {message.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      {/* Security Notice */}
      <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <div className="flex items-start gap-3">
          <Key className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-medium text-sm mb-1">Your Keys, Your Browser</h3>
            <p className="text-xs text-muted-foreground">
              API keys are stored locally in your browser's localStorage. They are never sent to our servers
              except to test connectivity directly with each provider. Each user must configure their own keys.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Mobile: Card Layout */}
          <div className="md:hidden space-y-3">
            {providerEntries.map(([keyName, info]) => (
              <ProviderCard
                key={keyName}
                keyName={keyName}
                info={info}
                status={keys[keyName]}
                isEditing={editingKey === keyName}
                inputValue={inputValue}
                setInputValue={setInputValue}
                showValue={showValue}
                setShowValue={setShowValue}
                saving={saving}
                onEdit={() => startEditing(keyName)}
                onSave={() => saveKey(keyName)}
                onCancel={cancelEditing}
                onDelete={() => deleteKey(keyName)}
              />
            ))}
          </div>

          {/* Desktop: Table Layout */}
          <div className="hidden md:block rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 text-sm font-medium">Provider</th>
                  <th className="text-left p-3 text-sm font-medium">Key</th>
                  <th className="text-left p-3 text-sm font-medium">Link</th>
                  <th className="text-left p-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {providerEntries.map(([keyName, info]) => (
                  <ProviderRow
                    key={keyName}
                    keyName={keyName}
                    info={info}
                    status={keys[keyName]}
                    isEditing={editingKey === keyName}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    showValue={showValue}
                    setShowValue={setShowValue}
                    saving={saving}
                    onEdit={() => startEditing(keyName)}
                    onSave={() => saveKey(keyName)}
                    onCancel={cancelEditing}
                    onDelete={() => deleteKey(keyName)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Test All Connections Button */}
      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePing}
            disabled={pinging || liveMonitoring}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {pinging ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Test All Connections
              </>
            )}
          </button>

          {/* Live Monitoring Toggle */}
          <button
            onClick={toggleLiveMonitoring}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${liveMonitoring
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
          >
            {liveMonitoring ? (
              <>
                <Pause className="h-4 w-4" />
                Stop Monitoring
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Live Monitoring
              </>
            )}
          </button>
        </div>

        {/* Live Status Indicator */}
        {liveMonitoring && (
          <div className="flex items-center gap-2 text-sm text-green-500">
            <Activity className="h-4 w-4 animate-pulse" />
            <span>Live monitoring active - pinging every {MONITORING_INTERVAL}s</span>
          </div>
        )}
      </div>

      {/* Ping Results */}
      {pingResults.length > 0 && (
        <div className="mt-4 p-4 rounded-lg border bg-card">
          <h3 className="font-medium mb-3 text-sm">Connection Test Results</h3>
          <div className="space-y-2">
            {pingResults.map((result, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="font-medium">{result.provider}</span>
                <div className="flex items-center gap-2">
                  {result.status === 'pending' ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : result.status === 'success' ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">{result.latency}ms</span>
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-red-500">{result.message}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
