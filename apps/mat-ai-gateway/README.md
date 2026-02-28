# MAT AI Gateway

Python FastAPI microservice providing AI-powered compliance operations for the Maturion ISMS platform.

## Purpose

The MAT AI Gateway exposes five AI service endpoints that power the MAT (Maturity Assessment Tool) application. It delegates to OpenAI (GPT-4 Turbo, Whisper, GPT-4 Vision) and persists results via Supabase.

## Environment Variables

The following environment variables **must** be set before starting the gateway:

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API authentication key |
| `SUPABASE_URL` | Supabase project URL (e.g. `https://xxxx.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role JWT — bypasses RLS for server-side operations |

Optional:

| Variable | Default | Description |
|---|---|---|
| `CORS_ORIGINS` | `*` | Comma-separated allowed origins (restrict in production) |

## Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Set required environment variables
export OPENAI_API_KEY=sk-...
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Start with hot-reload
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

## Docker

```bash
# Build
docker build -t mat-ai-gateway .

# Run
docker run -p 8000:8000 \
  -e OPENAI_API_KEY=sk-... \
  -e SUPABASE_URL=https://your-project.supabase.co \
  -e SUPABASE_SERVICE_ROLE_KEY=eyJ... \
  mat-ai-gateway
```

## Health Check

```
GET /health
→ {"status": "ok"}
```

No authentication required. Used by ECS / Cloud Run readiness probes.

## API Routes

All routes are POST and require a JSON body:

| Endpoint | Description |
|---|---|
| `POST /api/v1/parse` | Document Parsing — converts PDF/DOCX criteria into structured JSON |
| `POST /api/v1/score` | Maturity Scoring — derives maturity level from evidence and criteria |
| `POST /api/v1/transcribe` | Audio Transcription — converts audio recording to timestamped transcript |
| `POST /api/v1/report` | Report Generation — produces DOCX/PDF/JSON audit report |
| `POST /api/v1/analyse-image` | Image Analysis — extracts compliance description from photo evidence |

Interactive API docs: `http://localhost:8000/docs`

## Running Tests

```bash
pip install -r requirements.txt pytest httpx
python -m pytest tests/ -v
```

## Architecture References

- `modules/mat/02-architecture/system-architecture.md` §3.3 (AI Gateway), §3.4 (AI Services)
- `modules/mat/02-architecture/deployment-architecture.md` §3.3 (Health Check, Container)
