# MANUAL AUDIT TOOL (MAT) – AI ARCHITECTURE v1.0.0

| Field            | Value                                      |
|------------------|--------------------------------------------|
| Module           | MAT – Manual Audit Tool                    |
| Version          | v1.0.0                                     |
| Status           | Approved                                   |
| Classification   | Internal – Architecture                    |
| Owner            | Maturion Platform Team                     |
| Last Updated     | 2025-01-01                                 |
| TRS Requirements | TR-037, TR-038, TR-039, TR-040, TR-041     |

---

## 1. AI Architecture Overview

- **Central AI Gateway (FastAPI)** mediates all AI operations
- **Stateless microservice design**; all state in Supabase
- Each AI capability is a separate module within the gateway
- All operations are asynchronous with progress tracking

---

## 2. AI Document Parsing Pipeline (TR-037)

### Pipeline Steps

1. **Document Ingestion**: Apache Tika extracts text from uploaded document (.doc, .docx, .pdf, .xls, .xlsx, .ppt, .pptx)
2. **Text Chunking**: Split extracted text into chunks (max 8K tokens per chunk)
3. **AI Parsing**: Send chunks to GPT-4 Turbo with structured parsing prompt
   - Prompt includes: criteria structure schema, no-hallucination rules, coverage requirements
   - System prompt defines Domain → MPS → Criteria hierarchy
4. **Output Validation**: Pydantic model validates AI output against CriteriaStructureSchema
5. **Confidence Check**: Items with confidence < 0.85 flagged as `needs_human_review`
6. **Source Anchors**: Every extracted criterion links to source document location (page, paragraph)
7. **Coverage Report**: All source blocks mapped or explicitly marked as non-criteria context
8. **Hallucination Check**: Every criterion must have a `source_anchor`; missing = flagged

### Parsing Output Schema

```python
class Criterion(BaseModel):
    number: str  # e.g., "1.1.1"
    title: str
    description: str
    source_anchor: str  # page/paragraph reference
    confidence: float  # 0.0–1.0

class MiniPerformanceStandard(BaseModel):
    number: str  # e.g., "1.1"
    title: str
    criteria: list[Criterion]

class Domain(BaseModel):
    number: int
    title: str
    mini_performance_standards: list[MiniPerformanceStandard]

class ParsedStructure(BaseModel):
    domains: list[Domain]
    coverage_report: CoverageReport
    unmapped_content: list[str]
```

### Error Handling

- **Document too large (>50 pages)**: Split into batches, process sequentially, merge results
- **Unsupported format**: Return error with supported format list
- **AI parsing failure**: Retry with different chunking strategy; if 3 failures → escalate to user

---

## 3. AI Maturity Scoring Pipeline (TR-038)

### Pipeline Steps

1. **Evidence Aggregation**: Collect all evidence items for the criterion
2. **Evidence-First Check**: If < 2 evidence items → refuse to score, return `refuse_to_score: true` with `missing_evidence_needed` list
3. **Evidence Preparation**: Compile evidence (text, transcripts, image descriptions) into scoring context
4. **Scoring Request**: Send to GPT-4 Turbo with maturity model definitions and scoring rubric
   - Include: criterion description, all evidence, maturity level definitions (Basic through Resilient), evidence weighting rules
5. **Output Validation**: Pydantic model validates against ScoringResultSchema
6. **Confidence Check**: Confidence < 0.70 → flag for human review
7. **Evidence Weighting**: Documentary evidence weighted higher than testimonial per FR-022
8. **Gap Analysis**: AI identifies immediate, medium-term, and long-term improvement actions

### Scoring Output Schema

```python
class GapAnalysis(BaseModel):
    immediate: str  # Next maturity level actions
    medium_term: str  # +2 level actions
    long_term: str  # Resilient level actions

class ScoringResult(BaseModel):
    maturity_level: Literal["basic", "reactive", "compliant", "proactive", "resilient"]
    confidence: float  # 0.0–1.0
    rationale: str  # Evidence-citing rationale
    gap_analysis: GapAnalysis
    evidence_ids_used: list[str]
    refuse_to_score: bool = False
    missing_evidence_needed: list[str] | None = None

class MaturityLevel(BaseModel):
    level: int  # 1–5
    name: str
    description: str
    indicators: list[str]
```

### Performance

- < 30 seconds per criterion

---

## 4. AI Transcription Pipeline (TR-039)

### Pipeline Steps

1. **Audio Input**: Accept .mp3, .wav, .m4a files
2. **Video Input**: Accept .mp4, .mov, .avi → extract audio via FFmpeg
3. **Transcription**: OpenAI Whisper API
   - Timestamped segments with speaker identification
   - Auto language detection with manual override option
