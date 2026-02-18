/**
 * Criteria Management Page
 * FRS: FR-004 to FR-012 (Criteria Upload, Tree Navigation, Modal)
 * TRS: TR-047, TR-016, TR-033
 * Task: 5.6.3
 */
import { useState } from 'react';
import { CriteriaUpload } from '../components/criteria/CriteriaUpload';
import { CriteriaTree } from '../components/criteria/CriteriaTree';
import { CriteriaModal } from '../components/criteria/CriteriaModal';
import { useAudits } from '../lib/hooks/useAudits';
import type { Criterion } from '../lib/hooks/useCriteria';

export function CriteriaManagementPage() {
  const { data: audits } = useAudits();
  const [selectedAuditId, setSelectedAuditId] = useState<string>('');
  const [selectedCriterion, setSelectedCriterion] = useState<Criterion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get the first audit if none selected
  const auditId = selectedAuditId || audits?.[0]?.id || '';

  const handleCriterionSelect = (criterionId: string) => {
    // In a real implementation, this would fetch the full criterion data
    // For now, we'll use mock data
    setSelectedCriterion({
      id: criterionId,
      audit_id: auditId,
      mps_id: 'mock-mps-id',
      number: '1.1.1',
      title: 'Sample Criterion',
      description: 'This is a sample criterion description that would be loaded from the database.',
      status: 'in_progress',
      sort_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCriterion(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Criteria Management</h1>
      
      {/* Audit Selector */}
      {audits && audits.length > 0 && (
        <div className="mb-6">
          <label htmlFor="audit-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Audit
          </label>
          <select
            id="audit-select"
            value={auditId}
            onChange={(e) => setSelectedAuditId(e.target.value)}
            className="max-w-md border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            {audits.map((audit) => (
              <option key={audit.id} value={audit.id}>
                {audit.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Two-column layout: Upload + Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upload */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Criteria</h2>
            {auditId ? (
              <CriteriaUpload auditId={auditId} />
            ) : (
              <div className="border-2 border-gray-300 bg-gray-50 rounded p-4 text-center">
                <p className="text-gray-600">Create an audit first to upload criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Criteria Tree */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Criteria Hierarchy</h2>
            {auditId ? (
              <CriteriaTree 
                auditId={auditId} 
                onCriterionSelect={handleCriterionSelect}
              />
            ) : (
              <div className="border-2 border-gray-300 bg-gray-50 rounded p-4 text-center">
                <p className="text-gray-600">Select an audit to view criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Criteria Detail Modal */}
      <CriteriaModal
        criterion={selectedCriterion}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}
