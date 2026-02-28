"""
routers/ai_routes.py — AI Gateway route definitions.

Architecture reference: modules/mat/02-architecture/system-architecture.md §3.3
  Five AI service endpoints exposed by the MAT AI Gateway.
"""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

from services.image_analysis import ImageAnalyser
from services.parsing import DocumentParser
from services.reporting import ReportGenerator
from services.scoring import MaturityScorer
from services.transcription import AudioTranscriber

router = APIRouter(prefix="/api/v1", tags=["AI Services"])

# ---------------------------------------------------------------------------
# Module-level service singletons — instantiated once, shared across requests
# ---------------------------------------------------------------------------
_parser = DocumentParser()
_scorer = MaturityScorer()
_transcriber = AudioTranscriber()
_generator = ReportGenerator()
_analyser = ImageAnalyser()


# ---------------------------------------------------------------------------
# Request models
# ---------------------------------------------------------------------------

class ParseRequest(BaseModel):
    document_url: str
    tenant_id: str


class ScoreRequest(BaseModel):
    tenant_id: str
    evidence: Any = None
    criteria_id: str | None = None
    criteria: list | None = None


class TranscribeRequest(BaseModel):
    audio_url: str
    tenant_id: str


class ReportRequest(BaseModel):
    tenant_id: str
    audit_id: str | None = None
    audit_data: dict | None = None
    format: str = "json"


class AnalyseImageRequest(BaseModel):
    image_url: str
    tenant_id: str


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.post("/parse")
def parse_document(request: ParseRequest) -> dict:
    """
    Document Parsing — converts PDF/DOCX criteria into structured JSON.

    Architecture: system-architecture.md §3.4
    """
    return _parser.parse(
        document_url=request.document_url,
        tenant_id=request.tenant_id,
    )


@router.post("/score")
def score_maturity(request: ScoreRequest) -> dict:
    """
    Maturity Scoring — derives maturity level from evidence and criteria.

    Architecture: system-architecture.md §3.4
    """
    evidence = request.evidence if isinstance(request.evidence, list) else [request.evidence]
    criteria = request.criteria or (
        [request.criteria_id] if request.criteria_id else []
    )
    return _scorer.score(
        evidence=evidence,
        criteria=criteria,
        tenant_id=request.tenant_id,
    )


@router.post("/transcribe")
def transcribe_audio(request: TranscribeRequest) -> dict:
    """
    Audio Transcription — converts audio recording to timestamped transcript.

    Architecture: system-architecture.md §3.4
    """
    return _transcriber.transcribe(
        audio_url=request.audio_url,
        tenant_id=request.tenant_id,
    )


@router.post("/report")
def generate_report(request: ReportRequest) -> dict:
    """
    Report Generation — produces DOCX/PDF/JSON audit report.

    Architecture: system-architecture.md §3.4
    """
    audit_data = request.audit_data or {"audit_id": request.audit_id}
    return _generator.generate(
        audit_data=audit_data,
        format=request.format,
        tenant_id=request.tenant_id,
    )


@router.post("/analyse-image")
def analyse_image(request: AnalyseImageRequest) -> dict:
    """
    Image Analysis — extracts compliance description from photo evidence.

    Architecture: system-architecture.md §3.4
    """
    return _analyser.analyse(
        image_url=request.image_url,
        tenant_id=request.tenant_id,
    )
