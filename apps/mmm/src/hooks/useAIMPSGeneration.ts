import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { GeneratedMpsDraft } from './useDomainAuditBuilder';

export function useAIMPSGeneration() {
  const [generatedMPSs, setGeneratedMPSs] = useState<GeneratedMpsDraft[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMPSsForDomain = async (domainName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const prompt = `Generate 3 mini performance statements for the "${domainName}" domain. Return JSON array items with code, name, and intent_statement fields.`;
      const { data, error: invokeError } = await supabase.functions.invoke('maturion-ai-chat', {
        body: { prompt, context: 'MPS generation', currentDomain: domainName },
      });

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      const response = (data?.response || data?.content || '').toString();
      const parsed = JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim() || '[]') as Array<{
        code?: string;
        name?: string;
        intent_statement?: string;
      }>;

      const normalized = parsed
        .filter((row) => row.code && row.name)
        .slice(0, 3)
        .map((row, index) => ({
          code: row.code ?? `GEN-${index + 1}`,
          name: row.name ?? `Generated MPS ${index + 1}`,
          intent_statement: row.intent_statement ?? '',
        }));

      if (normalized.length === 0) {
        throw new Error('No AI MPS output was returned.');
      }

      setGeneratedMPSs(normalized);
      return normalized;
    } catch (err) {
      const fallback = [
        { code: 'GEN-1', name: `${domainName} governance baseline`, intent_statement: 'Define accountable ownership for the domain.' },
        { code: 'GEN-2', name: `${domainName} operational control`, intent_statement: 'Establish repeatable operational control checks.' },
        { code: 'GEN-3', name: `${domainName} assurance evidence`, intent_statement: 'Track auditable evidence and review cadence.' },
      ];
      setGeneratedMPSs(fallback);
      setError(err instanceof Error ? err.message : 'Failed to generate MPSs.');
      return fallback;
    } finally {
      setIsLoading(false);
    }
  };

  return { generatedMPSs, isLoading, error, generateMPSsForDomain };
}
