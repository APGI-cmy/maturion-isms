# MANUAL AUDIT TOOL (MAT) – SYSTEM ARCHITECTURE v1.0.0

| Field            | Value                                      |
|------------------|--------------------------------------------|
| Module           | MAT – Manual Audit Tool                    |
| Version          | v1.0.0                                     |
| Status           | Approved                                   |
| Classification   | Internal – Architecture                    |
| Owner            | Maturion Platform Team                     |
| Last Updated     | 2025-01-01                                 |

---

## 1. Purpose

This document defines the complete system architecture for the Manual Audit Tool (MAT) module. It specifies the technology stack, component boundaries, inter-component wiring, end-to-end functional paths, and architectural invariants that govern all MAT implementation work.

MAT is the Maturion module that enables organisations to conduct structured ISO/IEC-standard audits with AI-assisted evidence collection, maturity scoring, and report generation — all available offline-first.

---

## 2. Technology Stack

### 2.1 Frontend

| Concern              | Technology                          | Version    |
|----------------------|-------------------------------------|------------|
| UI Framework         | React (functional components only)  | 18+        |
| Language             | TypeScript (strict mode)            | 5.0+       |
| Build Tool           | Vite                                | 5+         |
| Component Library    | Shadcn/UI + Tailwind CSS            | 3+ (TW)    |
| State Management     | Zustand (client), TanStack Query (server) | latest |
| PWA                  | Service Worker, Web App Manifest    | —          |

- Class components are **prohibited**. All UI is built with functional components and hooks.
- Shadcn/UI components are copied into the project (not imported as a library) for full ownership.

### 2.2 Backend

| Concern              | Technology                          | Version    |
|----------------------|-------------------------------------|------------|
| Database             | Supabase PostgreSQL                 | 15+        |
| Authentication       | Supabase Auth (JWT + MFA)           | —          |
| Object Storage       | Supabase Storage (signed URLs)      | —          |
| Realtime             | Supabase Realtime (WebSocket)       | —          |
| Serverless Logic     | Supabase Edge Functions (Deno)      | —          |
| API Layer            | PostgREST with Row Level Security   | —          |

- Every table is protected by RLS policies. No table is accessible without a valid JWT and matching policy.
- Edge Functions serve as the serverless business logic layer and as a proxy for AI Gateway calls.

### 2.3 AI Microservices

| Concern              | Technology                          | Version    |
|----------------------|-------------------------------------|------------|
| Runtime              | Python                              | 3.11+      |
| Framework            | FastAPI                             | latest     |
| AI Provider          | OpenAI API                          | —          |
| Models               | GPT-4 Turbo, GPT-4 Vision, Whisper, GPT-4o Mini | — |
| Validation           | Pydantic v2                         | 2.x        |
| Containerisation     | Docker (multi-stage builds)         | 24+        |

- Each AI capability runs as a separate service behind the AI Gateway.
- Multi-stage Docker builds produce minimal production images.

### 2.4 Package Management & Monorepo

| Concern              | Technology                          | Version    |
|----------------------|-------------------------------------|------------|
| Package Manager      | pnpm (workspaces)                   | 8+         |
| Monorepo Structure   | `apps/` + `packages/`               | —          |
| Build Orchestration  | Turborepo                           | latest     |

### 2.5 Runtime Requirements

| Target               | Minimum Version                     |
|----------------------|-------------------------------------|
| Browser              | Chrome, Firefox, Safari, Edge 90+   |
| Mobile (iOS)         | iOS 14+                             |
| Mobile (Android)     | Android 10+                         |
| Node.js              | 20 LTS                              |
| Python               | 3.11+                               |
| PostgreSQL           | 15+                                 |
| Docker               | 24+                                 |

---

## 3. Component Architecture

MAT is composed of six primary system components. Each component has a defined boundary, responsibility set, and explicit wiring to other components.

### 3.1 MAT Frontend (React SPA)

**Responsibility:** User interface for all audit operations.

