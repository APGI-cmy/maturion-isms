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
      .eq('framework_id', frameworkId)
      .returns<VerbatimDomainRow[]>();

    const lookup = normalizeDomainKey(domainName);
    const matched = (proposedDomains ?? []).find((d) => normalizeDomainKey(d.name) === lookup);
    if (matched) {
      const { data: proposedMps } = await supabase
        .from('mmm_proposed_mps')
        .select('name,sort_order,intent_statement')
        .eq('proposed_domain_id', matched.id)
        .order('sort_order', { ascending: true })
        .returns<VerbatimMpsRow[]>();

      if (proposedMps && proposedMps.length > 0) {
        return proposedMps.map((row, idx) => ({
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
      .eq('framework_id', frameworkId)
      .returns<CanonicalDomainRow[]>();
    const canonicalMatched = (canonicalDomains ?? []).find(
      (d) => normalizeDomainKey(d.name) === lookup,
    );
    if (!canonicalMatched) return null;

    const { data: canonicalMps } = await supabase
      .from('mmm_maturity_process_steps')
      .select('name,sort_order,intent_statement')
      .eq('domain_id', canonicalMatched.id)
      .order('sort_order', { ascending: true })
      .returns<VerbatimMpsRow[]>();

    if (!canonicalMps || canonicalMps.length === 0) {
      return null;
    }

    return canonicalMps.map((row, idx) => ({
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

      // First preference: exact resolved domain context already supplied by the workflow.
      if (options?.sourceDomainId) {
        const { data: directMps } = await supabase
          .from('mmm_maturity_process_steps')
          .select('name,sort_order,intent_statement')
          .eq('domain_id', options.sourceDomainId)
          .order('sort_order', { ascending: true })
          .returns<VerbatimMpsRow[]>();
        if (directMps && directMps.length > 0) {
          return directMps.map((row, idx) => ({
            number: Number.isFinite(row.sort_order ?? NaN) ? Number(row.sort_order) + 1 : idx + 1,
            title: row.name,
            intent: row.intent_statement?.trim() || `Maintain ${row.name}.`,
            rationale: 'Verbatim extraction from resolved domain context.',
            acceptance: 'session' as const,
          }));
        }
      }

      if (options?.frameworkId) {
        const verbatimDrafts = await loadVerbatimDraftsFromFramework(options.frameworkId, domainName);
        if (verbatimDrafts && verbatimDrafts.length > 0) {
          return verbatimDrafts;
        }

        const { data: fw } = await supabase
          .from('mmm_frameworks')
          .select('name,source_type')
          .eq('id', options.frameworkId)
          .maybeSingle();
        frameworkSourceType = (fw?.source_type as string | undefined) ?? null;
        frameworkName = (fw?.name as string | undefined) ?? null;
      }

      const sourceInstruction =
        frameworkSourceType === 'VERBATIM'
          ? 'STRICT VERBATIM MODE: Use the uploaded framework-source document wording and structure as primary source. Do not invent new MPS content unless the source is missing an equivalent statement.'
          : frameworkSourceType === 'HYBRID'
          ? 'HYBRID MODE: Blend uploaded framework-source content with generated improvements.'
          : 'NEW GENERATION MODE: Generate new MPS content from organisational and subject-knowledge context.';

      const prompt =
        `Generate 5 Maturity Practice Statements (MPSs) for the "${domainName}" domain in a maturity assessment framework.\n` +
        `${sourceInstruction}\n` +
        `${frameworkName ? `Framework: ${frameworkName}\n` : ''}` +
        `Each MPS should describe a specific expectation. Return a JSON array with this structure:\n` +
        `[{"number": 1, "title": "...", "intent": "...", "rationale": "..."}]\n` +
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

      return parsed.map((item) => ({ ...item, acceptance: 'session' as const }));
    } catch (err: unknown) {
      setFallbackWarning(err instanceof Error ? err.message : undefined);
      return toFallbackDrafts(domainName);
    } finally {
      setIsLoading(false);
    }
  };

  return { generateMPSsForDomain, isLoading, error };
}
