import { useState } from 'react';
import { supabase, getEdgeInvokeHeaders } from '../lib/supabase';
import type { GeneratedMpsDraft } from './useDomainAuditBuilder';

interface GeneratedMpsDraftRaw {
  number: number;
  title: string;
  intent: string;
  rationale: string;
}

export function useAIMPSGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const { data, error: invokeError } = await supabase.functions.invoke('mmm-ai-chat', {
        body: { message: prompt },
        headers,
      });

      if (invokeError) {
        throw new Error((invokeError as { message?: string }).message ?? 'AI generation failed');
      }

      let parsed: GeneratedMpsDraftRaw[];
      try {
        parsed = JSON.parse((data as { reply: string }).reply) as GeneratedMpsDraftRaw[];
      } catch {
        throw new Error('Failed to parse AI response. Please try again.');
      }

      return parsed.map((item) => ({ ...item, acceptance: 'session' as const }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'AI generation failed. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { generateMPSsForDomain, isLoading, error };
}
