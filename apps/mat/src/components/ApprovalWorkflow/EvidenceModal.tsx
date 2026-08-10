/**
 * Evidence Modal Component — Phase 4 UI Component
 * File: apps/mat/src/components/ApprovalWorkflow/EvidenceModal.tsx
 * Issue: #2004 (mmm-approval-foundation-runtime-build-to-green)
 *
 * Displays descriptor reasoning, criteria alignment, and evidence sources.
 * Accessible from Level 2 change summary and Level 1 response form.
 *
 * Contract: approval-workflow-db-api-contract.md §17 (evidence display)
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface DescriptorEvidence {
  reasoning: string;
  criteria_alignment: Array<{
    criterion_id: string;
    criterion_name: string;
    alignment_score: number;
  }>;
  source_audit_events: Array<{
    event_type: string;
    timestamp: string;
    description: string;
  }>;
  confidence_score?: number;
}

export const EvidenceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  changeId: string;
  field: string;
  proposedValue: string;
}> = ({ isOpen, onClose, changeId, field, proposedValue }) => {
  const [tab, setTab] = useState<'reasoning' | 'criteria' | 'audit'>('reasoning');

  // Fetch evidence (would be from database or descriptor service)
  const { data: evidence, isLoading } = useQuery({
    queryKey: ['evidence', changeId],
    queryFn: async () => {
      // In production, this would query from mmm_approval_evidence_descriptors
      // and criteria_alignment tables
      return {
        reasoning: 'This field was recommended for change based on recent assessment updates and compliance gaps identified in the audit cycle.',
        criteria_alignment: [
          { criterion_id: 'crit-001', criterion_name: 'Security: Access Control', alignment_score: 0.92 },
          { criterion_id: 'crit-002', criterion_name: 'Compliance: Data Protection', alignment_score: 0.87 },
        ],
        source_audit_events: [
          { event_type: 'assessment_completed', timestamp: '2026-02-10T14:30:00Z', description: 'Annual audit identified 3 gaps in this field' },
          { event_type: 'recommendation_generated', timestamp: '2026-02-12T09:15:00Z', description: 'Descriptor reasoning engine recommended update' },
        ],
        confidence_score: 0.89,
      } as DescriptorEvidence;
    },
    enabled: isOpen,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-96 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">Evidence & Reasoning</h3>
            <p className="text-sm text-gray-600 mt-1">{field}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-light"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="sticky top-14 bg-gray-50 border-b flex">
          {(['reasoning', 'criteria', 'audit'] as const).map((tabName) => (
            <button
              key={tabName}
              onClick={() => setTab(tabName)}
              className={`flex-1 py-3 font-semibold text-sm transition ${
                tab === tabName
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tabName === 'reasoning' && 'Reasoning'}
              {tabName === 'criteria' && 'Criteria Alignment'}
              {tabName === 'audit' && 'Audit Trail'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading evidence...</div>
          ) : (
            <>
              {/* Reasoning Tab */}
              {tab === 'reasoning' && (
                <div className="space-y-4">
                  {evidence?.confidence_score && (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                      <p className="text-sm text-gray-700">
                        <strong>Confidence Score:</strong> {(evidence.confidence_score * 100).toFixed(0)}%
                      </p>
                    </div>
                  )}
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-gray-800 leading-relaxed">{evidence?.reasoning}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Proposed Value:</p>
                    <code className="block bg-gray-100 p-3 rounded text-sm text-gray-800 overflow-auto">
                      {proposedValue}
                    </code>
                  </div>
                </div>
              )}

              {/* Criteria Alignment Tab */}
              {tab === 'criteria' && (
                <div className="space-y-3">
                  {evidence?.criteria_alignment.map((criterion) => (
                    <div key={criterion.criterion_id} className="border rounded p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{criterion.criterion_name}</h4>
                        <span className="text-sm font-semibold text-green-700">
                          {(criterion.alignment_score * 100).toFixed(0)}% aligned
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded h-2">
                        <div
                          className="bg-green-500 h-2 rounded"
                          style={{ width: `${criterion.alignment_score * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Audit Trail Tab */}
              {tab === 'audit' && (
                <div className="space-y-3">
                  {evidence?.source_audit_events.map((event, idx) => (
                    <div key={idx} className="border-l-4 border-gray-300 pl-4 py-2">
                      <p className="font-semibold text-gray-800 text-sm">{event.event_type}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-700 mt-2">{event.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded font-semibold hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvidenceModal;
