/**
 * Criteria Tree Navigation Component
 * FRS: FR-010 (Hierarchical Navigation)
 * TRS: TR-047, TR-033
 */
import { useState } from 'react';
import { useCriteriaTree } from '../../lib/hooks/useCriteria';
import { ChevronRight, ChevronDown, FileText } from 'lucide-react';

interface CriteriaTreeProps {
  auditId: string;
  onCriterionSelect?: (criterionId: string) => void;
}

export function CriteriaTree({ auditId, onCriterionSelect }: CriteriaTreeProps) {
  const { data: domains, isLoading, isError, error } = useCriteriaTree(auditId);
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const [expandedMPS, setExpandedMPS] = useState<Set<string>>(new Set());

  const toggleDomain = (domainId: string) => {
    setExpandedDomains((prev) => {
      const next = new Set(prev);
      if (next.has(domainId)) {
        next.delete(domainId);
      } else {
        next.add(domainId);
      }
      return next;
    });
  };

  const toggleMPS = (mpsId: string) => {
    setExpandedMPS((prev) => {
      const next = new Set(prev);
      if (next.has(mpsId)) {
        next.delete(mpsId);
      } else {
        next.add(mpsId);
      }
      return next;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent, id: string, type: 'domain' | 'mps' | 'criterion') => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (type === 'domain') {
        toggleDomain(id);
      } else if (type === 'mps') {
        toggleMPS(id);
      } else if (type === 'criterion' && onCriterionSelect) {
        onCriterionSelect(id);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="criteria-tree" role="status" aria-live="polite">
        <div className="animate-pulse space-y-2">
          <div className="h-8 bg-gray-200 rounded w-full" />
          <div className="h-8 bg-gray-200 rounded w-full" />
          <div className="h-8 bg-gray-200 rounded w-full" />
        </div>
        <span className="sr-only">Loading criteria tree...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="criteria-tree" role="alert">
        <div className="border-2 border-red-500 bg-red-50 rounded p-4">
          <p className="text-red-800">
            Failed to load criteria tree: {error?.message || 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  if (!domains || domains.length === 0) {
    return (
      <div className="criteria-tree">
        <div className="border-2 border-gray-300 bg-gray-50 rounded p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-600">No criteria uploaded yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Upload a criteria document to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="criteria-tree" role="tree" aria-label="Criteria hierarchy">
      <div className="space-y-1">
        {domains.map((domain) => {
          const isDomainExpanded = expandedDomains.has(domain.id);

          return (
            <div key={domain.id} role="treeitem" aria-expanded={isDomainExpanded}>
              {/* Domain Header */}
              <button
                onClick={() => toggleDomain(domain.id)}
                onKeyDown={(e) => handleKeyDown(e, domain.id, 'domain')}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`${domain.title || domain.name} - ${isDomainExpanded ? 'Expanded' : 'Collapsed'}`}
              >
                {isDomainExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-600 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-600 flex-shrink-0" aria-hidden="true" />
                )}
                <span className="font-semibold text-sm text-gray-900">
                  {domain.title || domain.name}
                </span>
                <span className="ml-auto text-xs text-gray-500">
                  {domain.mini_performance_standards?.length || 0} MPS
                </span>
              </button>

              {/* MPS List (Nested) */}
              {isDomainExpanded && domain.mini_performance_standards && (
                <div className="ml-4 mt-1 space-y-1" role="group">
                  {domain.mini_performance_standards.map((mps) => {
                    const isMPSExpanded = expandedMPS.has(mps.id);

                    return (
                      <div key={mps.id} role="treeitem" aria-expanded={isMPSExpanded}>
                        {/* MPS Header */}
                        <button
                          onClick={() => toggleMPS(mps.id)}
                          onKeyDown={(e) => handleKeyDown(e, mps.id, 'mps')}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label={`${mps.title || mps.name} - ${isMPSExpanded ? 'Expanded' : 'Collapsed'}`}
                        >
                          {isMPSExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" aria-hidden="true" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0" aria-hidden="true" />
                          )}
                          <span className="text-sm text-gray-800">
                            {mps.number || ''} {mps.title || mps.name}
                          </span>
                          <span className="ml-auto text-xs text-gray-500">
                            {mps.criteria?.length || 0} criteria
                          </span>
                        </button>

                        {/* Criteria List (Nested) */}
                        {isMPSExpanded && mps.criteria && (
                          <div className="ml-4 mt-1 space-y-1" role="group">
                            {mps.criteria.map((criterion) => (
                              <button
                                key={criterion.id}
                                onClick={() => onCriterionSelect?.(criterion.id)}
                                onKeyDown={(e) => handleKeyDown(e, criterion.id, 'criterion')}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
                                role="treeitem"
                                aria-label={`Criterion ${criterion.number}: ${criterion.title || criterion.name}`}
                              >
                                <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" aria-hidden="true" />
                                <span className="text-sm text-gray-700">
                                  {criterion.number} {criterion.title || criterion.name}
                                </span>
                                {criterion.status && (
                                  <span className={`ml-auto text-xs px-2 py-1 rounded ${
                                    criterion.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    criterion.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    {criterion.status}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
