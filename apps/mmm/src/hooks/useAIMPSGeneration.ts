import { useState } from 'react';
import { supabase, getEdgeInvokeHeaders } from '../lib/supabase';
import type { GeneratedMpsDraft } from './useDomainAuditBuilder';
import { LEGACY_DOMAIN_BLUEPRINTS, normalizeDomainKey } from '../lib/legacyDomainBlueprint';

interface GeneratedMpsDraftRaw {
  number: number;
  title: string;
  intent: string;
  rationale: string;
}

function toFallbackDrafts(domainName: string): GeneratedMpsDraft[] {
  const lookup = normalizeDomainKey(domainName);
  const matchedDomain =
    LEGACY_DOMAIN_BLUEPRINTS.find((domain) => normalizeDomainKey(domain.name) === lookup) ??
    LEGACY_DOMAIN_BLUEPRINTS.find((domain) => lookup.includes(normalizeDomainKey(domain.name))) ??
    LEGACY_DOMAIN_BLUEPRINTS.find((domain) => lookup.includes(domain.slug)) ??
    LEGACY_DOMAIN_BLUEPRINTS[LEGACY_DOMAIN_BLUEPRINTS.length - 1];

  return matchedDomain.mps.map((item) => ({
    number: item.number,
    title: item.title,
    intent: item.intent,
    rationale: `Legacy fallback blueprint for ${matchedDomain.name}.`,
    acceptance: 'session' as const,
  }));
}

export function useAIMPSGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setFallbackWarning = () => {
    setError('AI service unavailable. Loaded legacy fallback MPS pack for this domain.');
  };

  const generateMPSsForDomain = async (domainName: string): Promise<GeneratedMpsDraft[]> => {
    setIsLoading(true);
    setError(null);
    try {
      let headers: Record<string, string>;
      try {
        headers = await getEdgeInvokeHeaders();
      } catch {
        throw new Error('Please log in to use AI generation features.');
      }

      const prompt =
        `Generate 5 Maturity Practice Statements (MPSs) for the "${domainName}" domain in a maturity assessment framework.\n` +
        `Each MPS should describe a specific expectation. Return a JSON array with this structure:\n` +
        `[{"number": 1, "title": "...", "intent": "...", "rationale": "..."}]\n` +
        `Return only the JSON array, no additional text.`;

      const { data, error: invokeError } = await supabase.functions.invoke('mmm-ai-chat-user', {
        body: {
          message: prompt,
          context: {
            workflow_stage: 'mps_generation',
            domain_name: domainName,
          },
        },
        headers,
      });

      if (invokeError) {
        throw new Error((invokeError as { message?: string }).message ?? 'AI generation failed');
      }

      let parsed: GeneratedMpsDraftRaw[];
      try {
        parsed = JSON.parse((data as { reply: string }).reply) as GeneratedMpsDraftRaw[];
      } catch {
        setFallbackWarning();
        return toFallbackDrafts(domainName);
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        setFallbackWarning();
        return toFallbackDrafts(domainName);
      }

      return parsed.map((item) => ({ ...item, acceptance: 'session' as const }));
    } catch (err: unknown) {
      setFallbackWarning();
      return toFallbackDrafts(domainName);
    } finally {
      setIsLoading(false);
    }
  };

  return { generateMPSsForDomain, isLoading, error };
}
