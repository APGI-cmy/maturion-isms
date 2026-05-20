/**
 * IntentCreator — current-app adaptation of the legacy
 * apps/maturion-maturity-legacy/src/components/assessment/IntentCreator.tsx
 *
 * Renders intent statements for MPS rows within the active domain.
 * Adapted for the MMM current app without legacy Supabase dependencies.
 */
import React from 'react';

export interface IntentCreatorProps {
  /** The domain currently being built. */
  domainId: string;
  /** Whether the panel is visible. */
  open: boolean;
  /** Callback to close/cancel. */
  onClose: () => void;
}

/**
 * Current-app adaptation of IntentCreator.
 * Provides the intent-authoring surface for MPS rows in a given domain.
 */
export function IntentCreator({ domainId, open, onClose }: IntentCreatorProps) {
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
            Domain: <strong>{domainId}</strong>
          </p>
          <p>
            Write intent statements for each MPS in this domain.
            Intent statements declare what the organisation intends to achieve.
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

export default IntentCreator;
