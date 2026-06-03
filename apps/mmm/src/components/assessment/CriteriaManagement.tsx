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
  isLoading,
  errorMessage,
  onClose,
  frameworkId,
}: CriteriaManagementProps) {
  const queryClient = useQueryClient();
  const [mpsCriteriaStates, setMpsCriteriaStates] = useState<Record<string, PerMpsCriteriaState>>({});
  const [addCriteriaDrafts, setAddCriteriaDrafts] = useState<Record<string, string>>({});

  const resetAllStates = useCallback(() => {
    setMpsCriteriaStates({});
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
          <h2 className="modal-title">Create Criteria</h2>
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
                          <ol className="modal-list">
                            {criteriaRows.map((criterion) => (
                              <li
                                key={criterion.id}
                                className="modal-list__item"
                                data-testid="criteria-row"
                              >
                                <strong>{criterion.code}</strong> — {criterion.name} (sort order:{' '}
                                {criterion.sort_order})
                              </li>
                            ))}
                          </ol>
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