| Sub-Component        | Role                                                  |
|----------------------|-------------------------------------------------------|
| UI Components        | Shadcn/UI-based pages, forms, tables, charts          |
| State Management     | Zustand stores (client state), TanStack Query (server state) |
| Offline Capability   | Service Worker interception, IndexedDB caching        |
| PWA Shell            | Web App Manifest, install prompt, app-like experience |

### 3.2 Supabase Backend

**Responsibility:** Authentication, data persistence, real-time subscriptions, file storage, serverless logic.

| Sub-Component        | Role                                                  |
|----------------------|-------------------------------------------------------|
| Auth                 | JWT issuance, MFA enforcement, session management     |
| PostgREST            | RESTful CRUD over PostgreSQL with RLS                 |
| Realtime             | WebSocket subscriptions for live dashboard updates    |
| Storage              | Evidence file storage with signed-URL access          |
| Edge Functions       | Serverless business logic (Deno runtime)              |
| RLS Policies         | Row-level access control on every table               |

### 3.3 AI Gateway (FastAPI)

**Responsibility:** Central mediator for all AI operations.

| Sub-Component        | Role                                                  |
|----------------------|-------------------------------------------------------|
| Request Router       | Routes AI requests to the correct service             |
| Circuit Breaker      | Protects against cascading failures from OpenAI       |
| Rate Limiter         | Enforces per-tenant and per-model rate limits         |
| Retry Manager        | Exponential backoff with jitter for transient errors  |
| Response Normaliser  | Standardises AI responses for downstream consumers    |

### 3.4 AI Services

**Responsibility:** Individual AI capabilities, each independently deployable.

| Service              | Model               | Input               | Output                    |
|----------------------|----------------------|----------------------|---------------------------|
| Document Parsing     | GPT-4 Turbo         | PDF/DOCX criteria    | Structured criteria JSON  |
| Maturity Scoring     | GPT-4 Turbo         | Evidence + criteria  | Maturity level + rationale|
| Transcription        | Whisper              | Audio recording      | Timestamped transcript    |
| Report Generation    | GPT-4 Turbo         | Audit data aggregate | DOCX/PDF/JSON report      |
| Image Analysis       | GPT-4 Vision        | Photo evidence       | Description + compliance  |
| Fallback Scoring     | GPT-4o Mini         | Evidence + criteria  | Maturity level (degraded) |

### 3.5 Offline Engine

**Responsibility:** Enable full audit functionality without network connectivity.

| Sub-Component        | Role                                                  |
|----------------------|-------------------------------------------------------|
| Service Worker       | Intercepts fetch requests, serves cached assets       |
| IndexedDB            | Structured offline data storage (audits, evidence metadata) |
| Cache API / OPFS     | Binary file storage for evidence captured offline     |
| Sync Queue           | Ordered queue of pending mutations for replay on reconnect |

### 3.6 External Integrations

**Responsibility:** Inter-module data exchange and external API consumption.

| Integration          | Direction    | Protocol                          |
|----------------------|-------------|-----------------------------------|
| PIT Module           | MAT → PIT   | Edge Function REST export endpoint|
| Maturity Roadmap     | MAT → Roadmap | Edge Function REST export endpoint|
| OpenAI API           | AI Gateway → OpenAI | HTTPS REST (API key auth)  |

---

## 3.10 Architecture Principles

The following principles are **non-negotiable** and govern every design and implementation decision.

### Offline-First
All core audit functions — evidence capture, criteria review, manual scoring — are available offline. The Offline Engine (§3.5) ensures data integrity and eventual consistency via the Sync Queue.

### AI-Assisted, Human-Governed
AI provides suggestions (maturity scores, parsed criteria, transcriptions). Humans confirm, override, or reject every AI output before it becomes part of the audit record. No AI output is committed without explicit human approval.

### Security by Default
Row Level Security (RLS) is enforced on every table. Supabase Auth issues JWTs with role claims. MFA is required for Lead Auditor role. Audit trail logging is built into every write path — not bolted on.

### Immutable Evidence
Evidence files and audit log entries are **append-only**. Once an evidence file is stored, it cannot be modified or deleted through the application. SHA-256 hashes are computed at upload time and verified on retrieval.

