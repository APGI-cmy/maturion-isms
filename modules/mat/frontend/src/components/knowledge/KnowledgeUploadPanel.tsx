/**
 * KnowledgeUploadPanel — Pipeline 2 (Knowledge Ingestion) upload UI
 *
 * Wave    : DCKIS-IMPL-002
 * Test IDs: T-KU-001
 *
 * HARD CONSTRAINT (ADR-005): This component is NOT related to CriteriaUpload.tsx
 * or any Pipeline 1 component. It uses a distinct upload handler via useKnowledgeDocuments.
 *
 * Accepts: .docx, .pdf, .txt, .md
 * Domain selector: AIMC source taxonomy (general, iso27001, nist, pci-dss, soc2, risk-management)
 */

import React, { useRef, useState } from 'react';
import { useKnowledgeDocuments } from '../../lib/hooks/useKnowledgeDocuments';

/** AIMC source taxonomy domain options for Pipeline 2 Knowledge Ingestion */
const DOMAIN_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'iso27001', label: 'ISO 27001' },
  { value: 'nist', label: 'NIST' },
  { value: 'pci-dss', label: 'PCI-DSS' },
  { value: 'soc2', label: 'SOC 2' },
  { value: 'risk-management', label: 'Risk Management' },
] as const;

export type KnowledgeDomain = (typeof DOMAIN_OPTIONS)[number]['value'];

export function KnowledgeUploadPanel(): React.ReactElement {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDomain, setSelectedDomain] = useState<KnowledgeDomain>('general');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { uploadDocument, isUploading, uploadError, uploadSuccess } =
    useKnowledgeDocuments();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setValidationError(null);
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  }

  function handleDomainChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    setSelectedDomain(event.target.value as KnowledgeDomain);
  }

  async function handleUpload(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!selectedFile) {
      setValidationError('Please select a file to upload.');
      return;
    }
    await uploadDocument({ file: selectedFile, domain: selectedDomain });
    // Reset file input on success
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSelectedFile(null);
  }

  return (
    <section
      aria-labelledby="knowledge-upload-heading"
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <h2
        id="knowledge-upload-heading"
        className="text-lg font-semibold text-gray-900 mb-1"
      >
        🧠 Knowledge Upload — Pipeline 2
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Upload knowledge documents for AI-assisted maturity assessment. This is
        Pipeline 2 (Knowledge Ingestion) — distinct from Pipeline 1 (Criteria
        Upload).
      </p>

      <form onSubmit={handleUpload} noValidate aria-label="Knowledge document upload form">
        {/* Domain selector */}
        <div className="mb-4">
          <label
            htmlFor="knowledge-domain-selector"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Knowledge Domain
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          </label>
          <select
            id="knowledge-domain-selector"
            name="domain"
            value={selectedDomain}
            onChange={handleDomainChange}
            aria-required="true"
            aria-describedby="domain-hint"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm px-3 py-2 border"
          >
            {DOMAIN_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p id="domain-hint" className="mt-1 text-xs text-gray-500">
            Select the AIMC source taxonomy domain for this document.
          </p>
        </div>

        {/* File input */}
        <div className="mb-4">
          <label
            htmlFor="knowledge-file-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Document File
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          </label>
          <input
            id="knowledge-file-input"
            ref={fileInputRef}
            type="file"
            name="file"
            accept=".docx,.pdf,.txt,.md"
            onChange={handleFileChange}
            aria-required="true"
            aria-describedby="file-hint file-error"
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
          />
          <p id="file-hint" className="mt-1 text-xs text-gray-500">
            Accepted formats: .docx, .pdf, .txt, .md
          </p>
          {selectedFile && (
            <p className="mt-1 text-xs text-gray-700" aria-live="polite">
              Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
            </p>
          )}
          {validationError && (
            <p
              id="file-error"
              role="alert"
              className="mt-1 text-xs text-red-600"
            >
              {validationError}
            </p>
          )}
        </div>

        {/* Status feedback */}
        {uploadError && (
          <div role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            Upload failed: {uploadError}
          </div>
        )}
        {uploadSuccess && (
          <div role="status" aria-live="polite" className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
            Document uploaded successfully and queued for processing.
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isUploading}
          aria-disabled={isUploading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? (
            <>
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
              Uploading…
            </>
          ) : (
            'Upload Document'
          )}
        </button>
      </form>
    </section>
  );
}
