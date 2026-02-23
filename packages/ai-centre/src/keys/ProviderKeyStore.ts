/**
 * ProviderKeyStore — Wave 2 implementation
 *
 * Reads provider API keys from environment variables.
 *
 * References: GRS-015 | APS §6.3 | AAD §5.9
 */
import {
  ProviderKeyNotFoundError,
  type ProviderKeyStore as IProviderKeyStore,
  type ProviderName,
} from '../types/index.js';

const ENV_VAR_MAP: Record<ProviderName, string> = {
  'github-models': 'GITHUB_TOKEN',
  openai: 'OPENAI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
  perplexity: 'PERPLEXITY_API_KEY',
  runway: 'RUNWAY_API_KEY',
};

export class ProviderKeyStore implements IProviderKeyStore {
  getKey(provider: ProviderName): string {
    const envVar = ENV_VAR_MAP[provider];
    const value = process.env[envVar];
    if (!value) {
      throw new ProviderKeyNotFoundError(provider);
    }
    return value;
  }
}
