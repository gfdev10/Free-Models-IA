/**
 * OpenCode CLI Integration
 * 
 * This module provides utilities to generate OpenCode configuration
 * from ModelsFree model data.
 * 
 * OpenCode config file location: ~/.opencode.json
 * 
 * Supported providers in OpenCode:
 * - anthropic, openai, gemini, groq, openrouter, azure, bedrock, vertexai, copilot
 * - NVIDIA NIM via LOCAL_ENDPOINT (OpenAI-compatible API)
 */

import type { ProviderKey } from '@modelsfree/types'

// OpenCode provider names
export type OpenCodeProvider = 
  | 'anthropic' 
  | 'openai' 
  | 'gemini' 
  | 'groq' 
  | 'openrouter' 
  | 'azure' 
  | 'bedrock' 
  | 'vertexai'
  | 'copilot'
  | 'nvidia' // Via LOCAL_ENDPOINT

// OpenCode model ID mapping
// Maps ModelsFree (provider, modelId) to OpenCode model ID
export const OPENCODE_MODEL_MAP: Record<string, OpenCodeProvider> = {
  // Groq models
  'groq:qwen-qwq-32b': 'groq',
  'groq:llama-3.3-70b-versatile': 'groq',
  'groq:meta-llama/llama-4-scout-17b-16e-instruct': 'groq',
  'groq:meta-llama/llama-4-maverick-17b-128e-instruct': 'groq',
  'groq:deepseek-r1-distill-llama-70b': 'groq',
  
  // OpenRouter models (prefix: openrouter.)
  'openrouter:openai/gpt-4.1': 'openrouter',
  'openrouter:openai/gpt-4.1-mini': 'openrouter',
  'openrouter:openai/gpt-4o': 'openrouter',
  'openrouter:openai/gpt-4o-mini': 'openrouter',
  'openrouter:anthropic/claude-3.5-sonnet': 'openrouter',
  'openrouter:anthropic/claude-3.7-sonnet': 'openrouter',
  'openrouter:google/gemini-2.5-flash-preview:thinking': 'openrouter',
  'openrouter:deepseek/deepseek-r1-0528:free': 'openrouter',
  
  // Google AI models
  'googleai:gemini-2.5-pro-preview-03-25': 'gemini',
  'googleai:gemini-2.5-flash-preview-04-17': 'gemini',
  'googleai:gemini-2.0-flash': 'gemini',
  
  // NVIDIA NIM (via LOCAL_ENDPOINT - OpenAI-compatible)
  'nvidia:meta/llama-3.1-405b-instruct': 'nvidia',
  'nvidia:meta/llama-3.1-70b-instruct': 'nvidia',
  'nvidia:meta/llama-3.3-70b-instruct': 'nvidia',
  'nvidia:meta/llama-3.2-1b-instruct': 'nvidia',
  'nvidia:meta/llama-3.2-3b-instruct': 'nvidia',
  'nvidia:meta/llama-3.2-11b-vision-instruct': 'nvidia',
  'nvidia:meta/llama-3.2-90b-vision-instruct': 'nvidia',
  'nvidia:deepseek-ai/deepseek-r1': 'nvidia',
  'nvidia:qwen/qwen2.5-7b-instruct': 'nvidia',
  'nvidia:qwen/qwen2.5-32b-instruct': 'nvidia',
  'nvidia:qwen/qwen2.5-72b-instruct': 'nvidia',
  'nvidia:mistralai/mistral-large': 'nvidia',
  'nvidia:google/gemma-2-2b-it': 'nvidia',
  'nvidia:google/gemma-2-9b-it': 'nvidia',
  'nvidia:google/gemma-2-27b-it': 'nvidia',
  
  // Cerebras (not directly supported, suggest OpenRouter)
  'cerebras:llama-3.3-70b': 'openrouter',
  
  // SambaNova (not directly supported, suggest OpenRouter)
  'sambanova:Meta-Llama-3.3-70B-Instruct': 'openrouter',
}