### Modular AI
Each AI capability (§3.4) is a separate service behind the AI Gateway. Services can be replaced, upgraded, or disabled independently. The circuit breaker (§3.3) isolates failures to individual services.

---

## 3.11 System Wiring Diagram

This section defines **every** connection between MAT components. No connection may exist in implementation that is not documented here. No component may exist without at least one defined connection.

### 3.11.1 Complete Wiring Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              MAT SYSTEM WIRING                                  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────┐                        │
│  │              MAT FRONTEND (React SPA)               │                        │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │                        │
│  │  │    UI    │ │  Zustand │ │ TanStack │ │  PWA   │ │                        │
│  │  │Components│ │  Stores  │ │  Query   │ │ Shell  │ │                        │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘ │                        │
│  │       │             │            │            │       │                        │
│  │       └─────────────┴──────┬─────┴────────────┘       │                        │
│  └────────────────────────────┼──────────────────────────┘                        │
│         │    │    │    │      │      │                                            │
│         │    │    │    │      │      │                                            │
│    ┌────┘    │    │    │      │      └──────────┐                                │
│    │  [A]    │[B] │[C] │ [D]  │[E]              │[F]                             │
│    ▼         ▼    ▼    ▼      ▼                 ▼                                │
│  ┌──────┐ ┌─────────┐ ┌──────────┐ ┌─────────────────┐  ┌───────────────────┐  │
│  │Supa  │ │Supa     │ │Supa      │ │Supa             │  │  OFFLINE ENGINE   │  │
│  │Auth  │ │PostgREST│ │Realtime  │ │Storage          │  │ ┌───────────────┐ │  │
│  │      │ │  + RLS  │ │(WebSocket│ │(Signed URLs)    │  │ │Service Worker │ │  │
│  └──────┘ └─────────┘ │Subscript)│ └────────┬────────┘  │ └───────┬───────┘ │  │
│                        └──────────┘          │           │         │         │  │
│                                              │           │    ┌────┴────┐    │  │
│    ┌─────────────────────────────────────────┐           │    │IndexedDB│    │  │
│    │         SUPABASE EDGE FUNCTIONS         │           │    │Cache API│    │  │
│    │         (Deno Serverless Logic)         │◄──────────┘    │  OPFS   │    │  │
│    └──────────┬──────────┬───────────────────┘           │    └────┬────┘    │  │
│               │          │                               │         │         │  │
│          [G]  │          │  [H],[I]                      │    ┌────┴────┐    │  │
│               ▼          ▼                               │    │  Sync   │    │  │
│    ┌────────────────────────────────┐                    │    │  Queue  │    │  │
│    │      AI GATEWAY (FastAPI)     │                    │    └────┬────┘    │  │
│    │  ┌──────────┐ ┌─────────────┐ │                    │         │ [L]     │  │
│    │  │ Circuit  │ │   Request   │ │                    │         ▼         │  │
│    │  │ Breaker  │ │   Router    │ │                    │   Supabase Sync   │  │
│    │  └──────────┘ └──────┬──────┘ │                    │   (on reconnect)  │  │
│    └──────────────────────┼────────┘                    └───────────────────┘  │
│               │           │                                                     │
│          [J]  │      [K]  │                                                     │
│               ▼           ▼                                                     │
│    ┌──────────────┐  ┌─────────────────────────────────────┐                    │
│    │  Supabase    │  │          AI SERVICES                │                    │
│    │  (store      │  │  ┌──────────┐  ┌───────────────┐   │                    │
│    │  results,    │  │  │ Doc Parse│  │Maturity Score │   │                    │
│    │  read        │  │  │ GPT-4T   │  │  GPT-4T       │   │                    │
│    │  evidence)   │  │  └──────────┘  └───────────────┘   │                    │
│    └──────────────┘  │  ┌──────────┐  ┌───────────────┐   │                    │
│                      │  │Transcript│  │Report Gen     │   │                    │
│                      │  │ Whisper  │  │  GPT-4T       │   │                    │
│  ┌────────────────┐  │  └──────────┘  └───────────────┘   │                    │
│  │ EXTERNAL       │  │  ┌──────────┐  ┌───────────────┐   │                    │
│  │ INTEGRATIONS   │  │  │Image Anlz│  │Fallback Score │   │                    │
│  │ ┌──────────┐   │  │  │GPT-4 Vis │  │  GPT-4o Mini  │   │                    │
│  │ │PIT Module│   │  │  └──────────┘  └───────────────┘   │                    │
│  │ └─────┬────┘   │  └──────────────────┬──────────────────┘                    │
│  │       │ [M]    │                     │                                       │
│  │ ┌─────┴──────┐ │                [K]  │                                       │
│  │ │ Maturity   │ │                     ▼                                       │
│  │ │ Roadmap    │ │            ┌──────────────┐                                 │
│  │ └─────┬──────┘ │            │  OpenAI API  │                                 │
│  │       │ [N]    │            │  (External)  │                                 │
│  └───────┼────────┘            └──────────────┘                                 │
│          │                                                                      │
│          ▼                                                                      │
│    Supabase Edge Functions                                                      │
│    (export endpoints)                                                           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 3.11.2 Connection Registry

