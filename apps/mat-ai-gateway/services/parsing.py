"""
services/parsing.py — Document Parsing service stub.

Architecture reference: modules/mat/02-architecture/system-architecture.md §3.4
  "Document Parsing: GPT-4 Turbo, PDF/DOCX → structured criteria JSON"
"""

from __future__ import annotations


class DocumentParser:
    """
    Parses compliance documents (PDF, DOCX) into structured criteria JSON.

    Uses GPT-4 Turbo to extract and normalise audit criteria from uploaded
    documents.  Full implementation is wired in a later wave; this stub
    satisfies the architectural interface contract.
    """

    def parse(self, document_url: str, tenant_id: str) -> dict:
        """
        Parse a document from *document_url* and return structured criteria JSON.

        Parameters
        ----------
        document_url:
            Publicly accessible URL of the document to parse (PDF or DOCX).
        tenant_id:
            Tenant scoping key used for audit trail and multi-tenancy isolation.

        Returns
        -------
        dict
            Structured result containing extracted criteria or task queue entry.
        """
        return {
            "status": "queued",
            "task_id": "stub",
            "document_url": document_url,
            "tenant_id": tenant_id,
        }
