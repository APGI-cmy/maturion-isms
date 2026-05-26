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

export interface GeneratedCriterionItem {
  code: string;
  statement: string;
}

interface PerMpsCriteriaState {
  isGenerating: boolean;
  generatedCriteria: GeneratedCriterionItem[];
  acceptedCodes: Set<string>;
  refinePrompt: string;
  error: string | null;
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
}: CriteriaManagementProps) {
  const queryClient = useQueryClient();
  const [mpsCriteriaStates, setMpsCriteriaStates] = useState<Record<string, PerMpsCriteriaState>>({});

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
          mps_id: mpsId,
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
      const prompt =
        `Generate 3-5 audit criteria for Maturity Practice Statement "${mps.code} — ${mps.name}"` +
        ` (intent: "${mps.intent_statement ?? 'not set'}") in the "${domainName}" domain.\n` +
        (refinePrompt ? `Additional refinement context: ${refinePrompt}\n` : '') +
        `Each criterion should be specific, measurable, and auditable.\n` +
        `Return a JSON array: [{"code": "${mps.code}-C001", "statement": "..."}]\n` +
        `Return only the JSON array.`;
      const { data, error } = await supabase.functions.invoke('mmm-ai-chat-user', {
        body: {
          message: prompt,
          context: {
            workflow_stage: 'criteria_generation',
            domain_name: domainName,
            mps_code: mps.code,
          },
        },
        headers,
      });
      if (error) throw new Error((error as { message?: string }).message ?? 'AI generation failed');
      let parsed: GeneratedCriterionItem[];
      try {
        parsed = JSON.parse((data as { reply: string }).reply) as GeneratedCriterionItem[];
      } catch {
        throw new Error('Failed to parse AI response. Please try again.');
      }
      setMpsCriteriaStates((prev) => ({
        ...prev,
        [mps.id]: {
          isGenerating: false,
          generatedCriteria: parsed,
          acceptedCodes: new Set(parsed.map((c) => c.code)),
          refinePrompt,
          error: null,
        },
      }));
    } catch {
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
                       </div>
                     )}
                  </section>
                );
              })}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={() => { resetAllStates(); onClose(); }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CriteriaManagement;