Every connection in the system is enumerated below. **No implicit or assumed connections are permitted.**

| ID  | Producer            | Consumer            | Protocol / Mechanism        | Data Flow   | Sync/Async | Description                                                  |
|-----|----------------------|----------------------|-----------------------------|-------------|------------|--------------------------------------------------------------|
| [A] | MAT Frontend         | Supabase Auth        | HTTPS REST (JWT, MFA)       | Bidir       | Sync       | Authentication, token refresh, MFA verification              |
| [B] | MAT Frontend         | Supabase PostgREST   | HTTPS REST + RLS            | Bidir       | Sync       | CRUD operations on audit, criteria, evidence, scoring tables |
| [C] | Supabase Realtime    | MAT Frontend         | WebSocket (subscriptions)   | Server→Client | Async    | Live dashboard updates on data changes                       |
| [D] | MAT Frontend         | Supabase Storage     | HTTPS (signed URLs)         | Bidir       | Sync       | Upload/download evidence files via pre-signed URLs           |
| [E] | MAT Frontend         | Supabase Edge Funcs  | HTTPS REST                  | Bidir       | Sync       | Serverless business logic invocation                         |
| [F] | MAT Frontend         | Service Worker       | Fetch interception          | Bidir       | Sync       | Offline request interception and cached response serving     |
| [G] | Supabase Edge Funcs  | AI Gateway           | HTTPS REST (internal)       | Request→Response | Async | Proxy AI operations from frontend through Edge Functions     |
| [H] | AI Gateway           | Supabase PostgREST   | HTTPS REST + service key    | Bidir       | Sync       | Store AI results, read evidence for processing               |
| [I] | AI Gateway           | Supabase Storage     | HTTPS (service key)         | Read        | Sync       | Retrieve evidence files for AI analysis                      |
| [J] | AI Gateway           | AI Services          | Internal HTTP               | Bidir       | Async      | Route requests to individual AI service containers           |
| [K] | AI Services          | OpenAI API           | HTTPS REST (API key auth)   | Bidir       | Async      | GPT-4 Turbo, GPT-4 Vision, Whisper, GPT-4o Mini calls       |
| [L] | Service Worker       | Supabase             | HTTPS REST (queued)         | Client→Server | Async   | Sync Queue replay on network reconnect                       |
| [M] | PIT Module           | Supabase Edge Funcs  | `GET /api/v1/audits/{audit_id}/findings/export` | Read | Sync | Export audit findings for project tracking                   |
| [N] | Maturity Roadmap     | Supabase Edge Funcs  | `GET /api/v1/audits/{audit_id}/maturity/export` | Read | Sync | Export maturity scores for roadmap planning                  |

### 3.11.3 Connection Ownership & Lifecycle

**Startup Order:**

