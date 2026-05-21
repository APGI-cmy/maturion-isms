import { useState } from 'react';
import { supabase, getEdgeInvokeHeaders } from '../lib/supabase';

interface GenerateIntentInput {
  domainName: string;
  mpsCode: string;
  mpsName: string;
}

export function useIntentGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateIntent = async ({
    domainName,
    mpsCode,
    mpsName,
  }: GenerateIntentInput): Promise<string> => {
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
        `Write a concise intent statement for Maturity Practice Statement "${mpsCode} — ${mpsName}" in the "${domainName}" domain.\n` +
        `The intent statement should describe the purpose and objective of this MPS in one or two sentences.\n` +
        `Return only the intent statement text, no additional formatting.`;

      const { data, error: invokeError } = await supabase.functions.invoke('mmm-ai-chat', {
        body: { message: prompt },
        headers,
      });

      if (invokeError) {
        throw new Error((invokeError as { message?: string }).message ?? 'AI generation failed');
      }

      const reply = (data as { reply: string }).reply?.trim() ?? '';
      if (!reply) {
        throw new Error('AI generation returned an empty intent statement.');
      }

      return reply;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'AI generation failed. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { generateIntent, isLoading, error };
}

