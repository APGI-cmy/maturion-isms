/**
 * MPSSelectionModal — current-app adaptation of the legacy
 * apps/maturion-maturity-legacy/src/components/assessment/MPSSelectionModal.tsx
 *
 * Renders MPS data for the active domain and provides AI-assisted MPS generation
 * with full generate/accept/refine/save lifecycle.
 * Adapted for the MMM current app without shadcn/lucide or legacy hook dependencies.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DomainAuditMpsRow, GeneratedMpsDraft as GeneratedMPSItem } from '../../hooks/useDomainAuditBuilder';
import { getEdgeInvokeHeaders, supabase } from '../../lib/supabase';
import { useAIMPSGeneration } from '../../hooks/useAIMPSGeneration';
import { hasTrimmedText, toTrimmedText } from '../../lib/safeText';

interface EditedMPSItem {
  title: string;
  intent: string;
  rationale?: string;
}

type LearningCapturePayload = {
  mpsId?: string;
  mpsNumber?: number;
  beforeTitle: string;
  afterTitle: string;
  beforeIntent: string;
  afterIntent: string;
};

export interface MPSSelectionModalProps {
  /** The domain currently being built. */
  domainId: string;
  /** Human-readable domain label. */
  domainName: string;
  /** Whether the modal is visible. */
  open: boolean;
  /** Loaded MPS rows for the active domain. */
  mpsRows: DomainAuditMpsRow[];
  /** Whether MPS rows are still loading. */
  isLoading: boolean;
  /** Visible error state for failed domain workflow reads. */
  errorMessage: string | null;
  /** Callback to close/cancel the modal. */
  onClose: () => void;
  /** Framework context for source-mode aware generation. */
  frameworkId?: string | null;
  focusMpsId?: string | null;
}

/**
 * Current-app adaptation of MPSSelectionModal.
 * Provides the MPS selection surface with AI generation lifecycle.
 */
