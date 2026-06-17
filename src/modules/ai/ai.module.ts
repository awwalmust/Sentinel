import { AIService } from './ai.service';
import { AIProvider } from './providers/ai-provider.interface';
import { OpenAIProvider } from './providers/openai.provider';
import { AIConfig } from './config/ai.config';

export function createAIService(config: AIConfig = AIConfig.default()): AIService {
  const providers: AIProvider[] = [];

  if (config.provider === 'openai') {
    const c = config.providers.openai;
    providers.push(new OpenAIProvider(c.apiKey));
  }

  return new AIService(providers);
}
