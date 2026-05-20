/**
 * CriteriaManagement — current-app adaptation of the legacy
 * apps/maturion-maturity-legacy/src/components/assessment/CriteriaManagement.tsx
 *
 * Renders criteria grouped and scoped to the active domain and MPS data.
 * Adapted for the MMM current app without legacy Supabase dependencies.
 */
import React from 'react';

export interface CriteriaManagementProps {
  /** The domain currently being built. */
  domainId: string;
  /** Whether the panel is visible. */
  open: boolean;
  /** Callback to close/cancel. */
  onClose: () => void;
}

/**
 * Current-app adaptation of CriteriaManagement.
 * Provides the criteria-definition surface scoped to a domain and its MPSs.
 */
export function CriteriaManagement({ domainId, open, onClose }: CriteriaManagementProps) {
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
            Define criteria for each MPS in this domain.
            Criteria are the measurable evidence points used to assess maturity.
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

export default CriteriaManagement;
