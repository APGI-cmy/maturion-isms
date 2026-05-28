import { useState } from 'react';
import { supabase, getEdgeInvokeHeaders } from '../lib/supabase';
import { defaultModeSourceContext, resolveModeSourceContext } from '../lib/modeSourceContext';

interface GenerateIntentInput {
  domainName: string;
  mpsCode: string;
  mpsName: string;
  frameworkId?: string | null;
}

export function useIntentGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateIntent = async ({
    domainName,
    mpsCode,
    mpsName,
    frameworkId,
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

      const modeContext = frameworkId
        ? await resolveModeSourceContext(frameworkId)
        : defaultModeSourceContext(null);

      const prompt =
        `Write a concise intent statement for Maturity Practice Statement "${mpsCode} — ${mpsName}" in the "${domainName}" domain.\n` +
        `Mode-source strategy: ${modeContext.mode_source_strategy}.\n` +
        `Use organisation context, selected Verbatim/Hybrid/New rules, and source documents before generic wording.\n` +
        `Available organisation/framework source documents: ${modeContext.mode_source_documents.map((doc) => `${doc.title} (${doc.file_name}, ${doc.processing_status}, chunks=${doc.chunk_count})`).join('; ') || 'none'}.\n` +
        `${modeContext.source_rules.join('\n')}\n` +
        `The intent statement should describe the purpose and objective of this MPS in one or two sentences.\n` +
        `Return only the intent statement text, no additional formatting.`;

      const { data, error: invokeError } = await supabase.functions.invoke('mmm-ai-chat-user', {
        body: {
          message: prompt,
          context: {
            workflow_stage: 'intent_generation',
            domain_name: domainName,
            mps_code: mpsCode,
            framework_id: frameworkId ?? null,
            mode_source_strategy: modeContext.mode_source_strategy,
            mode_source_context: modeContext,
            tenant_isolation_required: true,
          },
        },
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