// Model ID conversion map for OpenCode format
export const OPENCODE_MODEL_ID_MAP: Record<string, string> = {
  // Groq
  'groq:qwen-qwq-32b': 'qwen-qwq',
  'groq:llama-3.3-70b-versatile': 'llama-3.3-70b-versatile',
  'groq:meta-llama/llama-4-scout-17b-16e-instruct': 'meta-llama/llama-4-scout-17b-16e-instruct',
  'groq:meta-llama/llama-4-maverick-17b-128e-instruct': 'meta-llama/llama-4-maverick-17b-128e-instruct',
  'groq:deepseek-r1-distill-llama-70b': 'deepseek-r1-distill-llama-70b',
  
  // OpenRouter (prefix with openrouter.)
  'openrouter:openai/gpt-4.1': 'openrouter.gpt-4.1',
  'openrouter:openai/gpt-4.1-mini': 'openrouter.gpt-4.1-mini',
  'openrouter:openai/gpt-4o': 'openrouter.gpt-4o',
  'openrouter:openai/gpt-4o-mini': 'openrouter.gpt-4o-mini',
  'openrouter:anthropic/claude-3.5-sonnet': 'openrouter.claude-3.5-sonnet',
  'openrouter:anthropic/claude-3.7-sonnet': 'openrouter.claude-3.7-sonnet',
  'openrouter:google/gemini-2.5-flash-preview:thinking': 'openrouter.gemini-2.5-flash',
  'openrouter:deepseek/deepseek-r1-0528:free': 'openrouter.deepseek-r1-free',
  
  // Google AI (direct)
  'googleai:gemini-2.5-pro-preview-03-25': 'gemini-2.5-pro',
  'googleai:gemini-2.5-flash-preview-04-17': 'gemini-2.5-flash',
  'googleai:gemini-2.0-flash': 'gemini-2.0-flash',
  
  // NVIDIA NIM (uses model ID directly with LOCAL_ENDPOINT)
  'nvidia:meta/llama-3.1-405b-instruct': 'meta/llama-3.1-405b-instruct',
  'nvidia:meta/llama-3.1-70b-instruct': 'meta/llama-3.1-70b-instruct',
  'nvidia:meta/llama-3.3-70b-instruct': 'meta/llama-3.3-70b-instruct',
  'nvidia:meta/llama-3.2-1b-instruct': 'meta/llama-3.2-1b-instruct',
  'nvidia:meta/llama-3.2-3b-instruct': 'meta/llama-3.2-3b-instruct',
  'nvidia:meta/llama-3.2-11b-vision-instruct': 'meta/llama-3.2-11b-vision-instruct',
  'nvidia:meta/llama-3.2-90b-vision-instruct': 'meta/llama-3.2-90b-vision-instruct',
  'nvidia:deepseek-ai/deepseek-r1': 'deepseek-ai/deepseek-r1',
  'nvidia:qwen/qwen2.5-7b-instruct': 'qwen/qwen2.5-7b-instruct',
  'nvidia:qwen/qwen2.5-32b-instruct': 'qwen/qwen2.5-32b-instruct',
  'nvidia:qwen/qwen2.5-72b-instruct': 'qwen/qwen2.5-72b-instruct',
  'nvidia:mistralai/mistral-large': 'mistralai/mistral-large',
  'nvidia:google/gemma-2-2b-it': 'google/gemma-2-2b-it',
  'nvidia:google/gemma-2-9b-it': 'google/gemma-2-9b-it',
  'nvidia:google/gemma-2-27b-it': 'google/gemma-2-27b-it',
}

// API Key environment variable mapping
export const OPENCODE_ENV_VAR_MAP: Record<OpenCodeProvider, string> = {
  anthropic: 'ANTHROPIC_API_KEY',
  openai: 'OPENAI_API_KEY',
  gemini: 'GEMINI_API_KEY',
  groq: 'GROQ_API_KEY',
  openrouter: 'OPENROUTER_API_KEY',
  azure: 'AZURE_OPENAI_API_KEY',
  bedrock: 'AWS_ACCESS_KEY_ID',
  vertexai: 'GOOGLE_APPLICATION_CREDENTIALS',
  copilot: 'GITHUB_TOKEN',
  nvidia: 'NVIDIA_API_KEY',
}

// ModelsFree provider to OpenCode provider mapping
export const MODELSFREE_TO_OPENCODE_PROVIDER: Partial<Record<ProviderKey, OpenCodeProvider>> = {
  groq: 'groq',
  openrouter: 'openrouter',
  googleai: 'gemini',
  nvidia: 'nvidia', // NVIDIA NIM via LOCAL_ENDPOINT
}

/**
 * Check if a model is supported in OpenCode
 */
export function isOpenCodeSupported(providerKey: ProviderKey, modelId: string): boolean {
  const key = `${providerKey}:${modelId}`
  return key in OPENCODE_MODEL_ID_MAP || providerKey in MODELSFREE_TO_OPENCODE_PROVIDER
}

/**
 * Get OpenCode model ID from ModelsFree model
 */
