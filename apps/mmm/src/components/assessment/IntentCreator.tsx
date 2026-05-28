/**
 * IntentCreator — current-app adaptation of the legacy
 * apps/maturion-maturity-legacy/src/components/assessment/IntentCreator.tsx
 *
 * Renders intent statements for MPS rows within the active domain and provides
 * per-MPS AI intent generation with accept/edit/reject/save lifecycle.
 * Adapted for the MMM current app without shadcn/lucide or legacy hook dependencies.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { DomainAuditMpsRow } from '../../hooks/useDomainAuditBuilder';
import { supabase } from '../../lib/supabase';
import { useIntentGeneration } from '../../hooks/useIntentGeneration';
import { hasTrimmedText, toTrimmedText } from '../../lib/safeText';

interface PerMpsIntentState {
  isGenerating: boolean;
  generatedIntent: string | null;
  editedIntent: string;
  error: string | null;
}

export interface IntentCreatorProps {
  /** The domain currently being built. */
  domainId: string;
  /** Human-readable domain label. */
  domainName: string;
  /** Whether the panel is visible. */
  open: boolean;
  /** Loaded MPS rows for the active domain. */
  mpsRows: DomainAuditMpsRow[];
  /** Whether MPS rows are still loading. */
  isLoading: boolean;
  /** Visible error state for failed domain workflow reads. */
  errorMessage: string | null;
  /** Callback to close/cancel. */
  onClose: () => void;
  /** Framework context for Verbatim/Hybrid/New source-mode generation. */
  frameworkId?: string | null;
  /** Optional callback after a successful modal-level submit action. */
  onSubmitted?: () => void;
}

/**
 * Current-app adaptation of IntentCreator.
 * Provides per-MPS AI intent generation with accept/edit/reject/save lifecycle.
 */