1. PostgreSQL database (must be available first)
2. Supabase services (Auth, PostgREST, Realtime, Storage) — depend on PostgreSQL
3. Supabase Edge Functions — depend on Supabase services
4. AI Gateway (FastAPI) — depends on network access to Supabase and OpenAI
5. AI Services (Docker containers) — depend on AI Gateway for routing
6. MAT Frontend — depends on all backend services (degrades gracefully if unavailable)
7. Service Worker — registered by MAT Frontend on first load

**Shutdown / Failure Cascades:**

| Failed Component      | Impact                                                    | Mitigation                                        |
|-----------------------|-----------------------------------------------------------|---------------------------------------------------|
| PostgreSQL            | All Supabase services unavailable                         | Frontend enters offline mode via Service Worker   |
| Supabase Auth         | No new logins; existing JWTs remain valid until expiry    | Users with valid tokens continue working           |
| Supabase PostgREST    | No CRUD operations                                       | Offline Engine queues mutations for later sync     |
| Supabase Realtime     | Dashboards stop updating live                             | TanStack Query polling fallback                   |
| Supabase Storage      | No file upload/download                                   | Offline Engine caches files in OPFS               |
| AI Gateway            | No AI operations                                          | Circuit breaker opens; manual mode activated       |
| OpenAI API            | AI services return errors                                 | Retry → fallback model (GPT-4o Mini) → manual mode|
| Service Worker        | No offline capability                                     | Application works normally when online             |

### 3.11.4 Wiring Invariants

These invariants are enforced at architecture review and must hold at all times:

1. **No orphan components.** Every component has at least one defined connection in the Connection Registry (§3.11.2).
2. **No phantom interfaces.** Every interface exposed by a component has a corresponding wiring path that is implemented and tested.
3. **No implicit connections.** If two components communicate, a row in the Connection Registry documents it. Undocumented connections are a build-blocking defect.
4. **Directional clarity.** Every connection has a defined producer, consumer, and data flow direction.
5. **Failure isolation.** Every connection documents what happens when it fails (§3.11.3).

---

## 3.12 End-to-End Functional Paths

Each path below traces a user action through **every** layer: UI → API → Domain Logic → Data → External Dependencies → Response → Observability.

---

### Primary Workflows

#### Path 1 — Audit Creation

```
User clicks "Create Audit"
  → UI: AuditCreateForm validates input (Zod schema)
    → API: POST /rest/v1/audits via TanStack Query mutation
      → PostgREST: INSERT into audits table
        → RLS: Verify JWT role ∈ {lead_auditor, auditor} AND org_id matches
          → DB: Row inserted with id, status='draft', created_at, created_by
            → Realtime: broadcasts INSERT event on audits channel
              → UI: Dashboard subscription receives event → audit list re-renders
                → Observability: audit_trail INSERT (action='audit_created', actor, timestamp)
```

**Error path:** RLS denial → 403 → toast "Insufficient permissions" → no mutation.

#### Path 2 — Criteria Upload & AI Parsing

```
User uploads criteria file (PDF/DOCX)
  → UI: File input → Supabase Storage upload (multipart)
    → Storage: File stored → signed URL returned
      → UI: Calls Edge Function POST /functions/v1/parse-criteria
        → Edge Function: Validates request → forwards to AI Gateway
          → AI Gateway: Routes to Document Parsing service
            → AI Service: Sends file content to OpenAI GPT-4 Turbo
              → OpenAI: Returns structured criteria extraction
            → AI Service: Validates response (Pydantic v2) → returns parsed JSON
          → AI Gateway: Stores parsed criteria in staging table (status='pending_review')
        → Edge Function: Returns parsing job ID
      → UI: Polls for completion → displays parsed criteria in review UI
        → User: Reviews, edits, approves each criterion
          → API: POST /rest/v1/criteria (batch insert approved criteria)
            → RLS: Verify ownership → INSERT
              → Observability: audit_trail INSERT (action='criteria_parsed', source='ai', approved_by)
```

**Error path:** OpenAI timeout → retry (3x exponential backoff) → circuit breaker check → if open, return error → toast "AI parsing unavailable, upload criteria manually."

