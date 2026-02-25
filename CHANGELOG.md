# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-02-24

### Fixed
- Fast Refresh issue in Explorer page - moved filter options (TIER_OPTIONS, PROVIDER_OPTIONS) outside component to prevent recreation on each render
- Live ping continuation issue - replaced module-level AbortController with useRef for proper cleanup and cancellation
- Improved live monitoring loop with proper async/await pattern and isCancelled flag for reliable stopping
- Removed ping interval selector in Settings page - now uses fixed 30-second interval for consistency with Explorer

### Added
- Live monitoring feature for API provider availability in Settings page
- Visual indicators for live monitoring status with animated pulse icon
- Start/Stop controls for live monitoring mode
- **Per-model ping testing** in Explorer page - ping each individual model, not just providers
- New `/api/ping-model` endpoint for model-specific availability testing
- Status column in Explorer table showing real-time model availability
- **Simultaneous pinging** - all models are pinged in parallel using Promise.all
- Provider filter support - ping only models from selected provider
- Fixed 30-second interval for live monitoring (optimal for all models to complete)
- **New provider: Scaleway** - Added Scaleway as 11th provider with 6 models (Llama, Mistral, Qwen)
- **OpenCode CLI integration** - "Use in OpenCode" button in Explorer page
  - Generates OpenCode config file (~/.opencode.json) for selected model
  - Supports Groq, OpenRouter, Google AI, and NVIDIA NIM providers
  - NVIDIA NIM uses LOCAL_ENDPOINT for OpenAI-compatible API
  - Copy to clipboard or download config file
  - Shows setup instructions for each model
