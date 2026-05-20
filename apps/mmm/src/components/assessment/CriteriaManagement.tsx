/**
 * CriteriaManagement — current-app adaptation of the legacy
 * apps/maturion-maturity-legacy/src/components/assessment/CriteriaManagement.tsx
 *
 * Renders criteria grouped and scoped to the active domain and MPS data.
 * Adapted for the MMM current app without legacy Supabase dependencies.
 */
import React from 'react';
import type {
  GeneratedCriteriaDraft,
  DomainAuditCriterionRow,
  DomainAuditMpsRow,
} from '../../hooks/useDomainAuditBuilder';
import { AIGeneratedCriteriaCards } from './AIGeneratedCriteriaCards';
import { EnhancedCriteriaGenerator } from './EnhancedCriteriaGenerator';

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
  /** Accept generated criteria drafts for an MPS in this workspace. */
  onAcceptGeneratedCriteria: (mpsId: string, drafts: GeneratedCriteriaDraft[]) => void;
}

/**
 * Current-app adaptation of CriteriaManagement.
 * Provides the criteria-definition surface scoped to a domain and its MPSs.
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
  onAcceptGeneratedCriteria,
}: CriteriaManagementProps) {
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
                return (
                  <section key={mps.id} className="criteria-group" data-testid="criteria-group">
                    <h3>
                      {mps.code} — {mps.name}
                    </h3>
                    <p>
                      Intent:{' '}
                      {mps.intent_statement?.trim()
                        ? mps.intent_statement
                        : 'No intent statement stored for this MPS yet.'}
                    </p>
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
                    <AIGeneratedCriteriaCards
                      mpsId={mps.id}
                      mpsLabel={`${mps.code} — ${mps.name}`}
                      onAccept={(drafts) => onAcceptGeneratedCriteria(mps.id, drafts)}
                    />
                    <EnhancedCriteriaGenerator
                      domainId={domainId}
                      mpsId={mps.id}
                      onCriteriaGenerated={(criterion) =>
                        onAcceptGeneratedCriteria(mps.id, [{ statement: criterion }])
                      }
                    />
                  </section>
                );
              })}
            </div>
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

export default CriteriaManagement;