#### Path 3 — Evidence Collection

```
User captures evidence (text/voice/photo/document/video)
  → UI: Evidence capture component (type-specific input)
    → Client: Compute SHA-256 hash of file content
      → API: Upload to Supabase Storage (multipart, content-addressed path)
        → Storage: File persisted → signed URL generated
          → API: POST /rest/v1/evidence via PostgREST
            → RLS: Verify user is assigned to audit AND criterion
              → DB: INSERT evidence row (file_url, sha256_hash, type, criterion_id, captured_by, captured_at)
                → DB: UPDATE criterion SET evidence_count = evidence_count + 1
                  → Realtime: broadcasts changes → dashboard evidence counters update
                    → Observability: audit_trail INSERT (action='evidence_captured', evidence_type, criterion_id)
```

**Integrity guarantee:** SHA-256 hash is stored at upload. On retrieval, hash is recomputed and compared. Mismatch triggers an integrity alert.

#### Path 4 — AI Maturity Scoring

```
User requests AI scoring for a criterion
  → UI: "Request AI Score" button on criterion detail
    → API: POST /functions/v1/score-criterion (Edge Function)
      → Edge Function: Aggregates evidence for criterion from DB
        → Edge Function: Forwards evidence bundle to AI Gateway
          → AI Gateway: Circuit breaker check → if closed, proceed
            → AI Service (Maturity Scoring): Sends evidence + criteria to GPT-4 Turbo
              → OpenAI: Returns maturity level (1-5) + confidence score + rationale
            → AI Service: Validates response (Pydantic v2)
              → Confidence ≥ threshold? → store as 'pending_review'
              → Confidence < threshold? → store as 'low_confidence', flag for human
          → AI Gateway: Stores score in maturity_scores table
        → Edge Function: Returns score to frontend
      → UI: Displays AI-suggested score with rationale in review panel
        → User: Confirms score OR overrides with manual score + justification
          → API: PATCH /rest/v1/maturity_scores/{id} (status='confirmed' | 'overridden')
            → RLS: Verify user role = lead_auditor
              → DB: UPDATE with final score, decided_by, decided_at
                → Observability: audit_trail INSERT (action='score_finalised', method='ai_confirmed'|'manual_override')
```

**Error path:** Circuit breaker open → skip AI → UI shows "AI unavailable — enter score manually" → Path 13 (Degraded Mode).

#### Path 5 — Report Generation

```
User clicks "Generate Report"
  → UI: Report config dialog (format: DOCX/PDF/JSON, sections to include)
    → API: POST /functions/v1/generate-report (Edge Function)
      → Edge Function: Reads full audit data (criteria, evidence, scores, metadata)
        → Edge Function: Forwards assembled data to AI Gateway
          → AI Gateway: Routes to Report Generation service
            → AI Service: Constructs report via GPT-4 Turbo (executive summary, findings, recommendations)
              → OpenAI: Returns structured report content
            → AI Service: Renders to requested format (DOCX via docx library / PDF via pdf-lib / JSON)
          → AI Gateway: Uploads generated file to Supabase Storage
        → Edge Function: Returns signed download URL
      → UI: Displays download link → user downloads report
        → Observability: audit_trail INSERT (action='report_generated', format, generated_by)
```

#### Path 6 — Excel Export

```
User clicks "Export to Excel"
  → UI: Sends POST /functions/v1/export-excel with audit_id and options
    → Edge Function: Queries audit data (criteria, scores, evidence summary)
      → Edge Function: Processes data with exceljs library
        → Edge Function: Generates .xlsx with formatted worksheets (summary, criteria, scores, evidence log)
          → Edge Function: Uploads to Supabase Storage (temporary, 1-hour expiry)
            → Edge Function: Returns signed download URL
              → UI: Browser initiates download → toast "Export complete"
                → Observability: audit_trail INSERT (action='excel_exported', audit_id, exported_by)
```

---

### Secondary Workflows

#### Path 7 — User Authentication

