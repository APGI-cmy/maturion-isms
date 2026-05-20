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
import { useDomainAuditBuilder, type AuditStep } from '../../hooks/useDomainAuditBuilder';
import { MPSSelectionModal } from './MPSSelectionModal';
import { IntentCreator } from './IntentCreator';
import { CriteriaManagement } from './CriteriaManagement';

/**
 * Ordered step definitions — legacy three-step model preserved in source order.
 * Must remain as quoted string literals so test assertions can verify ordering.
 * Source order: 'Create MPSs' → 'Create Intent' → 'Create Criteria'
 */
const DOMAIN_AUDIT_STEPS: { id: AuditStep; title: string; description: string; order: number }[] = [
  { id: 'mps',      title: 'Create MPSs',     description: 'Define Maturity Practice Statements for this domain.', order: 1 },
  { id: 'intent',   title: 'Create Intent',   description: 'Write intent statements for each MPS.',                order: 2 },
  { id: 'criteria', title: 'Create Criteria', description: 'Define criteria scoped to each MPS.',                  order: 3 },
];

export interface DomainAuditBuilderProps {
  /** The domain slug/id being built — forwarded from the route. */
  domainId: string;
}

/**
 * Current-app adaptation of the legacy DomainAuditBuilder page component.
 * Implements the three-step ordered workflow: Create MPSs → Create Intent → Create Criteria.
 */
export function DomainAuditBuilder({ domainId }: DomainAuditBuilderProps) {
  const {
    isMPSModalOpen,
    setIsMPSModalOpen,
    isIntentCreatorOpen,
    setIsIntentCreatorOpen,
    isCriteriaManagementOpen,
    setIsCriteriaManagementOpen,
    handleStepClick,
  } = useDomainAuditBuilder(domainId);

  return (
    <div className="domain-audit-builder" data-testid="domain-audit-builder">
      {/* Three-step workflow (legacy order preserved) */}
      <ol className="domain-audit-builder__steps" aria-label="Domain audit workflow steps">
        {DOMAIN_AUDIT_STEPS.map((step) => (
          <li key={step.id} className="domain-audit-builder__step">
            <div className="domain-audit-builder__step-card">
              <span className="domain-audit-builder__step-number">{step.order}</span>
              <div className="domain-audit-builder__step-body">
                <h3 className="domain-audit-builder__step-title">{step.title}</h3>
                <p className="domain-audit-builder__step-desc">{step.description}</p>
              </div>
              <button
                type="button"
                className="btn btn-primary domain-audit-builder__step-action"
                data-testid={`step-action-${step.id}`}
                onClick={() => handleStepClick(step.id as AuditStep)}
                aria-label={`Open ${step.title}`}
              >
                {step.title}
              </button>
            </div>
          </li>
        ))}
      </ol>

      {/* Modal/panel adaptations — legacy child component equivalents */}
      <MPSSelectionModal
        domainId={domainId}
        open={isMPSModalOpen}
        onClose={() => setIsMPSModalOpen(false)}
      />
      <IntentCreator
        domainId={domainId}
        open={isIntentCreatorOpen}
        onClose={() => setIsIntentCreatorOpen(false)}
      />
      <CriteriaManagement
        domainId={domainId}
        open={isCriteriaManagementOpen}
        onClose={() => setIsCriteriaManagementOpen(false)}
      />
    </div>
  );
}

export default DomainAuditBuilder;
