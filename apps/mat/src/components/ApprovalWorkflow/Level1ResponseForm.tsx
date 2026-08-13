/**
 * Level 1 Response Form — Phase 4 UI Component
 * File: apps/mat/src/components/ApprovalWorkflow/Level1ResponseForm.tsx
 * Issue: #2004 (mmm-approval-foundation-runtime-build-to-green)
 *
 * Implements T-MMM-APPROVAL-DB-009, T-MMM-APPROVAL-DB-010, T-MMM-APPROVAL-DB-011
 * Allows Level 1 (framework owner) to accept/edit/reject proposed changes.
 * Captures AI learning events with consent gating.
 * Wires to mmm-approval-level1-response-submit Edge Function.
 *
 * Contract: approval-workflow-db-api-contract.md §17
 */

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

type L1Action = 'accepted' | 'edited_by_level_1' | 'rejected';

interface ProposedChange {
  id: string;
  field: string;
  original_value: string;
  proposed_value: string;
  status: string;
  level_1_response?: string;
}

interface ChangeResponse {
  proposed_change_id: string;
  action: L1Action;
  final_value?: string;
  response_comment?: string;
}

export const Level1ResponseForm: React.FC<{ roundId: string }> = ({ roundId }) => {
  const [responses, setResponses] = useState<Map<string, ChangeResponse>>(new Map());
  const [learningConsent, setLearningConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showResubmit, setShowResubmit] = useState(false);

  // Fetch proposed changes
  const { data: changes, isLoading: changesLoading } = useQuery({
    queryKey: ['proposed-changes', roundId],
    queryFn: async () => {
      const response = await fetch(`/api/mmm-approval-workspace-read?filter=pending`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch changes');
      const data = await response.json();
      const round = data.approval_rounds.find((r: any) => r.id === roundId);
      return round?.proposed_changes || [];
    },
  });

  // Submit responses mutation
  const { mutate: submitResponses } = useMutation({
    mutationFn: async () => {
      const responsesArray = Array.from(responses.values());
      if (responsesArray.length === 0) {
        throw new Error('Please respond to at least one proposed change');
      }

      const response = await fetch('/api/mmm-approval-level1-response-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          approval_round_id: roundId,
          level_1_user_id: localStorage.getItem('user_id'),
          responses: responsesArray,
          resubmit: showResubmit,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to submit responses');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setSuccess(`Responses submitted. ${data.applied_change_ids.length} changes applied.`);
      if (data.new_round_id) {
        setSuccess(`Responses submitted. New approval round created: ${data.new_round_id}`);
      }
      setResponses(new Map());
      setLearningConsent(false);
      setError(null);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to submit responses');
      setSuccess(null);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!learningConsent) {
      setError('Please agree to learning consent to proceed');
      return;
    }
    setIsSubmitting(true);
    submitResponses();
  };

  const updateResponse = (changeId: string, action: L1Action, finalValue?: string, comment?: string) => {
    const newResponses = new Map(responses);
    newResponses.set(changeId, {
      proposed_change_id: changeId,
      action,
      final_value: finalValue || undefined,
      response_comment: comment || undefined,
    });
    setResponses(newResponses);
  };

  if (changesLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!changes || changes.length === 0) {
    return <div className="p-4 text-gray-600">No proposed changes for this round</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Level 1 Response — Review Proposed Changes</h2>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Proposed Changes List */}
        <div className="space-y-4">
          {changes.map((change: ProposedChange) => {
            const currentResponse = responses.get(change.id);
            return (
              <div key={change.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">{change.field}</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p><strong>Original:</strong> {change.original_value}</p>
                    <p><strong>Proposed:</strong> {change.proposed_value}</p>
                    <p><strong>Status:</strong> {change.status}</p>
                  </div>
                </div>

                {/* Response Options */}
                <fieldset className="space-y-3 mb-4">
                  <legend className="font-semibold mb-2">Your Response</legend>

                  {/* Accept Option */}
                  <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-blue-50">
                    <input
                      type="radio"
                      name={`response-${change.id}`}
                      value="accepted"
                      checked={currentResponse?.action === 'accepted'}
                      onChange={() => updateResponse(change.id, 'accepted', change.proposed_value)}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 font-semibold text-green-700">✓ Accept</span>
                  </label>

                  {/* Edit Option */}
                  <div className="border rounded p-3">
                    <label className="flex items-center cursor-pointer mb-2">
                      <input
                        type="radio"
                        name={`response-${change.id}`}
                        value="edited_by_level_1"
                        checked={currentResponse?.action === 'edited_by_level_1'}
                        onChange={() => updateResponse(change.id, 'edited_by_level_1', change.proposed_value)}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 font-semibold text-blue-700">→ Edit & Accept</span>
                    </label>
                    {currentResponse?.action === 'edited_by_level_1' && (
                      <textarea
                        value={currentResponse.final_value || ''}
                        onChange={(e) => updateResponse(change.id, 'edited_by_level_1', e.target.value)}
                        placeholder="Enter edited value..."
                        className="w-full h-20 p-2 border rounded text-sm"
                      />
                    )}
                  </div>

                  {/* Reject Option */}
                  <div className="border rounded p-3">
                    <label className="flex items-center cursor-pointer mb-2">
                      <input
                        type="radio"
                        name={`response-${change.id}`}
                        value="rejected"
                        checked={currentResponse?.action === 'rejected'}
                        onChange={() => updateResponse(change.id, 'rejected')}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 font-semibold text-red-700">✗ Reject</span>
                    </label>
                    {currentResponse?.action === 'rejected' && (
                      <textarea
                        value={currentResponse.response_comment || ''}
                        onChange={(e) => updateResponse(change.id, 'rejected', undefined, e.target.value)}
                        placeholder="Reason for rejection (optional)..."
                        className="w-full h-20 p-2 border rounded text-sm"
                      />
                    )}
                  </div>
                </fieldset>
              </div>
            );
          })}
        </div>

        {/* Learning Consent */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-3">AI Learning Consent</h3>
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={learningConsent}
              onChange={(e) => setLearningConsent(e.target.checked)}
              className="w-4 h-4 mt-1 mr-3 flex-shrink-0"
            />
            <span className="text-sm text-gray-700">
              <strong>I consent to use this approval decision to improve future AI recommendations.</strong>
              {' '}Your decision data will be used to train the descriptor reasoning model. This information is not shared with external parties and is used only for model improvement.
            </span>
          </label>
        </div>

        {/* Resubmit Option */}
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showResubmit}
            onChange={(e) => setShowResubmit(e.target.checked)}
            className="w-4 h-4 mr-3"
          />
          <span className="text-gray-700">Resubmit changes if any are rejected</span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || responses.size === 0}
          className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Responses'}
        </button>
      </form>
    </div>
  );
};

export default Level1ResponseForm;