export function IntentCreator({
  domainId,
  domainName,
  open,
  mpsRows,
  isLoading,
  errorMessage,
  onClose,
  frameworkId,
  onSubmitted,
}: IntentCreatorProps) {
  const queryClient = useQueryClient();
  const { generateIntent } = useIntentGeneration();
  const [mpsIntentStates, setMpsIntentStates] = useState<Record<string, PerMpsIntentState>>({});
  const [modalError, setModalError] = useState<string | null>(null);

  const resetAllStates = useCallback(() => {
    setMpsIntentStates({});
    setModalError(null);
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

  const saveMutation = useMutation({
    mutationFn: async ({ mpsId, intentText }: { mpsId: string; intentText: string }) => {
      const { error } = await supabase
        .from('mmm_maturity_process_steps')
        .update({ intent_statement: intentText })
        .eq('id', mpsId);
      if (error) throw new Error(error.message);
      return mpsId;
    },
    onSuccess: (mpsId: string) => {
      // NBR-001: invalidate affected queries after save
      queryClient.invalidateQueries({ queryKey: ['domain-audit-mps', domainId] });
      setMpsIntentStates((prev) => {
        const current = prev[mpsId];
        if (!current) return prev;
        return {
          ...prev,
          [mpsId]: {
            isGenerating: false,
            generatedIntent: null,
            editedIntent: '',
            error: null,
          },
        };
      });
      resetAllStates();
      onClose();
    },
    onError: (err: Error, { mpsId }) => {
      // NBR-005: surface save errors to user
      setMpsIntentStates((prev) => {
        const current = prev[mpsId] ?? { isGenerating: false, generatedIntent: null, editedIntent: '', error: null };
        return { ...prev, [mpsId]: { ...current, error: err.message } };
      });
    },
  });

  const handleGenerate = async (mps: DomainAuditMpsRow) => {
    setModalError(null);
    setMpsIntentStates((prev) => ({
      ...prev,
      [mps.id]: { isGenerating: true, generatedIntent: null, editedIntent: '', error: null },
    }));
    try {
      const reply = await generateIntent({
        domainName,
        mpsCode: mps.code,
        mpsName: mps.name,
        frameworkId,
      });
      setMpsIntentStates((prev) => ({
        ...prev,
        [mps.id]: { isGenerating: false, generatedIntent: reply, editedIntent: reply, error: null },
      }));
    } catch (err: unknown) {
      const fallbackIntent =
        `Ensure ${mps.name} (${mps.code}) is clearly defined, implemented, and evidenced within the ${domainName} domain.`;
      setMpsIntentStates((prev) => ({
        ...prev,
        [mps.id]: {
          isGenerating: false,
          generatedIntent: fallbackIntent,
          editedIntent: fallbackIntent,
          error: 'AI service unavailable. Loaded fallback intent draft.',
        },
      }));
    }
  };

  const handleEditIntent = (mpsId: string, value: string) => {
    setMpsIntentStates((prev) => {
      const current = prev[mpsId] ?? { isGenerating: false, generatedIntent: null, editedIntent: '', error: null };
      return { ...prev, [mpsId]: { ...current, editedIntent: value } };
    });
  };

  const handleAccept = (mps: DomainAuditMpsRow) => {
    const intentText = mpsIntentStates[mps.id]?.editedIntent ?? '';
    saveMutation.mutate({ mpsId: mps.id, intentText });
  };

  const hasGeneratedDrafts = mpsRows.some((mps) => {
    const state = mpsIntentStates[mps.id];
    return Boolean(state && state.generatedIntent !== null && state.generatedIntent !== undefined);
  });

  const handleAcceptAll = async () => {
    setModalError(null);
    const upserts = mpsRows
      .map((mps) => {
        const state = mpsIntentStates[mps.id];
        const candidate = state?.editedIntent ?? mps.intent_statement ?? '';
        const intentText = candidate.trim();
        if (intentText.length === 0) {
          return null;
        }
        return { id: mps.id, intent_statement: intentText };
      })
      .filter((row): row is { id: string; intent_statement: string } => row !== null);

    if (upserts.length === 0) {
      return;
    }

    const { error } = await supabase
      .from('mmm_maturity_process_steps')
      .upsert(upserts, { onConflict: 'id' });

    if (error) {
      throw new Error(error.message);
    }

    queryClient.invalidateQueries({ queryKey: ['domain-audit-mps', domainId] });
    resetAllStates();
    onSubmitted?.();
    onClose();
  };

  const handleReject = (mpsId: string) => {
    setMpsIntentStates((prev) => {
      const next = { ...prev };
      delete next[mpsId];
      return next;
    });
  };

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Intent Creator"
      data-testid="intent-creator"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Create Intent</h2>
          <button
            type="button"
            className="modal-close"
            aria-label="Close intent creator"
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
            <p data-testid="intent-creator-loading">Loading intent data…</p>
          ) : errorMessage ? (
            <div role="alert" data-testid="intent-creator-error">
              {errorMessage}
            </div>
          ) : modalError ? (
            <div role="alert" className="alert alert-error" data-testid="intent-creator-modal-error">
              {modalError}
            </div>
          ) : mpsRows.length === 0 ? (
            <p data-testid="intent-creator-empty">
              No MPS rows are currently available for intent rendering.
            </p>
          ) : (
            <ol className="modal-list" data-testid="intent-list">
              {mpsRows.map((mps) => {
                const state = mpsIntentStates[mps.id];
                return (
                  <li key={mps.id} className="modal-list__item" data-testid="intent-row">
                    <div>
                      <strong>{mps.code}</strong> — {mps.name}
                    </div>

                    {/* Per-MPS error (NBR-005) */}
                    {state?.error ? (
                      <div
                        role="alert"
                        className="alert alert-error"
                        data-testid={`intent-generation-error-${mps.id}`}
                      >
                        {state.error}
                      </div>
                    ) : null}

                    {state?.isGenerating ? (
                      <p data-testid={`intent-generation-loading-${mps.id}`}>
                        Generating intent for {mps.code}…
                      </p>
                    ) : state?.generatedIntent !== null && state?.generatedIntent !== undefined ? (
                      <div data-testid={`intent-generated-${mps.id}`}>
                        <textarea
                          value={state.editedIntent}
                          onChange={(e) => handleEditIntent(mps.id, e.target.value)}
                          aria-label={`Edit intent for ${mps.code}`}
                          data-testid={`intent-textarea-${mps.id}`}
                          rows={3}
                        />
                        <button
                          type="button"
                          className="btn btn-primary"
                          data-testid={`intent-accept-btn-${mps.id}`}
                          onClick={() => handleAccept(mps)}
                          disabled={saveMutation.isPending}
                        >
                          {saveMutation.isPending ? 'Saving…' : 'Accept / Submit'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline"
                          data-testid={`intent-reject-btn-${mps.id}`}
                          onClick={() => handleReject(mps.id)}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div>
                          {hasTrimmedText(mps.intent_statement)
                            ? toTrimmedText(mps.intent_statement)
                            : 'No intent statement stored for this MPS yet.'}
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary"
                          data-testid={`generate-intent-btn-${mps.id}`}
                          onClick={() => handleGenerate(mps)}
                        >
                          {hasTrimmedText(mps.intent_statement) ? 'Regenerate intent' : 'Generate intent'}
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              void handleAcceptAll().catch((error: unknown) => {
                const message = error instanceof Error ? error.message : 'Failed to submit intent set.';
                setModalError(message);
              });
            }}
            disabled={saveMutation.isPending || isLoading || mpsRows.length === 0 || !hasGeneratedDrafts}
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

export default IntentCreator;
