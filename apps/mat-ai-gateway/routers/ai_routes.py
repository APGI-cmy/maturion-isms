"""
routers/ai_routes.py — AI Gateway route definitions.

Architecture reference: modules/mat/02-architecture/system-architecture.md §3.3
  Five AI service endpoints exposed by the MAT AI Gateway.
"""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1", tags=["AI Services"])


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
    from services.parsing import DocumentParser
    parser = DocumentParser()
    return parser.parse(
        document_url=request.document_url,
        tenant_id=request.tenant_id,
    )


@router.post("/score")
def score_maturity(request: ScoreRequest) -> dict:
    """
    Maturity Scoring — derives maturity level from evidence and criteria.

    Architecture: system-architecture.md §3.4
    """
    from services.scoring import MaturityScorer
    scorer = MaturityScorer()
    evidence = request.evidence if isinstance(request.evidence, list) else [request.evidence]
    criteria = request.criteria or (
        [request.criteria_id] if request.criteria_id else []
    )
    return scorer.score(
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
    from services.transcription import AudioTranscriber
    transcriber = AudioTranscriber()
    return transcriber.transcribe(
        audio_url=request.audio_url,
        tenant_id=request.tenant_id,
    )


@router.post("/report")
def generate_report(request: ReportRequest) -> dict:
    """
    Report Generation — produces DOCX/PDF/JSON audit report.

    Architecture: system-architecture.md §3.4
    """
    from services.reporting import ReportGenerator
    generator = ReportGenerator()
    audit_data = request.audit_data or {"audit_id": request.audit_id}
    return generator.generate(
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
    from services.image_analysis import ImageAnalyser
    analyser = ImageAnalyser()
    return analyser.analyse(
        image_url=request.image_url,
        tenant_id=request.tenant_id,
    )
