/**
 * KnowledgeUploadPage — Pipeline 2 (Knowledge Ingestion) page
 *
 * Wave    : DCKIS-IMPL-002
 * Route   : /knowledge
 *
 * Renders all three Pipeline 2 Knowledge Ingestion components:
 * - KnowledgeUploadPanel (upload form with domain selector)
 * - DocumentChunkTester (local chunk preview)
 * - KnowledgeDocumentsList (uploaded documents with approval_status badges)
 *
 * HARD CONSTRAINT (ADR-005): This page is NOT related to CriteriaManagementPage.
 * The /knowledge route is DISTINCT from the /criteria route.
 */

import React from 'react';
import { KnowledgeUploadPanel } from '../components/knowledge/KnowledgeUploadPanel';
import { DocumentChunkTester } from '../components/knowledge/DocumentChunkTester';
import { KnowledgeDocumentsList } from '../components/knowledge/KnowledgeDocumentsList';

export function KnowledgeUploadPage(): React.ReactElement {
  return (
    <main
      id="main-content"
      aria-labelledby="knowledge-page-heading"
      className="p-6 max-w-4xl mx-auto"
    >
      <header className="mb-6">
        <h1
          id="knowledge-page-heading"
          className="text-2xl font-bold text-gray-900"
        >
          🧠 Knowledge Ingestion
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Pipeline 2 — Upload and manage knowledge documents for AI-assisted
          maturity assessment. Documents are chunked, embedded, and stored for
          retrieval-augmented generation (RAG).
        </p>
      </header>

      <div className="space-y-6">
        {/* Upload panel with file picker and domain selector */}
        <KnowledgeUploadPanel />

        {/* Chunk tester for previewing chunk boundaries before upload */}
        <DocumentChunkTester />

        {/* List of uploaded knowledge documents with approval_status badges */}
        <KnowledgeDocumentsList />
      </div>
    </main>
  );
}
