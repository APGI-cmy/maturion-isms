/**
 * useDomainAuditBuilder — current-app adaptation of the legacy
 * apps/maturion-maturity-legacy/src/hooks/useDomainAuditBuilder.ts hook.
 *
 * Owns three-step metadata/order and click-handling for the DomainAuditBuilder
 * workflow: Create MPSs → Create Intent → Create Criteria.
 *
 * Legacy source: apps/maturion-maturity-legacy/src/hooks/useDomainAuditBuilder.ts
 */
import { useState } from 'react';

export type AuditStep = 'mps' | 'intent' | 'criteria';

export interface StepMeta {
  id: AuditStep;
  title: string;
  description: string;
  order: number;
}

export const AUDIT_STEPS: StepMeta[] = [
  { id: 'mps',      title: 'Create MPSs',      description: 'Define Maturity Practice Statements for this domain.', order: 1 },
  { id: 'intent',   title: 'Create Intent',    description: 'Write intent statements for each MPS.',                order: 2 },
  { id: 'criteria', title: 'Create Criteria',  description: 'Define criteria scoped to each MPS.',                  order: 3 },
];

export interface UseDomainAuditBuilderReturn {
  /** Which modal/panel is currently open, or null. */
  activeStep: AuditStep | null;
  /** Open the MPS selection panel. */
  isMPSModalOpen: boolean;
  setIsMPSModalOpen: (open: boolean) => void;
  /** Open the Intent creator panel. */
  isIntentCreatorOpen: boolean;
  setIsIntentCreatorOpen: (open: boolean) => void;
  /** Open the Criteria management panel. */
  isCriteriaManagementOpen: boolean;
  setIsCriteriaManagementOpen: (open: boolean) => void;
  /** Dispatch handler — opens the correct panel for the given step. */
  handleStepClick: (step: AuditStep) => void;
  /** Ordered step metadata (legacy three-step order). */
  steps: StepMeta[];
}

/**
 * Current-app adaptation of the legacy DomainAuditBuilder hook.
 * Preserves the three-step ordered workflow from the legacy app.
 */
export function useDomainAuditBuilder(_domainId: string): UseDomainAuditBuilderReturn {
  const [isMPSModalOpen, setIsMPSModalOpen] = useState(false);
  const [isIntentCreatorOpen, setIsIntentCreatorOpen] = useState(false);
  const [isCriteriaManagementOpen, setIsCriteriaManagementOpen] = useState(false);

  const activeStep: AuditStep | null = isMPSModalOpen
    ? 'mps'
    : isIntentCreatorOpen
    ? 'intent'
    : isCriteriaManagementOpen
    ? 'criteria'
    : null;

  /** Open the correct panel for a given step (legacy dispatch contract). */
  const handleStepClick = (step: AuditStep) => {
    // Close all panels first.
    setIsMPSModalOpen(false);
    setIsIntentCreatorOpen(false);
    setIsCriteriaManagementOpen(false);

    switch (step) {
      case 'mps':
        setIsMPSModalOpen(true);
        break;
      case 'intent':
        setIsIntentCreatorOpen(true);
        break;
      case 'criteria':
        setIsCriteriaManagementOpen(true);
        break;
    }
  };

  return {
    activeStep,
    isMPSModalOpen,
    setIsMPSModalOpen,
    isIntentCreatorOpen,
    setIsIntentCreatorOpen,
    isCriteriaManagementOpen,
    setIsCriteriaManagementOpen,
    handleStepClick,
    steps: AUDIT_STEPS,
  };
}