```
User navigates to MAT login
  → UI: Login form (email + password)
    → Supabase Auth: POST /auth/v1/token (grant_type=password)
      → Auth: Validates credentials → checks MFA requirement
        → If Lead Auditor role → MFA challenge (TOTP)
          → User: Enters TOTP code → Auth verifies
        → Auth: Issues JWT with claims (sub, role, org_id, aud)
          → UI: Stores JWT in memory (not localStorage) → sets auth header
            → TanStack Query: Prefetches user profile and audit list
              → Observability: audit_trail INSERT (action='user_login', mfa_used=true|false)
```

**Session management:** JWT refresh happens automatically via Supabase client. On token expiry without refresh, user is redirected to login.

#### Path 8 — Dashboard Real-time Updates

```
Data change occurs (new evidence, score update, audit status change)
  → DB: Row INSERT/UPDATE triggers Realtime broadcast
    → Supabase Realtime: Pushes change event via WebSocket
      → MAT Frontend: Supabase client receives event on subscribed channel
        → TanStack Query: Invalidates relevant query cache
          → React: Re-renders affected components (charts, counters, status badges)
            → UI: User sees updated dashboard without manual refresh
```

**Subscription channels:**
- `audits:org_id=eq.{org_id}` — audit list changes
- `evidence:audit_id=eq.{audit_id}` — evidence additions for active audit
- `maturity_scores:audit_id=eq.{audit_id}` — score updates for active audit

#### Path 9 — Interview Transcription

```
User starts interview recording
  → UI: MediaRecorder API captures audio (WebM/Opus)
    → UI: On stop → audio blob available
      → API: Upload audio to Supabase Storage
        → API: POST /functions/v1/transcribe (Edge Function)
          → Edge Function: Forwards audio to AI Gateway
            → AI Gateway: Routes to Transcription service
              → AI Service: Sends audio to OpenAI Whisper API
                → OpenAI: Returns timestamped transcript segments
              → AI Service: Formats transcript → stores in DB
            → AI Gateway: Returns transcript
          → Edge Function: Returns transcript to frontend
        → UI: Displays editable transcript with timestamps
          → User: Reviews, edits transcript → links to criteria as evidence
            → API: POST /rest/v1/evidence (type='transcript', content=edited_text, source_audio_url)
              → Observability: audit_trail INSERT (action='interview_transcribed', duration, criterion_ids)
```

---

### Error / Failure Scenarios

#### Path 10 — AI Service Failure

```
AI request initiated
  → AI Gateway: Circuit breaker state check
    → IF circuit CLOSED:
      → Forward to AI Service → OpenAI API call
        → OpenAI returns error (500/429/timeout)
          → Retry 1: Wait 1s + jitter → retry
          → Retry 2: Wait 4s + jitter → retry
          → Retry 3: Wait 16s + jitter → retry
          → All retries exhausted:
            → Circuit breaker: Record failure → IF failure_count ≥ threshold → OPEN circuit
              → Try fallback model (GPT-4o Mini) for scoring operations
                → IF fallback succeeds → return degraded result (flagged as fallback_model)
                → IF fallback fails → return error response
                  → Edge Function: Returns 503 with manual_mode_available=true
                    → UI: Toast "AI temporarily unavailable" → shows manual input fields
                      → Observability: audit_trail INSERT (action='ai_failure', service, error, fallback_attempted)
    → IF circuit OPEN:
      → Skip AI entirely → return 503 immediately
        → UI: Manual mode activated
          → Observability: audit_trail INSERT (action='circuit_breaker_open', service)
    → IF circuit HALF-OPEN:
      → Allow single probe request → if success → CLOSE circuit
```

#### Path 11 — Upload Failure

```
User uploads evidence file
  → API: Supabase Storage upload attempt
    → Network error / timeout
      → Retry 1: Automatic retry after 2s
      → Retry 2: Automatic retry after 5s
      → All retries exhausted:
        → UI: Error toast "Upload failed. Check your connection."
          → UI: Retry button displayed on failed upload card
            → User clicks retry → re-attempt upload from local file reference
              → IF online restored → upload succeeds → normal evidence flow
              → IF still offline → redirect to Path 12 (Offline Evidence Capture)
```

