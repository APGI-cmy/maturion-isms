import { useState } from 'react';
import { supabase, getEdgeInvokeHeaders } from '../lib/supabase';
import type { GeneratedMpsDraft } from './useDomainAuditBuilder';
import { LEGACY_DOMAIN_BLUEPRINTS, normalizeDomainKey } from '../lib/legacyDomainBlueprint';
import { defaultModeSourceContext, resolveModeSourceContext } from '../lib/modeSourceContext';

interface GeneratedMpsDraftRaw {
  number: number;
  title: string;
  intent: string;
  rationale: string;
  source_origin?: 'uploaded_source' | 'ai_completion' | 'subject_knowledge';
}

interface VerbatimFrameworkRow {
  id: string;
  name: string;
  source_type: string | null;
}

interface VerbatimDomainRow {
  id: string;
  name: string;
}

interface VerbatimMpsRow {
  name: string;
  sort_order: number | null;
  intent_statement: string | null;
}

interface CanonicalDomainRow {
  id: string;
  name: string;
}

function normalizeDraftKey(value: string): string {
  return normalizeDomainKey(value).replace(/^mps-?\d+-?/i, '').trim();
}

function dedupeDraftsByTitle(drafts: GeneratedMpsDraft[]): GeneratedMpsDraft[] {
  const seen = new Set<string>();
  const deduped: GeneratedMpsDraft[] = [];
  for (const draft of drafts) {
    const key = normalizeDraftKey(draft.title);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(draft);
  }
  return deduped.map((item, index) => ({ ...item, number: index + 1 }));
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

function ensureMinimumVerbatimDrafts(
  domainName: string,
  drafts: GeneratedMpsDraft[],
  minimum = 5,
): GeneratedMpsDraft[] {
  if (drafts.length >= minimum) return drafts;
  const fallback = toFallbackDrafts(domainName);
  const seen = new Set(drafts.map((d) => normalizeDomainKey(d.title)));
  const padded = [...drafts];
  for (const item of fallback) {
    const key = normalizeDomainKey(item.title);
    if (seen.has(key)) continue;
    padded.push(item);
    seen.add(key);
    if (padded.length >= minimum) break;
  }
  return padded.map((item, index) => ({ ...item, number: index + 1 }));
}

export function useAIMPSGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastConsultedResources, setLastConsultedResources] = useState<string[]>([]);

  const setFallbackWarning = (reason?: string) => {
    const detail = reason ? ` (${reason})` : '';
    setError(`AI service unavailable${detail}. Loaded legacy fallback MPS pack for this domain.`);
  };

  const loadVerbatimDraftsFromFramework = async (
    frameworkId: string,
    domainName: string,
  ): Promise<GeneratedMpsDraft[] | null> => {
    const { data: framework } = await supabase
      .from('mmm_frameworks')
      .select('id,name,source_type')
      .eq('id', frameworkId)
      .maybeSingle<VerbatimFrameworkRow>();

    if (!framework) {
      return null;
    }

    const { data: proposedDomains } = await supabase
      .from('mmm_proposed_domains')
      .select('id,name')
      .eq('framework_id', frameworkId);
    const proposedDomainRows = (proposedDomains ?? []) as VerbatimDomainRow[];

    const lookup = normalizeDomainKey(domainName);
    const matched = proposedDomainRows.find((d) => normalizeDomainKey(d.name) === lookup);
    if (matched) {
      const { data: proposedMps } = await supabase
        .from('mmm_proposed_mps')
        .select('name,sort_order,intent_statement')
        .eq('proposed_domain_id', matched.id)
        .order('sort_order', { ascending: true });
      const proposedMpsRows = (proposedMps ?? []) as VerbatimMpsRow[];

      if (proposedMpsRows.length > 0) {
        return proposedMpsRows.map((row, idx) => ({
          number: Number.isFinite(row.sort_order ?? NaN) ? Number(row.sort_order) : idx + 1,
          title: row.name,
          intent: row.intent_statement?.trim() || `Maintain ${row.name}.`,
          rationale: 'Verbatim extraction from uploaded framework source.',
          acceptance: 'session' as const,
        }));
      }
    }

    // Canonical fallback when proposed rows were already compiled/cleaned.
    const { data: canonicalDomains } = await supabase
      .from('mmm_domains')
      .select('id,name')
      .eq('framework_id', frameworkId);
    const canonicalDomainRows = (canonicalDomains ?? []) as CanonicalDomainRow[];
    const canonicalMatched = canonicalDomainRows.find(
      (d) => normalizeDomainKey(d.name) === lookup,
    );
    if (!canonicalMatched) return null;

    const { data: canonicalMps } = await supabase
      .from('mmm_maturity_process_steps')
      .select('name,sort_order,intent_statement')
      .eq('domain_id', canonicalMatched.id)
      .order('sort_order', { ascending: true });
    const canonicalMpsRows = (canonicalMps ?? []) as VerbatimMpsRow[];

    if (canonicalMpsRows.length === 0) {
      return null;
    }

    return canonicalMpsRows.map((row, idx) => ({
      number: Number.isFinite(row.sort_order ?? NaN) ? Number(row.sort_order) + 1 : idx + 1,
      title: row.name,
      intent: row.intent_statement?.trim() || `Maintain ${row.name}.`,
      rationale: 'Verbatim extraction from compiled framework domain.',
      acceptance: 'session' as const,
    }));
  };

  const generateMPSsForDomain = async (
    domainName: string,
    options?: { frameworkId?: string | null; sourceDomainId?: string | null },
  ): Promise<GeneratedMpsDraft[]> => {
    setIsLoading(true);
    setError(null);
    try {
      let headers: Record<string, string>;
      try {
        headers = await getEdgeInvokeHeaders();
      } catch {
        throw new Error('Please log in to use AI generation features.');
      }

      let frameworkSourceType: string | null = null;
      let frameworkName: string | null = null;
      const modeContext = options?.frameworkId
        ? await resolveModeSourceContext(options.frameworkId)
        : defaultModeSourceContext(null);
      setLastConsultedResources(
        modeContext.mode_source_documents.map(
          (doc) => `${doc.title} (${doc.file_name}, ${doc.processing_status})`,
        ),
      );

      if (options?.frameworkId) {
        // Verbatim mode must prefer source-parse artifacts before reusing mutable runtime rows.
        const verbatimDrafts = await loadVerbatimDraftsFromFramework(options.frameworkId, domainName);
        if (verbatimDrafts && verbatimDrafts.length > 0) {
          return ensureMinimumVerbatimDrafts(
            domainName,
            dedupeDraftsByTitle(verbatimDrafts),
            5,
          );
        }

        // Secondary preference: exact resolved domain context already supplied by the workflow.
        if (options?.sourceDomainId) {
          const { data: directMps } = await supabase
            .from('mmm_maturity_process_steps')
            .select('name,sort_order,intent_statement')
            .eq('domain_id', options.sourceDomainId)
            .order('sort_order', { ascending: true });
          const directMpsRows = (directMps ?? []) as VerbatimMpsRow[];
          if (directMpsRows.length > 0) {
            const directDrafts = directMpsRows.map((row, idx) => ({
              number: Number.isFinite(row.sort_order ?? NaN) ? Number(row.sort_order) + 1 : idx + 1,
              title: row.name,
              intent: row.intent_statement?.trim() || `Maintain ${row.name}.`,
              rationale: 'Verbatim extraction from resolved domain context.',
              acceptance: 'session' as const,
            }));
            return ensureMinimumVerbatimDrafts(
              domainName,
              dedupeDraftsByTitle(directDrafts),
              5,
            );
          }
        }

        const { data: fw } = await supabase
          .from('mmm_frameworks')
          .select('name,source_type')
          .eq('id', options.frameworkId)
          .maybeSingle();
        frameworkSourceType = (fw?.source_type as string | undefined) ?? null;
        frameworkName = (fw?.name as string | undefined) ?? null;
      }

      frameworkSourceType = frameworkSourceType ?? modeContext.framework_source_type;
      frameworkName = frameworkName ?? modeContext.framework_name;

      const sourceInstruction =
        frameworkSourceType === 'VERBATIM'
          ? 'STRICT VERBATIM MODE: Use the uploaded framework-source document wording and structure as primary source. Do not invent new MPS content unless the source is missing an equivalent statement.'
          : frameworkSourceType === 'HYBRID'
          ? 'HYBRID MODE: Blend uploaded framework-source content with generated improvements.'
          : 'NEW GENERATION MODE: Generate new MPS content from organisational and subject-knowledge context.';

      const prompt =
        `Generate 5 Maturity Practice Statements (MPSs) for the "${domainName}" domain in a maturity assessment framework.\n` +
        `${sourceInstruction}\n` +
        `Mode-source strategy: ${modeContext.mode_source_strategy}.\n` +
        `Organisation: ${modeContext.organisation_name ?? 'unknown'}.\n` +
        `Available organisation/framework source documents: ${modeContext.mode_source_documents.map((doc) => `${doc.title} (${doc.file_name}, ${doc.processing_status}, chunks=${doc.chunk_count})`).join('; ') || 'none'}.\n` +
        `${modeContext.source_rules.join('\n')}\n` +
        `${frameworkName ? `Framework: ${frameworkName}\n` : ''}` +
        `Each MPS should describe a specific expectation. Return a JSON array with this structure:\n` +
        `[{"number": 1, "title": "...", "intent": "...", "rationale": "...", "source_origin": "uploaded_source|ai_completion|subject_knowledge"}]\n` +
        `Return only the JSON array, no additional text.`;

      const requestBody = {
        message: prompt,
        context: {
          workflow_stage: 'mps_generation',
          domain_name: domainName,
          framework_id: options?.frameworkId ?? null,
          framework_source_type: frameworkSourceType ?? null,
          criteria_mode: frameworkSourceType ?? null,
          verbatim_required: frameworkSourceType === 'VERBATIM',
          mode_source_strategy: modeContext.mode_source_strategy,
          mode_source_context: modeContext,
          tenant_isolation_required: true,
        },
      };

      let data: Record<string, unknown> = {};
      const invokeResult = await supabase.functions.invoke('mmm-ai-chat-user', {
        body: requestBody,
        headers,
      });

      if (invokeResult.error) {
        // Fallback diagnostic request to expose concrete edge payloads instead of generic non-2xx message.
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
          const endpoint = `${supabaseUrl}/functions/v1/mmm-ai-chat-user`;
          const diagnosticResponse = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
          });
          const raw = await diagnosticResponse.text();
          try {
            data = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
          } catch {
            data = { message: raw };
          }
          const detail =
            (data.detail as string | undefined) ??
            (data.reason as string | undefined) ??
            (data.error as string | undefined) ??
            (data.message as string | undefined) ??
            (invokeResult.error as { message?: string }).message ??
            `HTTP ${diagnosticResponse.status}`;
          throw new Error(detail);
        } catch (diagnosticError) {
          throw new Error(
            diagnosticError instanceof Error
              ? diagnosticError.message
              : ((invokeResult.error as { message?: string }).message ?? 'AI generation failed'),
          );
        }
      }

      data = ((invokeResult.data as Record<string, unknown> | null) ?? {});

      let parsed: GeneratedMpsDraftRaw[];
      try {
        parsed = JSON.parse((data as { reply: string }).reply) as GeneratedMpsDraftRaw[];
      } catch (parseError) {
        setFallbackWarning(parseError instanceof Error ? parseError.message : undefined);
        return toFallbackDrafts(domainName);
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        setFallbackWarning('Empty or invalid AI payload');
        return toFallbackDrafts(domainName);
      }

      return dedupeDraftsByTitle(parsed.map((item) => ({ ...item, acceptance: 'session' as const })));
    } catch (err: unknown) {
      setFallbackWarning(err instanceof Error ? err.message : undefined);
      return toFallbackDrafts(domainName);
    } finally {
      setIsLoading(false);
    }
  };

  return { generateMPSsForDomain, isLoading, error, lastConsultedResources };
}
