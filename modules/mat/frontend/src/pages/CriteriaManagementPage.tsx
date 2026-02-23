/**
 * Criteria Management Page
 * FRS: FR-004 to FR-012 (Criteria Upload, Tree Navigation, Modal)
 * TRS: TR-047, TR-016, TR-033
 * Task: 5.6.3
 */
import { useState, useCallback } from 'react';
import { CriteriaUpload } from '../components/criteria/CriteriaUpload';
import { CriteriaTree } from '../components/criteria/CriteriaTree';
import { CriteriaModal } from '../components/criteria/CriteriaModal';
import { useAudits } from '../lib/hooks/useAudits';
import { useCriterion } from '../lib/hooks/useCriteria';
import type { Criterion } from '../lib/hooks/useCriteria';

export function CriteriaManagementPage() {
  const { data: audits } = useAudits();
  const [selectedAuditId, setSelectedAuditId] = useState<string>('');
  const [selectedCriterionId, setSelectedCriterionId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get the first audit if none selected
  const auditId = selectedAuditId || audits?.[0]?.id || '';

  // Fetch the real criterion from Supabase when one is selected
  const { data: fetchedCriterion } = useCriterion(selectedCriterionId);

  // Derive the modal criterion: use fetched data, fall back to a minimal shape
  const selectedCriterion: Criterion | null = fetchedCriterion ?? null;

  const handleCriterionSelect = useCallback((criterionId: string) => {
    setSelectedCriterionId(criterionId);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCriterionId('');
  }, []);

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

      {/* Criteria Detail Modal — populated with real Supabase data */}
      <CriteriaModal
        criterion={selectedCriterion}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}
