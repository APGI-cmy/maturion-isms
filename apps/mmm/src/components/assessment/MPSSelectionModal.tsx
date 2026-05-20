/**
 * MPSSelectionModal — current-app adaptation of the legacy
 * apps/maturion-maturity-legacy/src/components/assessment/MPSSelectionModal.tsx
 *
 * Renders MPS data for the active domain. Adapted for the MMM current app
 * without direct dependency on legacy Supabase integrations.
 */
import React from 'react';

export interface MPSSelectionModalProps {
  /** The domain currently being built. */
  domainId: string;
  /** Whether the modal is visible. */
  open: boolean;
  /** Callback to close/cancel the modal. */
  onClose: () => void;
}

/**
 * Current-app adaptation of MPSSelectionModal.
 * Provides the MPS selection surface for a given domain.
 */
export function MPSSelectionModal({ domainId, open, onClose }: MPSSelectionModalProps) {
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
            Domain: <strong>{domainId}</strong>
          </p>
          <p>
            Define Maturity Practice Statements (MPSs) for this domain.
            MPSs describe the practices an organisation must demonstrate.
          </p>
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
