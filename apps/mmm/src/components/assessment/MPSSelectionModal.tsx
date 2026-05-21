/**
 * MPSSelectionModal — current-app adaptation of the legacy
 * apps/maturion-maturity-legacy/src/components/assessment/MPSSelectionModal.tsx
 *
 * Renders MPS data for the active domain and provides AI-assisted MPS generation
 * with full generate/accept/refine/save lifecycle.
 * Adapted for the MMM current app without shadcn/lucide or legacy hook dependencies.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { DomainAuditMpsRow } from '../../hooks/useDomainAuditBuilder';
import { supabase } from '../../lib/supabase';
import {
  useAIMPSGeneration,
  type GeneratedMpsDraft as GeneratedMPSItem,
} from '../../hooks/useAIMPSGeneration';

interface EditedMPSItem {
  title: string;
  intent: string;
}

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
}: MPSSelectionModalProps) {
  const queryClient = useQueryClient();
  const { generateMPSsForDomain, isLoading: isGeneratingFromHook } = useAIMPSGeneration();

  const [generatedMPS, setGeneratedMPS] = useState<GeneratedMPSItem[]>([]);
  const [selectedMPSNumbers, setSelectedMPSNumbers] = useState<Set<number>>(new Set());
  const [editedMPS, setEditedMPS] = useState<Record<number, EditedMPSItem>>({});
  const [editingNumbers, setEditingNumbers] = useState<Set<number>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const resetGenerationState = useCallback(() => {
    setGeneratedMPS([]);
    setSelectedMPSNumbers(new Set());
    setEditedMPS({});
    setEditingNumbers(new Set());
    setIsGenerating(false);
    setGenerationError(null);
    setSaveError(null);
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

  const saveMutation = useMutation({
    mutationFn: async (selectedItems: GeneratedMPSItem[]) => {
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
      resetGenerationState();
    },
    onError: (err: Error) => {
      // NBR-005: surface save errors to user
      setSaveError(err.message);
    },
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setSaveError(null);
    try {
      const parsed = await generateMPSsForDomain(domainName);
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

  if (!open) return null;

  const displayError = generationError ?? saveError;

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

          {/* AI generation controls */}
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
          ) : generatedMPS.length === 0 && mpsRows.length === 0 ? (
            <p data-testid="mps-selection-empty">
              No MPS rows are currently stored for this domain.
            </p>
          ) : generatedMPS.length === 0 ? (
            <ol className="modal-list" data-testid="mps-selection-list">
              {mpsRows.map((mps) => (
                <li key={mps.id} className="modal-list__item" data-testid="mps-row">
                  <div>
                    <strong>{mps.code}</strong> — {mps.name}
                  </div>
                  <div>Sort order: {mps.sort_order}</div>
                  <div>
                    Intent linkage:{' '}
                    {mps.intent_statement?.trim()
                      ? mps.intent_statement
                      : 'No intent statement stored yet.'}
                  </div>
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
          <button type="button" className="btn btn-outline" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default MPSSelectionModal;
