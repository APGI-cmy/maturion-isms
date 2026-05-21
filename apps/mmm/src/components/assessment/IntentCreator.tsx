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
import { supabase, getEdgeInvokeHeaders } from '../../lib/supabase';

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
}: IntentCreatorProps) {
  const queryClient = useQueryClient();
  const [mpsIntentStates, setMpsIntentStates] = useState<Record<string, PerMpsIntentState>>({});

  const resetAllStates = useCallback(() => {
    setMpsIntentStates({});
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
    setMpsIntentStates((prev) => ({
      ...prev,
      [mps.id]: { isGenerating: true, generatedIntent: null, editedIntent: '', error: null },
    }));
    try {
      let headers: Record<string, string>;
      try {
        headers = await getEdgeInvokeHeaders();
      } catch {
        throw new Error('Please log in to use AI generation features.');
      }
      const prompt =
        `Write a concise intent statement for Maturity Practice Statement "${mps.code} — ${mps.name}" in the "${domainName}" domain.\n` +
        `The intent statement should describe the purpose and objective of this MPS in one or two sentences.\n` +
        `Return only the intent statement text, no additional formatting.`;
      const { data, error } = await supabase.functions.invoke('mmm-ai-chat', {
        body: { message: prompt },
        headers,
      });
      if (error) throw new Error((error as { message?: string }).message ?? 'AI generation failed');
      const reply = (data as { reply: string }).reply?.trim() ?? '';
      setMpsIntentStates((prev) => ({
        ...prev,
        [mps.id]: { isGenerating: false, generatedIntent: reply, editedIntent: reply, error: null },
      }));
    } catch (err: unknown) {
      // NBR-005: surface generation errors to user
      setMpsIntentStates((prev) => ({
        ...prev,
        [mps.id]: {
          isGenerating: false,
          generatedIntent: null,
          editedIntent: '',
          error: err instanceof Error ? err.message : 'AI generation failed. Please try again.',
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
                          {saveMutation.isPending ? 'Saving…' : 'Accept'}
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
                          {mps.intent_statement?.trim()
                            ? mps.intent_statement
                            : 'No intent statement stored for this MPS yet.'}
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary"
                          data-testid={`generate-intent-btn-${mps.id}`}
                          onClick={() => handleGenerate(mps)}
                        >
                          {mps.intent_statement?.trim() ? 'Regenerate intent' : 'Generate intent'}
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
          <button type="button" className="btn btn-outline" onClick={() => { resetAllStates(); onClose(); }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default IntentCreator;