export function getOpenCodeModelId(providerKey: ProviderKey, modelId: string): string | null {
  const key = `${providerKey}:${modelId}`
  
  // Check exact match first
  if (OPENCODE_MODEL_ID_MAP[key]) {
    return OPENCODE_MODEL_ID_MAP[key]
  }
  
  // For Groq, use the model ID directly
  if (providerKey === 'groq') {
    return modelId
  }
  
  // For OpenRouter, prefix with openrouter.
  if (providerKey === 'openrouter') {
    // Convert model ID to OpenCode format
    const sanitizedId = modelId
      .replace(/\//g, '-')
      .replace(/:/g, '-')
    return `openrouter.${sanitizedId}`
  }
  
  // For Google AI, use model ID directly
  if (providerKey === 'googleai') {
    return modelId.replace(/-preview.*$/, '').replace(/-04-17$/, '')
  }
  
  // For NVIDIA NIM, use model ID directly (works with LOCAL_ENDPOINT)
  if (providerKey === 'nvidia') {
    return modelId
  }
  
  return null
}

/**
 * Get OpenCode provider from ModelsFree provider
 */
export function getOpenCodeProvider(providerKey: ProviderKey): OpenCodeProvider | null {
  return MODELSFREE_TO_OPENCODE_PROVIDER[providerKey] || null
}

/**
 * OpenCode configuration type
 */
export interface OpenCodeConfig {
  providers?: Partial<Record<OpenCodeProvider, { apiKey: string; disabled?: boolean }>>
  agents?: {
    coder?: {
      model: string
      maxTokens?: number
      reasoningEffort?: 'low' | 'medium' | 'high'
    }
    summarizer?: {
      model: string
      maxTokens?: number
    }
    task?: {
      model: string
      maxTokens?: number
      reasoningEffort?: 'low' | 'medium' | 'high'
    }
    title?: {
      model: string
      maxTokens?: number
    }
  }
  autoCompact?: boolean
}

/**
 * Generate OpenCode configuration for a model
 */
export function generateOpenCodeConfig(
  providerKey: ProviderKey,
  modelId: string,
  apiKey: string
): OpenCodeConfig | null {
  const openCodeProvider = getOpenCodeProvider(providerKey)
  const openCodeModelId = getOpenCodeModelId(providerKey, modelId)
  
  if (!openCodeProvider || !openCodeModelId) {
    return null
  }
  
  // NVIDIA NIM uses LOCAL_ENDPOINT with OpenAI-compatible API
  if (openCodeProvider === 'nvidia') {
    return {
      providers: {
        openai: {
          apiKey,
          disabled: false,
        },
      },
      agents: {
        coder: {
          model: openCodeModelId,
          maxTokens: 5000,
        },
        summarizer: {
          model: openCodeModelId,
          maxTokens: 4000,
        },
        task: {
          model: openCodeModelId,
          maxTokens: 5000,
        },
        title: {
          model: openCodeModelId,
          maxTokens: 80,
        },
      },
      autoCompact: true,
    }
  }
  
  return {
    providers: {
      [openCodeProvider]: {
        apiKey,
        disabled: false,
      },
    },
    agents: {
      coder: {
        model: openCodeModelId,
        maxTokens: 5000,
      },
      summarizer: {
        model: openCodeModelId,
        maxTokens: 4000,
      },
      task: {
        model: openCodeModelId,
        maxTokens: 5000,
      },
      title: {
        model: openCodeModelId,
        maxTokens: 80,
      },
    },
    autoCompact: true,
  }
}

/**
 * Generate instructions for using the model in OpenCode
 */
export function generateOpenCodeInstructions(
  providerKey: ProviderKey,
  modelId: string,
  modelName: string
): { supported: boolean; instructions: string; modelId?: string; provider?: OpenCodeProvider } {
  const openCodeProvider = getOpenCodeProvider(providerKey)
  const openCodeModelId = getOpenCodeModelId(providerKey, modelId)
  
  if (!openCodeProvider || !openCodeModelId) {
    return {
      supported: false,
      instructions: `This model (${providerKey}/${modelId}) is not directly supported in OpenCode CLI. OpenCode supports: Anthropic, OpenAI, Google Gemini, Groq, OpenRouter, Azure, AWS Bedrock, NVIDIA NIM, and GitHub Copilot.`,
    }
  }
  
  const envVar = OPENCODE_ENV_VAR_MAP[openCodeProvider]
  
  // Special instructions for NVIDIA NIM (uses LOCAL_ENDPOINT)
  if (openCodeProvider === 'nvidia') {
    return {
      supported: true,
      modelId: openCodeModelId,
      provider: openCodeProvider,
      instructions: `To use "${modelName}" (NVIDIA NIM) in OpenCode CLI:

1. Set your NVIDIA API key:
   export NVIDIA_API_KEY="nvapi-xxx"

2. Set the LOCAL_ENDPOINT to NVIDIA's OpenAI-compatible API:
   export LOCAL_ENDPOINT="https://integrate.api.nvidia.com/v1"

3. Create or update ~/.opencode.json with:
   {
     "providers": {
       "openai": {
         "apiKey": "$NVIDIA_API_KEY"
       }
     },
     "agents": {
       "coder": {
         "model": "${openCodeModelId}",
         "maxTokens": 5000
       }
     }
   }

4. Run OpenCode:
   LOCAL_ENDPOINT=https://integrate.api.nvidia.com/v1 opencode

Note: NVIDIA NIM uses an OpenAI-compatible API, so it works via the LOCAL_ENDPOINT setting.
`,
    }
  }
  
  return {
    supported: true,
    modelId: openCodeModelId,
    provider: openCodeProvider,
    instructions: `To use "${modelName}" in OpenCode CLI:

1. Set your API key:
   export ${envVar}="your-api-key"

2. Create or update ~/.opencode.json with:
   {
     "providers": {
       "${openCodeProvider}": {
         "apiKey": "${envVar === 'GEMINI_API_KEY' ? 'AIza...' : 'your-key-here'}"
       }
     },
     "agents": {
       "coder": {
         "model": "${openCodeModelId}",
         "maxTokens": 5000
       }
     }
   }

3. Run OpenCode:
   opencode

4. Press Ctrl+O to select the model: ${openCodeModelId}
`,
  }
}

/**
 * Generate a shell script to launch OpenCode with the model
 */
export function generateLaunchScript(
  providerKey: ProviderKey,
  modelId: string,
  apiKey: string,
  isWindows: boolean = false
): string | null {
  const openCodeProvider = getOpenCodeProvider(providerKey)
  const openCodeModelId = getOpenCodeModelId(providerKey, modelId)
  
  if (!openCodeProvider || !openCodeModelId) {
    return null
  }
  
  const config = generateOpenCodeConfig(providerKey, modelId, apiKey)
  if (!config) return null
  
  const configJson = JSON.stringify(config, null, 2)
  
  if (isWindows) {
    // Windows batch script
    if (openCodeProvider === 'nvidia') {
      return `@echo off
REM OpenCode launcher for ${modelId}
REM Generated by ModelsFree Dashboard

SETLOCAL

REM Set NVIDIA API endpoint
SET LOCAL_ENDPOINT=https://integrate.api.nvidia.com/v1
SET NVIDIA_API_KEY=${apiKey}

REM Create config directory
IF NOT EXIST "%USERPROFILE%" mkdir "%USERPROFILE%"

REM Write config file
echo ${configJson.replace(/"/g, '""').replace(/\n/g, '\necho ')} > "%USERPROFILE%\\.opencode.json"

REM Launch OpenCode
echo Launching OpenCode with model: ${openCodeModelId}
opencode

ENDLOCAL
`
    }
    
    return `@echo off
REM OpenCode launcher for ${modelId}
REM Generated by ModelsFree Dashboard

SETLOCAL

REM Write config file
echo ${configJson.replace(/"/g, '""').replace(/\n/g, '\necho ')} > "%USERPROFILE%\\.opencode.json"

REM Launch OpenCode
echo Launching OpenCode with model: ${openCodeModelId}
opencode

ENDLOCAL
`
  }
  
  // Unix shell script
  if (openCodeProvider === 'nvidia') {
    return `#!/bin/bash
# OpenCode launcher for ${modelId}
# Generated by ModelsFree Dashboard

export LOCAL_ENDPOINT="https://integrate.api.nvidia.com/v1"
export NVIDIA_API_KEY="${apiKey}"

# Write config file
cat > ~/.opencode.json << 'EOF'
${configJson}
EOF

echo "Launching OpenCode with model: ${openCodeModelId}"
opencode
`
  }
  
  return `#!/bin/bash
# OpenCode launcher for ${modelId}
# Generated by ModelsFree Dashboard

# Write config file
cat > ~/.opencode.json << 'EOF'
${configJson}
EOF

echo "Launching OpenCode with model: ${openCodeModelId}"
opencode
`
}