4. **Video Snapshot Extraction**: FFmpeg extracts keyframes at 10-second intervals + scene detection
   - Thumbnails: 320×240px
   - Metadata: duration, resolution, codec, frame rate
5. **Output**: Timestamped transcript segments + snapshot images

### Transcription Output Schema

```python
class TranscriptSegment(BaseModel):
    start_time: float  # seconds
    end_time: float  # seconds
    speaker: str | None
    text: str
    confidence: float

class TranscriptionResult(BaseModel):
    segments: list[TranscriptSegment]
    full_text: str
    language_detected: str
    duration_seconds: float

class VideoProcessingResult(BaseModel):
    transcription: TranscriptionResult
    snapshots: list[SnapshotInfo]
    metadata: VideoMetadata
```

### Processing Limits

- Audio: < 2× real-time duration
- Video: < 3× video duration
- Max 2 concurrent video processing jobs per container instance
- Job queue via Celery (Python) for background processing
- Progress tracked via WebSocket or polling

---

## 5. AI Model Routing Configuration (TR-040)

### Routing Table

Stored in database or config file, **NOT hardcoded**:

```json
[
  {
    "task_type": "document_parsing",
    "primary_model": "gpt-4-turbo",
    "fallback_model": "gpt-4o-mini",
    "max_tokens": 4096,
    "temperature": 0.1
  },
  {
    "task_type": "transcription",
    "primary_model": "whisper-1",
    "fallback_model": null,
    "max_tokens": null,
    "temperature": null
  },
  {
    "task_type": "scoring",
    "primary_model": "gpt-4-turbo",
    "fallback_model": "gpt-4o-mini",
    "max_tokens": 2048,
    "temperature": 0.2
  },
  {
    "task_type": "image_analysis",
    "primary_model": "gpt-4-vision-preview",
    "fallback_model": "gpt-4-turbo",
    "max_tokens": 2048,
    "temperature": 0.1
  },
  {
    "task_type": "report_generation",
    "primary_model": "gpt-4-turbo",
    "fallback_model": "gpt-4o-mini",
    "max_tokens": 8192,
    "temperature": 0.3
  },
  {
    "task_type": "routine",
    "primary_model": "gpt-4o-mini",
    "fallback_model": null,
    "max_tokens": 1024,
    "temperature": 0.1
  }
]
```

### Invocation Logging (per FR-029)

Every AI invocation logged with:

- `model`, `model_version`, `prompt_tokens`, `completion_tokens`, `latency_ms`, `cost_estimate`, `timestamp`, `task_type`, `audit_id`, `criterion_id`, `status`, `error_message`

### Model Versioning (per FR-032)

- Model version recorded per invocation
- Model upgrades require regression testing
- Fine-tuning only with governance approval + audit trail

---

## 6. AI Rate Limiting and Circuit Breaker (TR-041)

### Rate Limiting

- Configurable per model and task type
- Default: follow OpenAI API rate limits

### Retry Strategy

- Exponential backoff with jitter
- Base: 1 second, max: 60 seconds, max retries: 5
- Jitter: ±2 seconds

### Circuit Breaker

```
States: CLOSED → OPEN → HALF_OPEN → CLOSED

CLOSED (normal operation):
  - All requests pass through
  - Track error rate in sliding 5-minute window

CLOSED → OPEN:
  - Trigger: Error rate > 10% over 5-minute window
  - Action: Switch to fallback model immediately

OPEN (fallback mode):
  - Primary model requests blocked
  - All requests routed to fallback model
  - Duration: 30 seconds

OPEN → HALF_OPEN:
  - After 30 seconds, allow 1 test request to primary model

HALF_OPEN → CLOSED:
  - 3 consecutive successes → reset to CLOSED

HALF_OPEN → OPEN:
  - Any failure → back to OPEN for another 30 seconds

FALLBACK FAILURE:
  - If fallback model also fails → offer manual mode to user
  - User can assign maturity level manually without AI
  - Manual mode logged in audit trail
```

### Metrics Tracked

- Error rate per model
- Circuit breaker state transitions
- Fallback usage count
- Manual mode usage count
- All logged to `watchdog_metrics` table

---

## 7. AI Security Considerations

- API keys stored in environment variables only (never in code or client)
- All AI requests go through AI Gateway (no direct client-to-OpenAI calls)
- Request/response content never logged (only metadata for privacy)
- PII masking in prompts where applicable
- AI output validated before storage (prevent injection via AI responses)
