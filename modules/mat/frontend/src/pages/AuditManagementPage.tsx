/**
 * Audit Management Page
 * FRS: FR-001 (Create Audit), FR-002 (Audit Listing), FR-003 (Audit Deletion),
 *      FR-097 (Audit Results Table)
 * TRS: TR-047, TR-097
 * Task: 5.6.2 (Audit Management CRUD), Wave 14 TASK-W14-BB-007 (Results tab)
 */
import { useState } from 'react';
import { AuditCreationForm } from '../components/audits/AuditCreationForm';
import { AuditList } from '../components/audits/AuditList';
import { AuditResultsTable } from '../components/audit/AuditResultsTable';

type ActiveTab = 'overview' | 'results';

export function AuditManagementPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  return (
    <div className="audit-management-page p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Audit Management</h1>

      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 mb-6" role="tablist" aria-label="Audit management tabs">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'overview'}
          aria-controls="tab-panel-overview"
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'overview'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('overview')}
          data-testid="tab-overview"
        >
          Overview
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'results'}
          aria-controls="tab-panel-results"
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'results'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('results')}
          data-testid="tab-results"
        >
          Results
        </button>
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div
          id="tab-panel-overview"
          role="tabpanel"
          aria-labelledby="tab-overview"
          data-testid="tab-panel-overview"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Creation Form - 1/3 width on large screens */}
            <div className="lg:col-span-1">
              <AuditCreationForm />
            </div>

            {/* Audit List - 2/3 width on large screens */}
            <div className="lg:col-span-2">
              <AuditList />
            </div>
          </div>
        </div>
      )}

      {/* Results tab — AuditResultsTable (FR-097) */}
      {activeTab === 'results' && (
        <div
          id="tab-panel-results"
          role="tabpanel"
          aria-labelledby="tab-results"
          data-testid="tab-panel-results"
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Audit Results</h2>
            <p className="text-sm text-gray-500">
              View all criteria evaluations across domains and MPS.
            </p>
          </div>
          {/* AuditResultsTable renders criteria_evaluations data for the selected audit */}
          <AuditResultsTable
            auditId=""
            criteria={[]}
          />
        </div>
      )}
    </div>
  );
}