---

### Degraded Scenarios

#### Path 12 — Offline Evidence Capture

```
User captures evidence while offline
  → Service Worker: Intercepts fetch → detects offline state
    → Client: Compute SHA-256 hash of file
      → IndexedDB: Store evidence metadata (criterion_id, type, hash, captured_at, captured_by)
        → OPFS / Cache API: Store binary file content locally
          → Sync Queue: Enqueue mutation {action:'evidence_upload', payload, timestamp, retry_count:0}
            → UI: Shows "Saved offline" badge with pending sync indicator

Network reconnects:
  → Service Worker: 'online' event fires
    → Sync Queue: Process entries in FIFO order
      → For each entry:
        → Upload file to Supabase Storage
          → POST evidence metadata to PostgREST
            → Verify SHA-256 hash matches original
              → IF match → mark entry as synced → remove from queue
              → IF mismatch → flag as integrity_error → alert user → keep in queue
                → Conflict resolution: Server timestamp wins for metadata; files are never overwritten
    → UI: "Sync complete" toast → pending badges removed
      → Observability: audit_trail INSERT (action='offline_evidence_synced', count, conflicts)
```

#### Path 13 — AI Degraded Mode (Manual Scoring)

```
Circuit breaker is OPEN for Maturity Scoring service
  → User opens criterion scoring panel
    → UI: Detects AI unavailability (cached circuit state or 503 response)
      → UI: Hides "Request AI Score" button → shows manual scoring form
        → Manual form: Maturity level dropdown (1-5) + justification text area (required)
          → User: Selects level, writes justification → submits
            → API: POST /rest/v1/maturity_scores (method='manual', ai_available=false)
              → RLS: Verify role = lead_auditor
                → DB: INSERT score with method='manual', ai_available=false
                  → Observability: audit_trail INSERT (action='manual_score', reason='ai_unavailable')
```

---

## 3.13 Wave-Based One-Time Build Model

MAT is delivered as a single-wave module. Wave-based delivery is not applicable. All components are built and delivered together as a single cohesive unit.

There is no phased rollout, feature-flagged progressive delivery, or multi-wave build plan. The MAT module ships as a complete, fully integrated product in one delivery cycle.

---

## Appendix A — Component-to-Connection Matrix

This matrix verifies that every component has at least one connection (Wiring Invariant #1).

| Component              | Connections (by ID)              | Min. 1? |
|------------------------|----------------------------------|---------|
| MAT Frontend           | A, B, C, D, E, F                | ✅       |
| Supabase Auth          | A                                | ✅       |
| Supabase PostgREST     | B, H                            | ✅       |
| Supabase Realtime      | C                                | ✅       |
| Supabase Storage       | D, I                            | ✅       |
| Supabase Edge Functions| E, G, M, N                      | ✅       |
| AI Gateway             | G, H, I, J, K                   | ✅       |
| AI Services            | J, K                            | ✅       |
| OpenAI API             | K                                | ✅       |
| Service Worker         | F, L                            | ✅       |
| IndexedDB / OPFS       | F (via SW)                       | ✅       |
| Sync Queue             | L                                | ✅       |
| PIT Module             | M                                | ✅       |
| Maturity Roadmap       | N                                | ✅       |

---

## Appendix B — Glossary

| Term             | Definition                                                                 |
|------------------|----------------------------------------------------------------------------|
| RLS              | Row Level Security — PostgreSQL policies restricting row access per user   |
| JWT              | JSON Web Token — authentication token issued by Supabase Auth             |
| MFA              | Multi-Factor Authentication — required for Lead Auditor role              |
| OPFS             | Origin Private File System — browser API for private file storage         |
| Circuit Breaker  | Pattern that stops requests to a failing service after threshold breaches  |
| Sync Queue       | Ordered list of offline mutations replayed on network reconnect           |
| Edge Function    | Supabase serverless function running on Deno runtime                      |
| PostgREST        | RESTful API auto-generated from PostgreSQL schema                         |

---

*End of MAT System Architecture v1.0.0*
