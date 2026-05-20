/**
 * MPSSelectionModal — current-app adaptation of the legacy
 * apps/maturion-maturity-legacy/src/components/assessment/MPSSelectionModal.tsx
 *
 * Renders MPS data for the active domain. Adapted for the MMM current app
 * without direct dependency on legacy Supabase integrations.
 */
import React from 'react';
import type { DomainAuditMpsRow } from '../../hooks/useDomainAuditBuilder';

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
 * Provides the MPS selection surface for a given domain.
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
  if (!open) return null;

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
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-domain-context">
            Domain: <strong>{domainName}</strong> <span>({domainId})</span>
          </p>
          {isLoading ? (
            <p data-testid="mps-selection-loading">Loading MPS data…</p>
          ) : errorMessage ? (
            <div role="alert" data-testid="mps-selection-error">
              {errorMessage}
            </div>
          ) : mpsRows.length === 0 ? (
            <p data-testid="mps-selection-empty">
              No MPS rows are currently stored for this domain.
            </p>
          ) : (
            <ol className="modal-list" data-testid="mps-selection-list">
              {mpsRows.map((mps) => (
                <li key={mps.id} className="modal-list__item" data-testid="mps-row">
                  <div>
                    <strong>{mps.code}</strong> — {mps.name}
                  </div>
                  <div>Sort order: {mps.sort_order}</div>
                  <div>
                    Intent linkage:{' '}
                    {mps.intent_statement?.trim() ? mps.intent_statement : 'No intent statement stored yet.'}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default MPSSelectionModal;
