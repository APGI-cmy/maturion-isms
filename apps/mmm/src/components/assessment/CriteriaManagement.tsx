/**
 * CriteriaManagement — current-app adaptation of the legacy
 * apps/maturion-maturity-legacy/src/components/assessment/CriteriaManagement.tsx
 *
 * Renders criteria grouped and scoped to the active domain and MPS data, and
 * provides per-MPS AI criteria generation with accept/reject/save lifecycle.
 * Adapted for the MMM current app without shadcn/lucide or legacy hook dependencies.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  DomainAuditCriterionRow,
  DomainAuditLevelDescriptorRow,
  DomainAuditMpsRow,
} from '../../hooks/useDomainAuditBuilder';
import { supabase, getEdgeInvokeHeaders } from '../../lib/supabase';
import { AIGeneratedCriteriaCards } from './AIGeneratedCriteriaCards';
import { EnhancedCriteriaGenerator } from './EnhancedCriteriaGenerator';
import { hasTrimmedText, toTrimmedText } from '../../lib/safeText';
import {
  defaultModeSourceContext,
  evaluateModeSourceAvailability,
  isChunkedSourceReadyForExtraction,
  resolveModeSourceContext,
} from '../../lib/modeSourceContext';
import {
  extractVerbatimCriteriaFromKnowledge,
  isSourceFaithfulStatement,
  mergeOverlappingTextChunks,
  normalizeVerbatimLookup,
} from '../../lib/verbatimCriteriaExtraction';

export interface GeneratedCriterionItem {
  code: string;
  statement: string;
  source_origin?: 'uploaded_source' | 'ai_completion' | 'subject_knowledge' | 'user_added' | 'deferred_user';
  deferred_target_mps_id?: string | null;
  created_by_display?: string | null;
}

interface PerMpsCriteriaState {
  isGenerating: boolean;
  generatedCriteria: GeneratedCriterionItem[];
  acceptedCodes: Set<string>;
  refinePrompt: string;
  error: string | null;
}

function parseCriteriaArrayFromReply(reply: string): GeneratedCriterionItem[] {
  try {
    return JSON.parse(reply) as GeneratedCriterionItem[];
  } catch {
    const start = reply.indexOf('[');
    const end = reply.lastIndexOf(']');
    if (start >= 0 && end > start) {
      const slice = reply.slice(start, end + 1);
      return JSON.parse(slice) as GeneratedCriterionItem[];
    }
    throw new Error('Failed to parse AI response. Please try again.');
  }
}

function tokenizeForMatch(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s]+/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 2),
  );
}

function resolveDeferredTargetMpsId(statement: string, mpsRows: DomainAuditMpsRow[]): string | null {
  const statementTokens = tokenizeForMatch(statement);
  let bestId: string | null = null;
  let bestScore = 0;
  for (const mps of mpsRows) {
    const mpsTokens = tokenizeForMatch(`${mps.code} ${mps.name}`);
    let score = 0;
    mpsTokens.forEach((token) => {
      if (statementTokens.has(token)) score += 1;
    });
    if (score > bestScore) {
      bestScore = score;
      bestId = mps.id;
    }
  }
  return bestScore > 0 ? bestId : null;
}

function buildFallbackCriteria(mpsCode: string, mpsName: string, domainName: string): GeneratedCriterionItem[] {
  return [
    {
      code: `${mpsCode}-C001`,
      statement: `Document and approve the ${mpsName} control design for ${domainName}.`,
    },
    {
      code: `${mpsCode}-C002`,
      statement: `Define accountable owners, review frequency, and escalation triggers for ${mpsName}.`,
    },
    {
      code: `${mpsCode}-C003`,
      statement: `Maintain auditable evidence proving ${mpsName} execution and effectiveness.`,
    },
  ];
}

function normalizeCriteriaKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

interface CriterionEditDraft {
  code: string;
  name: string;
}

interface LevelDescriptorDraft {
  level: number;
  label: string;
  descriptor_text: string;
}

interface CriterionActionMessage {
  type: 'success' | 'error';
  text: string;
}

const MATURITY_LEVELS: Array<{ level: number; label: string; guidance: string }> = [
  {
    level: 1,
    label: 'Basic',
    guidance: 'majority of requirements are not in place or remain informal and vulnerable',
  },
  {
    level: 2,
    label: 'Reactive',
    guidance: 'some requirements are in place, but execution is inconsistent and response-led',
  },
  {
    level: 3,
    label: 'Compliant',
    guidance: 'requirements are in place, documented, communicated, and managed in a clear framework',
  },
  {
    level: 4,
    label: 'Proactive',
    guidance: 'the process is optimised, measured, improved, and anticipates future events',
  },
  {
    level: 5,
    label: 'Resilient',
    guidance: 'the requirement is internalised, owned by everyone, and resilient under stress',
  },
];

function dedupeCriteria(criteria: GeneratedCriterionItem[]): GeneratedCriterionItem[] {
  const seen = new Set<string>();
  const next: GeneratedCriterionItem[] = [];
  for (const item of criteria) {
    const key = normalizeCriteriaKey(item.statement);
    if (seen.has(key)) continue;
    seen.add(key);
    next.push(item);
  }
  return next;
}

function buildMaturityDescriptorDrafts(criterion: DomainAuditCriterionRow): LevelDescriptorDraft[] {
  return MATURITY_LEVELS.map(({ level, label, guidance }) => ({
    level,
    label,
    descriptor_text: `${label}: ${criterion.name} - ${guidance}.`,
  }));
}

function descriptorCoverage(
  criteriaRows: DomainAuditCriterionRow[],
  levelDescriptorsByCriterion: Record<string, DomainAuditLevelDescriptorRow[]>,
): { completeCriteria: number; totalDescriptors: number } {
  return criteriaRows.reduce(
    (coverage, criterion) => {
      const count = levelDescriptorsByCriterion[criterion.id]?.length ?? 0;
      return {
        completeCriteria: coverage.completeCriteria + (count >= 5 ? 1 : 0),
        totalDescriptors: coverage.totalDescriptors + count,
      };
    },
    { completeCriteria: 0, totalDescriptors: 0 },
  );
}

export interface CriteriaManagementProps {
  /** The domain currently being built. */
  domainId: string;
  /** Human-readable domain label. */
  domainName: string;
  /** Whether the panel is visible. */
  open: boolean;
  /** Loaded MPS rows for the active domain. */
  mpsRows: DomainAuditMpsRow[];
  /** Criteria rows grouped by MPS id. */
  criteriaByMps: Record<string, DomainAuditCriterionRow[]>;
  /** Level descriptors grouped by criterion id. */
  levelDescriptorsByCriterion: Record<string, DomainAuditLevelDescriptorRow[]>;
  /** Whether MPS/criteria rows are still loading. */
  isLoading: boolean;
  /** Visible error state for failed domain workflow reads. */
  errorMessage: string | null;
  /** Callback to close/cancel. */
  onClose: () => void;
  /** Framework context for Verbatim/Hybrid/New source-mode generation. */
  frameworkId?: string | null;
}

