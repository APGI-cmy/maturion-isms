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
    reader = PdfReader(io.BytesIO(content))
    pages: list[str] = []
    for page in reader.pages:
        text = page.extract_text()
        if text and text.strip():
            pages.append(text.strip())
    return "\n\n".join(pages)


def _extract_text_from_docx(content: bytes) -> str:
    doc = DocxDocument(io.BytesIO(content))
    return "\n\n".join(
        p.text.strip() for p in doc.paragraphs if p.text and p.text.strip()
    )


def _extract_text(content: bytes, filename: str, content_type: str | None) -> str:
    name = (filename or "").lower()
    mime = (content_type or "").lower()
    if "pdf" in mime or name.endswith(".pdf"):
        return _extract_text_from_pdf(content)
    if "wordprocessingml" in mime or name.endswith(".docx"):
        return _extract_text_from_docx(content)
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
    extracted_text = _extract_text(payload, file.filename or "", file.content_type)
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
    extracted_text = _extract_text(payload, file.filename or "", file.content_type)
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
        },
    }
