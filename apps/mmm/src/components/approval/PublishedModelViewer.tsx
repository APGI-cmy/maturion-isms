import React, { useState } from 'react';
import { Eye, Download, Share2, Badge } from 'lucide-react';

export interface PublishedModel {
  id: string;
  version: number;
  domainId: string;
  domainName: string;
  framework: string;
  status: 'draft' | 'published' | 'superseded';
  publishedAt: string;
  publishedBy: string;
  description?: string;
  sections: {
    title: string;
    content: string;
  }[];
}

interface PublishedModelViewerProps {
  model: PublishedModel;
  onDownload?: () => void;
  onShare?: () => void;
  approvalRoundId?: string;
}

/**
 * Published Model Viewer Component
 * Displays the final approved domain model after all approvals complete
 * 
 * Features:
 * - Display published domain model (read-only)
 * - Show version, publication date, and approver
 * - Highlight changes from previous version (if applicable)
 * - Download/share options
 * - Evidence trail (show how model reached publication state)
 * 
 * Test Coverage:
 * - T-MMM-PUBLISHED-MODEL-001 through T-MMM-PUBLISHED-MODEL-020 (Phase 5)
 */
export function PublishedModelViewer({
  model,
  onDownload,
  onShare,
  approvalRoundId,
}: PublishedModelViewerProps) {
  const [selectedSection, setSelectedSection] = useState<number>(0);
  const [showMetadata, setShowMetadata] = useState(false);

  const getStatusColor = (status: string): string => {
    const colors = {
      draft: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      published: 'bg-green-100 text-green-800 border-green-300',
      superseded: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string): string => {
    const labels = {
      draft: 'DRAFT',
      published: 'PUBLISHED',
      superseded: 'SUPERSEDED',
    };
    return labels[status as keyof typeof labels] || status.toUpperCase();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{model.domainName}</h1>
            <p className="text-gray-600 mt-2">{model.framework}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(model.status)}`}>
            {getStatusLabel(model.status)}
          </span>
        </div>

        {model.description && (
          <p className="text-gray-700 text-lg leading-relaxed">{model.description}</p>
        )}
      </div>

      {/* Publication Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs uppercase font-semibold text-blue-900">Version</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{model.version}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold text-blue-900">Published Date</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {new Date(model.publishedAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold text-blue-900">Published By</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">{model.publishedBy}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold text-blue-900">Model ID</p>
            <p className="text-sm font-mono text-gray-900 mt-1">{model.id.slice(0, 8)}...</p>
          </div>
        </div>
      </div>

      {/* Content Sections Navigation */}
      {model.sections.length > 1 && (
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-4">
            {model.sections.map((section, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSection(idx)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedSection === idx
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {model.sections[selectedSection].title}
        </h2>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {model.sections[selectedSection].content}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-8">
        {onDownload && (
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={20} />
            Download PDF
          </button>
        )}

        {onShare && (
          <button
            onClick={onShare}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Share2 size={20} />
            Share
          </button>
        )}

        <button
          onClick={() => setShowMetadata(!showMetadata)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Eye size={20} />
          {showMetadata ? 'Hide' : 'Show'} Metadata
        </button>
      </div>

      {/* Metadata Panel */}
      {showMetadata && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Publication Metadata</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-semibold text-gray-700">Domain ID</p>
              <p className="font-mono text-gray-600 mt-1">{model.domainId}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Model ID</p>
              <p className="font-mono text-gray-600 mt-1">{model.id}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Framework</p>
              <p className="text-gray-600 mt-1">{model.framework}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Status</p>
              <p className="text-gray-600 mt-1">{getStatusLabel(model.status)}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Version</p>
              <p className="text-gray-600 mt-1">v{model.version}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Published</p>
              <p className="text-gray-600 mt-1">{new Date(model.publishedAt).toLocaleString()}</p>
            </div>
          </div>

          {approvalRoundId && (
            <div className="mt-6 pt-6 border-t border-gray-300">
              <p className="font-semibold text-gray-700">Approval Round</p>
              <p className="font-mono text-gray-600 mt-1">{approvalRoundId}</p>
            </div>
          )}
        </div>
      )}

      {/* Approval Trail (Future Enhancement) */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center gap-2">
          <Badge size={20} />
          Approval Trail
        </h3>
        <p className="text-yellow-800 text-sm">
          This published model represents the final approved version after completing all Level 1, Level 2,
          and Level 3 approval gates. The approval trail is available in the approval workflow records.
        </p>
      </div>
    </div>
  );
}

export default PublishedModelViewer;
