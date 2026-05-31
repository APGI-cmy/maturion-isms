"""
routers/kuc_routes.py — KUC-compatible upload routes exposed by MAT AI Gateway.

These endpoints satisfy the MMM KUC boundary contract expected by:
  supabase/functions/_shared/mmm-kuc-client.ts
"""

from __future__ import annotations

import io
import json
import uuid
from typing import Any

from docx import Document as DocxDocument
from fastapi import APIRouter, File, Form, UploadFile
from PyPDF2 import PdfReader
import pdfplumber

router = APIRouter(prefix="/api/upload", tags=["KUC Upload"])


def _safe_json(raw: str | None) -> dict[str, Any]:
    if not raw:
        return {}
    try:
        value = json.loads(raw)
        if isinstance(value, dict):
            return value
    except Exception:
        pass
    return {}


def _extract_text_from_pdf(content: bytes) -> str:
    # Pass 1: PyPDF2
    pages: list[str] = []
    try:
        reader = PdfReader(io.BytesIO(content))
        for page in reader.pages:
            text = page.extract_text()
            if text and text.strip():
                pages.append(text.strip())
    except Exception:
        pages = []

    primary = "\n\n".join(pages).strip()
    if primary:
        return primary

    # Pass 2: pdfplumber fallback (better for some PDFs where PyPDF2 yields empty text)
    fallback_pages: list[str] = []
    try:
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text and text.strip():
                    fallback_pages.append(text.strip())
    except Exception:
        fallback_pages = []

    return "\n\n".join(fallback_pages).strip()


def _extract_text_from_docx(content: bytes) -> str:
    doc = DocxDocument(io.BytesIO(content))
    return "\n\n".join(
        p.text.strip() for p in doc.paragraphs if p.text and p.text.strip()
    )


def _extract_text(content: bytes, filename: str, content_type: str | None) -> str:
    name = (filename or "").lower()
    mime = (content_type or "").lower()
    if "pdf" in mime or name.endswith(".pdf"):
        try:
            return _extract_text_from_pdf(content)
        except Exception:
            return ""
    if "wordprocessingml" in mime or name.endswith(".docx"):
        try:
            return _extract_text_from_docx(content)
        except Exception:
            return ""
    try:
        return content.decode("utf-8", errors="ignore")
    except Exception:
        return ""


@router.post("/framework-source")
async def upload_framework_source(
    file: UploadFile = File(...),
    document_role: str = Form(...),
    organisation_id: str = Form(...),
    user_id: str = Form(...),
    metadata: str | None = Form(None),
) -> dict[str, Any]:
    payload = await file.read()
    extraction_error: str | None = None
    try:
        extracted_text = _extract_text(payload, file.filename or "", file.content_type)
    except Exception as exc:
        extracted_text = ""
        extraction_error = str(exc)
    parse_job_id = str(uuid.uuid4())
    upload_id = str(uuid.uuid4())

    return {
        "upload_id": upload_id,
        "document_role": document_role,
        "classification": {
            "type": "framework_document",
            "confidence": 0.91 if extracted_text else 0.45,
            "categories": [document_role, "framework_source"],
        },
        "parse_job_id": parse_job_id,
        # Extra fields used by MMM best-effort extraction path:
        "extracted_text": extracted_text,
        "text": extracted_text,
        "raw_text": extracted_text,
        "metadata": {
            **_safe_json(metadata),
            "organisation_id": organisation_id,
            "user_id": user_id,
            "filename": file.filename,
            "mime_type": file.content_type,
            "size_bytes": len(payload),
            "chars": len(extracted_text),
            "extraction_error": extraction_error,
        },
    }


@router.post("/evidence")
async def upload_evidence(
    file: UploadFile = File(...),
    document_role: str = Form(...),
    organisation_id: str = Form(...),
    user_id: str = Form(...),
    metadata: str | None = Form(None),
) -> dict[str, Any]:
    payload = await file.read()
    extraction_error: str | None = None
    try:
        extracted_text = _extract_text(payload, file.filename or "", file.content_type)
    except Exception as exc:
        extracted_text = ""
        extraction_error = str(exc)
    upload_id = str(uuid.uuid4())

    return {
        "upload_id": upload_id,
        "document_role": document_role,
        "classification": {
            "type": "evidence_document",
            "confidence": 0.88 if extracted_text else 0.4,
            "categories": [document_role, "evidence"],
        },
        "parse_job_id": None,
        # Keep parity with framework route for client robustness
        "extracted_text": extracted_text,
        "text": extracted_text,
        "raw_text": extracted_text,
        "metadata": {
            **_safe_json(metadata),
            "organisation_id": organisation_id,
            "user_id": user_id,
            "filename": file.filename,
            "mime_type": file.content_type,
            "size_bytes": len(payload),
            "chars": len(extracted_text),
            "extraction_error": extraction_error,
        },
    }
