/**
 * IntentCreator — current-app adaptation of the legacy
 * apps/maturion-maturity-legacy/src/components/assessment/IntentCreator.tsx
 *
 * Renders intent statements for MPS rows within the active domain.
 * Adapted for the MMM current app without legacy Supabase dependencies.
 */
import React from 'react';
import type { DomainAuditMpsRow } from '../../hooks/useDomainAuditBuilder';

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
 * Provides the intent-authoring surface for MPS rows in a given domain.
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
              {mpsRows.map((mps) => (
                <li key={mps.id} className="modal-list__item" data-testid="intent-row">
                  <div>
                    <strong>{mps.code}</strong> — {mps.name}
                  </div>
                  <div>
                    {mps.intent_statement?.trim()
                      ? mps.intent_statement
                      : 'No intent statement stored for this MPS yet.'}
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

export default IntentCreator;
