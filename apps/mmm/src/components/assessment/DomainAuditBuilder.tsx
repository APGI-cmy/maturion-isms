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
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  useDomainAuditBuilder,
  type AuditStep,
} from '../../hooks/useDomainAuditBuilder';
import { getEdgeInvokeHeaders, supabase } from '../../lib/supabase';
import { hasTrimmedText } from '../../lib/safeText';
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
  const [focusedMpsId, setFocusedMpsId] = React.useState<string | null>(null);
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

  // Always prefer the resolved MMM domain row ID for persistence operations.
  // Falls back to sourceDomainId and then route slug only when needed.
  const persistedDomainId = domain?.id ?? sourceDomainId ?? domainId;

  const [domainApprovalComment, setDomainApprovalComment] = React.useState('');
  const domainApprovalQuery = useQuery({
    queryKey: ['domain-approval-request', persistedDomainId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mmm_domain_approval_requests')
        .select('id,status,locked,assigned_reviewer,updated_at')
        .eq('domain_id', persistedDomainId)
        .maybeSingle();
      if (error) throw error;
      return data as { id: string; status: string; locked: boolean } | null;
    },
    enabled: Boolean(persistedDomainId),
  });
  const isDomainSignedOff =
    domainApprovalQuery.data?.status === 'approved_l2' ||
    domainApprovalQuery.data?.status === 'approved';

  const domainApprovalActionMutation = useMutation({
    mutationFn: async (action_type: 'submit' | 'return' | 'resubmit' | 'approve') => {
      const headers = await getEdgeInvokeHeaders();
      const { data, error } = await supabase.functions.invoke('mmm-domain-approval-action', {
        headers,
        body: { domain_id: persistedDomainId, action_type },
      });
      if (error) throw new Error(error.message || 'Failed to update domain approval action.');
      return data as { request_id: string };
    },
    onSuccess: () => {
      domainApprovalQuery.refetch();
    },
  });

  const domainApprovalCommentMutation = useMutation({
    mutationFn: async (comment_type: 'user_note' | 'reviewer_return' | 'resubmit_note' | 'approval_note') => {
      const requestId = domainApprovalQuery.data?.id;
      if (!requestId) throw new Error('No domain approval request found.');
      const headers = await getEdgeInvokeHeaders();
      const { error } = await supabase.functions.invoke('mmm-domain-approval-comment', {
        headers,
        body: {
          request_id: requestId,
          domain_id: persistedDomainId,
          comment_type,
          message: domainApprovalComment.trim(),
        },
      });
      if (error) throw new Error(error.message || 'Failed to post domain approval comment.');
    },
    onSuccess: () => setDomainApprovalComment(''),
  });

  const resolveCardStage = React.useCallback(
    (step: AuditStep) => {
      if (isDomainSignedOff) {
        return 'Completed';
      }
      if (step === 'mps' && mpsRows.length > 0) return 'Draft';
      if (step === 'intent' && mpsRows.some((row) => hasTrimmedText(row.intent_statement))) return 'Draft';
      if (step === 'criteria' && criteriaRows.length > 0) return 'Draft';
      return 'Blank';
    },
    [criteriaRows.length, isDomainSignedOff, mpsRows],
  );

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
            {mpsRows.filter((row) => hasTrimmedText(row.intent_statement)).length} intents
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
      <div
        className="domain-audit-builder__steps"
        role="list"
        aria-label="Domain audit workflow steps"
      >
        {steps.map((step) => (
          <div key={step.id} className="domain-audit-builder__step" role="listitem">
            <div
              className={`domain-audit-builder__step-card domain-audit-builder__step-card--${step.status}`}
              data-testid="domain-audit-step-card"
            >
              <span className="domain-audit-builder__step-number">{step.order}</span>
              <div className="domain-audit-builder__step-body">
                <h3 className="domain-audit-builder__step-title">{step.title}</h3>
                <p className="domain-audit-builder__step-desc">{step.description}</p>
                <p
                  className={`domain-audit-builder__step-status domain-audit-builder__step-status--${step.status}`}
                  data-testid={`step-status-${step.id}`}
                >
                  {resolveCardStage(step.id as AuditStep)}
                </p>
                <p
                  className="domain-audit-builder__step-summary"
                  data-testid={`step-summary-${step.id}`}
                >
                  {step.summary}
                </p>
                {step.id === 'mps' && mpsRows.length > 0 ? (
                  <div
                    className="domain-audit-builder__step-preview"
                    data-testid={`step-preview-${step.id}`}
                  >
                    {mpsRows.map((row) => (
                      <div key={row.id} className="domain-audit-builder__mps-preview-row">
                        <span>{row.code} — {row.name}</span>
                        <span className="domain-audit-builder__mps-preview-actions">
                          <span className="domain-audit-builder__mps-status-pill">Draft</span>
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => {
                              setFocusedMpsId(row.id);
                              setIsMPSModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : step.id === 'intent' && mpsRows.length > 0 ? (
                  <div
                    className="domain-audit-builder__step-preview"
                    data-testid={`step-preview-${step.id}`}
                  >
                    {mpsRows.map((row) => (
                      <div key={row.id} className="domain-audit-builder__mps-preview-row">
                        <span>
                          {row.code} — {row.name}
                          <div style={{ fontSize: '0.92rem', marginTop: '0.2rem' }}>
                            {hasTrimmedText(row.intent_statement)
                              ? row.intent_statement
                              : 'Intent not drafted yet.'}
                          </div>
                        </span>
                        <span className="domain-audit-builder__mps-preview-actions">
                          <span className="domain-audit-builder__mps-status-pill">
                            {hasTrimmedText(row.intent_statement) ? 'Draft' : 'Blank'}
                          </span>
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => setIsIntentCreatorOpen(true)}
                          >
                            Edit
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : step.previewItems.length > 0 ? (
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
                disabled={step.status === 'locked'}
              >
                {step.status === 'locked' ? 'Locked' : `${step.title} (${step.count})`}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal/panel adaptations — legacy child component equivalents */}
      <MPSSelectionModal
        domainId={persistedDomainId}
        domainName={domain?.name ?? domainName ?? domainId}
        frameworkId={frameworkId}
        focusMpsId={focusedMpsId}
        open={isMPSModalOpen}
        mpsRows={mpsRows}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onClose={() => {
          setFocusedMpsId(null);
          setIsMPSModalOpen(false);
        }}
      />
      <IntentCreator
        domainId={persistedDomainId}
        domainName={domain?.name ?? domainName ?? domainId}
        frameworkId={frameworkId}
        open={isIntentCreatorOpen}
        mpsRows={mpsRows}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onSubmitted={() => setIsIntentCreatorOpen(false)}
        onClose={() => setIsIntentCreatorOpen(false)}
      />
      <CriteriaManagement
        domainId={persistedDomainId}
        domainName={domain?.name ?? domainName ?? domainId}
        frameworkId={frameworkId}
        open={isCriteriaManagementOpen}
        mpsRows={mpsRows}
        criteriaByMps={criteriaByMps}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onClose={() => setIsCriteriaManagementOpen(false)}
      />

      <section className="card" data-testid="domain-l2-approval-panel">
        <h3>Domain L2 Approval Loop</h3>
        <p>
          Current status:{' '}
          <strong>{domainApprovalQuery.data?.status?.replace(/_/g, ' ').toUpperCase() ?? 'DRAFT'}</strong>{' '}
          ({domainApprovalQuery.data?.locked ? 'Locked' : 'Unlocked'})
        </p>
        <div className="dmc-row-actions">
          <button className="btn btn-outline" onClick={() => domainApprovalActionMutation.mutate('submit')}>
            Submit L2
          </button>
          <button className="btn btn-outline" onClick={() => domainApprovalActionMutation.mutate('return')}>
            Return to User
          </button>
          <button className="btn btn-outline" onClick={() => domainApprovalActionMutation.mutate('resubmit')}>
            Resubmit
          </button>
          <button className="btn btn-primary" onClick={() => domainApprovalActionMutation.mutate('approve')}>
            Approve L2
          </button>
        </div>
        <div className="form-group" style={{ marginTop: '0.75rem' }}>
          <label htmlFor="domain-approval-comment">Review Comment</label>
          <textarea
            id="domain-approval-comment"
            className="form-control"
            rows={3}
            value={domainApprovalComment}
            onChange={(event) => setDomainApprovalComment(event.target.value)}
          />
          <button
            className="btn btn-outline"
            style={{ marginTop: '0.5rem' }}
            onClick={() => domainApprovalCommentMutation.mutate('user_note')}
            disabled={!domainApprovalComment.trim()}
          >
            Post Comment
          </button>
        </div>
      </section>
    </div>
  );
}

export default DomainAuditBuilder;
