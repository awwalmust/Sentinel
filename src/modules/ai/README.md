# AI Module

This minimal AI framework provides:

- A provider abstraction (`providers/ai-provider.interface.ts`) for plugging in different AI/threat-analysis backends.
- A lightweight example provider (`providers/openai.provider.ts`) that implements deterministic heuristics so teams can use the framework without network access.
- A simple `AIService` that aggregates provider results and selects a best summary.
- Config helper at `config/ai.config.ts` to choose providers at runtime.

## Usage

Create a service instance via `createAIService()` in `ai.module.ts` or construct `new AIService([new OpenAIProvider(apiKey)])`.

## Examples

- See `providers/openai.provider.ts` for required provider API (`analyzeThreat(event)`).
- Summaries implement the `ThreatSummary` interface in `interfaces/threat-summary.interface.ts`.

## Design notes

- Keep provider interface small and explicit so new providers (Azure, local models, LLMs) can be added.
- The `OpenAIProvider` currently uses local heuristics. Implementers can extend it to call external LLM APIs and enrich `confidence` and `description` fields.

## Acceptance

- Provider abstraction implemented.
- `ThreatSummary` interface documented.
- Configurable provider selection implemented via `AIConfig`.
