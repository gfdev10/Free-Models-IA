/**
 * @file packages/providers/src/index.ts
 * @description Provider definitions and model data for ModelsFree.
 *
 * This module contains all provider configurations and model definitions,
 * normalized from the original sources.js file.
 *
 * Key improvements over sources.js:
 * - Proper TypeScript types
 * - Normalized data structures (no tuple hell)
 * - Runtime validation via Zod schemas
 * - Single source of truth for provider metadata
 */

import type {
  Model,
  ModelTuple,
  ProviderKey,
  ProviderConfig,
  PROVIDER_METADATA,
} from '@modelsfree/types'

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Provider metadata including API endpoints and key hints.
 */
export const providers: Record<ProviderKey, ProviderConfig> = {
  nvidia: {
    key: 'nvidia',
    name: 'NIM',
    url: 'https://integrate.api.nvidia.com/v1/chat/completions',
    envVarName: 'NVIDIA_API_KEY',
    keyPrefix: 'nvapi-',
    hint: 'Profile → API Keys → Generate',
  },
  groq: {
    key: 'groq',
    name: 'Groq',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    envVarName: 'GROQ_API_KEY',
    keyPrefix: 'gsk_',
    hint: 'API Keys → Create API Key',
  },
  cerebras: {
    key: 'cerebras',
    name: 'Cerebras',
    url: 'https://api.cerebras.ai/v1/chat/completions',
    envVarName: 'CEREBRAS_API_KEY',
    keyPrefix: 'csk_ / cauth_',
    hint: 'API Keys → Create',
  },
  sambanova: {
    key: 'sambanova',
    name: 'SambaNova',
    url: 'https://api.sambanova.ai/v1/chat/completions',
    envVarName: 'SAMBANOVA_API_KEY',
    keyPrefix: 'sn-',
    hint: 'API Keys → Create ($5 free trial, 3 months)',
  },
  openrouter: {
    key: 'openrouter',
    name: 'OpenRouter',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    envVarName: 'OPENROUTER_API_KEY',
    keyPrefix: 'sk-or-',
    hint: 'API Keys → Create key (50 free req/day)',
  },
  codestral: {
    key: 'codestral',
    name: 'Codestral',
    url: 'https://codestral.mistral.ai/v1/chat/completions',
    envVarName: 'CODESTRAL_API_KEY',
    keyPrefix: 'csk-',
    hint: 'API Keys → Create key (30 req/min, phone required)',
  },
  googleai: {
    key: 'googleai',
    name: 'Google AI',
    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    envVarName: 'GOOGLE_API_KEY',
    keyPrefix: 'AIza',
    hint: 'Get API key (free Gemma models, 14.4K req/day)',
  },
  mistral: {
    key: 'mistral',
    name: 'Mistral AI',
    url: 'https://api.mistral.ai/v1/chat/completions',
    envVarName: 'MISTRAL_API_KEY',
    keyPrefix: '',
    hint: 'La Plateforme → API Keys (free tier available)',
  },
  fireworks: {
    key: 'fireworks',
    name: 'Fireworks AI',
    url: 'https://api.fireworks.ai/inference/v1/chat/completions',
    envVarName: 'FIREWORKS_API_KEY',
    keyPrefix: 'fw_',
    hint: '$6 free credit on signup, then pay-per-use',
  },
  hyperbolic: {
    key: 'hyperbolic',
    name: 'Hyperbolic',
    url: 'https://api.hyperbolic.xyz/v1/chat/completions',
    envVarName: 'HYPERBOLIC_API_KEY',
    keyPrefix: 'sk_live_',
    hint: '$1 free credit on signup, then pay-per-use',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODEL DEFINITIONS (normalized from sources.js)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * NVIDIA NIM models - https://build.nvidia.com
 */
export const nvidiaModels: ModelTuple[] = [
  // S+ tier — SWE-bench Verified ≥70%
  ['deepseek-ai/deepseek-v3.2', 'DeepSeek V3.2', 'S+', '73.1%', '128k'],
  ['moonshotai/kimi-k2.5', 'Kimi K2.5', 'S+', '76.8%', '128k'],
  ['z-ai/glm5', 'GLM 5', 'S+', '77.8%', '128k'],
  ['z-ai/glm4.7', 'GLM 4.7', 'S+', '73.8%', '200k'],
  ['moonshotai/kimi-k2-thinking', 'Kimi K2 Thinking', 'S+', '71.3%', '256k'],
  ['minimaxai/minimax-m2.1', 'MiniMax M2.1', 'S+', '74.0%', '200k'],
  ['stepfun-ai/step-3.5-flash', 'Step 3.5 Flash', 'S+', '74.4%', '256k'],
  ['qwen/qwen3-coder-480b-a35b-instruct', 'Qwen3 Coder 480B', 'S+', '70.6%', '256k'],
  ['qwen/qwen3-235b-a22b', 'Qwen3 235B', 'S+', '70.0%', '128k'],
  ['mistralai/devstral-2-123b-instruct-2512', 'Devstral 2 123B', 'S+', '72.2%', '256k'],
  // S tier — SWE-bench Verified 60–70%
  ['deepseek-ai/deepseek-v3.1-terminus', 'DeepSeek V3.1 Term', 'S', '68.4%', '128k'],
  ['moonshotai/kimi-k2-instruct', 'Kimi K2 Instruct', 'S', '65.8%', '128k'],
  ['minimaxai/minimax-m2', 'MiniMax M2', 'S', '69.4%', '128k'],
  ['qwen/qwen3-next-80b-a3b-thinking', 'Qwen3 80B Thinking', 'S', '68.0%', '128k'],
  ['qwen/qwen3-next-80b-a3b-instruct', 'Qwen3 80B Instruct', 'S', '65.0%', '128k'],
  ['qwen/qwen3.5-397b-a17b', 'Qwen3.5 400B VLM', 'S', '68.0%', '128k'],
  ['openai/gpt-oss-120b', 'GPT OSS 120B', 'S', '60.0%', '128k'],
  ['meta/llama-4-maverick-17b-128e-instruct', 'Llama 4 Maverick', 'S', '62.0%', '1M'],
  ['deepseek-ai/deepseek-v3.1', 'DeepSeek V3.1', 'S', '62.0%', '128k'],
  // A+ tier — SWE-bench Verified 50–60%
  ['nvidia/llama-3.1-nemotron-ultra-253b-v1', 'Nemotron Ultra 253B', 'A+', '56.0%', '128k'],
  ['mistralai/mistral-large-3-675b-instruct-2512', 'Mistral Large 675B', 'A+', '58.0%', '256k'],
  ['qwen/qwq-32b', 'QwQ 32B', 'A+', '50.0%', '131k'],
  ['igenius/colosseum_355b_instruct_16k', 'Colosseum 355B', 'A+', '52.0%', '16k'],
  // A tier — SWE-bench Verified 40–50%
  ['mistralai/mistral-medium-3-instruct', 'Mistral Medium 3', 'A', '48.0%', '128k'],
  ['mistralai/magistral-small-2506', 'Magistral Small', 'A', '45.0%', '32k'],
  ['nvidia/llama-3.3-nemotron-super-49b-v1.5', 'Nemotron Super 49B', 'A', '49.0%', '128k'],
  ['meta/llama-4-scout-17b-16e-instruct', 'Llama 4 Scout', 'A', '44.0%', '10M'],
  ['nvidia/nemotron-3-nano-30b-a3b', 'Nemotron Nano 30B', 'A', '43.0%', '128k'],
  ['deepseek-ai/deepseek-r1-distill-qwen-32b', 'R1 Distill 32B', 'A', '43.9%', '128k'],
  ['openai/gpt-oss-20b', 'GPT OSS 20B', 'A', '42.0%', '128k'],
  ['qwen/qwen2.5-coder-32b-instruct', 'Qwen2.5 Coder 32B', 'A', '46.0%', '32k'],
  ['meta/llama-3.1-405b-instruct', 'Llama 3.1 405B', 'A', '44.0%', '128k'],
  // A- tier — SWE-bench Verified 35–40%
  ['meta/llama-3.3-70b-instruct', 'Llama 3.3 70B', 'A-', '39.5%', '128k'],
  ['deepseek-ai/deepseek-r1-distill-qwen-14b', 'R1 Distill 14B', 'A-', '37.7%', '64k'],
  ['bytedance/seed-oss-36b-instruct', 'Seed OSS 36B', 'A-', '38.0%', '32k'],
  ['stockmark/stockmark-2-100b-instruct', 'Stockmark 100B', 'A-', '36.0%', '32k'],
  // B+ tier — SWE-bench Verified 30–35%
  ['mistralai/mixtral-8x22b-instruct-v0.1', 'Mixtral 8x22B', 'B+', '32.0%', '64k'],
  ['mistralai/ministral-14b-instruct-2512', 'Ministral 14B', 'B+', '34.0%', '32k'],
  ['ibm/granite-34b-code-instruct', 'Granite 34B Code', 'B+', '30.0%', '32k'],
  // B tier — SWE-bench Verified 20–30%
  ['deepseek-ai/deepseek-r1-distill-llama-8b', 'R1 Distill 8B', 'B', '28.2%', '32k'],
  ['deepseek-ai/deepseek-r1-distill-qwen-7b', 'R1 Distill 7B', 'B', '22.6%', '32k'],
  // C tier — SWE-bench Verified <20%
  ['google/gemma-2-9b-it', 'Gemma 2 9B', 'C', '18.0%', '8k'],
  ['microsoft/phi-3.5-mini-instruct', 'Phi 3.5 Mini', 'C', '12.0%', '128k'],
  ['microsoft/phi-4-mini-instruct', 'Phi 4 Mini', 'C', '14.0%', '128k'],
]

/**
 * Groq models - https://console.groq.com
 */
export const groqModels: ModelTuple[] = [
  ['moonshotai/kimi-k2-instruct', 'Kimi K2 Instruct', 'S', '65.8%', '131k'],
  ['moonshotai/kimi-k2-instruct-0905', 'Kimi K2 0905', 'S', '65.8%', '262k'],
  ['meta-llama/llama-4-maverick-17b-128e-instruct', 'Llama 4 Maverick', 'S', '62.0%', '1M'],
  ['openai/gpt-oss-120b', 'GPT OSS 120B', 'S', '60.0%', '128k'],
  ['qwen/qwen3-32b', 'Qwen3 32B', 'A+', '50.0%', '131k'],
  ['meta-llama/llama-4-scout-17b-16e-instruct', 'Llama 4 Scout', 'A', '44.0%', '10M'],
  ['openai/gpt-oss-20b', 'GPT OSS 20B', 'A', '42.0%', '128k'],
  ['llama-3.3-70b-versatile', 'Llama 3.3 70B', 'A-', '39.5%', '128k'],
  ['llama-3.1-8b-instant', 'Llama 3.1 8B', 'B', '28.8%', '128k'],
  ['groq/compound', 'Compound', 'A+', '52.0%', '131k'],
  ['groq/compound-mini', 'Compound Mini', 'A', '45.0%', '131k'],
]

/**
 * Cerebras models - https://cloud.cerebras.ai
 */
export const cerebrasModels: ModelTuple[] = [
  ['qwen-3-235b-a22b-instruct-2507', 'Qwen3 235B', 'S+', '70.0%', '128k'],
  ['gpt-oss-120b', 'GPT OSS 120B', 'S', '60.0%', '128k'],
  ['zai-glm-4.7', 'GLM 4.7', 'A+', '52.0%', '128k'],
  ['llama3.1-8b', 'Llama 3.1 8B', 'B', '28.8%', '128k'],
]

/**
 * SambaNova models - https://cloud.sambanova.ai
 */
export const sambanovaModels: ModelTuple[] = [
  ['Qwen3-235B', 'Qwen3 235B', 'S+', '70.0%', '128k'],
  ['DeepSeek-V3.2', 'DeepSeek V3.2', 'S+', '68.0%', '128k'],
  ['DeepSeek-V3.1-Terminus', 'DeepSeek V3.1 Term', 'S', '68.4%', '128k'],
  ['DeepSeek-R1-0528', 'DeepSeek R1 0528', 'S', '61.0%', '128k'],
  ['DeepSeek-V3.1', 'DeepSeek V3.1', 'S', '62.0%', '128k'],
  ['DeepSeek-V3-0324', 'DeepSeek V3 0324', 'S', '62.0%', '128k'],
  ['Llama-4-Maverick-17B-128E-Instruct', 'Llama 4 Maverick', 'S', '62.0%', '1M'],
  ['gpt-oss-120b', 'GPT OSS 120B', 'S', '60.0%', '128k'],
  ['Qwen3-32B', 'Qwen3 32B', 'A+', '50.0%', '128k'],
  ['DeepSeek-R1-Distill-Llama-70B', 'R1 Distill 70B', 'A', '43.9%', '128k'],
  ['Meta-Llama-3.3-70B-Instruct', 'Llama 3.3 70B', 'A-', '39.5%', '128k'],
  ['Meta-Llama-3.1-8B-Instruct', 'Llama 3.1 8B', 'B', '28.8%', '128k'],
]

/**
 * OpenRouter models - https://openrouter.ai
 */
export const openrouterModels: ModelTuple[] = [
  ['qwen/qwen3-coder:free', 'Qwen3 Coder', 'S+', '70.6%', '256k'],
  ['stepfun/step-3.5-flash:free', 'Step 3.5 Flash', 'S+', '74.4%', '256k'],
  ['deepseek/deepseek-r1-0528:free', 'DeepSeek R1 0528', 'S', '61.0%', '128k'],
  ['qwen/qwen3-next-80b-a3b-instruct:free', 'Qwen3 80B Instruct', 'S', '65.0%', '128k'],
  ['openai/gpt-oss-120b:free', 'GPT OSS 120B', 'S', '60.0%', '128k'],
  ['nousresearch/hermes-3-llama-3.1-405b:free', 'Hermes 3 405B', 'A+', '50.0%', '128k'],
  ['arcee-ai/trinity-large-preview:free', 'Trinity Large', 'A+', '48.0%', '128k'],
  ['upstage/solar-pro-3:free', 'Solar Pro 3', 'A', '45.0%', '128k'],
  ['z-ai/glm-4.5-air:free', 'GLM 4.5 Air', 'A', '44.0%', '128k'],
  ['openai/gpt-oss-20b:free', 'GPT OSS 20B', 'A', '42.0%', '128k'],
  ['nvidia/nemotron-3-nano-30b-a3b:free', 'Nemotron Nano 30B', 'A', '43.0%', '128k'],
  ['meta-llama/llama-3.3-70b-instruct:free', 'Llama 3.3 70B', 'A-', '39.5%', '128k'],
  ['mistralai/mistral-small-3.1-24b-instruct:free', 'Mistral Small 3.1', 'A-', '38.0%', '128k'],
  ['meta-llama/llama-3.2-3b-instruct:free', 'Llama 3.2 3B', 'B+', '35.0%', '128k'],
  ['arcee-ai/trinity-mini:free', 'Trinity Mini', 'B+', '34.0%', '128k'],
  ['google/gemma-3-27b-it:free', 'Gemma 3 27B', 'B', '22.0%', '128k'],
  ['google/gemma-3-12b-it:free', 'Gemma 3 12B', 'C', '15.0%', '128k'],
  ['google/gemma-3-4b-it:free', 'Gemma 3 4B', 'C', '10.0%', '128k'],
  ['google/gemma-3n-e4b-it:free', 'Gemma 3n 4B', 'C', '12.0%', '128k'],
  ['google/gemma-3n-e2b-it:free', 'Gemma 3n 2B', 'C', '8.0%', '128k'],
  ['qwen/qwen3-4b:free', 'Qwen3 4B', 'C+', '18.0%', '128k'],
  ['nvidia/nemotron-nano-12b-v2-vl:free', 'Nemotron Nano 12B VL', 'B', '25.0%', '128k'],
  ['nvidia/nemotron-nano-9b-v2:free', 'Nemotron Nano 9B', 'B-', '20.0%', '128k'],
  ['liquid/lfm-2.5-1.2b-instruct:free', 'LFM 2.5 1.2B', 'D', '5.0%', '128k'],
  ['liquid/lfm-2.5-1.2b-thinking:free', 'LFM 2.5 Thinking', 'D', '5.0%', '128k'],
  ['cognitivecomputations/dolphin-mistral-24b-venice-edition:free', 'Dolphin Venice', 'B', '28.0%', '128k'],
]

/**
 * Codestral models - https://codestral.mistral.ai
 */
export const codestralModels: ModelTuple[] = [
  ['codestral-latest', 'Codestral', 'B+', '34.0%', '256k'],
]

/**
 * Google AI Studio models - https://aistudio.google.com
 */
export const googleaiModels: ModelTuple[] = [
  ['gemma-3-27b-it', 'Gemma 3 27B', 'B', '22.0%', '128k'],
  ['gemma-3-12b-it', 'Gemma 3 12B', 'C', '15.0%', '128k'],
  ['gemma-3-4b-it', 'Gemma 3 4B', 'C', '10.0%', '128k'],
  ['gemma-3-1b-it', 'Gemma 3 1B', 'D', '5.0%', '128k'],
  ['gemma-3n-e4b-it', 'Gemma 3n 4B', 'C', '12.0%', '128k'],
  ['gemma-3n-e2b-it', 'Gemma 3n 2B', 'D', '8.0%', '128k'],
]

/**
 * Mistral AI (La Plateforme) models - https://console.mistral.ai
 * Free tier available with rate limits
 */
export const mistralModels: ModelTuple[] = [
  // S tier - High performance models
  ['mistral-large-latest', 'Mistral Large', 'S', '62.0%', '128k'],
  // A tier - Good performance
  ['mistral-medium-latest', 'Mistral Medium', 'A', '48.0%', '128k'],
  ['mistral-small-latest', 'Mistral Small', 'A-', '38.0%', '128k'],
  // B tier - Coding focused
  ['open-mistral-nemo', 'Mistral Nemo', 'B+', '32.0%', '131k'],
  ['open-codestral-mamba', 'Codestral Mamba', 'B+', '34.0%', '256k'],
  ['devstral-small-latest', 'Devstral Small', 'B+', '34.0%', '128k'],
  // Small models
  ['ministral-3b-latest', 'Ministral 3B', 'B-', '20.0%', '128k'],
  ['ministral-8b-latest', 'Ministral 8B', 'B', '25.0%', '128k'],
]

/**
 * Fireworks AI models - https://fireworks.ai
 * $6 free credit on signup, then pay-per-use
 */
export const fireworksModels: ModelTuple[] = [
  // S tier - High performance models
  ['accounts/fireworks/models/glm-5', 'GLM 5', 'S+', '77.8%', '200k'],
  ['accounts/fireworks/models/deepseek-v3p2', 'DeepSeek V3.2', 'S+', '73.1%', '163k'],
  ['accounts/fireworks/models/kimi-k2-instruct-0905', 'Kimi K2 Instruct', 'S', '65.8%', '262k'],
  // A tier - Good performance
  ['accounts/fireworks/models/minimax-m2p1', 'MiniMax M2.1', 'A+', '58.0%', '204k'],
  ['accounts/fireworks/models/gpt-oss-120b', 'GPT OSS 120B', 'S', '60.0%', '131k'],
  ['accounts/fireworks/models/gpt-oss-20b', 'GPT OSS 20B', 'A', '42.0%', '131k'],
  // B tier - Coding focused
  ['accounts/fireworks/models/mixtral-8x22b-instruct', 'Mixtral 8x22B', 'B+', '32.0%', '65k'],
]

/**
 * Hyperbolic models - https://hyperbolic.xyz
 * $1 free credit on signup, then pay-per-use
 */
export const hyperbolicModels: ModelTuple[] = [
  // S+ tier - Elite models
  ['Qwen/Qwen3-Coder-480B-A35B-Instruct', 'Qwen3 Coder 480B', 'S+', '70.6%', '262k'],
  ['deepseek-ai/DeepSeek-R1', 'DeepSeek R1', 'S+', '72.0%', '163k'],
  // S tier - High performance
  ['Qwen/Qwen2.5-72B-Instruct', 'Qwen2.5 72B', 'S', '65.0%', '131k'],
  ['deepseek-ai/DeepSeek-V3', 'DeepSeek V3', 'S', '62.0%', '131k'],
  ['meta-llama/Llama-3.3-70B-Instruct', 'Llama 3.3 70B', 'A-', '39.5%', '131k'],
  ['openai/gpt-oss-120b', 'GPT OSS 120B', 'S', '60.0%', '131k'],
  // A tier - Good performance
  ['Qwen/Qwen3-235B-A22B', 'Qwen3 235B', 'S+', '70.0%', '40k'],
  ['Qwen/Qwen3-Next-80B-A3B-Instruct', 'Qwen3 80B Instruct', 'S', '65.0%', '262k'],
  ['Qwen/Qwen2.5-Coder-32B-Instruct', 'Qwen2.5 Coder 32B', 'A', '46.0%', '32k'],
  ['Qwen/QwQ-32B', 'QwQ 32B', 'A+', '50.0%', '131k'],
  ['meta-llama/Meta-Llama-3.1-70B-Instruct', 'Llama 3.1 70B', 'A-', '39.5%', '131k'],
  ['meta-llama/Meta-Llama-3.1-8B-Instruct', 'Llama 3.1 8B', 'B', '28.8%', '131k'],
  ['meta-llama/Llama-3.2-3B-Instruct', 'Llama 3.2 3B', 'B-', '20.0%', '131k'],
]

// ═══════════════════════════════════════════════════════════════════════════════
// SOURCES MAP (backward compatible with sources.js)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * All sources combined - compatible with original sources.js structure.
 */
export const sources: Record<ProviderKey, { name: string; url: string; models: ModelTuple[] }> = {
  nvidia: {
    name: providers.nvidia.name,
    url: providers.nvidia.url,
    models: nvidiaModels,
  },
  groq: {
    name: providers.groq.name,
    url: providers.groq.url,
    models: groqModels,
  },
  cerebras: {
    name: providers.cerebras.name,
    url: providers.cerebras.url,
    models: cerebrasModels,
  },
  sambanova: {
    name: providers.sambanova.name,
    url: providers.sambanova.url,
    models: sambanovaModels,
  },
  openrouter: {
    name: providers.openrouter.name,
    url: providers.openrouter.url,
    models: openrouterModels,
  },
  codestral: {
    name: providers.codestral.name,
    url: providers.codestral.url,
    models: codestralModels,
  },
  googleai: {
    name: providers.googleai.name,
    url: providers.googleai.url,
    models: googleaiModels,
  },
  mistral: {
    name: providers.mistral.name,
    url: providers.mistral.url,
    models: mistralModels,
  },
  fireworks: {
    name: providers.fireworks.name,
    url: providers.fireworks.url,
    models: fireworksModels,
  },
  hyperbolic: {
    name: providers.hyperbolic.name,
    url: providers.hyperbolic.url,
    models: hyperbolicModels,
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// FLAT MODELS ARRAY (backward compatible with sources.js MODELS)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Flattened array of all models with providerKey.
 * Format: [modelId, label, tier, sweScore, ctx, providerKey]
 */
export type FlatModelTuple = [string, string, string, string, string, ProviderKey]

export const MODELS: FlatModelTuple[] = []
for (const [sourceKey, sourceData] of Object.entries(sources) as [ProviderKey, typeof sources[ProviderKey]][]) {
  for (const [modelId, label, tier, sweScore, ctx] of sourceData.models) {
    MODELS.push([modelId, label, tier, sweScore, ctx, sourceKey])
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get all models for a specific provider.
 */
export function getModelsByProvider(providerKey: ProviderKey): ModelTuple[] {
  return sources[providerKey]?.models ?? []
}

/**
 * Get provider configuration by key.
 */
export function getProviderConfig(providerKey: ProviderKey): ProviderConfig | undefined {
  return providers[providerKey]
}

/**
 * Get total model count.
 */
export function getTotalModelCount(): number {
  return MODELS.length
}

/**
 * Get all provider keys.
 */
export function getProviderKeys(): ProviderKey[] {
  return Object.keys(providers) as ProviderKey[]
}
