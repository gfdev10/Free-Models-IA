import { NextResponse } from 'next/server'

// Provider configurations
const PROVIDER_ENDPOINTS: Record<string, { url: string; model: string }> = {
  NVIDIA_API_KEY: {
    url: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'meta/llama-3.1-8b-instruct',
  },
  GROQ_API_KEY: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.1-8b-instant',
  },
  CEREBRAS_API_KEY: {
    url: 'https://api.cerebras.ai/v1/chat/completions',
    model: 'llama-3.1-8b',
  },
  SAMBANOVA_API_KEY: {
    url: 'https://api.sambanova.ai/v1/chat/completions',
    model: 'Meta-Llama-3.1-8B-Instruct',
  },
  OPENROUTER_API_KEY: {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'openrouter/free',
  },
  CODESTRAL_API_KEY: {
    url: 'https://codestral.mistral.ai/v1/chat/completions',
    model: 'codestral-latest',
  },
  GOOGLE_API_KEY: {
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemma-3-4b-it:generateContent',
    model: 'gemma-3-4b-it',
  },
  MISTRAL_API_KEY: {
    url: 'https://api.mistral.ai/v1/chat/completions',
    model: 'open-mistral-nemo',
  },
}

async function pingProvider(
  keyName: string,
  apiKey: string
): Promise<{ success: boolean; latency?: number; message?: string }> {
  const config = PROVIDER_ENDPOINTS[keyName]
  if (!config) {
    return { success: false, message: 'Unknown provider' }
  }

  const startTime = Date.now()

  try {
    // Different request formats for different providers
    if (keyName === 'GOOGLE_API_KEY') {
      // Google AI has a different API format
      const res = await fetch(`${config.url}?key=${apiKey}`, {
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
      } else {
        const error = await res.text()
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
        model: config.model,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 5,
      }),
    })

    const latency = Date.now() - startTime

    if (res.ok) {
      return { success: true, latency }
    } else if (res.status === 401) {
      return { success: false, latency, message: 'Invalid API key' }
    } else if (res.status === 429) {
      return { success: false, latency, message: 'Rate limited' }
    } else {
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
    const { provider, apiKey } = body as { provider: string; apiKey: string }

    if (!provider) {
      return NextResponse.json(
        { success: false, message: 'Provider not specified' },
        { status: 400 }
      )
    }

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: 'API key not provided' },
        { status: 400 }
      )
    }

    const result = await pingProvider(provider, apiKey)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal error' },
      { status: 500 }
    )
  }
}
