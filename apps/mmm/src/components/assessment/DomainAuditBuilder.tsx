/**
 * DomainAuditBuilder — current-app adaptation of the legacy
 * apps/maturion-maturity-legacy/src/pages/DomainAuditBuilder.tsx
 *
 * Renders the three-step DomainAuditBuilder workflow for the MMM current app:
 *   Step 1: Create MPSs
 *   Step 2: Create Intent
 *   Step 3: Create Criteria
 *
 * This component is a thin orchestration shell. Modal/panel child components
 * are current-app adaptations of the legacy counterparts.
 *
 * Legacy source: apps/maturion-maturity-legacy/src/pages/DomainAuditBuilder.tsx
 */
import React from 'react';
import {
  useDomainAuditBuilder,
  type AuditStep,
} from '../../hooks/useDomainAuditBuilder';
import { MPSSelectionModal } from './MPSSelectionModal';
import { IntentCreator } from './IntentCreator';
import { CriteriaManagement } from './CriteriaManagement';

export interface DomainAuditBuilderProps {
  /** The domain slug/id being built — forwarded from the route. */
  domainId: string;
  /** Framework context preserved from the route query string. */
  frameworkId?: string | null;
  /** Human-readable domain label preserved from the route query string. */
  domainName?: string | null;
  /** Concrete MMM domain row, if already known from the framework handoff page. */
  sourceDomainId?: string | null;
}

/**
 * Current-app adaptation of the legacy DomainAuditBuilder page component.
 * Implements the three-step ordered workflow: 'Create MPSs' → 'Create Intent' → 'Create Criteria'.
 */
export function DomainAuditBuilder({
  domainId,
  frameworkId,
  domainName,
  sourceDomainId,
}: DomainAuditBuilderProps) {
  const {
    activeStep,
    steps,
    domain,
    mpsRows,
    criteriaRows,
    criteriaByMps,
    isLoading,
    errorMessage,
    isMPSModalOpen,
    setIsMPSModalOpen,
    isIntentCreatorOpen,
    setIsIntentCreatorOpen,
    isCriteriaManagementOpen,
    setIsCriteriaManagementOpen,
    handleStepClick,
  } = useDomainAuditBuilder({
    domainId,
    frameworkId,
    domainName,
    sourceDomainId,
  });

  return (
    <div className="domain-audit-builder" data-testid="domain-audit-builder">
      <div className="domain-audit-builder__summary" data-testid="domain-audit-summary">
        <p className="domain-audit-builder__summary-line">
          Domain data source:{' '}
          <strong data-testid="domain-audit-domain-name">
            {domain?.name ?? domainName ?? domainId}
          </strong>
        </p>
        <p className="domain-audit-builder__summary-line">
          Loaded totals —{' '}
          <span data-testid="domain-audit-mps-count">{mpsRows.length} MPS</span>,{' '}
          <span data-testid="domain-audit-intent-count">
            {mpsRows.filter((row) => row.intent_statement?.trim()).length} intents
          </span>,{' '}
          <span data-testid="domain-audit-criteria-count">{criteriaRows.length} criteria</span>
        </p>
      </div>

      {isLoading ? (
        <p className="domain-audit-builder__status" data-testid="domain-audit-loading">
          Loading domain workflow data…
        </p>
      ) : null}

      {errorMessage ? (
        <div
          className="alert alert-error domain-audit-builder__status"
          role="alert"
          data-testid="domain-audit-error"
        >
          {errorMessage}
        </div>
      ) : null}

      {!isLoading && !errorMessage && !domain ? (
        <div className="alert domain-audit-builder__status" data-testid="domain-audit-setup-state">
          No compiled domain record exists for this canonical route yet. Start from the framework workspace
          compile flow, or compile this domain before opening its workflow.
        </div>
      ) : null}

      {/* Three-step workflow (legacy order preserved) */}
      <ol className="domain-audit-builder__steps" aria-label="Domain audit workflow steps">
        {steps.map((step) => (
          <li key={step.id} className="domain-audit-builder__step">
            <div className="domain-audit-builder__step-card">
              <span className="domain-audit-builder__step-number">{step.order}</span>
              <div className="domain-audit-builder__step-body">
                <h3 className="domain-audit-builder__step-title">{step.title}</h3>
                <p className="domain-audit-builder__step-desc">{step.description}</p>
                <p
                  className="domain-audit-builder__step-summary"
                  data-testid={`step-summary-${step.id}`}
                >
                  {step.summary}
                </p>
                {step.previewItems.length > 0 ? (
                  <ul
                    className="domain-audit-builder__step-preview"
                    data-testid={`step-preview-${step.id}`}
                  >
                    {step.previewItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <button
                type="button"
                className="btn btn-primary domain-audit-builder__step-action"
                data-testid={`step-action-${step.id}`}
                onClick={() => handleStepClick(step.id as AuditStep)}
                aria-label={`Open ${step.title}`}
                aria-expanded={activeStep === step.id}
              >
                {step.title} ({step.count})
              </button>
            </div>
          </li>
        ))}
      </ol>

      {/* Modal/panel adaptations — legacy child component equivalents */}
      <MPSSelectionModal
        domainId={domainId}
        domainName={domain?.name ?? domainName ?? domainId}
        open={isMPSModalOpen}
        mpsRows={mpsRows}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onClose={() => setIsMPSModalOpen(false)}
      />
      <IntentCreator
        domainId={domainId}
        domainName={domain?.name ?? domainName ?? domainId}
        open={isIntentCreatorOpen}
        mpsRows={mpsRows}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onClose={() => setIsIntentCreatorOpen(false)}
      />
      <CriteriaManagement
        domainId={domainId}
        domainName={domain?.name ?? domainName ?? domainId}
        open={isCriteriaManagementOpen}
        mpsRows={mpsRows}
        criteriaByMps={criteriaByMps}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onClose={() => setIsCriteriaManagementOpen(false)}
      />
    </div>
  );
}

export default DomainAuditBuilder;
