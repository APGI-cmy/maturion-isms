/**
 * Criteria Modal/Detail Component
 * FRS: FR-011 (Criteria Modal), FR-012 (Not Used Exclusion)
 * TRS: TR-047
 */
import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { EvidenceCollection } from '../evidence/EvidenceCollection';

interface CriteriaModalProps {
  criterion: {
    id: string;
    number: string;
    title: string;
    description?: string;
    status?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabId = 'description' | 'not-used' | 'evidence' | 'findings' | 'interview';

export function CriteriaModal({ criterion, isOpen, onClose }: CriteriaModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('description');
  const [notUsed, setNotUsed] = useState(false);
  const [notUsedReason, setNotUsedReason] = useState('');
  const [notUsedJustification, setNotUsedJustification] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and keyboard navigation
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      // Tab trap inside modal
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !criterion) {
    return null;
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: 'description', label: 'Description' },
    { id: 'not-used', label: 'Not Used' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'findings', label: 'Findings' },
    { id: 'interview', label: 'Interview' },
  ];

  const handleNotUsedToggle = () => {
    setNotUsed(!notUsed);
    if (notUsed) {
      // Clearing when unchecking
      setNotUsedReason('');
      setNotUsedJustification('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="criteria-modal-title"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 id="criteria-modal-title" className="text-xl font-semibold text-gray-900">
              {criterion.number} {criterion.title}
            </h2>
            {criterion.status && (
              <span className={`inline-block mt-1 text-xs px-2 py-1 rounded ${
                criterion.status === 'completed' ? 'bg-green-100 text-green-800' :
                criterion.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-600'
              }`}>
                {criterion.status}
              </span>
            )}
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Description Tab */}
          {activeTab === 'description' && (
            <div id="description-panel" role="tabpanel" aria-labelledby="description-tab">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Criterion Description</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {criterion.description || 'No description available.'}
                </p>
              </div>
            </div>
          )}

          {/* Not Used Tab */}
          {activeTab === 'not-used' && (
            <div id="not-used-panel" role="tabpanel" aria-labelledby="not-used-tab">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Not Used Exclusion</h3>
              <div className="space-y-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={notUsed}
                    onChange={handleNotUsedToggle}
                    className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    aria-describedby="not-used-description"
                  />
                  <div>
                    <span className="font-medium text-gray-900">
                      Mark this criterion as "Not Used"
                    </span>
                    <p id="not-used-description" className="text-sm text-gray-600 mt-1">
                      Use this option if this criterion is not applicable to your organisation.
                      You must provide a reason and justification.
                    </p>
                  </div>
                </label>

                {notUsed && (
                  <div className="space-y-4 pl-8 border-l-2 border-gray-200">
                    <div>
                      <label htmlFor="not-used-reason" className="block text-sm font-medium text-gray-700 mb-1">
                        Reason <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="not-used-reason"
                        value={notUsedReason}
                        onChange={(e) => setNotUsedReason(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        required
                        aria-required="true"
                      >
                        <option value="">Select a reason...</option>
                        <option value="not-applicable">Not applicable to our organisation</option>
                        <option value="out-of-scope">Out of audit scope</option>
                        <option value="service-not-provided">Service not provided</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="not-used-justification" className="block text-sm font-medium text-gray-700 mb-1">
                        Justification <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="not-used-justification"
                        value={notUsedJustification}
                        onChange={(e) => setNotUsedJustification(e.target.value)}
                        rows={4}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="Provide detailed justification for why this criterion is not used..."
                        required
                        aria-required="true"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Minimum 50 characters required
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Evidence Tab */}
          {activeTab === 'evidence' && (
            <div id="evidence-panel" role="tabpanel" aria-labelledby="evidence-tab">
              <EvidenceCollection criterionId={criterion.id} />
            </div>
          )}

          {/* Findings Tab */}
          {activeTab === 'findings' && (
            <div id="findings-panel" role="tabpanel" aria-labelledby="findings-tab">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Findings Summary</h3>
              <div className="space-y-4">
                <textarea
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  rows={8}
                  placeholder="Enter findings summary for this criterion..."
                  aria-label="Findings summary"
                />
                <p className="text-sm text-gray-500">
                  Document key findings, observations, and notes related to this criterion.
                </p>
              </div>
            </div>
          )}

          {/* Interview Tab */}
          {activeTab === 'interview' && (
            <div id="interview-panel" role="tabpanel" aria-labelledby="interview-tab">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Interview Recording</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-600">Interview recording interface will be implemented in Task 5.6.4</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Will support: Audio recording, transcript display, segment tagging
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              // Save logic would go here
              alert('Save functionality will be implemented with backend integration');
              onClose();
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