export function MPSSelectionModal({
  domainId,
  domainName,
  open,
  mpsRows,
  isLoading,
  errorMessage,
  onClose,
  frameworkId,
  focusMpsId,
}: MPSSelectionModalProps) {
  const legacyEditContentLabel = 'Edit Content';
  const queryClient = useQueryClient();
  const {
    generateMPSsForDomain,
    isLoading: isGeneratingFromHook,
    error: hookGenerationError,
    lastConsultedResources,
  } = useAIMPSGeneration();

  const [generatedMPS, setGeneratedMPS] = useState<GeneratedMPSItem[]>([]);
  const [selectedMPSNumbers, setSelectedMPSNumbers] = useState<Set<number>>(new Set());
  const [editedMPS, setEditedMPS] = useState<Record<number, EditedMPSItem>>({});
  const [editingNumbers, setEditingNumbers] = useState<Set<number>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [editingExistingMpsId, setEditingExistingMpsId] = useState<string | null>(null);
  const [existingEditDraft, setExistingEditDraft] = useState<EditedMPSItem | null>(null);

  const resetGenerationState = useCallback(() => {
    setGeneratedMPS([]);
    setSelectedMPSNumbers(new Set());
    setEditedMPS({});
    setEditingNumbers(new Set());
    setIsGenerating(false);
    setGenerationError(null);
    setSaveError(null);
    setInfoMessage(null);
    setEditingExistingMpsId(null);
    setExistingEditDraft(null);
  }, []);

  // NBR-003: reset generation state when domainId changes
  useEffect(() => {
    resetGenerationState();
  }, [domainId, resetGenerationState]);

  // NBR-003: reset generation state when modal closes
  useEffect(() => {
    if (!open) {
      resetGenerationState();
    }
  }, [open, resetGenerationState]);

  const deriveRationale = (name: string): string =>
    `This MPS is required to ensure ${name.toLowerCase()} is explicitly defined, consistently governed, and auditable within the domain.`;

  const saveMutation = useMutation({
    mutationFn: async (selectedItems: GeneratedMPSItem[]) => {
      const table = supabase.from('mmm_maturity_process_steps') as any;
      if (typeof table.delete === 'function') {
        const { error: deleteError } = await table.delete().eq('domain_id', domainId);
        if (deleteError) throw new Error(deleteError.message);
      }

      const { error } = await supabase.from('mmm_maturity_process_steps').insert(
        selectedItems.map((mps, idx) => ({
          domain_id: domainId,
          name: editedMPS[mps.number]?.title ?? mps.title,
          code: `MPS-${mps.number}`,
          sort_order: idx,
          intent_statement: editedMPS[mps.number]?.intent ?? mps.intent ?? null,
        })),
      );
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      // NBR-001: invalidate affected queries after save
      queryClient.invalidateQueries({ queryKey: ['domain-audit-mps', domainId] });
      setInfoMessage('MPS draft saved.');
      resetGenerationState();
      onClose();
    },
    onError: (err: Error) => {
      // NBR-005: surface save errors to user
      setSaveError(err.message);
    },
  });

  const approvalStateQuery = useQuery({
    queryKey: ['mps-l1-approval-state', domainId, mpsRows.map((row) => row.id).join(',')],
    queryFn: async () => {
      if (mpsRows.length === 0) return {} as Record<string, string>;
      const { data, error } = await supabase
        .from('mmm_mps_approval_actions')
        .select('mps_id,resulting_state,created_at')
        .in('mps_id', mpsRows.map((row) => row.id))
        .order('created_at', { ascending: false });
      if (error) throw error;

      const map: Record<string, string> = {};
      for (const row of data ?? []) {
        if (!map[row.mps_id]) {
          map[row.mps_id] = row.resulting_state;
        }
      }
      return map;
    },
    enabled: open,
  });

  const memoryEvidenceQuery = useQuery({
    queryKey: ['mps-memory-evidence', domainId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mmm_ai_interactions')
        .select('id,created_at,status,request_json')
        .eq('action_type', 'USER_PREFERENCE_CAPTURE')
        .eq('context_type', 'MPS_EDIT')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      const rows = (data ?? []) as Array<{
        id: string;
        created_at: string;
        status: string;
        request_json: Record<string, unknown> | null;
      }>;
      const domainRows = rows.filter((row) => row.request_json?.domain_id === domainId);
      return {
        count: domainRows.length,
        lastRecordedAt: domainRows[0]?.created_at ?? null,
      };
    },
    enabled: open,
  });

  const mpsApprovalActionMutation = useMutation({
    mutationFn: async (payload: { mps_id: string; action_type: 'approve' | 'reopen' | 'reject' | 'regenerate' }) => {
      const headers = await getEdgeInvokeHeaders();
      const { error } = await supabase.functions.invoke('mmm-mps-approval-action', {
        headers,
        body: {
          mps_id: payload.mps_id,
          domain_id: domainId,
          action_type: payload.action_type,
        },
      });
      if (error) throw new Error(error.message || 'Failed to execute MPS approval action.');
    },
    onSuccess: () => {
      approvalStateQuery.refetch();
      queryClient.invalidateQueries({ queryKey: ['domain-audit-mps', domainId] });
    },
  });

  const domainSubmitMutation = useMutation({
    mutationFn: async () => {
      const headers = await getEdgeInvokeHeaders();
      const { error } = await supabase.functions.invoke('mmm-domain-approval-action', {
        headers,
        body: {
          domain_id: domainId,
          action_type: 'submit',
        },
      });
      if (error) throw new Error(error.message || 'Failed to submit MPS set for L2 review.');
    },
    onSuccess: () => {
      setInfoMessage('MPS section submitted for L2 review.');
    },
    onError: (err: Error) => {
      setSaveError(err.message);
    },
  });

  const captureLearningPreference = useCallback(async (payload: LearningCapturePayload) => {
    const headers = await getEdgeInvokeHeaders();
    const remember = window.confirm(
      'Thank you for your direction. I will adopt this preference. Do you want me to include this in my memory system?',
    );
    if (!remember) return;

    await supabase.functions.invoke('mmm-ai-chat-user', {
      headers,
      body: {
        message: 'Capture user preference from MPS edit for future proposal alignment.',
        context: {
          workflow_stage: 'mps_preference_capture',
          domain_id: domainId,
          domain_name: domainName,
          preference_capture: payload,
        },
      },
    }).catch(() => {
      // Non-blocking preference capture path: continue even if AI endpoint is unavailable.
    });

    await supabase.from('mmm_ai_interactions').insert({
      action_type: 'USER_PREFERENCE_CAPTURE',
      context_type: 'MPS_EDIT',
      target_entity_id: payload.mpsId ?? null,
      status: 'recorded',
      request_json: {
        domain_id: domainId,
        domain_name: domainName,
        mps_number: payload.mpsNumber ?? null,
        before_title: payload.beforeTitle,
        after_title: payload.afterTitle,
        before_intent: payload.beforeIntent,
        after_intent: payload.afterIntent,
        before_rationale: (payload as LearningCapturePayload & { beforeRationale?: string }).beforeRationale ?? '',
        after_rationale: (payload as LearningCapturePayload & { afterRationale?: string }).afterRationale ?? '',
      },
      response_json: { captured: true },
    });

    setInfoMessage('Preference recorded. Maturion will apply this style in future proposals.');
  }, [domainId, domainName]);

  const updateExistingMpsMutation = useMutation({
    mutationFn: async (payload: { mpsId: string; name: string; intent_statement: string | null; rationale?: string | null }) => {
      const { error } = await supabase
        .from('mmm_maturity_process_steps')
        .update({
          name: payload.name,
          intent_statement: payload.intent_statement,
        })
        .eq('id', payload.mpsId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domain-audit-mps', domainId] });
      setInfoMessage('MPS updated in draft state. You can continue editing before final sign-off.');
      if (focusMpsId) {
        onClose();
      }
    },
    onError: (err: Error) => setSaveError(err.message),
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setSaveError(null);
    try {
      const parsed = await generateMPSsForDomain(domainName, {
        frameworkId,
        sourceDomainId: domainId,
      });
      setGeneratedMPS(parsed);
      setSelectedMPSNumbers(new Set(parsed.map((item) => item.number)));
    } catch (err: unknown) {
      // NBR-005: surface generation errors to user
      setGenerationError(
        err instanceof Error ? err.message : 'AI generation failed. Please try again.',
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleSelect = (num: number) => {
    setSelectedMPSNumbers((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  const handleAcceptAll = () => {
    setSelectedMPSNumbers(new Set(generatedMPS.map((item) => item.number)));
  };

  const handleToggleEdit = (num: number) => {
    setEditingNumbers((prev) => {
      const next = new Set(prev);
      if (next.has(num)) {
        next.delete(num);
      } else {
        next.add(num);
        const item = generatedMPS.find((m) => m.number === num);
        if (item) {
          setEditedMPS((prevEdited) => ({
            ...prevEdited,
            [num]: prevEdited[num] ?? { title: item.title, intent: item.intent },
          }));
        }
      }
      return next;
    });
  };

  const handleEditChange = (num: number, field: 'title' | 'intent', value: string) => {
    setEditedMPS((prev) => ({
      ...prev,
      [num]: { ...(prev[num] ?? { title: '', intent: '' }), [field]: value },
    }));
  };

  const handleResetEdit = (num: number) => {
    setEditedMPS((prev) => {
      const next = { ...prev };
      delete next[num];
      return next;
    });
  };

  const handleConfirmSelection = () => {
    const selectedItems = generatedMPS.filter((item) => selectedMPSNumbers.has(item.number));
    if (selectedItems.length === 0) return;
    saveMutation.mutate(selectedItems);
  };

  const handleClose = () => {
    resetGenerationState();
    onClose();
  };

  const visibleMpsRows =
    generatedMPS.length === 0 && focusMpsId
      ? mpsRows.filter((mps) => mps.id === focusMpsId)
      : mpsRows;
  const isFocusedEditMode = generatedMPS.length === 0 && Boolean(focusMpsId) && visibleMpsRows.length === 1;

  useEffect(() => {
    if (!isFocusedEditMode || editingExistingMpsId || !visibleMpsRows[0]) return;
    const row = visibleMpsRows[0];
    setEditingExistingMpsId(row.id);
    setExistingEditDraft({
      title: row.name,
      intent: hasTrimmedText(row.intent_statement) ? toTrimmedText(row.intent_statement) : '',
      rationale: deriveRationale(row.name),
    });
  }, [editingExistingMpsId, isFocusedEditMode, visibleMpsRows]);

  if (!open) return null;

  const blockingError = generationError ?? saveError;
  const fallbackWarning =
    !blockingError && hookGenerationError?.includes('Loaded legacy fallback MPS pack')
      ? hookGenerationError
      : null;
  const displayError = blockingError ?? (!fallbackWarning ? hookGenerationError : null);

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="MPS Selection"
      data-testid="mps-selection-modal"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Create MPSs</h2>
          <button
            type="button"
            className="modal-close"
            aria-label="Close MPS selection"
            onClick={handleClose}
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-domain-context">
            Domain: <strong>{domainName}</strong> <span>({domainId})</span>
          </p>

          {/* NBR-005: surface AI generation and save errors to user */}
          {displayError ? (
            <div role="alert" className="alert alert-error" data-testid="mps-generation-error">
              {displayError}
            </div>
          ) : null}
          {fallbackWarning ? (
            <div
              role="status"
              className="alert alert-warning"
              data-testid="mps-generation-warning"
            >
              {fallbackWarning}
            </div>
          ) : null}
          {infoMessage ? (
            <div role="status" className="alert alert-success" data-testid="mps-info-message">
              {infoMessage}
            </div>
          ) : null}
          {generatedMPS.length > 0 && lastConsultedResources.length > 0 ? (
            <div
              role="status"
              className="alert alert-success"
              data-testid="mps-consulted-resources-toast"
            >
              Resources consulted: {lastConsultedResources.join('; ')}
            </div>
          ) : null}
          {generatedMPS.length > 0 ? (
            <div
              role="status"
              className="alert alert-success"
              data-testid="mps-memory-evidence-toast"
            >
              Memory capture evidence: {memoryEvidenceQuery.data?.count ?? 0} recorded preference updates
              for this domain
              {memoryEvidenceQuery.data?.lastRecordedAt
                ? ` (last recorded ${new Date(memoryEvidenceQuery.data.lastRecordedAt).toLocaleString()})`
                : '.'}
            </div>
          ) : null}

          {/* AI generation controls */}
          {!isFocusedEditMode ? (
            <div className="modal-ai-controls">
              {isGenerating || isGeneratingFromHook ? (
                <p data-testid="mps-generation-loading">Generating MPSs…</p>
              ) : generatedMPS.length === 0 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  data-testid="generate-mps-btn"
                  onClick={handleGenerate}
                >
                  Generate MPS with AI
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline"
                  data-testid="regenerate-mps-btn"
                  onClick={handleGenerate}
                >
                  Regenerate
                </button>
              )}
            </div>
          ) : null}

          {/* Generated MPS list — accept/edit/select surface */}
          {generatedMPS.length > 0 && !isGenerating ? (
            <div data-testid="generated-mps-list">
              <div className="modal-ai-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  data-testid="accept-all-mps-btn"
                  onClick={handleAcceptAll}
                >
                  Accept All
                </button>
              </div>
              <ol className="modal-list">
                {generatedMPS.map((item) => {
                  const isSelected = selectedMPSNumbers.has(item.number);
                  const isEditing = editingNumbers.has(item.number);
                  const edited = editedMPS[item.number];
                  const displayTitle = edited?.title ?? item.title;
                  const displayIntent = edited?.intent ?? item.intent;
                  return (
                    <li
                      key={item.number}
                      className="modal-list__item"
                      data-testid="generated-mps-item"
                    >
                      <label>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(item.number)}
                          data-testid={`mps-select-${item.number}`}
                          aria-label={`Select MPS ${item.number}`}
                        />
                        <strong>
                          {' '}
                          {item.number}. {displayTitle}
                        </strong>
                      </label>
                      {isEditing ? (
                        <div data-testid={`mps-edit-form-${item.number}`}>
                          <input
                            type="text"
                            value={displayTitle}
                            onChange={(e) =>
                              handleEditChange(item.number, 'title', e.target.value)
                            }
                            aria-label="Edit title"
                            data-testid={`mps-title-input-${item.number}`}
                          />
                          <input
                            type="text"
                            value={displayIntent}
                            onChange={(e) =>
                              handleEditChange(item.number, 'intent', e.target.value)
                            }
                            aria-label="Edit intent"
                            data-testid={`mps-intent-input-${item.number}`}
                          />
                          {edited ? (
                            <button
                              type="button"
                              className="btn btn-outline"
                              data-testid={`mps-reset-${item.number}`}
                              onClick={() => handleResetEdit(item.number)}
                            >
                              Reset to AI suggestion
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => handleToggleEdit(item.number)}
                          >
                            Done
                          </button>
                        </div>
                      ) : (
                        <div>
                          {item.source_origin ? (
                            <span className={`source-origin source-origin--${item.source_origin}`}>
                              {item.source_origin === 'uploaded_source'
                                ? 'Uploaded source'
                                : item.source_origin === 'ai_completion'
                                ? 'AI completion'
                                : 'Subject knowledge'}
                            </span>
                          ) : null}
                          <p>Intent: {displayIntent}</p>
                          <p>Rationale: {item.rationale}</p>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-testid={`mps-edit-btn-${item.number}`}
                            onClick={() => handleToggleEdit(item.number)}
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          ) : null}

          {/* Existing MPS rows — read-only display when no generation in progress */}
          {isLoading ? (
            <p data-testid="mps-selection-loading">Loading MPS data…</p>
          ) : errorMessage ? (
            <div role="alert" data-testid="mps-selection-error">
              {errorMessage}
            </div>
          ) : generatedMPS.length === 0 && visibleMpsRows.length === 0 ? (
            <p data-testid="mps-selection-empty">
              No MPS rows are currently stored for this domain.
            </p>
          ) : generatedMPS.length === 0 ? (
            <ol className="modal-list" data-testid="mps-selection-list">
              {visibleMpsRows.map((mps) => (
                <li key={mps.id} className="modal-list__item" data-testid="mps-row">
                  <div>
                    <strong>{mps.code}</strong> — {mps.name}
                  </div>
                  <div>Sort order: {mps.sort_order}</div>
                  <div>
                    Intent linkage:{' '}
                    {hasTrimmedText(mps.intent_statement)
                      ? toTrimmedText(mps.intent_statement)
                      : 'No intent statement stored yet.'}
                  </div>
                  <div>
                    L1 state:{' '}
                    <strong>
                      {(approvalStateQuery.data?.[mps.id] ?? 'draft').replace(/_/g, ' ').toUpperCase()}
                    </strong>
                  </div>
                  {!isFocusedEditMode ? (
                    <div className="dmc-row-actions" style={{ marginTop: '0.4rem' }}>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => mpsApprovalActionMutation.mutate({ mps_id: mps.id, action_type: 'approve' })}
                      >
                        Approve L1
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => mpsApprovalActionMutation.mutate({ mps_id: mps.id, action_type: 'reopen' })}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => mpsApprovalActionMutation.mutate({ mps_id: mps.id, action_type: 'reject' })}
                      >
                        Reject
                      </button>
                    </div>
                  ) : null}
                  {editingExistingMpsId === mps.id && existingEditDraft ? (
                    <div className="card" style={{ marginTop: '0.6rem' }}>
                      <div className="form-group">
                        <label>MPS Title</label>
                        <input
                          className="form-control"
                          value={existingEditDraft.title}
                          onChange={(event) =>
                            setExistingEditDraft((prev) => (prev ? { ...prev, title: event.target.value } : prev))
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Provisional Intent</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={existingEditDraft.intent}
                          onChange={(event) =>
                            setExistingEditDraft((prev) => (prev ? { ...prev, intent: event.target.value } : prev))
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Rationale</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={existingEditDraft.rationale ?? ''}
                          onChange={(event) =>
                            setExistingEditDraft((prev) => (prev ? { ...prev, rationale: event.target.value } : prev))
                          }
                        />
                      </div>
                      <div className="dmc-row-actions">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={async () => {
                            if (!existingEditDraft) return;
                            await updateExistingMpsMutation.mutateAsync({
                              mpsId: mps.id,
                              name: existingEditDraft.title.trim() || mps.name,
                              intent_statement: existingEditDraft.intent.trim() || null,
                              rationale: existingEditDraft.rationale?.trim() || null,
                            });
                            await captureLearningPreference({
                              mpsId: mps.id,
                              beforeTitle: mps.name,
                              afterTitle: existingEditDraft.title.trim() || mps.name,
                              beforeIntent: hasTrimmedText(mps.intent_statement) ? toTrimmedText(mps.intent_statement) : '',
                              afterIntent: existingEditDraft.intent.trim(),
                              beforeRationale: deriveRationale(mps.name),
                              afterRationale: existingEditDraft.rationale?.trim() || '',
                            } as LearningCapturePayload & { beforeRationale: string; afterRationale: string });
                            setEditingExistingMpsId(null);
                            setExistingEditDraft(null);
                          }}
                          disabled={updateExistingMpsMutation.isPending}
                        >
                          {updateExistingMpsMutation.isPending ? 'Updating…' : 'Submit / Update'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => {
                            setEditingExistingMpsId(null);
                            setExistingEditDraft(null);
                          }}
                        >
                          Cancel Edit
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {isFocusedEditMode && editingExistingMpsId !== mps.id ? (
                    <div className="dmc-row-actions" style={{ marginTop: '0.4rem' }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          setEditingExistingMpsId(mps.id);
                          setExistingEditDraft({
                            title: mps.name,
                            intent: hasTrimmedText(mps.intent_statement) ? toTrimmedText(mps.intent_statement) : '',
                            rationale: deriveRationale(mps.name),
                          });
                        }}
                      >
                        Edit This MPS
                      </button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : null}
        </div>

        <div className="modal-footer">
          {generatedMPS.length > 0 ? (
            <button
              type="button"
              className="btn btn-primary"
              data-testid="confirm-mps-selection-btn"
              onClick={handleConfirmSelection}
              disabled={saveMutation.isPending || selectedMPSNumbers.size === 0}
            >
              {saveMutation.isPending ? 'Saving…' : 'Confirm Selection'}
            </button>
          ) : null}
          {generatedMPS.length === 0 && visibleMpsRows.length > 0 && !isFocusedEditMode ? (
            <button
              type="button"
              className="btn btn-primary"
              data-testid="submit-mps-l2-btn"
              onClick={() => {
                domainSubmitMutation.mutate();
                onClose();
              }}
              disabled={domainSubmitMutation.isPending}
            >
              {domainSubmitMutation.isPending ? 'Submitting…' : `Submit MPS Set (${visibleMpsRows.length})`}
            </button>
          ) : null}
          <button type="button" className="btn btn-outline" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default MPSSelectionModal;
