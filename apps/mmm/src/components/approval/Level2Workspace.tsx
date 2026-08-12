import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface DomainData {
  id: string;
  name: string;
  description: string;
  status: string;
  created_by: string;
  framework_id: string;
  organisation_id: string;
}

interface MPS {
  id: string;
  name: string;
  description: string;
  intent_statement?: string;
}

interface Criterion {
  id: string;
  mps_id: string;
  name: string;
  reference: string;
}

interface Descriptor {
  id: string;
  criterion_id: string;
  maturity_level: number;
  text: string;
}

interface Level2WorkspaceProps {
  approvalRoundId: string;
  approverId: string;
  organisationId: string;
}

/**
 * Level 2 Approval Workspace Component
 * Allows Level 2 approvers to:
 * 1. Review domain, MPS, criteria, and descriptors
 * 2. Propose changes to content
 * 3. Submit proposed changes
 * 4. Approve or request changes
 * 
 * Phase 3 Implementation:
 * - Workspace layout and data loading
 * - Content rendering (domain, MPS, criteria, descriptors)
 * - Proposed-change controls
 * - Approval/submit actions
 */
export function Level2Workspace({
  approvalRoundId,
  approverId,
  organisationId,
}: Level2WorkspaceProps) {
  const [domain, setDomain] = useState<DomainData | null>(null);
  const [mpsList, setMpsList] = useState<MPS[]>([]);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [descriptors, setDescriptors] = useState<Descriptor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [proposedChanges, setProposedChanges] = useState<any[]>([]);
  const [approvalDecision, setApprovalDecision] = useState<'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    loadWorkspaceData();
  }, [approvalRoundId]);

  const loadWorkspaceData = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      // TODO: Fetch approval round details
      // TODO: Verify approver authorization (RLS will enforce)
      // TODO: Load domain data
      // TODO: Load MPS list
      // TODO: Load criteria
      // TODO: Load descriptors
      // TODO: Load any existing proposed changes

      // Placeholder: These will be fetched from supabase queries
      setDomain(null);
      setMpsList([]);
      setCriteria([]);
      setDescriptors([]);
      setProposedChanges([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load workspace data';
      setLoadError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProposeChange = (objectType: string, objectId: string, field: string, originalValue: any, newValue: any) => {
    // TODO: Implement proposed change capture
    // TODO: Add to proposedChanges state
    // TODO: Show propose-change modal/form
    console.log('Propose change:', { objectType, objectId, field, originalValue, newValue });
  };

  const handleSubmitChanges = async () => {
    if (proposedChanges.length === 0) {
      alert('No proposed changes to submit');
      return;
    }

    try {
      // TODO: Call mmm-approval-proposed-changes-submit Edge Function
      // TODO: Wait for notification event in response
      // TODO: Show success message
      // TODO: Clear proposed changes
      alert('Proposed changes submitted successfully');
      setProposedChanges([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit changes';
      alert(errorMessage);
    }
  };

  const handleApprove = async () => {
    if (proposedChanges.length > 0) {
      const confirmed = confirm('You have unsent proposed changes. Submit them before approving?');
      if (!confirmed) {
        return;
      }
      // TODO: Submit changes first if user confirms
    }

    try {
      // TODO: Call mmm-approval-decision-submit Edge Function with decision: approved
      // TODO: Wait for notification event
      // TODO: Show success message
      // TODO: Route to next step
      alert('Approval submitted successfully');
      setApprovalDecision('approved');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit approval';
      alert(errorMessage);
    }
  };

  const handleRejectWithChanges = async () => {
    const reason = prompt('Provide a reason for requesting changes:');
    if (!reason) return;

    try {
      // TODO: Call mmm-approval-decision-submit Edge Function with decision: rejected, reason
      // TODO: Wait for notification event
      // TODO: Show success message
      alert('Changes requested. Level 1 user will be notified.');
      setApprovalDecision('rejected');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit decision';
      alert(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Workspace</h3>
          <p className="text-red-700 mb-4">{loadError}</p>
          <button
            onClick={loadWorkspaceData}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">
            {domain?.name || 'Domain Approval Workspace'}
          </h1>
          <p className="text-gray-600 mt-1">
            {domain?.description}
          </p>
          {domain && (
            <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-semibold text-gray-900">{domain.status}</p>
              </div>
              <div>
                <p className="text-gray-600">MPS Count</p>
                <p className="font-semibold text-gray-900">{mpsList.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Criteria Count</p>
                <p className="font-semibold text-gray-900">{criteria.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Descriptors Count</p>
                <p className="font-semibold text-gray-900">{descriptors.length}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* MPS Section */}
        {mpsList.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Management Practice Statements</h2>
            <div className="space-y-4">
              {mpsList.map((mps) => (
                <div key={mps.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{mps.name}</h3>
                    <button
                      onClick={() => handleProposeChange('mps', mps.id, 'description', mps.description, '')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Propose Change
                    </button>
                  </div>
                  <p className="text-gray-700 mb-3">{mps.description}</p>

                  {/* Intent Statement */}
                  {mps.intent_statement && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">Intent Statement</h4>
                      <p className="text-blue-700">{mps.intent_statement}</p>
                    </div>
                  )}

                  {/* Criteria for this MPS */}
                  {criteria.filter(c => c.mps_id === mps.id).length > 0 && (
                    <div className="mt-6 space-y-3 border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-900">Criteria</h4>
                      {criteria
                        .filter(c => c.mps_id === mps.id)
                        .map((criterion) => (
                          <div key={criterion.id} className="ml-4 p-3 bg-gray-50 rounded border border-gray-100">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {mps.name} / {criterion.reference}
                                </p>
                                <p className="text-sm text-gray-700 mt-1">{criterion.name}</p>
                              </div>
                              <button
                                onClick={() => handleProposeChange('criterion', criterion.id, 'text', criterion.name, '')}
                                className="text-blue-600 hover:text-blue-700 text-xs font-medium whitespace-nowrap ml-4"
                              >
                                Propose Change
                              </button>
                            </div>

                            {/* Descriptors for this Criterion */}
                            {descriptors.filter(d => d.criterion_id === criterion.id).length > 0 && (
                              <div className="mt-3 space-y-2 border-t border-gray-200 pt-3">
                                {descriptors
                                  .filter(d => d.criterion_id === criterion.id)
                                  .map((descriptor) => (
                                    <div key={descriptor.id} className="text-xs bg-white p-2 rounded border border-gray-200">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <p className="font-semibold text-gray-900">
                                            Level {descriptor.maturity_level}
                                          </p>
                                          <p className="text-gray-700 mt-1">{descriptor.text}</p>
                                        </div>
                                        <button
                                          onClick={() =>
                                            handleProposeChange(
                                              'descriptor',
                                              descriptor.id,
                                              'text',
                                              descriptor.text,
                                              ''
                                            )
                                          }
                                          className="text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap ml-2"
                                        >
                                          Propose
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Proposed Changes Summary */}
        {proposedChanges.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Proposed Changes ({proposedChanges.length})</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              {/* TODO: Display proposed changes summary */}
              <p className="text-sm text-gray-600">
                You have {proposedChanges.length} pending change(s) to review before submitting.
              </p>
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end sticky bottom-6">
          {proposedChanges.length > 0 && (
            <button
              onClick={handleSubmitChanges}
              className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 font-medium"
            >
              Submit Changes ({proposedChanges.length})
            </button>
          )}
          <button
            onClick={handleRejectWithChanges}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium"
            disabled={approvalDecision !== 'pending'}
          >
            Request Changes
          </button>
          <button
            onClick={handleApprove}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium disabled:opacity-50"
            disabled={approvalDecision !== 'pending'}
          >
            Approve Domain
          </button>
        </div>
      </div>
    </div>
  );
}

export default Level2Workspace;