/**
 * Current-app adaptation of CriteriaManagement.
 * Provides per-MPS AI criteria generation with accept/reject/save lifecycle.
 */
export function CriteriaManagement({
  domainId,
  domainName,
  open,
  mpsRows,
  criteriaByMps,
  levelDescriptorsByCriterion,
  isLoading,
  errorMessage,
  onClose,
  frameworkId,
}: CriteriaManagementProps) {
  const queryClient = useQueryClient();
  const [mpsCriteriaStates, setMpsCriteriaStates] = useState<Record<string, PerMpsCriteriaState>>({});
  const [addCriteriaDrafts, setAddCriteriaDrafts] = useState<Record<string, string>>({});
  const [criterionEditDrafts, setCriterionEditDrafts] = useState<Record<string, CriterionEditDraft>>({});
  const [descriptorDraftsByCriterion, setDescriptorDraftsByCriterion] = useState<Record<string, LevelDescriptorDraft[]>>({});
  const [criterionActionMessages, setCriterionActionMessages] = useState<Record<string, CriterionActionMessage>>({});

  const resetAllStates = useCallback(() => {
    setMpsCriteriaStates({});
    setCriterionActionMessages({});
  }, []);

  // NBR-003: reset generation state when domainId changes
  useEffect(() => {
    resetAllStates();
  }, [domainId, resetAllStates]);

  // NBR-003: reset generation state when modal closes
  useEffect(() => {
    if (!open) {
      resetAllStates();
    }
  }, [open, resetAllStates]);

  useEffect(() => {
    const nextDrafts: Record<string, CriterionEditDraft> = {};
    Object.values(criteriaByMps).flat().forEach((criterion) => {
      nextDrafts[criterion.id] = {
        code: criterion.code,
        name: criterion.name,
      };
    });
    setCriterionEditDrafts(nextDrafts);
  }, [criteriaByMps]);

  const mpsIds = mpsRows.map((m) => m.id);

  const saveMutation = useMutation({
    mutationFn: async ({
      mpsId,
      accepted,
    }: {
      mpsId: string;
      accepted: GeneratedCriterionItem[];
    }) => {
      const { error } = await supabase.from('mmm_criteria').insert(
        accepted.map((criterion, idx) => ({
          mps_id: criterion.deferred_target_mps_id ?? mpsId,
          name: criterion.statement,
          code: criterion.code,
          sort_order: idx,
        })),
      );
      if (error) throw new Error(error.message);
      return mpsId;
    },
    onSuccess: (mpsId: string) => {
      // NBR-001: invalidate affected queries after save
      queryClient.invalidateQueries({ queryKey: ['domain-audit-criteria', mpsIds] });
      setMpsCriteriaStates((prev) => {
        const next = { ...prev };
        delete next[mpsId];
        return next;
      });
    },
    onError: (err: Error, { mpsId }) => {
      // NBR-005: surface save errors to user
      setMpsCriteriaStates((prev) => {
        const current = prev[mpsId] ?? { isGenerating: false, generatedCriteria: [], acceptedCodes: new Set(), refinePrompt: '', error: null };
        return { ...prev, [mpsId]: { ...current, error: err.message } };
      });
    },
  });

  const updateCriterionMutation = useMutation({
    mutationFn: async (criterion: DomainAuditCriterionRow) => {
      const draft = criterionEditDrafts[criterion.id];
      if (!draft?.name.trim() || !draft?.code.trim()) {
        throw new Error('Criterion code and text are required before saving.');
      }
      const { error } = await supabase
        .from('mmm_criteria')
        .update({
          code: draft.code.trim(),
          name: draft.name.trim(),
        })
        .eq('id', criterion.id);
      if (error) throw new Error(error.message);
      return criterion.id;
    },
    onSuccess: (_criterionId, criterion) => {
      queryClient.invalidateQueries({ queryKey: ['domain-audit-criteria', mpsIds] });
      setCriterionActionMessages((prev) => ({
        ...prev,
        [criterion.id]: { type: 'success', text: 'Criterion edit saved.' },
      }));
    },
    onError: (err: Error, criterion) => {
      setCriterionActionMessages((prev) => ({
        ...prev,
        [criterion.id]: { type: 'error', text: err.message },
      }));
    },
  });

  const saveDescriptorMutation = useMutation({
    mutationFn: async (criterion: DomainAuditCriterionRow) => {
      const drafts = descriptorDraftsByCriterion[criterion.id] ??
        (levelDescriptorsByCriterion[criterion.id] ?? []).map((descriptor) => ({
          level: descriptor.level,
          label: MATURITY_LEVELS.find((item) => item.level === descriptor.level)?.label ?? `Level ${descriptor.level}`,
          descriptor_text: descriptor.descriptor_text,
        }));
      if (drafts.length !== 5 || drafts.some((draft) => !draft.descriptor_text.trim())) {
        throw new Error('All five maturity level descriptors must be completed before saving.');
      }
      const { error } = await supabase.from('mmm_level_descriptors').upsert(
        drafts.map((draft) => ({
          criterion_id: criterion.id,
          level: draft.level,
          descriptor_text: draft.descriptor_text.trim(),
        })),
        { onConflict: 'criterion_id,level' },
      );
      if (error) throw new Error(error.message);
      return criterion.id;
    },
    onSuccess: (_criterionId, criterion) => {
      queryClient.invalidateQueries({ queryKey: ['domain-audit-level-descriptors'] });
      queryClient.invalidateQueries({ queryKey: ['domain-audit-criteria', mpsIds] });
      setCriterionActionMessages((prev) => ({
        ...prev,
        [criterion.id]: { type: 'success', text: 'Maturity descriptors saved.' },
      }));
    },
    onError: (err: Error, criterion) => {
      setCriterionActionMessages((prev) => ({
        ...prev,
        [criterion.id]: { type: 'error', text: err.message },
      }));
    },
  });

  const handleGenerate = async (mps: DomainAuditMpsRow) => {
    const refinePrompt = mpsCriteriaStates[mps.id]?.refinePrompt?.trim() ?? '';
    setMpsCriteriaStates((prev) => ({
      ...prev,
      [mps.id]: {
        isGenerating: true,
        generatedCriteria: [],
        acceptedCodes: new Set(),
        refinePrompt,
        error: null,
      },
    }));
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
        const primaryVerbatimSourceDoc = modeContext.mode_source_documents.find(
          (doc) =>
            isChunkedSourceReadyForExtraction(doc) &&
            doc.tags.some((tag) => tag === 'source_mode:VERBATIM'),
        );
        const verbatimSourceDocIds = primaryVerbatimSourceDoc ? [primaryVerbatimSourceDoc.id] : [];
        let processedVerbatimText = '';

        if (verbatimSourceDocIds.length > 0) {
          const { data: knowledgeRows } = await supabase
            .from('ai_knowledge')
            .select('content,chunk_index')
            .in('document_id', verbatimSourceDocIds)
            .order('chunk_index', { ascending: true });

          processedVerbatimText = mergeOverlappingTextChunks(
            (knowledgeRows ?? []).map((row) => String((row as { content?: unknown }).content ?? '')),
          );

          const sourceCriteria = extractVerbatimCriteriaFromKnowledge({
            content: processedVerbatimText,
            mpsCode: mps.code,
            mpsName: mps.name,
            domainName,
          }).map((criterion) => ({
            ...criterion,
            source_origin: 'uploaded_source' as const,
          }));

          if (sourceCriteria.length > 0) {
            const verbatimCriteria = dedupeCriteria(sourceCriteria);
            setMpsCriteriaStates((prev) => ({
              ...prev,
              [mps.id]: {
                isGenerating: false,
                generatedCriteria: verbatimCriteria,
                acceptedCodes: new Set(verbatimCriteria.map((c) => c.code)),
                refinePrompt,
                error: null,
              },
            }));
            return;
          }
        }

        const { data: proposedDomains } = await supabase
          .from('mmm_proposed_domains')
          .select('id,name')
          .eq('framework_id', frameworkId);
        const domainLookup = normalizeVerbatimLookup(domainName);
        const proposedDomain = (proposedDomains ?? []).find(
          (row) =>
            normalizeVerbatimLookup(String(row.name ?? '')) === domainLookup,
        );
        if (proposedDomain) {
          const { data: proposedMps } = await supabase
            .from('mmm_proposed_mps')
            .select('id,name,code')
            .eq('proposed_domain_id', proposedDomain.id);
          const mpsNameLookup = normalizeVerbatimLookup(mps.name);
          const linkedMps = (proposedMps ?? []).find(
            (row) =>
              normalizeVerbatimLookup(String(row.name ?? '')) ===
                mpsNameLookup || row.code === mps.code,
          );
          if (linkedMps) {
            const { data: proposedCriteria } = await supabase
              .from('mmm_proposed_criteria')
              .select('code,name,sort_order')
              .eq('proposed_mps_id', linkedMps.id)
              .order('sort_order', { ascending: true });
            const verbatimCriteria = dedupeCriteria(
              (proposedCriteria ?? []).map((row, idx) => ({
                code: row.code || `${mps.code}-C${String(idx + 1).padStart(3, '0')}`,
                statement: row.name,
                source_origin: 'uploaded_source' as const,
              })).filter((criterion) =>
                !processedVerbatimText ||
                isSourceFaithfulStatement(processedVerbatimText, criterion.statement),
              ),
            );
            if (verbatimCriteria.length > 0) {
              setMpsCriteriaStates((prev) => ({
                ...prev,
                [mps.id]: {
                  isGenerating: false,
                  generatedCriteria: verbatimCriteria,
                  acceptedCodes: new Set(verbatimCriteria.map((c) => c.code)),
                  refinePrompt,
                  error: null,
                },
              }));
              return;
            }
          }
        }
        throw new Error(
          `Verbatim mode is active, but no source Required Actions could be extracted for ${mps.code}. Reprocess the organisation source document and verify parsed chunk quality before regenerating criteria.`,
        );
      }

      const prompt =
        `Generate 3-5 audit criteria for Maturity Practice Statement "${mps.code} — ${mps.name}"` +
        ` (intent: "${mps.intent_statement ?? 'not set'}") in the "${domainName}" domain.\n` +
        `Mode-source strategy: ${modeContext.mode_source_strategy}.\n` +
        (sourceAvailability.warnings.length > 0
          ? `Source availability warnings: ${sourceAvailability.warnings.join(' ')}\n`
          : '') +
        `Available organisation/framework source documents: ${modeContext.mode_source_documents.map((doc) => `${doc.title} (${doc.file_name}, ${doc.processing_status}, chunks=${doc.chunk_count})`).join('; ') || 'none'}.\n` +
        `Perform external web research on the organisation profile and peer organisations in the same industry as supporting context only; never override tenant source documents.\n` +
        `${modeContext.source_rules.join('\n')}\n` +
        (refinePrompt ? `Additional refinement context: ${refinePrompt}\n` : '') +
        `Each criterion should be specific, measurable, and auditable.\n` +
        `Return a JSON array: [{"code": "${mps.code}-C001", "statement": "...", "source_origin": "uploaded_source|ai_completion|subject_knowledge"}]\n` +
        `Return only the JSON array.`;
      const { data, error } = await supabase.functions.invoke('mmm-ai-chat-user', {
        body: {
          message: prompt,
          context: {
            workflow_stage: 'criteria_generation',
            domain_name: domainName,
            mps_code: mps.code,
            framework_id: frameworkId ?? null,
            mode_source_strategy: modeContext.mode_source_strategy,
            mode_source_context: modeContext,
            external_research_required: true,
            tenant_isolation_required: true,
          },
        },
        headers,
      });
      if (error) throw new Error((error as { message?: string }).message ?? 'AI generation failed');
      const parsed = parseCriteriaArrayFromReply((data as { reply: string }).reply);
      const deduped = dedupeCriteria(parsed);
      setMpsCriteriaStates((prev) => ({
        ...prev,
        [mps.id]: {
          isGenerating: false,
          generatedCriteria: deduped,
          acceptedCodes: new Set(deduped.map((c) => c.code)),
          refinePrompt,
          error: null,
        },
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'AI generation failed.';
      const isSourceGate =
        message.includes('Verbatim mode requires') ||
        message.includes('Hybrid mode requires') ||
        message.includes('Verbatim criteria source is missing') ||
        message.includes('no source Required Actions could be extracted');
      if (isSourceGate) {
        setMpsCriteriaStates((prev) => ({
          ...prev,
          [mps.id]: {
            isGenerating: false,
            generatedCriteria: [],
            acceptedCodes: new Set(),
            refinePrompt,
            error: message,
          },
        }));
        return;
      }
      const fallback = buildFallbackCriteria(mps.code, mps.name, domainName);
      setMpsCriteriaStates((prev) => ({
        ...prev,
        [mps.id]: {
          isGenerating: false,
          generatedCriteria: fallback,
          acceptedCodes: new Set(fallback.map((item) => item.code)),
          refinePrompt,
          error: 'AI service unavailable. Loaded fallback criteria draft.',
        },
      }));
    }
  };

  const handleToggleCriterion = (mpsId: string, code: string) => {
    setMpsCriteriaStates((prev) => {
      const current = prev[mpsId];
      if (!current) return prev;
      const next = new Set(current.acceptedCodes);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return { ...prev, [mpsId]: { ...current, acceptedCodes: next } };
    });
  };

  const handleAcceptAll = (mpsId: string) => {
    setMpsCriteriaStates((prev) => {
      const current = prev[mpsId];
      if (!current) return prev;
      return {
        ...prev,
        [mpsId]: {
          ...current,
          acceptedCodes: new Set(current.generatedCriteria.map((c) => c.code)),
        },
      };
    });
  };

  const handleRefinePromptChange = (mpsId: string, prompt: string) => {
    setMpsCriteriaStates((prev) => {
      const current = prev[mpsId] ?? {
        isGenerating: false,
        generatedCriteria: [],
        acceptedCodes: new Set(),
        refinePrompt: '',
        error: null,
      };
      return {
        ...prev,
        [mpsId]: {
          ...current,
          refinePrompt: prompt,
        },
      };
    });
  };

  const handleSave = (mps: DomainAuditMpsRow) => {
    const state = mpsCriteriaStates[mps.id];
    if (!state) return;
    const accepted = state.generatedCriteria.filter((c) => state.acceptedCodes.has(c.code));
    if (accepted.length === 0) return;
    saveMutation.mutate({ mpsId: mps.id, accepted });
  };

  const handleSaveAllAccepted = () => {
    mpsRows.forEach((mps) => {
      const state = mpsCriteriaStates[mps.id];
      if (!state) return;
      const accepted = state.generatedCriteria.filter((c) => state.acceptedCodes.has(c.code));
      if (accepted.length === 0) return;
      saveMutation.mutate({ mpsId: mps.id, accepted });
    });
    resetAllStates();
    onClose();
  };

  const handleAddCriteria = (mps: DomainAuditMpsRow) => {
    const raw = addCriteriaDrafts[mps.id] ?? '';
    const statement = raw.trim();
    if (!statement) return;
    const targetMpsId = resolveDeferredTargetMpsId(statement, mpsRows);
    const isDeferred = Boolean(targetMpsId && targetMpsId !== mps.id);
    const state = mpsCriteriaStates[mps.id] ?? {
      isGenerating: false,
      generatedCriteria: [],
      acceptedCodes: new Set<string>(),
      refinePrompt: '',
      error: null,
    };
    const nextIndex = state.generatedCriteria.length + 1;
    const code = `${mps.code}-C${String(nextIndex).padStart(3, '0')}`;
    const added: GeneratedCriterionItem = {
      code,
      statement,
      source_origin: isDeferred ? 'deferred_user' : 'user_added',
      deferred_target_mps_id: isDeferred ? targetMpsId : null,
      created_by_display: 'current_user',
    };
    const nextGenerated = dedupeCriteria([...state.generatedCriteria, added]);
    setMpsCriteriaStates((prev) => ({
      ...prev,
      [mps.id]: {
        ...state,
        generatedCriteria: nextGenerated,
        acceptedCodes: new Set([...Array.from(state.acceptedCodes), code]),
        error: isDeferred ? 'Deferred routing detected: this criterion will be inserted under the better-fit MPS on submit.' : null,
      },
    }));
    setAddCriteriaDrafts((prev) => ({ ...prev, [mps.id]: '' }));
  };

  const handleCriterionDraftChange = (
    criterionId: string,
    field: keyof CriterionEditDraft,
    value: string,
  ) => {
    setCriterionEditDrafts((prev) => ({
      ...prev,
      [criterionId]: {
        ...(prev[criterionId] ?? { code: '', name: '' }),
        [field]: value,
      },
    }));
  };

  const getDescriptorDrafts = (criterion: DomainAuditCriterionRow): LevelDescriptorDraft[] => {
    const activeDrafts = descriptorDraftsByCriterion[criterion.id];
    if (activeDrafts) return activeDrafts;
    const storedDescriptors = levelDescriptorsByCriterion[criterion.id] ?? [];
    if (storedDescriptors.length > 0) {
      return MATURITY_LEVELS.map(({ level, label }) => {
        const stored = storedDescriptors.find((descriptor) => descriptor.level === level);
        return {
          level,
          label,
          descriptor_text: stored?.descriptor_text ?? '',
        };
      });
    }
    return [];
  };

  const handleGenerateDescriptors = (criterion: DomainAuditCriterionRow) => {
    setDescriptorDraftsByCriterion((prev) => ({
      ...prev,
      [criterion.id]: buildMaturityDescriptorDrafts(criterion),
    }));
  };

  const handleDescriptorDraftChange = (
    criterionId: string,
    level: number,
    descriptorText: string,
  ) => {
    setDescriptorDraftsByCriterion((prev) => {
      const existing =
        prev[criterionId] ??
        MATURITY_LEVELS.map(({ level: itemLevel, label }) => ({
          level: itemLevel,
          label,
          descriptor_text: '',
        }));
      return {
        ...prev,
        [criterionId]: existing.map((draft) =>
          draft.level === level ? { ...draft, descriptor_text: descriptorText } : draft,
        ),
      };
    });
  };

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Criteria Management"
      data-testid="criteria-management"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Criteria Management</h2>
          <button
            type="button"
            className="modal-close"
            aria-label="Close criteria management"
            onClick={() => { resetAllStates(); onClose(); }}
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-domain-context">
            Domain: <strong>{domainName}</strong> <span>({domainId})</span>
          </p>
          {isLoading ? (
            <p data-testid="criteria-management-loading">Loading criteria data…</p>
          ) : errorMessage ? (
            <div role="alert" data-testid="criteria-management-error">
              {errorMessage}
            </div>
          ) : mpsRows.length === 0 ? (
            <p data-testid="criteria-management-empty">
              No MPS rows are currently available for criteria grouping.
            </p>
          ) : (
            <div className="criteria-groups" data-testid="criteria-groups">
              {mpsRows.map((mps) => {
                const criteriaRows = criteriaByMps[mps.id] ?? [];
                const state = mpsCriteriaStates[mps.id];
                const coverage = descriptorCoverage(criteriaRows, levelDescriptorsByCriterion);
                const descriptorSummary =
                  criteriaRows.length > 0
                    ? `${coverage.completeCriteria}/${criteriaRows.length} criteria have full level descriptors`
                    : 'No criteria yet';
                return (
                  <section key={mps.id} className="criteria-group" data-testid="criteria-group">
                    <h3>
                      {mps.code} — {mps.name}
                    </h3>
                    <p>
                      Intent:{' '}
                      {hasTrimmedText(mps.intent_statement)
                        ? toTrimmedText(mps.intent_statement)
                        : 'No intent statement stored for this MPS yet.'}
                    </p>
                    <div className="criteria-group__dashboard" data-testid={`criteria-mps-dashboard-${mps.id}`}>
                      <span><strong>{criteriaRows.length}</strong> criteria</span>
                      <span><strong>{coverage.totalDescriptors}</strong> level descriptor statements</span>
                      <span>MPS maturity: <strong>Not rated yet</strong></span>
                      <span>{descriptorSummary}</span>
                    </div>

                    {/* Per-MPS error (NBR-005) */}
                    {state?.error ? (
                      <div
                        role="alert"
                        className="alert alert-error"
                        data-testid={`criteria-generation-error-${mps.id}`}
                      >
                        {state.error}
                      </div>
                    ) : null}

                    {state?.isGenerating ? (
                      <p data-testid={`criteria-generation-loading-${mps.id}`}>
                        Generating criteria for {mps.code}…
                      </p>
                     ) : state?.generatedCriteria && state.generatedCriteria.length > 0 ? (
                       <AIGeneratedCriteriaCards
                         mpsId={mps.id}
                         criteria={state.generatedCriteria}
                         acceptedCodes={state.acceptedCodes}
                         isSaving={saveMutation.isPending}
                         onToggleCriterion={(code) => handleToggleCriterion(mps.id, code)}
                         onAcceptAll={() => handleAcceptAll(mps.id)}
                         onSaveAccepted={() => handleSave(mps)}
                       />
                     ) : (
                       <div>
                         {criteriaRows.length === 0 ? (
                          <p>No criteria rows are currently stored for this MPS.</p>
                        ) : (
                          <div className="criteria-card-list">
                            {criteriaRows.map((criterion) => (
                              <article
                                key={criterion.id}
                                className="criteria-card"
                                data-testid="criteria-row"
                              >
                                <div className="criteria-card__header">
                                  <div>
                                    <label htmlFor={`criteria-code-${criterion.id}`}>Criterion code</label>
                                    <input
                                      id={`criteria-code-${criterion.id}`}
                                      className="form-control"
                                      value={criterionEditDrafts[criterion.id]?.code ?? criterion.code}
                                      onChange={(event) =>
                                        handleCriterionDraftChange(criterion.id, 'code', event.target.value)
                                      }
                                      data-testid={`criteria-code-input-${criterion.id}`}
                                    />
                                  </div>
                                  <div>
                                    <span>Sort order: {criterion.sort_order}</span>
                                    <span>
                                      Descriptor coverage:{' '}
                                      {(levelDescriptorsByCriterion[criterion.id] ?? []).length}/5
                                    </span>
                                  </div>
                                </div>
                                <label htmlFor={`criteria-text-${criterion.id}`}>Criterion statement</label>
                                <textarea
                                  id={`criteria-text-${criterion.id}`}
                                  className="form-control"
                                  rows={3}
                                  value={criterionEditDrafts[criterion.id]?.name ?? criterion.name}
                                  onChange={(event) =>
                                    handleCriterionDraftChange(criterion.id, 'name', event.target.value)
                                  }
                                  data-testid={`criteria-name-input-${criterion.id}`}
                                />
                                <div className="criteria-card__actions">
                                  <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => updateCriterionMutation.mutate(criterion)}
                                    disabled={updateCriterionMutation.isPending}
                                    data-testid={`criteria-save-btn-${criterion.id}`}
                                  >
                                    Save criterion edit
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => handleGenerateDescriptors(criterion)}
                                    data-testid={`generate-descriptors-btn-${criterion.id}`}
                                  >
                                    {(levelDescriptorsByCriterion[criterion.id] ?? []).length > 0
                                      ? 'Regenerate maturity descriptors'
                                      : 'Create maturity descriptors'}
                                  </button>
                                </div>
                                {criterionActionMessages[criterion.id] ? (
                                  <div
                                    className={`criteria-card__message criteria-card__message--${criterionActionMessages[criterion.id].type}`}
                                    role={criterionActionMessages[criterion.id].type === 'error' ? 'alert' : 'status'}
                                  >
                                    {criterionActionMessages[criterion.id].text}
                                  </div>
                                ) : null}

                                {getDescriptorDrafts(criterion).length > 0 ? (
                                  <div
                                    className="level-descriptor-grid"
                                    data-testid={`level-descriptor-grid-${criterion.id}`}
                                  >
                                    {getDescriptorDrafts(criterion).map((descriptor) => (
                                      <div
                                        key={descriptor.level}
                                        className={`level-descriptor-card level-descriptor-card--${descriptor.level}`}
                                      >
                                        <label htmlFor={`descriptor-${criterion.id}-${descriptor.level}`}>
                                          {descriptor.label}
                                        </label>
                                        <textarea
                                          id={`descriptor-${criterion.id}-${descriptor.level}`}
                                          className="form-control"
                                          rows={4}
                                          value={descriptor.descriptor_text}
                                          onChange={(event) =>
                                            handleDescriptorDraftChange(
                                              criterion.id,
                                              descriptor.level,
                                              event.target.value,
                                            )
                                          }
                                          data-testid={`descriptor-input-${criterion.id}-${descriptor.level}`}
                                        />
                                      </div>
                                    ))}
                                    <div className="criteria-card__actions">
                                      <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => saveDescriptorMutation.mutate(criterion)}
                                        disabled={saveDescriptorMutation.isPending}
                                        data-testid={`save-descriptors-btn-${criterion.id}`}
                                      >
                                        Save maturity descriptors
                                      </button>
                                    </div>
                                  </div>
                                ) : null}
                              </article>
                            ))}
                          </div>
                        )}
                         <EnhancedCriteriaGenerator
                           mpsId={mps.id}
                           refinePrompt={state?.refinePrompt ?? ''}
                           isGenerating={Boolean(state?.isGenerating)}
                           onRefinePromptChange={(value) => handleRefinePromptChange(mps.id, value)}
                           onGenerate={() => handleGenerate(mps)}
                         />
                         <div className="enhanced-criteria-generator" style={{ marginTop: '0.75rem' }}>
                           <label htmlFor={`criteria-add-${mps.id}`}>Add more criteria</label>
                           <textarea
                             id={`criteria-add-${mps.id}`}
                             rows={3}
                             placeholder="Add a criterion (Verb + Noun + Context)."
                             value={addCriteriaDrafts[mps.id] ?? ''}
                             onChange={(event) => {
                               setAddCriteriaDrafts((prev) => ({ ...prev, [mps.id]: event.target.value }));
                             }}
                             data-testid={`criteria-add-input-${mps.id}`}
                           />
                           <button
                             type="button"
                             className="btn btn-outline"
                             onClick={() => handleAddCriteria(mps)}
                             data-testid={`criteria-add-btn-${mps.id}`}
                           >
                             Add More Criteria
                           </button>
                         </div>
                       </div>
                     )}
                  </section>
                );
              })}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveAllAccepted}
            disabled={!Object.values(mpsCriteriaStates).some((state) => state.acceptedCodes.size > 0) || saveMutation.isPending}
          >
            Accept / Submit
          </button>
          <button type="button" className="btn btn-outline" onClick={() => { resetAllStates(); onClose(); }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CriteriaManagement;
