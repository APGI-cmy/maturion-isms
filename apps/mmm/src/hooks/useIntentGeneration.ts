import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useIntentGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateIntent = async (prompt: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('maturion-ai-chat', {
        body: { prompt, context: 'Intent generation' },
      });

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      const response = (data?.response || data?.content || '').toString().trim();
      if (!response) {
        throw new Error('No AI intent response was returned.');
      }

      return response;
    } catch (err) {
      const fallback = 'Maintain a documented, repeatable control objective with accountable ownership and periodic evidence review.';
      setError(err instanceof Error ? err.message : 'Failed to generate intent.');
      return fallback;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateIntent, isLoading, error };
}

