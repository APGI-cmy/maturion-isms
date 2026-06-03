import { useState } from 'react';
import { supabase, getEdgeInvokeHeaders } from '../lib/supabase';
import {
  defaultModeSourceContext,
  evaluateModeSourceAvailability,
  isChunkedSourceReadyForExtraction,
  resolveModeSourceContext,
} from '../lib/modeSourceContext';

interface GenerateIntentInput {
  domainName: string;
  mpsCode: string;
  mpsName: string;
  frameworkId?: string | null;
}

function normalizeLookup(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function isVerbatimMatch(sourceText: string, candidate: string): boolean {
  const source = normalizeLookup(sourceText);
  const probe = normalizeLookup(candidate);
  if (probe.length < 24) return false;
  return source.includes(probe);
}

function pickVerbatimIntentFromKnowledge(params: {
  content: string;
  mpsCode: string;
  mpsName: string;
  domainName: string;
}): string | null {
  const { content, mpsCode, mpsName, domainName } = params;
  const text = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length >= 32);

  const mpsTokens = normalizeLookup(mpsName).split(' ').filter((token) => token.length >= 4);
  const domainTokens = normalizeLookup(domainName).split(' ').filter((token) => token.length >= 4);
  const mpsCodeLookup = normalizeLookup(mpsCode);

  // Prefer explicit "MPS ... / Intent: ..." pairings when present.
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const lowered = line.toLowerCase();
    const isMpsHeading = /^mps[\s:-]/i.test(line) || lowered.includes('mps');
    if (!isMpsHeading) continue;

    const lineNorm = normalizeLookup(line);
    const lineMatchesCode = mpsCodeLookup.length > 0 && lineNorm.includes(mpsCodeLookup);
    const lineMatchesName = mpsTokens.some((token) => lowered.includes(token));
    if (!lineMatchesCode && !lineMatchesName) continue;

    for (let j = i + 1; j < Math.min(lines.length, i + 8); j += 1) {
      const next = lines[j];
      if (/^intent\s*:/i.test(next)) {
        const extracted = next.replace(/^intent\s*:\s*/i, '').trim();
        if (extracted.length >= 24) return extracted;
      }
      if (/^mps[\s:-]/i.test(next) || /^criteria[\s:-]/i.test(next)) break;
    }
  }

  const candidates: string[] = [];
  for (const line of lines) {
    const lowered = line.toLowerCase();
    const mpsScore = mpsTokens.filter((token) => lowered.includes(token)).length;
    const domainScore = domainTokens.filter((token) => lowered.includes(token)).length;
    const isVerbSentence = /^[A-Z][^.!?]*\b(?:shall|must|ensure|establish|define|set|maintain|track|verify)\b/i.test(line);
    if ((mpsScore > 0 && domainScore > 0) || (mpsScore > 1) || (isVerbSentence && mpsScore > 0)) {
      candidates.push(line.replace(/\s+/g, ' ').trim());
    }
  }

  if (candidates.length > 0) {
    const best = candidates.sort((a, b) => a.length - b.length)[0];
    return best;
  }

  const sentenceMatches = text.match(/[^.!?\n]{30,220}[.!?]/g) ?? [];
  for (const sentence of sentenceMatches) {
    const normalized = sentence.replace(/\s+/g, ' ').trim();
    const lowered = normalized.toLowerCase();
    const mpsScore = mpsTokens.filter((token) => lowered.includes(token)).length;
    if (mpsScore > 0) {
      return normalized;
    }
  }

  return null;
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
      const sourceAvailability = evaluateModeSourceAvailability(modeContext);
      if (sourceAvailability.blockingError) {
        throw new Error(sourceAvailability.blockingError);
      }

      if (frameworkId && modeContext.framework_source_type === 'VERBATIM') {
        const { data: profile } = await supabase
          .from('mmm_profiles')
          .select('organisation_id')
          .eq('id', (await supabase.auth.getUser()).data.user?.id ?? '')
          .maybeSingle();
        const orgId = profile?.organisation_id ?? null;
        if (orgId) {
          const { data: verbatimIndexedRows } = await supabase
            .from('mmm_org_source_verbatim_index')
            .select('mps_code,mps_title,intent_verbatim,domain_name,confidence')
            .eq('organisation_id', orgId)
            .ilike('domain_name', `%${domainName}%`);
          const normalizedMpsName = normalizeLookup(mpsName);
          const indexedMatch = (verbatimIndexedRows ?? []).find((row) => {
            const code = String((row as { mps_code?: unknown }).mps_code ?? '');
            const title = String((row as { mps_title?: unknown }).mps_title ?? '');
            return (
              normalizeLookup(code) === normalizeLookup(mpsCode) ||
              normalizeLookup(title) === normalizedMpsName ||
              normalizeLookup(title).includes(normalizedMpsName) ||
              normalizedMpsName.includes(normalizeLookup(title))
            );
          });
          const indexedIntent = String(
            (indexedMatch as { intent_verbatim?: unknown } | undefined)?.intent_verbatim ?? '',
          ).trim();
          if (indexedIntent) {
            return indexedIntent;
          }
        }

        const verbatimSourceDocIds = modeContext.mode_source_documents
          .filter(
            (doc) =>
              isChunkedSourceReadyForExtraction(doc) &&
              doc.tags.some((tag) => tag === 'source_mode:VERBATIM'),
          )
          .map((doc) => doc.id);
        const hasProcessedVerbatimDocs = verbatimSourceDocIds.length > 0;
        let processedVerbatimText = '';

        if (hasProcessedVerbatimDocs) {
          const { data: knowledgeRows } = await supabase
            .from('ai_knowledge')
            .select('content,chunk_index')
            .in('document_id', verbatimSourceDocIds)
            .order('chunk_index', { ascending: true });

          const joinedContent = (knowledgeRows ?? [])
            .map((row) => String((row as { content?: unknown }).content ?? ''))
            .join('\n');
          processedVerbatimText = joinedContent;
          const extractedIntent = pickVerbatimIntentFromKnowledge({
            content: joinedContent,
            mpsCode,
            mpsName,
            domainName,
          });
          if (extractedIntent) {
            return extractedIntent;
          }

          const strictPrompt =
            `Extract the exact VERBATIM intent sentence for MPS "${mpsCode} — ${mpsName}" in domain "${domainName}".\n` +
            `Return one sentence copied exactly from source text, no paraphrase, no extra text.\n\n` +
            `SOURCE TEXT:\n${joinedContent}`;
          const { data: strictData, error: strictInvokeError } = await supabase.functions.invoke('mmm-ai-chat-user', {
            body: {
              message: strictPrompt,
              context: {
                workflow_stage: 'intent_generation_verbatim_strict',
                domain_name: domainName,
                mps_code: mpsCode,
                framework_id: frameworkId ?? null,
                mode_source_strategy: modeContext.mode_source_strategy,
                mode_source_context: modeContext,
                external_research_required: false,
                tenant_isolation_required: true,
              },
            },
            headers,
          });
          if (!strictInvokeError) {
            const strictReply = (strictData as { reply?: string })?.reply?.trim() ?? '';
            if (strictReply && isVerbatimMatch(joinedContent, strictReply)) {
              return strictReply;
            }
          }
        }

        const { data: proposedDomains } = await supabase
          .from('mmm_proposed_domains')
          .select('id,name')
          .eq('framework_id', frameworkId);
        const domainLookup = normalizeLookup(domainName);
        const proposedDomain = (proposedDomains ?? []).find(
          (row) => normalizeLookup(String(row.name)) === domainLookup,
        );
        if (proposedDomain) {
          const { data: proposedMps } = await supabase
            .from('mmm_proposed_mps')
            .select('name,code,intent_statement')
            .eq('proposed_domain_id', proposedDomain.id);
          const mpsNameLookup = normalizeLookup(mpsName);
          const linkedMps = (proposedMps ?? []).find(
            (row) =>
              normalizeLookup(String(row.name)) === mpsNameLookup ||
              row.code === mpsCode,
          );
          const verbatimIntent = linkedMps?.intent_statement?.trim();
          if (
            verbatimIntent &&
            (!hasProcessedVerbatimDocs || isVerbatimMatch(processedVerbatimText, verbatimIntent))
          ) {
            return verbatimIntent;
          }
        }
        if (hasProcessedVerbatimDocs) {
          throw new Error(
            `Verbatim mode is active, but no source-faithful intent text could be extracted for ${mpsCode}. Reprocess the organisation source document and verify parsed chunk quality before regenerating.`,
          );
        }
        throw new Error(
          `Verbatim intent source is missing for ${mpsCode} in ${domainName}. Please confirm the source document is uploaded, processed, and mapped.`,
        );
      }

      const prompt =
        `Write a concise intent statement for Maturity Practice Statement "${mpsCode} — ${mpsName}" in the "${domainName}" domain.\n` +
        `Mode-source strategy: ${modeContext.mode_source_strategy}.\n` +
        `Use organisation context, selected Verbatim/Hybrid/New rules, and source documents before generic wording.\n` +
        (sourceAvailability.warnings.length > 0
          ? `Source availability warnings: ${sourceAvailability.warnings.join(' ')}\n`
          : '') +
        `Available organisation/framework source documents: ${modeContext.mode_source_documents.map((doc) => `${doc.title} (${doc.file_name}, ${doc.processing_status}, chunks=${doc.chunk_count})`).join('; ') || 'none'}.\n` +
        `Perform external web research on the organisation website and peer organisations in the same industry as supporting context only; do not override tenant source documents.\n` +
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
            external_research_required: true,
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

