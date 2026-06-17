export type AIProviderName = 'openai' | 'mock';

export interface OpenAIConfig {
  apiKey: string;
}

export interface AIConfigShape {
  provider: AIProviderName;
  providers: { openai: OpenAIConfig };
}

export class AIConfig implements AIConfigShape {
  provider: AIProviderName;
  providers: { openai: OpenAIConfig };

  constructor(provider: AIProviderName, providers: { openai: OpenAIConfig }) {
    this.provider = provider;
    this.providers = providers;
  }

  static default(): AIConfig {
    return new AIConfig('openai', { openai: { apiKey: process.env.OPENAI_API_KEY || '' } });
  }
}
