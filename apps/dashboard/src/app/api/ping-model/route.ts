import { NextResponse } from 'next/server'

// Provider configurations with their API endpoints
const PROVIDER_CONFIGS: Record<string, { 
  url: string; 
  envVar: string;
  getModelUrl?: (model: string) => string;
}> = {
  nvidia: {
    url: 'https://integrate.api.nvidia.com/v1/chat/completions',
    envVar: 'NVIDIA_API_KEY',
  },
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    envVar: 'GROQ_API_KEY',
  },
  cerebras: {
    url: 'https://api.cerebras.ai/v1/chat/completions',
    envVar: 'CEREBRAS_API_KEY',
  },
  sambanova: {
    url: 'https://api.sambanova.ai/v1/chat/completions',
    envVar: 'SAMBANOVA_API_KEY',
  },
  openrouter: {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    envVar: 'OPENROUTER_API_KEY',
  },
  codestral: {
    url: 'https://codestral.mistral.ai/v1/chat/completions',
    envVar: 'CODESTRAL_API_KEY',
  },
  googleai: {
    url: 'https://generativelanguage.googleapis.com/v1beta/models',
    envVar: 'GOOGLE_API_KEY',
    getModelUrl: (model: string) => 
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
  },
  mistral: {
    url: 'https://api.mistral.ai/v1/chat/completions',
    envVar: 'MISTRAL_API_KEY',
  },
  fireworks: {
    url: 'https://api.fireworks.ai/inference/v1/chat/completions',
    envVar: 'FIREWORKS_API_KEY',
  },
  hyperbolic: {
    url: 'https://api.hyperbolic.xyz/v1/chat/completions',
    envVar: 'HYPERBOLIC_API_KEY',
  },
  scaleway: {
    url: 'https://api.scaleway.ai/v1/chat/completions',
    envVar: 'SCALEWAY_API_KEY',
  },
}

interface PingRequest {
  provider: string
  model: string
  apiKey: string
}

async function pingModel(
  provider: string, 
  model: string, 
  apiKey: string
): Promise<{ success: boolean; latency?: number; message?: string }> {
  const config = PROVIDER_CONFIGS[provider]
  if (!config) {
    return { success: false, message: 'Unknown provider' }
  }

  const startTime = Date.now()

  try {
    // Google AI has a different API format
    if (provider === 'googleai') {
      const url = config.getModelUrl ? config.getModelUrl(model) : `${config.url}/${model}:generateContent`
      const res = await fetch(`${url}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'ping' }] }],
          generationConfig: { maxOutputTokens: 5 },
        }),
      })

      const latency = Date.now() - startTime

      if (res.ok) {
        return { success: true, latency }
      } else if (res.status === 404) {
        return { success: false, latency, message: 'Model not found' }
      } else if (res.status === 401) {
        return { success: false, latency, message: 'Invalid API key' }
      } else if (res.status === 429) {
        return { success: false, latency, message: 'Rate limited' }
      } else {
        return { success: false, latency, message: `HTTP ${res.status}` }
      }
    }

    // OpenAI-compatible API format
    const res = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 5,
      }),
    })

    const latency = Date.now() - startTime

    if (res.ok) {
      return { success: true, latency }
    } else if (res.status === 404) {
      return { success: false, latency, message: 'Model not found' }
    } else if (res.status === 401) {
      return { success: false, latency, message: 'Invalid API key' }
    } else if (res.status === 429) {
      return { success: false, latency, message: 'Rate limited' }
    } else {
      const errorText = await res.text().catch(() => '')
      return { success: false, latency, message: `HTTP ${res.status}` }
    }
  } catch (error) {
    const latency = Date.now() - startTime
    return { success: false, latency, message: 'Network error' }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { provider, model, apiKey } = body as PingRequest

    if (!provider) {
      return NextResponse.json(
        { success: false, message: 'Provider not specified' },
        { status: 400 }
      )
    }

    if (!model) {
      return NextResponse.json(
        { success: false, message: 'Model not specified' },
        { status: 400 }
      )
    }

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: 'API key not provided' },
        { status: 400 }
      )
    }

    const result = await pingModel(provider, model, apiKey)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal error' },
      { status: 500 }
    )
  }
}
